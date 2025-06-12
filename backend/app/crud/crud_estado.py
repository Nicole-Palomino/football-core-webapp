from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app import models, schemas

async def get_estado(db: AsyncSession, estado_id: int):
    """
    Recupera un único Estado por su ID de forma asíncrona.
    Eager carga equipos asociados, partidos, y paquetes_moneda para una respuesta más rica.
    """
    result = await db.execute(
        select(models.Estado)
        .options(
            joinedload(models.Estado.equipos),
            joinedload(models.Estado.partidos),
            joinedload(models.Estado.paquetes_moneda)
        )
        .filter(models.Estado.id_estado == estado_id)
    )
    return result.scalars().first()

async def get_estado_by_name(db: AsyncSession, nombre_estado: str):
    """
    Recupera un único Estado por su nombre de forma asíncrona.
    """
    result = await db.execute(select(models.Estado).filter(models.Estado.nombre_estado == nombre_estado))
    return result.scalars().first()

async def get_estados(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    Recupera una lista de Estados de forma asíncrona.
    """
    result = await db.execute(select(models.Estado).offset(skip).limit(limit))
    return result.scalars().all()

async def create_estado(db: AsyncSession, estado: schemas.EstadoCreate):
    """
    Crea un nuevo Estado de forma asíncrona.
    """
    db_estado = models.Estado(nombre_estado=estado.nombre_estado)
    db.add(db_estado)
    await db.commit()
    await db.refresh(db_estado)
    return db_estado

async def update_estado(db: AsyncSession, estado_id: int, estado: schemas.EstadoUpdate):
    """
    Actualiza un Estado existente de forma asíncrona.
    """
    db_estado = await get_estado(db, estado_id)
    if db_estado:
        for key, value in estado.model_dump(exclude_unset=True).items():
            setattr(db_estado, key, value)
        await db.commit()
        await db.refresh(db_estado)
    return db_estado

async def delete_estado(db: AsyncSession, estado_id: int):
    """
    Borra un Estado por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_estado = await get_estado(db, estado_id)
    if db_estado:
        await db.delete(db_estado)
        await db.commit()
        return True
    return False