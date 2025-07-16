from typing import Optional
from sqlalchemy import select
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, schemas, models
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/estadisticas",
    tags=["Estadísticas"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# ✅
@router.post("/", response_model=schemas.Estadistica)
async def create_stats(
    estadistica: schemas.EstadisticaCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    """
    Crea nuevas Estadisticas para un partido. Requiere privilegios de administrador.
    """
    try:
        return await crud.create_estadistica(db=db, estadistica=estadistica)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Asegúrese de que el ID del partido sea válido y único para las estadísticas.")

# ⚠️
@router.get("/", response_model=list[schemas.Estadistica])
async def read_stats(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Recupera una lista de todas las Estadisticas. Accesible por cualquier usuario autentificado.
    """
    estadisticas = await crud.get_estadisticas(db, skip=skip, limit=limit)
    return estadisticas

# ⚠️
@router.get("/{estadistica_id}", response_model=schemas.Estadistica)
async def read_stats_by_id(estadistica_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera una única Estadística por su ID. Accesible por cualquier usuario autentificado.
    """
    db_estadistica = await crud.get_estadistica(db, estadistica_id=estadistica_id)
    if db_estadistica is None:
        raise HTTPException(status_code=404, detail="Estadística no encontrada")
    return db_estadistica

# ✅
@router.get("/partido/{partido_id}", response_model=schemas.Estadistica)
async def read_stats_by_match_id(partido_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera Estadisticas (estadísticas) para un Partido ID específico. Accesible por cualquier usuario autentificado.
    """
    db_estadistica = await crud.get_estadistica_by_partido_id(db, partido_id=partido_id)
    if db_estadistica is None:
        raise HTTPException(status_code=404, detail=f"Estadísticas para el partido con ID {partido_id} no encontradas.")
    return db_estadistica

# ✅
@router.put("/by-partido/{id_partido}", response_model=schemas.Estadistica)
async def update_stats(
    id_partido: int, 
    estadistica: schemas.EstadisticaUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar
):
    """
    Actualiza una Estadistica existente por el ID del partido. Requiere privilegios de administrador.
    """
    try:
        # Buscar la estadística asociada al partido
        db_estadistica = await db.execute(
            select(models.Estadistica).where(models.Estadistica.id_partido == id_partido)
        )
        estadistica_actual = db_estadistica.scalars().first()

        if not estadistica_actual:
            raise HTTPException(status_code=404, detail="Estadística no encontrada para este partido")

        # Actualizar campos
        for field, value in estadistica.dict(exclude_unset=True).items():
            setattr(estadistica_actual, field, value)
            
        await db.commit()
        await db.refresh(estadistica_actual)
        return estadistica_actual
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de las relaciones o unicidad.")

# ⚠️
@router.delete("/{estadistica_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stats(
    estadistica_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede eliminar
):
    """
    Borra una Estadistica por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_estadistica(db=db, estadistica_id=estadistica_id)
    if not success:
        raise HTTPException(status_code=404, detail="Estadística no encontrada")
    return {"message": "Estadística eliminada exitosamente"}