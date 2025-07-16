from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app import models, schemas

async def get_role(db: AsyncSession, rol_id: int):
    """
    Recupera un único Rol por su ID de forma asíncrona.
    Eager carga usuarios asociados para una respuesta más rica.
    """
    result = await db.execute(select(models.Rol).filter(models.Rol.id_rol == rol_id))
    return result.scalars().first()

async def get_role_by_name(db: AsyncSession, nombre_rol: str):
    """
    Recupera un único Rol por su nombre de forma asíncrona.
    """
    result = await db.execute(select(models.Rol).filter(models.Rol.nombre_rol == nombre_rol))
    return result.scalars().first()

async def get_roles(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    Recupera una lista de Roles de forma asíncrona.
    """
    result = await db.execute(select(models.Rol).offset(skip).limit(limit))
    return result.scalars().all()

async def create_role(db: AsyncSession, rol: schemas.RolCreate):
    """
    Crea un nuevo Rol de forma asíncrona.
    """
    db_rol = models.Rol(nombre_rol=rol.nombre_rol)
    db.add(db_rol)
    await db.commit()
    await db.refresh(db_rol)
    return db_rol

async def update_role(db: AsyncSession, rol_id: int, rol: schemas.RolUpdate):
    """
    Actualiza un Rol existente de forma asíncrona.
    """
    db_rol = await get_role(db, rol_id)
    if db_rol:
        for key, value in rol.model_dump(exclude_unset=True).items():
            setattr(db_rol, key, value)
        await db.commit()
        await db.refresh(db_rol)
    return db_rol

async def delete_role(db: AsyncSession, rol_id: int):
    """
    Elimina un Rol por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_rol = await get_role(db, rol_id)
    if db_rol:
        await db.delete(db_rol)
        await db.commit()
        return True
    return False