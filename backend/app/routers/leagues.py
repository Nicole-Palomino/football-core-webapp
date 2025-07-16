from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app import crud, schemas, models
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/ligas",
    tags=["Ligas"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# ✅
@router.post("/", response_model=schemas.Liga)
async def create_ligues(
    liga: schemas.LigaCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    """
    Crea una nueva Liga. Requiere privilegios de administrador.
    """
    db_liga = await crud.get_liga_by_name(db, nombre_liga=liga.nombre_liga)
    if db_liga:
        raise HTTPException(status_code=400, detail="La liga ya existe")
    return await crud.create_liga(db=db, liga=liga)

# ✅
@router.get("/", response_model=list[schemas.Liga])
async def read_ligues(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Recupera una lista de todas las Ligas. Accesible por cualquier usuario autentificado.
    """
    ligas = await crud.get_ligas(db, skip=skip, limit=limit)
    return ligas

# ⚠️
@router.get("/{liga_id}", response_model=schemas.Liga)
async def read_ligues(liga_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera una única Liga por su ID. Accesible por cualquier usuario autentificado.
    """
    db_liga = await crud.get_liga(db, liga_id=liga_id)
    if db_liga is None:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    return db_liga

# ✅
@router.put("/{liga_id}", response_model=schemas.Liga)
async def update_ligues(
    liga_id: int, 
    liga: schemas.LigaUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar
):
    """
    Actualiza una Liga existente por su ID. Requiere privilegios de administrador.
    """
    db_liga = await crud.update_liga(db=db, liga_id=liga_id, liga=liga)
    if db_liga is None:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    return db_liga

# ✅
@router.delete("/{liga_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ligues(
    liga_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede borrar
):
    """
    Borra una Liga por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_liga(db=db, liga_id=liga_id)
    if not success:
        raise HTTPException(status_code=404, detail="Liga no encontrada")
    return {"message": "Liga eliminada exitosamente"}

# ✅
@router.get("/stats/total", response_model=int)
async def get_total_ligues(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(models.Liga))
    total = result.scalar()
    return total