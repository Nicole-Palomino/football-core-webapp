from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app import crud, schemas
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/partidos",
    tags=["Partidos"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Partido)
async def create_partido(
    partido: schemas.PartidoCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    """
    Crea un nuevo Partido. Requiere privilegios de administrador.
    """
    try:
        return await crud.create_partido(db=db, partido=partido)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")

@router.get("/", response_model=list[schemas.Partido])
async def read_partidos(
    skip: int = 0, 
    limit: int = 100, 
    liga_id: Optional[int] = None,
    temporada_id: Optional[int] = None,
    equipo_id: Optional[int] = None,
    estado_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Recupera una lista de todos los Partidos (partidos) con filtros opcionales. Accesible por cualquier usuario autenticado.
    """
    partidos = await crud.get_partidos(
        db, 
        skip=skip, 
        limit=limit, 
        liga_id=liga_id, 
        temporada_id=temporada_id, 
        equipo_id=equipo_id, 
        estado_id=estado_id
    )
    return partidos

@router.get("/{partido_id}", response_model=schemas.Partido)
async def read_partido(partido_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un único Partido (coincidencia) por su ID. Accesible por cualquier usuario autenticado.
    """
    db_partido = await crud.get_partido(db, partido_id=partido_id)
    if db_partido is None:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return db_partido

@router.put("/{partido_id}", response_model=schemas.Partido)
async def update_partido(
    partido_id: int, 
    partido: schemas.PartidoUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar
):
    """
    Actualiza un Partido existente por su ID. Requiere privilegios de administrador.
    """
    try:
        db_partido = await crud.update_partido(db=db, partido_id=partido_id, partido=partido)
        if db_partido is None:
            raise HTTPException(status_code=404, detail="Partido no encontrado")
        return db_partido
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")

@router.delete("/{partido_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_partido(
    partido_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede eliminar
):
    """
    Elimina un Partido por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_partido(db=db, partido_id=partido_id)
    if not success:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return {"message": "Partido eliminado exitosamente"}