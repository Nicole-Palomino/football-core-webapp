from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user
from app.core.logger import logger
from app.middlewares.rate_limit import limiter

router = APIRouter(
    prefix="/estados",
    tags=["Estados"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# finished || used
@router.post("/", response_model=schemas.Estado, dependencies=[Depends(get_current_admin_user)])
async def create_state(
    estado: schemas.EstadoCreate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Crea un nuevo Estado. Requiere privilegios de administrador.
    """
    db_estado = await crud.get_estado_by_name(db, nombre_estado=estado.nombre_estado)
    if db_estado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El estado ya existe")
    return await crud.create_estado(db=db, estado=estado)

# finished || used
@router.get("/", response_model=list[schemas.Estado], dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_states(request: Request, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Recupera una lista de todos los Estados (estados). ⚠️ Solo accesible por administradores.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path}")

    estados = await crud.get_estados(db, skip=skip, limit=limit)
    return estados

# finished
@router.get("/{estado_id}", response_model=schemas.Estado, dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_state_by_id(request: Request, estado_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un único Estado por su ID. ⚠️ Solo accesible por administradores.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (estado_id={estado_id})")

    db_estado = await crud.get_estado(db, estado_id=estado_id)
    if db_estado is None:
        logger.warning(f"[NO ENCONTRADO] Estado con id={estado_id} solicitado desde {client_ip}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estado no encontrado")
    
    logger.info(f"[ENCONTRADO] Estado con id={estado_id} consultado exitosamente por {client_ip}")
    return db_estado

# finished || used
@router.put("/{estado_id}", response_model=schemas.Estado, dependencies=[Depends(get_current_admin_user)])
async def update_state(
    estado_id: int, 
    estado: schemas.EstadoUpdate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Actualiza un Estado existente por su ID. Requiere privilegios de administrador.
    """
    logger.info(f"[ACCESO ADMIN] Intentando actualizar estado con ID: {estado_id}")
    db_estado = await crud.update_estado(db=db, estado_id=estado_id, estado=estado)

    if db_estado is None:
        logger.warning(f"[NO ENCONTRADO] Estado con ID {estado_id} no encontrado.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estado no encontrado")
    
    logger.info(f"[ENCONTRADO] Estado con ID {estado_id} actualizado exitosamente.")
    return db_estado

# finished || used
@router.delete("/{estado_id}", status_code=status.HTTP_200_OK)
async def delete_state(
    estado_id: int, 
    db: AsyncSession = Depends(get_db),
    admin_user: schemas.user.User = Depends(get_current_admin_user)
):
    """
    Elimina un Estado por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_estado(db=db, estado_id=estado_id)
    if not success:
        logger.warning(f"[NO ENCONTRADO] Admin {admin_user.id_usuario} intentó eliminar estado {estado_id} pero no fue encontrado.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estado no encontrado")
    
    logger.info(f"[ENCONTRADO] Admin {admin_user.id_usuario} eliminó estado {estado_id}")
    return {"message": "Estado eliminado exitosamente"}