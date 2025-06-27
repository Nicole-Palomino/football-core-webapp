from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app import crud, schemas, models
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/temporadas",
    tags=["Temporadas"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Temporada)
async def create_temporada(
    temporada: schemas.TemporadaCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    """
    Crea una nueva Temporada. Requiere privilegios de administrador.
    """
    db_temporada = await crud.get_temporada_by_name(db, nombre_temporada=temporada.nombre_temporada)
    if db_temporada:
        raise HTTPException(status_code=400, detail="La temporada ya existe")
    return await crud.create_temporada(db=db, temporada=temporada)

@router.get("/", response_model=list[schemas.Temporada])
async def read_temporadas(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Recupera una lista de todas las Temporadas (estaciones). Accesible por cualquier usuario autentificado.
    """
    temporadas = await crud.get_temporadas(db, skip=skip, limit=limit)
    return temporadas

@router.get("/{temporada_id}", response_model=schemas.Temporada)
async def read_temporada(temporada_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera una sola Temporada (estación) por su ID. Accesible por cualquier usuario autentificado.
    """
    db_temporada = await crud.get_temporada(db, temporada_id=temporada_id)
    if db_temporada is None:
        raise HTTPException(status_code=404, detail="Temporada no encontrada")
    return db_temporada

@router.put("/{temporada_id}", response_model=schemas.Temporada)
async def update_temporada(
    temporada_id: int, 
    temporada: schemas.TemporadaUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar
):
    """
    Actualiza una Temporada existente por su ID. Requiere privilegios de administrador.
    """
    db_temporada = await crud.update_temporada(db=db, temporada_id=temporada_id, temporada=temporada)
    if db_temporada is None:
        raise HTTPException(status_code=404, detail="Temporada no encontrada")
    return db_temporada

@router.delete("/{temporada_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_temporada(
    temporada_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede borrar
):
    """
    Borra una Temporada por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_temporada(db=db, temporada_id=temporada_id)
    if not success:
        raise HTTPException(status_code=404, detail="Temporada no encontrada")
    return {"message": "Temporada eliminada exitosamente"}

@router.get("/stats/total", response_model=int)
async def get_total_temporadas(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(models.Temporada))
    total = result.scalar()
    return total