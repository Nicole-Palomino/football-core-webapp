from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.favorito import Favorito
from app.schemas.favorito import FavoritoCreate

async def agregar_favorito(db: AsyncSession, id_usuario: int, favorito_data: FavoritoCreate):
    # Verificar si ya existe
    result = await db.execute(
        select(Favorito).where(and_(
            Favorito.id_usuario == id_usuario,
            Favorito.id_partido == favorito_data.id_partido
        ))
    )
    favorito = result.scalar_one_or_none()
    if favorito:
        favorito.is_active = True
    else:
        favorito = Favorito(id_usuario=id_usuario, **favorito_data.model_dump())
        db.add(favorito)
    await db.commit()
    await db.refresh(favorito)
    return favorito

async def eliminar_favorito(db: AsyncSession, id_usuario: int, id_partido: int):
    result = await db.execute(
        select(Favorito).where(and_(
            Favorito.id_usuario == id_usuario,
            Favorito.id_partido == id_partido
        ))
    )
    favorito = result.scalar_one_or_none()
    if favorito:
        favorito.is_active = False
        await db.commit()
        return favorito
    return None

async def listar_favoritos(db: AsyncSession, id_usuario: int):
    result = await db.execute(
        select(Favorito).where(and_(
            Favorito.id_usuario == id_usuario,
            Favorito.is_active == True
        ))
    )
    return result.scalars().all()
