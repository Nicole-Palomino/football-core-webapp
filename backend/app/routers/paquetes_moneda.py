from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app import schemas, crud, models
from app.dependencies import get_db
from app.core.security import get_current_active_user

router = APIRouter(prefix="/paquetes", tags=["Paquetes de Monedas"])


@router.get("/", response_model=list[schemas.paquete_moneda.PaqueteMonedaRead])
async def listar_paquetes(db: AsyncSession = Depends(get_db)):
    return await crud.crud_paquete_moneda.list_paquetes(db)


@router.post("/", response_model=schemas.paquete_moneda.PaqueteMonedaRead)
async def crear_paquete(
    paquete_in: schemas.PaqueteMonedaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo administradores pueden crear paquetes")
    return await crud.crud_paquete_moneda.create_paquete(db, paquete_in)


@router.put("/{id_paquete}", response_model=schemas.paquete_moneda.PaqueteMonedaRead)
async def actualizar_paquete(
    id_paquete: int,
    paquete_in: schemas.PaqueteMonedaUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo administradores pueden modificar paquetes")
    return await crud.crud_paquete_moneda.update_paquete(db, id_paquete, paquete_in)


@router.delete("/{id_paquete}")
async def eliminar_paquete(
    id_paquete: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user),
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Solo administradores pueden eliminar paquetes")
    success = await crud.crud_paquete_moneda.delete_paquete(db, id_paquete)
    if not success:
        raise HTTPException(status_code=404, detail="Paquete no encontrado")
    return {"message": "Paquete eliminado correctamente"}
