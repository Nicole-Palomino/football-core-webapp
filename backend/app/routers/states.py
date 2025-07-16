from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, schemas
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/estados",
    tags=["Estados"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# ✅
@router.post("/", response_model=schemas.Estado)
async def create_state(
    estado: schemas.EstadoCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    """
    Crea un nuevo Estado. Requiere privilegios de administrador.
    """
    db_estado = await crud.get_estado_by_name(db, nombre_estado=estado.nombre_estado)
    if db_estado:
        raise HTTPException(status_code=400, detail="El estado ya existe")
    return await crud.create_estado(db=db, estado=estado)

# ✅
@router.get("/", response_model=list[schemas.Estado])
async def read_states(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Recupera una lista de todos los Estados (estados). Accesible por cualquier usuario autenticado.
    """
    estados = await crud.get_estados(db, skip=skip, limit=limit)
    return estados

# ⚠️
@router.get("/{estado_id}", response_model=schemas.Estado)
async def read_state_by_id(estado_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un único Estado por su ID. Accesible por cualquier usuario autenticado.
    """
    db_estado = await crud.get_estado(db, estado_id=estado_id)
    if db_estado is None:
        raise HTTPException(status_code=404, detail="Estado no encontrado")
    return db_estado

# ✅
@router.put("/{estado_id}", response_model=schemas.Estado)
async def update_state(
    estado_id: int, 
    estado: schemas.EstadoUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar
):
    """
    Actualiza un Estado existente por su ID. Requiere privilegios de administrador.
    """
    db_estado = await crud.update_estado(db=db, estado_id=estado_id, estado=estado)
    if db_estado is None:
        raise HTTPException(status_code=404, detail="Estado no encontrado")
    return db_estado

# ✅
@router.delete("/{estado_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_state(
    estado_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede eliminar
):
    """
    Elimina un Estado por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_estado(db=db, estado_id=estado_id)
    if not success:
        raise HTTPException(status_code=404, detail="Estado no encontrado")
    return {"message": "Estado eliminado exitosamente"}