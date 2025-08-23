from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select
from fastapi import HTTPException, status

from app import models, schemas

# used in crud_user.py || states.py || teams.py
async def get_estado(db: AsyncSession, estado_id: int):
    """
    Recupera un único Estado por su ID de forma asíncrona.
    Eager carga equipos asociados, partidos, y paquetes_moneda para una respuesta más rica.
    """
    result = await db.execute(
        select(models.Estado)
        .filter(models.Estado.id_estado == estado_id)
    )
    return result.scalars().first()

# used in states.py
async def get_estado_by_name(db: AsyncSession, nombre_estado: str):
    """
    Recupera un único Estado por su nombre de forma asíncrona.
    """
    result = await db.execute(select(models.Estado).filter(models.Estado.nombre_estado == nombre_estado))
    return result.scalars().first()

# used in states.py
async def get_estados(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    Recupera una lista de Estados de forma asíncrona.
    """
    result = await db.execute(select(models.Estado).offset(skip).limit(limit))
    return result.scalars().all()

# used in states.py
async def create_estado(db: AsyncSession, estado: schemas.EstadoCreate):
    """
    Crea un nuevo Estado de forma asíncrona.
    """
    db_estado = models.Estado(nombre_estado=estado.nombre_estado)
    db.add(db_estado)
    try:
        await db.commit()
        await db.refresh(db_estado)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El estado ya existe")
    return db_estado

# used in states.py
async def update_estado(db: AsyncSession, estado_id: int, estado: schemas.EstadoUpdate):
    """
    Actualiza un Estado existente de forma asíncrona.
    """
    db_estado = await get_estado(db, estado_id)
    for key, value in estado.model_dump(exclude_unset=True).items():
        setattr(db_estado, key, value)
    try:
        await db.commit()
        await db.refresh(db_estado)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nombre de estado duplicado")
    return db_estado

# used in states.py
async def delete_estado(db: AsyncSession, estado_id: int):
    """
    Borra un Estado por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_estado = await get_estado(db, estado_id)
    try:
        await db.delete(db_estado)
        await db.commit()
        return {"message": "Estado eliminado correctamente"}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar el estado porque tiene relaciones asociadas"
        )