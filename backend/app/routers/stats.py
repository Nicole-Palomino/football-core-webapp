from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas, models
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user
from app.core.logger import logger
from app.middlewares.rate_limit import limiter

router = APIRouter(
    prefix="/estadisticas",
    tags=["Estadísticas"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# finished
@router.post("/", response_model=schemas.Estadistica, dependencies=[Depends(get_current_admin_user)])
async def create_stats(
    estadistica: schemas.EstadisticaCreate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Crea nuevas Estadisticas para un partido. Requiere privilegios de administrador.
    """
    try:
        return await crud.create_estadistica(db=db, estadistica=estadistica)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error de integridad de datos. Asegúrese de que el ID del partido sea válido y único para las estadísticas.")

# finished
@router.get("/", response_model=list[schemas.Estadistica], dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_stats(request: Request, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Recupera una lista de todas las Estadisticas.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path}")

    estadisticas = await crud.get_estadisticas(db, skip=skip, limit=limit)
    return estadisticas

# finished
@router.get("/{estadistica_id}", response_model=schemas.Estadistica, dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_stats_by_id(request: Request, estadistica_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera una única Estadística por su ID.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (estadistica_id={estadistica_id})")

    db_estadistica = await crud.get_estadistica(db, estadistica_id=estadistica_id)
    if db_estadistica is None:
        logger.warning(f"[NO ENCONTRADO] Estadística con id={estadistica_id} solicitada desde {client_ip}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estadística no encontrada")
    
    logger.info(f"[ENCONTRADO] Estadística con id={estadistica_id} consultada exitosamente por {client_ip}")
    return db_estadistica

# finished
@router.get("/partido/{partido_id}", response_model=schemas.Estadistica, dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_stats_by_match_id(request: Request, partido_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera Estadisticas (estadísticas) para un Partido ID específico. Accesible por cualquier usuario autentificado.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (partido_id={partido_id})")

    db_estadistica = await crud.get_estadistica_by_partido_id(db, partido_id=partido_id)
    if db_estadistica is None:
        logger.warning(f"[NO ENCONTRADO] Estadística con id_partido={partido_id} solicitada desde {client_ip}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Estadísticas para el partido con ID {partido_id} no encontradas.")
    
    logger.info(f"[ENCONTRADO] Estadística con id_partido={partido_id} consultada exitosamente por {client_ip}")
    return db_estadistica

# finished
@router.put("/by-partido/{id_partido}", response_model=schemas.Estadistica, dependencies=[Depends(get_current_admin_user)])
async def update_stats(
    id_partido: int, 
    estadistica: schemas.EstadisticaUpdate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Actualiza una Estadistica existente por el ID del partido. Requiere privilegios de administrador.
    """
    try:
        # Buscar la estadística asociada al partido
        logger.info(f"[ACCESO ADMIN] Intentando actualizar estadística con ID: {id_partido}")
    
        db_estadistica = await db.execute(
            select(models.Estadistica).where(models.Estadistica.id_partido == id_partido)
        )
        estadistica_actual = db_estadistica.scalars().first()

        if not estadistica_actual:
            logger.warning(f"[NO ENCONTRADO] Estadística con ID {id_partido} no encontrada.")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estadística no encontrada para este partido")

        # Actualizar campos
        for field, value in estadistica.dict(exclude_unset=True).items():
            setattr(estadistica_actual, field, value)
            
        await db.commit()
        await db.refresh(estadistica_actual)
        logger.info(f"[ENCONTRADO] Estadística con ID {id_partido} actualizada exitosamente.")
        return estadistica_actual
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error de integridad de datos. Verifique los IDs de las relaciones o unicidad.")

# finished
@router.delete("/{estadistica_id}", status_code=status.HTTP_200_OK)
async def delete_stats(
    estadistica_id: int, 
    db: AsyncSession = Depends(get_db),
    admin_user: schemas.user.User = Depends(get_current_admin_user)
):
    """
    Borra una Estadistica por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_estadistica(db=db, estadistica_id=estadistica_id)
    if not success:
        logger.warning(f"[NO ENCONTRADO] Admin {admin_user.id_usuario} intentó eliminar estadística {estadistica_id} pero no fue encontrada.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estadística no encontrada")
    
    logger.info(f"[ENCONTRADO] Admin {admin_user.id_usuario} eliminó estadística {estadistica_id}")
    return {"message": "Estadística eliminada exitosamente"}