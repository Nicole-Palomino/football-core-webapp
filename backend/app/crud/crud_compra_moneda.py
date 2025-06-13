from decimal import Decimal
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, update, func
from app import models, schemas
from app.services.client import paypal_client

orders_controller = paypal_client.orders
payments_controller = paypal_client.payments

async def get_compra_by_id(db: AsyncSession, id_compra: int) -> models.CompraMoneda | None:
    """
    Recupera un registro de CompraMoneda por su ID.
    """
    result = await db.execute(
        select(models.CompraMoneda).filter(models.CompraMoneda.id_compra == id_compra)
    )
    return result.scalar_one_or_none()

async def get_compra_by_order_id(db: AsyncSession, paypal_order_id: str) -> models.CompraMoneda | None:
    """
    Recupera un registro de CompraMoneda por su paypal_order_id.
    """
    result = await db.execute(
        select(models.CompraMoneda).filter(models.CompraMoneda.paypal_order_id == paypal_order_id)
    )
    return result.scalar_one_or_none()

async def list_compras_by_user(db: AsyncSession, user_id: int) -> list[models.CompraMoneda]:
    """
    Lista todas las compras de un usuario, ordenadas por fecha descendente.
    """
    result = await db.execute(
        select(models.CompraMoneda)
        .filter(models.CompraMoneda.id_usuario == user_id)
        .order_by(models.CompraMoneda.created_at.desc())
    )
    return result.scalars().all()

async def list_all_compras(db: AsyncSession) -> list[models.CompraMoneda]:
    """
    Lista todas las compras en el sistema, ordenadas por fecha descendente.
    """
    result = await db.execute(
        select(models.CompraMoneda).order_by(models.CompraMoneda.created_at.desc())
    )
    return result.scalars().all()

async def create_compra(db: AsyncSession, id_usuario: int, id_paquete: int | None,
                        paypal_order_id: str, monto_usd: Decimal, cantidad_monedas: int) -> models.CompraMoneda:
    """
    Crea un nuevo registro de CompraMoneda con status 'CREATED'.
    Verifica duplicado de paypal_order_id y existencia de paquete si aplica.
    """
    # Verificar si ya existe orden con el mismo paypal_order_id
    existente = await get_compra_by_order_id(db, paypal_order_id)
    if existente:
        raise ValueError(f"Ya existe una compra con paypal_order_id='{paypal_order_id}'.")
    # Verificar existencia de paquete si id_paquete no es None
    if id_paquete is not None:
        pkg = await db.execute(
            select(models.PaqueteMoneda).filter(models.PaqueteMoneda.id_paquete == id_paquete)
        )
        pkg_obj = pkg.scalar_one_or_none()
        if not pkg_obj:
            raise ValueError(f"Paquete con ID {id_paquete} no encontrado.")
    nueva = models.CompraMoneda(
        id_usuario=id_usuario,
        id_paquete=id_paquete,
        paypal_order_id=paypal_order_id,
        monto_usd=monto_usd,
        cantidad_monedas=cantidad_monedas,
        status=schemas.PurchaseStatusEnum.CREATED,  # o "CREATED"
        capture_id=None,
        # created_at y updated_at manejados por BD
    )
    db.add(nueva)
    try:
        await db.commit()
        await db.refresh(nueva)
    except IntegrityError:
        await db.rollback()
        raise ValueError("Error de integridad al crear compra; posible duplicado u otra constraint violada.")
    return nueva

async def update_compra_status(db: AsyncSession, id_compra: int, status: schemas.compra_moneda.PurchaseStatusEnum, capture_id: str | None = None) -> models.CompraMoneda:
    """
    Actualiza el status de una compra existente. Opcionalmente actualiza capture_id.
    """
    compra = await get_compra_by_id(db, id_compra)
    if not compra:
        raise ValueError(f"Compra con ID {id_compra} no encontrada.")
    # Validar proceso de status: se puede añadir lógica de transición si se desea.
    compra.status = status
    if capture_id is not None:
        compra.capture_id = capture_id
    # updated_at manejado por BD
    try:
        await db.commit()
        await db.refresh(compra)
    except IntegrityError:
        await db.rollback()
        raise ValueError("Error de integridad al actualizar status de compra.")
    return compra

async def delete_compra(db: AsyncSession, id_compra: int) -> bool:
    """
    Borra físicamente un registro de CompraMoneda. Retorna True si se borró, False si no existía.
    Normalmente no se utiliza en producción para compras reales, pero se incluye para completitud.
    """
    compra = await get_compra_by_id(db, id_compra)
    if not compra:
        return False
    await db.delete(compra)
    await db.commit()
    return True

async def capture_and_apply_topup(
    db: AsyncSession,
    compra: models.CompraMoneda,
    orders_controller,
    current_user_id: int
) -> dict:
    """
    Captura el pago en PayPal, actualiza el estado de la compra y registra las monedas en el balance del usuario.
    """
    order_id = compra.paypal_order_id

    try:
        # Ejecutar la captura de la orden con el SDK oficial
        response = orders_controller.capture_order(
            {"id": order_id, "prefer": "return=representation"}
        )
    except Exception as e:
        await update_compra_status(db, compra.id_compra, schemas.PurchaseStatusEnum.FAILED)
        raise ValueError("Error al capturar la orden en PayPal.") from e

    status_paypal = response.result.status
    if status_paypal != "COMPLETED":
        await update_compra_status(db, compra.id_compra, schemas.PurchaseStatusEnum.FAILED)
        raise ValueError(f"Estado de PayPal inesperado: {status_paypal}")

    # Extraer capture_id si está disponible
    try:
        capture_id = response.result.purchase_units[0].payments.captures[0].id
    except Exception:
        capture_id = None

    # Transacción atómica
    async with db.begin():
        # Actualizar CompraMoneda
        await db.execute(
            update(models.CompraMoneda)
            .where(models.CompraMoneda.id_compra == compra.id_compra)
            .values(status="COMPLETED", capture_id=capture_id)
        )

        # Agregar movimiento en balance
        movimiento = models.BalanceUsuario(
            id_usuario=current_user_id,
            cantidad_monedas=compra.cantidad_monedas,
            motivo="topup",
            referencia=order_id,
            timestamp_movimiento=datetime.utcnow()
        )
        db.add(movimiento)

    # Obtener nuevo saldo del usuario
    result = await db.execute(
        select(func.coalesce(func.sum(models.BalanceUsuario.cantidad_monedas), 0))
        .where(models.BalanceUsuario.id_usuario == current_user_id)
    )
    nuevo_saldo = result.scalar_one()

    return {
        "status": "COMPLETED",
        "coinsAdded": compra.cantidad_monedas,
        "newBalance": nuevo_saldo
    }