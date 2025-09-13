from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud, schemas
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user
from app.core.logger import logger
from app.middlewares.rate_limit import limiter

router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# finished || used
@router.post("/", response_model=schemas.Rol, dependencies=[Depends(get_current_admin_user)])
async def create_roles_endpoint(
    rol: schemas.RolCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    """
    Crea un nuevo Rol. Requiere privilegios de administrador.
    """
    db_rol = await crud.get_role_by_name(db, nombre_rol=rol.nombre_rol)
    if db_rol:
        raise HTTPException(status_code=400, detail="El rol ya existe")
    return await crud.create_role(db=db, rol=rol)

# finished || used
@router.get("/", response_model=list[schemas.Rol], dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_roles_endpoint(request: Request, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Obtiene una lista de todos los roles. ⚠️ Solo accesible por administradores.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path}")

    roles = await crud.get_roles(db, skip=skip, limit=limit)
    return roles

# finished
@router.get("/{rol_id}", response_model=schemas.Rol, dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_role_endpoint(request: Request, rol_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un único Rol por su ID. ⚠️ Solo accesible por administradores.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (rol_id={rol_id})")

    db_rol = await crud.get_role(db, rol_id=rol_id)
    if db_rol is None:
        logger.warning(f"[NO ENCONTRADO] Rol con id={rol_id} solicitado desde {client_ip}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado")
    
    logger.info(f"[ENCONTRADO] Rol con id={rol_id} consultado exitosamente por {client_ip}")
    return db_rol

# finished || used
@router.put("/{rol_id}", response_model=schemas.Rol, dependencies=[Depends(get_current_admin_user)])
async def update_roles_endpoint(
    rol_id: int, 
    rol: schemas.RolUpdate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Actualiza un Rol existente por su ID. Requiere privilegios de administrador.
    """
    logger.info(f"[ACCESO ADMIN] Intentando actualizar rol con ID: {rol_id}")
    db_rol = await crud.update_role(db=db, rol_id=rol_id, rol=rol)

    if db_rol is None:
        logger.warning(f"[NO ENCONTRADO] Rol con ID {rol_id} no encontrado.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado")
    
    logger.info(f"[ENCONTRADO] Rol con ID {rol_id} actualizado exitosamente.")
    return db_rol

# finished || used
@router.delete("/{rol_id}", status_code=status.HTTP_200_OK)
async def delete_roles_endpoint(
    rol_id: int, 
    db: AsyncSession = Depends(get_db),
    admin_user: schemas.user.User = Depends(get_current_admin_user)
):
    """
    Elimina un Rol por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_role(db=db, rol_id=rol_id)
    if not success:
        logger.warning(f"[NO ENCONTRADO] Admin {admin_user.id_usuario} intentó eliminar rol {rol_id} pero no fue encontrado.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado")
    
    logger.info(f"[ENCONTRADO] Admin {admin_user.id_usuario} eliminó rol {rol_id}")
    return {"message": "Rol eliminado exitosamente"}