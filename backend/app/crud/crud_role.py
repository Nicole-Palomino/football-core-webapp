from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app import models, schemas

# used in crud_user.py || roles.py
async def get_role(db: AsyncSession, rol_id: int):
    """
    Recupera un único Rol por su ID de forma asíncrona.
    """
    result = await db.execute(select(models.Rol).filter(models.Rol.id_rol == rol_id))
    return result.scalars().first()

# used in roles.py
async def get_role_by_name(db: AsyncSession, nombre_rol: str):
    """
    Recupera un único Rol por su nombre de forma asíncrona.
    """
    result = await db.execute(select(models.Rol).filter(models.Rol.nombre_rol == nombre_rol))
    return result.scalars().first()

# used in roles.py
async def get_roles(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    Recupera una lista de Roles de forma asíncrona.
    """
    result = await db.execute(select(models.Rol).offset(skip).limit(limit))
    return result.scalars().all()

# used in roles.py
async def create_role(db: AsyncSession, rol: schemas.RolCreate):
    """
    Crea un nuevo Rol de forma asíncrona.
    """
    db_rol = models.Rol(nombre_rol=rol.nombre_rol)
    db.add(db_rol)
    try:
        await db.commit()
        await db.refresh(db_rol)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El rol ya existe")
    return db_rol

# used in roles.py
async def update_role(db: AsyncSession, rol_id: int, rol: schemas.RolUpdate):
    """
    Actualiza un Rol existente de forma asíncrona.
    """
    db_rol = await get_role(db, rol_id)
    for key, value in rol.model_dump(exclude_unset=True).items():
        setattr(db_rol, key, value)

    try:
        await db.commit()
        await db.refresh(db_rol)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nombre de rol duplicado")
    return db_rol

# used in roles.py
async def delete_role(db: AsyncSession, rol_id: int):
    """
    Elimina un Rol por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_rol = await get_role(db, rol_id)
    try:
        await db.delete(db_rol)
        await db.commit()
        return {"message": "Rol eliminado correctamente"}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar el rol porque tiene relaciones asociadas"
        )