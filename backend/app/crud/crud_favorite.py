from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload
from app.models.favorite import Favorito
from app.models.match import Partido
from app.schemas.favorite import FavoritoCreate

async def agregar_favorito(db: AsyncSession, favorito_data: FavoritoCreate):
    # Verificar si ya existe
    result = await db.execute(
        select(Favorito).where(and_(
            Favorito.id_usuario == favorito_data.id_usuario,
            Favorito.id_partido == favorito_data.id_partido
        ))
    )
    favorito = result.scalar_one_or_none()
    if favorito:
        favorito.is_active = True
    else:
        favorito = Favorito(**favorito_data.model_dump())
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
        select(Favorito)
        .options(
            selectinload(Favorito.partido)
            .options(
                selectinload(Partido.liga),
                selectinload(Partido.equipo_local),
                selectinload(Partido.equipo_visita),
                selectinload(Partido.estado),
            )
        )
        .where(
            Favorito.id_usuario == id_usuario,
            Favorito.is_active == True
        )
        .order_by(Favorito.created_at.desc())
    )
    return result.scalars().all()
