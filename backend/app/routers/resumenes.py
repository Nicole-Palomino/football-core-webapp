from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, desc

from app.dependencies import get_db
from app import models, schemas, crud
from app.crud import crud_balance_usuario
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/resumenes", 
    tags=["Resumenes"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.ResumenOut)
async def crear_resumen(
    resumen: schemas.ResumenCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    """
    Crea un nuevo Resumen. Requiere privilegios de administrador.
    """
    try:
        return await crud.crear_resumen(db=db, resumen=resumen)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")

@router.get("/", response_model=List[schemas.ResumenOut])
async def listar_resumenes(
    skip: int = 0, 
    limit: int = 50,
    partido_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Recupera una lista de todos los Resumenes con filtros opcionales. Accesible por cualquier usuario autenticado.
    """
    query = select(models.ResumenEstadistico)

    if partido_id:
        query = query.where(models.ResumenEstadistico.id_partido == partido_id)

    query = query.order_by(desc(models.ResumenEstadistico.created_at)).offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()

@router.get("/partido/{id_partido}", response_model=List[schemas.ResumenOut])
async def listar_resumenes_partido(id_partido: int, db: AsyncSession = Depends(get_db)):
    return await crud.crud_resumen.listar_resumenes_por_partido(db, id_partido)

@router.put("/{resumen_id}", response_model=schemas.ResumenOut)
async def update_resumen(
    resumen_id: int, 
    resumen: schemas.ResumenUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar
):
    """
    Actualiza un Resumen existente por su ID. Requiere privilegios de administrador.
    """
    try:
        db_resumen = await crud.update_resumen(db=db, resumen_id=resumen_id, resumen=resumen)
        if db_resumen is None:
            raise HTTPException(status_code=404, detail="Resumen no encontrado")
        return db_resumen
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")

@router.delete("/{resumen_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resumen(
    resumen_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede eliminar
):
    """
    Elimina un Resumen por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_resumen(db=db, resumen_id=resumen_id)
    if not success:
        raise HTTPException(status_code=404, detail="Resumen no encontrado")
    return {"message": "Resumen eliminado exitosamente"}

@router.get("/{id_resumen}/ver", response_model=schemas.ResumenOut)
async def ver_resumen(id_resumen: int, id_usuario: int, db: AsyncSession = Depends(get_db)):
    resumen = await crud.crud_resumen.get_resumen(db, id_resumen)
    if not resumen:
        raise HTTPException(status_code=404, detail="Resumen no encontrado")

    # Verificar y descontar monedas
    balance = await crud_balance_usuario.get_balance_usuario_by_user_id(db, id_usuario)
    if not balance or balance.cantidad_monedas < resumen.costo_monedas:
        raise HTTPException(status_code=400, detail="No tienes monedas suficientes")

    await crud_balance_usuario.descontar_monedas(db, id_usuario, resumen.costo_monedas)
    return resumen
