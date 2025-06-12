from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, schemas
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/roles",
    tags=["Roles"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Rol)
async def create_rol(
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

@router.get("/", response_model=list[schemas.Rol])
async def read_roles(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Obtiene una lista de todos los roles. Accesible por cualquier usuario autenticado.Crea un nuevo Rol. Requiere privilegios de administrador.
    """
    roles = await crud.get_roles(db, skip=skip, limit=limit)
    return roles

@router.get("/{rol_id}", response_model=schemas.Rol)
async def read_rol(rol_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un único Rol por su ID. Accesible por cualquier usuario autenticado.
    """
    db_rol = await crud.get_role(db, rol_id=rol_id)
    if db_rol is None:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return db_rol

@router.put("/{rol_id}", response_model=schemas.Rol)
async def update_rol(
    rol_id: int, 
    rol: schemas.RolUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar
):
    """
    Actualiza un Rol existente por su ID. Requiere privilegios de administrador.
    """
    db_rol = await crud.update_role(db=db, rol_id=rol_id, rol=rol)
    if db_rol is None:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return db_rol

@router.delete("/{rol_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_rol(
    rol_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede borrar
):
    """
    Elimina un Rol por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_role(db=db, rol_id=rol_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return {"message": "Rol eliminado exitosamente"}