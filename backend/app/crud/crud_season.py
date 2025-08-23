from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app import models, schemas

# used in seasons.py
async def get_temporada(db: AsyncSession, temporada_id: int):
    """
    Recupera una única Temporada por su ID de forma asíncrona.
    """
    result = await db.execute(
        select(models.Temporada)
        .filter(models.Temporada.id_temporada == temporada_id)
    )
    return result.scalars().first()

# used in seasons.py
async def get_temporada_by_name(db: AsyncSession, nombre_temporada: str):
    """
    Recupera una única Temporada por su nombre de forma asíncrona.
    """
    result = await db.execute(select(models.Temporada).filter(models.Temporada.nombre_temporada == nombre_temporada))
    return result.scalars().first()

# used in seasons.py
async def get_temporadas(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    Recupera una lista de Temporadas de forma asíncrona.
    """
    result = await db.execute(select(models.Temporada).offset(skip).limit(limit))
    return result.scalars().all()

# used in seasons.py
async def create_temporada(db: AsyncSession, temporada: schemas.TemporadaCreate):
    """
    Crea una nueva Temporada de forma asíncrona.
    """
    db_temporada = models.Temporada(nombre_temporada=temporada.nombre_temporada)
    db.add(db_temporada)
    try:
        await db.commit()
        await db.refresh(db_temporada)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La temporada ya existe")
    return db_temporada

# used in seasons.py
async def update_temporada(db: AsyncSession, temporada_id: int, temporada: schemas.TemporadaUpdate):
    """
    Actualiza una Temporada existente de forma asíncrona.
    """
    db_temporada = await get_temporada(db, temporada_id)
    for key, value in temporada.model_dump(exclude_unset=True).items():
        setattr(db_temporada, key, value)

    try:
        await db.commit()
        await db.refresh(db_temporada)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nombre de la temporada duplicada")
    return db_temporada

# used in seasons.py
async def delete_temporada(db: AsyncSession, temporada_id: int):
    """
    Borra una Temporada por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_temporada = await get_temporada(db, temporada_id)
    try:
        await db.delete(db_temporada)
        await db.commit()
        return {"message": "Temporada eliminada correctamente"}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar la temporada porque tiene relaciones asociadas"
        )