from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app import models, schemas

async def get_equipo(db: AsyncSession, equipo_id: int):
    """
    Recupera un único Equipo por su ID de forma asíncrona, con Estado, Liga y Partidos relacionados.
    """
    result = await db.execute(
        select(models.Equipo)
        .options(
            selectinload(models.Equipo.estado),
            selectinload(models.Equipo.liga),
            selectinload(models.Equipo.partidos_local),
            selectinload(models.Equipo.partidos_visita)
        )
        .filter(models.Equipo.id_equipo == equipo_id)
    )
    return result.scalars().first()

async def get_equipo_by_name(db: AsyncSession, nombre_equipo: str):
    """
    Recupera un único Equipo por su nombre de forma asíncrona.
    """
    result = await db.execute(
        select(models.Equipo)
        .filter(models.Equipo.nombre_equipo == nombre_equipo)
    )
    return result.scalars().first()

async def get_equipos(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    Recupera una lista de Equipos de forma asíncrona.
    """
    result = await db.execute(
        select(models.Equipo)
        .options(
            selectinload(models.Equipo.estado), 
            selectinload(models.Equipo.liga)
        )
        .offset(skip).limit(limit)
    )
    return result.scalars().all()

async def create_equipo(db: AsyncSession, equipo: schemas.EquipoCreate):
    """
    Crea un nuevo Equipo de forma asíncrona.
    """
    db_equipo = models.Equipo(
        nombre_equipo=equipo.nombre_equipo,
        estadio=equipo.estadio,
        logo=equipo.logo,
        id_estado=equipo.id_estado,
        id_liga=equipo.id_liga
    )
    db.add(db_equipo)
    await db.commit()
    await db.refresh(db_equipo)
    return db_equipo

async def update_equipo(db: AsyncSession, equipo_id: int, equipo: schemas.EquipoUpdate):
    """
    Actualiza un Equipo existente de forma asíncrona.
    """
    db_equipo = await get_equipo(db, equipo_id)
    if db_equipo:
        for key, value in equipo.model_dump(exclude_unset=True).items():
            setattr(db_equipo, key, value)
        await db.commit()
        await db.refresh(db_equipo)
    return db_equipo

async def delete_equipo(db: AsyncSession, equipo_id: int):
    """
    Elimina un Equipo por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_equipo = await get_equipo(db, equipo_id)
    if db_equipo:
        await db.delete(db_equipo)
        await db.commit()
        return True
    return False