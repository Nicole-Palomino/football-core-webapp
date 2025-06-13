from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app import schemas, crud, models
from app.dependencies import get_db
from app.core.security import get_current_active_user
from decimal import Decimal

router = APIRouter(prefix="/compras", tags=["Compra de Monedas"])


@router.get("/", response_model=list[schemas.compra_moneda.CompraMonedaRead])
async def listar_compras_usuario(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    return await crud.crud_compra_moneda.list_compras_by_user(db, current_user.id)


@router.get("/admin", response_model=list[schemas.compra_moneda.CompraMonedaRead])
async def listar_todas_compras(
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Acceso solo para administradores")
    return await crud.crud_compra_moneda.list_all_compras(db)


@router.post("/", response_model=schemas.compra_moneda.CompraMonedaRead)
async def crear_compra(
    compra_in: schemas.CompraMonedaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    return await crud.crud_compra_moneda.create_compra(
        db=db,
        id_usuario=current_user.id,
        id_paquete=compra_in.id_paquete,
        paypal_order_id=compra_in.paypal_order_id,
        monto_usd=Decimal(compra_in.monto_usd),
        cantidad_monedas=compra_in.cantidad_monedas,
    )


@router.post("/capturar/{id_compra}")
async def capturar_pago(
    id_compra: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    compra = await crud.crud_compra_moneda.get_compra_by_id(db, id_compra)
    if not compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    if compra.id_usuario != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="No tienes permiso para capturar esta compra")
    return await crud.crud_compra_moneda.capture_and_apply_topup(
        db=db,
        compra=compra,
        orders_controller=crud.crud_compra_moneda.orders_controller,
        current_user_id=current_user.id,
    )