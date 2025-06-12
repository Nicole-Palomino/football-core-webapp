from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app import models, schemas

async def get_temporada(db: AsyncSession, temporada_id: int):
    """
    Recupera una única Temporada por su ID de forma asíncrona.
    Carga los partidos asociados para obtener una respuesta más completa.
    """
    result = await db.execute(
        select(models.Temporada)
        .filter(models.Temporada.id_temporada == temporada_id)
        .options(joinedload(models.Temporada.partidos))
    )
    return result.scalars().first()

async def get_temporada_by_name(db: AsyncSession, nombre_temporada: str):
    """
    Recupera una única Temporada por su nombre de forma asíncrona.
    """
    result = await db.execute(select(models.Temporada).filter(models.Temporada.nombre_temporada == nombre_temporada))
    return result.scalars().first()

async def get_temporadas(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    Recupera una lista de Temporadas de forma asíncrona.
    """
    result = await db.execute(select(models.Temporada).offset(skip).limit(limit))
    return result.scalars().all()

async def create_temporada(db: AsyncSession, temporada: schemas.TemporadaCreate):
    """
    Crea una nueva Temporada de forma asíncrona.
    """
    db_temporada = models.Temporada(nombre_temporada=temporada.nombre_temporada)
    db.add(db_temporada)
    await db.commit()
    await db.refresh(db_temporada)
    return db_temporada

async def update_temporada(db: AsyncSession, temporada_id: int, temporada: schemas.TemporadaUpdate):
    """
    Actualiza una Temporada existente de forma asíncrona.
    """
    db_temporada = await get_temporada(db, temporada_id)
    if db_temporada:
        for key, value in temporada.model_dump(exclude_unset=True).items():
            setattr(db_temporada, key, value)
        await db.commit()
        await db.refresh(db_temporada)
    return db_temporada

async def delete_temporada(db: AsyncSession, temporada_id: int):
    """
    Borra una Temporada por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_temporada = await get_temporada(db, temporada_id)
    if db_temporada:
        await db.delete(db_temporada)
        await db.commit()
        return True
    return False