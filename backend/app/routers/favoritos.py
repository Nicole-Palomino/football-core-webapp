from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.schemas.favorito import FavoritoCreate, FavoritoOut
from app.crud import crud_favorito
from typing import List
from app.core.security import get_current_active_user

router = APIRouter(
    prefix="/favoritos", 
    tags=["Favoritos"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}}
)

@router.post("/", response_model=FavoritoOut)
async def agregar_favorito(favorito: FavoritoCreate, id_usuario: int, db: AsyncSession = Depends(get_db)):
    return await crud_favorito.agregar_favorito(db, id_usuario, favorito)

@router.delete("/", response_model=FavoritoOut)
async def eliminar_favorito(id_usuario: int, id_partido: int, db: AsyncSession = Depends(get_db)):
    favorito = await crud_favorito.eliminar_favorito(db, id_usuario, id_partido)
    if not favorito:
        raise HTTPException(status_code=404, detail="Favorito no encontrado")
    return favorito

@router.get("/", response_model=List[FavoritoOut])
async def obtener_favoritos(id_usuario: int, db: AsyncSession = Depends(get_db)):
    return await crud_favorito.listar_favoritos(db, id_usuario)
