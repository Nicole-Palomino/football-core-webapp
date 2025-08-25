from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.schemas.favorite import FavoritoCreate, FavoritoOut
from app.crud import crud_favorite
from typing import List
from app.core.security import get_current_active_user

router = APIRouter(
    prefix="/favoritos", 
    tags=["Favoritos"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}}
)

# finished
@router.post("/", response_model=FavoritoOut, status_code=status.HTTP_201_CREATED)
async def create_favorite(favorito: FavoritoCreate, db: AsyncSession = Depends(get_db)):
    return await crud_favorite.agregar_favorito(db, favorito)

# finished
@router.delete("/{id_partido}/{id_usuario}")
async def delete_favorite(id_usuario: int, id_partido: int, db: AsyncSession = Depends(get_db)):
    favorito = await crud_favorite.eliminar_favorito(db, id_usuario, id_partido)
    if not favorito:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorito no encontrado")
    return favorito

# finished
@router.get("/", response_model=List[FavoritoOut])
async def get_favorites(id_usuario: int, db: AsyncSession = Depends(get_db)):
    return await crud_favorite.listar_favoritos(db, id_usuario)
