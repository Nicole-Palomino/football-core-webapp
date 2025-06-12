from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app import crud, schemas
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/equipos",
    tags=["Equipos"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=schemas.Equipo)
async def create_equipo(
    equipo: schemas.EquipoCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    """
    Crea un nuevo Equipo. Requiere privilegios de administrador.
    """
    # Check if foreign keys exist
    estado = await crud.get_estado(db, equipo.id_estado)
    if not estado:
        raise HTTPException(status_code=400, detail=f"Estado con ID {equipo.id_estado} no encontrado.")
    
    liga = await crud.get_liga(db, equipo.id_liga)
    if not liga:
        raise HTTPException(status_code=400, detail=f"Liga con ID {equipo.id_liga} no encontrada.")

    db_equipo = await crud.get_equipo_by_name(db, nombre_equipo=equipo.nombre_equipo)
    if db_equipo:
        raise HTTPException(status_code=400, detail="El equipo ya existe")
    
    return await crud.create_equipo(db=db, equipo=equipo)

@router.get("/", response_model=list[schemas.Equipo])
async def read_equipos(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Recupera una lista de todos los Equipos. Accesible por cualquier usuario autentificado.
    """
    equipos = await crud.get_equipos(db, skip=skip, limit=limit)
    return equipos

@router.get("/{equipo_id}", response_model=schemas.Equipo)
async def read_equipo(equipo_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un único Equipo por su ID. Accesible por cualquier usuario autentificado.
    """
    db_equipo = await crud.get_equipo(db, equipo_id=equipo_id)
    if db_equipo is None:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return db_equipo

@router.put("/{equipo_id}", response_model=schemas.Equipo)
async def update_equipo(
    equipo_id: int, 
    equipo: schemas.EquipoUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar
):
    """
    Actualiza un Equipo existente por su ID. Requiere privilegios de administrador.
    """
    # Check if foreign keys exist if they are being updated
    if equipo.id_estado is not None:
        estado = await crud.get_estado(db, equipo.id_estado)
        if not estado:
            raise HTTPException(status_code=400, detail=f"Estado con ID {equipo.id_estado} no encontrado.")
    
    if equipo.id_liga is not None:
        liga = await crud.get_liga(db, equipo.id_liga)
        if not liga:
            raise HTTPException(status_code=400, detail=f"Liga con ID {equipo.id_liga} no encontrada.")

    db_equipo = await crud.update_equipo(db=db, equipo_id=equipo_id, equipo=equipo)
    if db_equipo is None:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return db_equipo

@router.delete("/{equipo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_equipo(
    equipo_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede eliminar
):
    """
    Elimina un Equipo por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_equipo(db=db, equipo_id=equipo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    return {"message": "Equipo eliminado exitosamente"}