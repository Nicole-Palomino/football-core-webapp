from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app import models, schemas

# used in leagues.py || teams.py
async def get_liga(db: AsyncSession, liga_id: int):
    """
    Recupera una Liga por su ID de forma asíncrona.
    """
    result = await db.execute(
        select(models.Liga)
        .filter(models.Liga.id_liga == liga_id)
    )
    return result.scalars().first()

# used in leagues.py
async def get_liga_by_name(db: AsyncSession, nombre_liga: str):
    """
    Recupera una única Liga por su nombre de forma asíncrona.
    """
    result = await db.execute(
        select(models.Liga)
        .filter(models.Liga.nombre_liga == nombre_liga)
    )
    return result.scalars().first()

# used in leagues.py
async def get_ligas(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    Recupera una lista de Ligas de forma asíncrona.
    """
    result = await db.execute(
        select(models.Liga)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

# used in leagues.py
async def create_liga(db: AsyncSession, liga: schemas.LigaCreate):
    """
    Crea una nueva Liga de forma asíncrona.
    """
    db_liga = models.Liga(**liga.model_dump())
    db.add(db_liga)
    try:
        await db.commit()
        await db.refresh(db_liga)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La liga ya existe")
    return db_liga

# used in leagues.py
async def update_liga(db: AsyncSession, liga_id: int, liga: schemas.LigaUpdate):
    """
    Actualiza una Liga existente de forma asíncrona.
    """
    db_liga = await get_liga(db, liga_id)
    if db_liga:
        for key, value in liga.model_dump(exclude_unset=True).items():
            setattr(db_liga, key, value)
        await db.commit()
        await db.refresh(db_liga)
    return db_liga

# used in leagues.py
async def delete_liga(db: AsyncSession, liga_id: int):
    """
    Elimina una Liga por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_liga = await get_liga(db, liga_id)
    try:
        await db.delete(db_liga)
        await db.commit()
        return {"message": "Liga eliminada correctamente"}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar la liga porque tiene relaciones asociadas"
        )