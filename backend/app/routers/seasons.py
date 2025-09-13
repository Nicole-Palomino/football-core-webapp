from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app import crud, schemas, models
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user
from app.core.logger import logger
from app.middlewares.rate_limit import limiter

router = APIRouter(
    prefix="/temporadas",
    tags=["Temporadas"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# finished || used
@router.post("/", response_model=schemas.Temporada, dependencies=[Depends(get_current_admin_user)])
async def create_season(
    temporada: schemas.TemporadaCreate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Crea una nueva Temporada. Requiere privilegios de administrador.
    """
    db_temporada = await crud.get_temporada_by_name(db, nombre_temporada=temporada.nombre_temporada)
    if db_temporada:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La temporada ya existe")
    return await crud.create_temporada(db=db, temporada=temporada)

# finished || used
@router.get("/", response_model=list[schemas.Temporada], dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_seasons(request: Request, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Recupera una lista de todas las Temporadas. ⚠️ Solo accesible por administradores.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path}")

    temporadas = await crud.get_temporadas(db, skip=skip, limit=limit)
    return temporadas

# finished
@router.get("/{temporada_id}", response_model=schemas.Temporada, dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_seasons_by_id(request: Request, temporada_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera una sola Temporada (estación) por su ID. Accesible por cualquier usuario autentificado.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (temporada_id={temporada_id})")

    db_temporada = await crud.get_temporada(db, temporada_id=temporada_id)
    if db_temporada is None:
        logger.warning(f"[NO ENCONTRADO] Temporada con id={temporada_id} solicitada desde {client_ip}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Temporada no encontrada")
    
    logger.info(f"[ENCONTRADO] Temporada con id={temporada_id} consultada exitosamente por {client_ip}")
    return db_temporada

# finished || used
@router.put("/{temporada_id}", response_model=schemas.Temporada, dependencies=[Depends(get_current_admin_user)])
async def update_season(
    temporada_id: int, 
    temporada: schemas.TemporadaUpdate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Actualiza una Temporada existente por su ID. Requiere privilegios de administrador.
    """
    logger.info(f"[ACCESO ADMIN] Intentando actualizar temporada con ID: {temporada_id}")
    db_temporada = await crud.update_temporada(db=db, temporada_id=temporada_id, temporada=temporada)

    if db_temporada is None:
        logger.warning(f"[NO ENCONTRADO] Temporada con ID {temporada_id} no encontrada.")
        raise HTTPException(status_code=404, detail="Temporada no encontrada")
    
    logger.info(f"[ENCONTRADO] Temporada con ID {temporada_id} actualizada exitosamente.")
    return db_temporada

# finished || used
@router.delete("/{temporada_id}", status_code=status.HTTP_200_OK)
async def delete_season(
    temporada_id: int, 
    db: AsyncSession = Depends(get_db),
    admin_user: schemas.user.User = Depends(get_current_admin_user)
):
    """
    Borra una Temporada por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_temporada(db=db, temporada_id=temporada_id)
    if not success:
        logger.warning(f"[NO ENCONTRADO] Admin {admin_user.id_usuario} intentó eliminar temporada {temporada_id} pero no fue encontrada.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Temporada no encontrada")
    
    logger.info(f"[ENCONTRADO] Admin {admin_user.id_usuario} eliminó temporada {temporada_id}")
    return {"message": "Temporada eliminada exitosamente"}

# finished
@router.get("/stats/total", response_model=int, status_code=status.HTTP_200_OK)
async def get_total_seasons(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(models.Temporada))
    total = result.scalar()
    logger.info(f"Total de temporadas consultado: {total}")
    return total