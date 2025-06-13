from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from app import models, schemas

async def get_paquete_by_id(db: AsyncSession, id_paquete: int) -> models.PaqueteMoneda | None:
    """
    Recupera un paquete de moneda por su ID.
    """
    result = await db.execute(
        select(models.PaqueteMoneda).filter(models.PaqueteMoneda.id_paquete == id_paquete)
    )
    return result.scalar_one_or_none()

async def get_paquete_by_nombre(db: AsyncSession, nombre: str) -> models.PaqueteMoneda | None:
    """
    Recupera un paquete de moneda por su nombre exacto.
    """
    result = await db.execute(
        select(models.PaqueteMoneda).filter(models.PaqueteMoneda.nombre == nombre)
    )
    return result.scalar_one_or_none()

async def list_paquetes(db: AsyncSession, only_activos: bool = False) -> list[models.PaqueteMoneda]:
    """
    Lista todos los paquetes. Si only_activos=True, filtra aquellos con activo=True.
    """
    stmt = select(models.PaqueteMoneda)
    if only_activos:
        stmt = stmt.filter(models.PaqueteMoneda.activo == True)
    result = await db.execute(stmt.order_by(models.PaqueteMoneda.created_at.desc()))
    return result.scalars().all()

async def create_paquete(db: AsyncSession, paquete_in: schemas.PaqueteMonedaCreate) -> models.PaqueteMoneda:
    """
    Crea un nuevo paquete de moneda.
    Verifica que no exista otro paquete con el mismo nombre.
    """
    # Verificar existencia por nombre
    existente = await get_paquete_by_nombre(db, paquete_in.nombre)
    if existente:
        raise ValueError(f"Ya existe un paquete con nombre '{paquete_in.nombre}'.")
    nuevo = models.PaqueteMoneda(
        nombre=paquete_in.nombre,
        descripcion=paquete_in.descripcion,
        cantidad_monedas=paquete_in.cantidad_monedas,
        precio_usd=paquete_in.precio_usd,
        activo=paquete_in.activo,
        paypal_product_id=paquete_in.paypal_product_id
    )
    db.add(nuevo)
    try:
        await db.commit()
        await db.refresh(nuevo)
    except IntegrityError as e:
        await db.rollback()
        raise ValueError("Error de integridad al crear paquete; posible campo duplicado o constraints violadas.")
    return nuevo

async def update_paquete(db: AsyncSession, id_paquete: int, paquete_in: schemas.PaqueteMonedaUpdate) -> models.PaqueteMoneda:
    """
    Actualiza un paquete existente.
    """
    db_paquete = await get_paquete_by_id(db, id_paquete)
    if not db_paquete:
        raise ValueError(f"Paquete con ID {id_paquete} no encontrado.")
    # Verificar si se cambia nombre y ya existe otro con ese nombre
    data = paquete_in.model_dump(exclude_unset=True)
    if "nombre" in data:
        nombre_nuevo = data["nombre"]
        otro = await get_paquete_by_nombre(db, nombre_nuevo)
        if otro and otro.id_paquete != id_paquete:
            raise ValueError(f"Otro paquete con nombre '{nombre_nuevo}' ya existe.")
    # Aplicar campos
    for key, value in data.items():
        setattr(db_paquete, key, value)
    # updated_at se maneja en la BD automáticamente si está ON UPDATE; si no, podrías actualizar manualmente:
    # db_paquete.updated_at = datetime.utcnow()
    try:
        await db.commit()
        await db.refresh(db_paquete)
    except IntegrityError:
        await db.rollback()
        raise ValueError("Error de integridad al actualizar paquete.")
    return db_paquete

async def deactivate_paquete(db: AsyncSession, id_paquete: int) -> models.PaqueteMoneda:
    """
    Marca un paquete como inactivo (soft delete).
    """
    db_paquete = await get_paquete_by_id(db, id_paquete)
    if not db_paquete:
        raise ValueError(f"Paquete con ID {id_paquete} no encontrado.")
    if not db_paquete.activo:
        return db_paquete
    db_paquete.activo = False
    # db_paquete.updated_at = datetime.utcnow()  # si se maneja manualmente
    await db.commit()
    await db.refresh(db_paquete)
    return db_paquete

async def delete_paquete(db: AsyncSession, id_paquete: int) -> bool:
    """
    Elimina físicamente un paquete (hard delete).
    Retorna True si se borró, False si no existía.
    """
    db_paquete = await get_paquete_by_id(db, id_paquete)
    if not db_paquete:
        return False
    await db.delete(db_paquete)
    await db.commit()
    return True