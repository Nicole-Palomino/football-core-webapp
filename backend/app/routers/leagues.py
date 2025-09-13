from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app import crud, schemas, models
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user
from app.core.logger import logger
from app.middlewares.rate_limit import limiter

router = APIRouter(
    prefix="/ligas",
    tags=["Ligas"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# finished || used
@router.post("/", response_model=schemas.Liga, dependencies=[Depends(get_current_admin_user)])
async def create_ligues(
    liga: schemas.LigaCreate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Crea una nueva Liga. Requiere privilegios de administrador.
    """
    db_liga = await crud.get_liga_by_name(db, nombre_liga=liga.nombre_liga)
    if db_liga:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La liga ya existe")
    return await crud.create_liga(db=db, liga=liga)

# finished || used
@router.get("/", response_model=list[schemas.Liga], dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_ligues(request: Request, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Recupera una lista de todas las Ligas. ⚠️ Solo accesible por administradores.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path}")

    ligas = await crud.get_ligas(db, skip=skip, limit=limit)
    return ligas

# finished
@router.get("/{liga_id}", response_model=schemas.Liga, dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_ligues(request: Request, liga_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera una única Liga por su ID. Accesible por cualquier usuario autentificado.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (liga_id={liga_id})")

    db_liga = await crud.get_liga(db, liga_id=liga_id)
    if db_liga is None:
        logger.warning(f"[NO ENCONTRADO] Liga con id={liga_id} solicitada desde {client_ip}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Liga no encontrada")
    
    logger.info(f"[ENCONTRADO] Liga con id={liga_id} consultada exitosamente por {client_ip}")
    return db_liga

# finished || used
@router.put("/{liga_id}", response_model=schemas.Liga, dependencies=[Depends(get_current_admin_user)])
async def update_ligues(
    liga_id: int, 
    liga: schemas.LigaUpdate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Actualiza una Liga existente por su ID. Requiere privilegios de administrador.
    """
    logger.info(f"[ACCESO ADMIN] Intentando actualizar liga con ID: {liga_id}")
    db_liga = await crud.update_liga(db=db, liga_id=liga_id, liga=liga)

    if db_liga is None:
        logger.warning(f"[NO ENCONTRADO] Liga con ID {liga_id} no encontrada.")
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    
    logger.info(f"[ENCONTRADO] Liga con ID {liga_id} actualizada exitosamente.")
    return db_liga

# finished || used
@router.delete("/{liga_id}", status_code=status.HTTP_200_OK)
async def delete_ligues(
    liga_id: int, 
    db: AsyncSession = Depends(get_db),
    admin_user: schemas.user.User = Depends(get_current_admin_user)
):
    """
    Borra una Liga por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_liga(db=db, liga_id=liga_id)
    if not success:
        logger.warning(f"[NO ENCONTRADO] Admin {admin_user.id_usuario} intentó eliminar liga {liga_id} pero no fue encontrada.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Liga no encontrada")
    
    logger.info(f"[ENCONTRADO] Admin {admin_user.id_usuario} eliminó liga {liga_id}")
    return {"message": "Liga eliminada exitosamente"}

# finished || used
@router.get("/stats/total", response_model=int, status_code=status.HTTP_200_OK)
async def get_total_ligues(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(models.Liga))
    total = result.scalar()
    logger.info(f"Total de ligas consultado: {total}")
    return total