from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app import models, schemas
from app.crud import crud_user

async def get_balance_usuario(db: AsyncSession, balance_id: int):
    """
    Recupera un único BalanceUsuario por su ID de forma asíncrona, con el Usuario relacionado.
    """
    result = await db.execute(
        select(models.BalanceUsuario)
        .options(joinedload(models.BalanceUsuario.usuario))
        .filter(models.BalanceUsuario.id_balance == balance_id)
    )
    return result.scalars().first()

async def get_balance_usuario_by_user_id(db: AsyncSession, user_id: int):
    """
    Recupera un único BalanceUsuario por su ID de usuario asociado de forma asíncrona.
    """
    result = await db.execute(
        select(models.BalanceUsuario)
        .filter(models.BalanceUsuario.id_usuario == user_id)
    )
    return result.scalars().first()

async def create_balance_usuario(db: AsyncSession, balance: schemas.BalanceUsuarioCreate):
    """
    Crea un nuevo BalanceUsuario de forma asíncrona.
    Debe ser llamado típicamente cuando un nuevo usuario se registra.
    Realiza una comprobación de la existencia de un Usuario relacionado.
    """

    user = await crud_user.get_user(db, balance.id_usuario) 
    if not user:
        raise ValueError(f"Usuario con ID {balance.id_usuario} no encontrado.")
    
    existing_balance = await get_balance_usuario_by_user_id(db, balance.id_usuario)
    if existing_balance:
        raise ValueError(f"El balance para el Usuario con ID {balance.id_usuario} ya existe.")

    db_balance = models.BalanceUsuario(
        id_usuario=balance.id_usuario,
        cantidad_monedas=balance.cantidad_monedas,
        ultima_actualizacion=datetime.utcnow()
    )
    db.add(db_balance)
    await db.commit()
    await db.refresh(db_balance)
    return db_balance

async def update_balance_usuario(db: AsyncSession, balance_id: int, balance: schemas.BalanceUsuarioUpdate):
    """
    Actualiza un BalanceUsuario existente de forma asíncrona.
    Actualiza `ultima_actualizacion` timestamp.
    """
    db_balance = await get_balance_usuario(db, balance_id)
    if not db_balance:
        return None
    
    update_data = balance.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_balance, key, value)
    
    db_balance.ultima_actualizacion = datetime.utcnow() # Actualizar siempre la fecha de modificación
    
    await db.commit()
    await db.refresh(db_balance)
    return db_balance

async def add_coins_to_balance(db: AsyncSession, user_id: int, cantidad: int):
    """
    Añade una cantidad especificada de monedas al saldo de un usuario de forma asíncrona.
    """
    db_balance = await get_balance_usuario_by_user_id(db, user_id)
    if not db_balance:
        raise ValueError(f"Balance no encontrado para el usuario con ID {user_id}.")
    
    db_balance.cantidad_monedas += cantidad
    db_balance.ultima_actualizacion = datetime.utcnow()
    
    await db.commit()
    await db.refresh(db_balance)
    return db_balance

async def deduct_coins_from_balance(db: AsyncSession, user_id: int, cantidad: int):
    """
    Deduce una cantidad especificada de monedas del saldo de un usuario de forma asíncrona.
    Genera un error ValueError si el usuario no tiene suficientes monedas.
    """
    db_balance = await get_balance_usuario_by_user_id(db, user_id)
    if not db_balance:
        raise ValueError(f"Balance no encontrado para el usuario con ID {user_id}.")
    
    if db_balance.cantidad_monedas < cantidad:
        raise ValueError(f"Balance insuficiente. Monedas actuales: {db_balance.cantidad_monedas}, se necesitan: {cantidad}.")
    
    db_balance.cantidad_monedas -= cantidad
    db_balance.ultima_actualizacion = datetime.utcnow()
    
    await db.commit()
    await db.refresh(db_balance)
    return db_balance

async def delete_balance_usuario(db: AsyncSession, balance_id: int):
    """
    Borra un BalanceUsuario por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_balance = await get_balance_usuario(db, balance_id)
    if db_balance:
        await db.delete(db_balance)
        await db.commit()
        return True
    return False