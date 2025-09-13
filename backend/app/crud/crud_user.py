import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, func
from app import models, schemas
from app.core.password_utils import get_password_hash
from app.utils.email_sender import send_email
from app.crud import crud_role, crud_state

DEFAULT_ESTADO = 10  # Usuario Free
DEFAULT_ROL = 3     # Usuario normal
DEFAULT_ADMIN_ROL = 2 # Administrador

# used in users.py
async def get_all_users(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    Recupera todos los usuarios de forma asíncrona, cargando ansiosamente roles y estado.
    """
    result = await db.execute(
        select(models.User)
        .options(
            selectinload(models.User.rol),
            selectinload(models.User.estado),
        )
        .offset(skip).limit(limit)
    )
    return result.scalars().all()

# used in auth.py || users.py || security.py
async def get_user(db: AsyncSession, user_id: int):
    """
    Recupera un único usuario por su ID de forma asíncrona, cargando ansiosamente roles, saldo y transacciones.
    """
    result = await db.execute(
        select(models.User)
        .options(
            selectinload(models.User.rol), 
            selectinload(models.User.estado), 
        )
        .filter(models.User.id_usuario == user_id)
    )
    return result.scalars().first()

# used in auth.py
async def get_user_by_correo(db: AsyncSession, correo: str):
    """
    Recupera un único Usuario por su email (correo) de forma asíncrona, cargando ansiosamente roles, saldo y transacciones.
    """
    result = await db.execute(
        select(models.User)
        .filter(models.User.correo == correo)
    )
    return result.scalars().first()

# used in auth.py
async def get_user_by_username(db: AsyncSession, username: str):
    """
    Recupera un único usuario por su nombre de usuario de forma asíncrona.
    """
    result = await db.execute(
        select(models.User)
        .filter(models.User.usuario == username)
    )
    return result.scalars().first()

# used in auth.py
async def create_user(db: AsyncSession, user: schemas.UserCreate):
    """
    Crea un nuevo usuario de forma asíncrona, haciendo hash de la contraseña
    y asociando rol y estado, retornando el usuario con relaciones cargadas.
    """
    # Obtener rol y estado por defecto
    role = await crud_role.get_role(db, DEFAULT_ROL)
    if not role:
        raise ValueError(f"Rol con ID {DEFAULT_ROL} no encontrado.")

    estado = await crud_state.get_estado(db, DEFAULT_ESTADO)
    if not estado:
        raise ValueError(f"Estado con ID {DEFAULT_ESTADO} no encontrado.")

    hashed_contrasena = get_password_hash(user.contrasena)
    db_user = models.User(
        usuario=user.usuario,
        correo=user.correo,
        contrasena=hashed_contrasena,
        id_estado=DEFAULT_ESTADO,
        id_rol=DEFAULT_ROL,
        registro=datetime.now(timezone.utc)
    )
    
    db.add(db_user)
    try:
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise ValueError("Error al crear el usuario. Verifique los datos ingresados.") from e
    
    stmt = (
        select(models.User)
        .options(
            selectinload(models.User.rol),
            selectinload(models.User.estado),
        )
        .where(models.User.id_usuario == db_user.id_usuario)
    )
    result = await db.execute(stmt)
    user_with_relations = result.scalars().first()

    return user_with_relations

# used in auth.py
async def create_user_admin(db: AsyncSession, user: schemas.user.UserCreateAdmin):
    """
    Crea un nuevo Usuario administrador de forma asíncrona, permitiendo definir manualmente el rol y estado.
    """
    # Obtener rol y estado por defecto
    role = await crud_role.get_role(db, DEFAULT_ADMIN_ROL)
    if not role:
        raise ValueError(f"Rol con ID {DEFAULT_ADMIN_ROL} no encontrado.")

    estado = await crud_state.get_estado(db, DEFAULT_ESTADO)
    if not estado:
        raise ValueError(f"Estado con ID {DEFAULT_ESTADO} no encontrado.")

    hashed_contrasena = get_password_hash(user.contrasena)
    db_user = models.User(
        usuario=user.usuario,
        correo=user.correo,
        contrasena=hashed_contrasena,
        id_estado=user.id_estado,
        id_rol=user.id_rol,
        registro=datetime.now(timezone.utc)
    )
    
    db.add(db_user)
    try:
        await db.commit()
    except IntegrityError as e:
        await db.rollback()
        raise ValueError("Error al crear el usuario. Verifique los datos ingresados.") from e

    stmt = (
        select(models.User)
        .options(
            selectinload(models.User.rol),
            selectinload(models.User.estado),
        )
        .where(models.User.id_usuario == db_user.id_usuario)
    )
    result = await db.execute(stmt)
    user_with_relations = result.scalars().first()
    
    return user_with_relations

# used in users.py
async def update_user(db: AsyncSession, user_id: int, user: schemas.UserUpdate):
    """
    Actualiza un usuario existente de forma asíncrona.
    - Verifica existencia del usuario.
    - Valida duplicados de correo y nombre de usuario.
    - Hashea la contraseña si es proporcionada.
    - Convierte is_active a int (para compatibilidad).
    """
    # Buscar usuario
    db_user = await db.get(models.User, user_id)
    if not db_user:
        return None

    # Datos actualizados enviados en la request
    update_data = user.model_dump(exclude_unset=True)

    # Validar duplicado de usuario
    if "usuario" in update_data:
        result = await db.execute(
            select(models.User).where(
                models.User.usuario == update_data["usuario"],
                models.User.id_usuario != user_id
            )
        )
        if result.scalar():
            raise ValueError("Ya existe un usuario con ese nombre de usuario.")

    # Validar duplicado de correo
    if "correo" in update_data:
        result = await db.execute(
            select(models.User).where(
                models.User.correo == update_data["correo"],
                models.User.id_usuario != user_id
            )
        )
        if result.scalar():
            raise ValueError("Ya existe un usuario con ese correo.")

    # Actualizar campos
    for key, value in update_data.items():
        if key == "contrasena" and value:  # Si envía nueva contraseña
            hashed_pw = get_password_hash(value)
            setattr(db_user, key, hashed_pw)
        elif key == "is_active" and value is not None:  # Boolean a int
            setattr(db_user, key, int(value))
        else:
            setattr(db_user, key, value)

    # Guardar cambios
    await db.commit()
    await db.refresh(db_user)

    return db_user

# used in users.py
async def update_admin(db: AsyncSession, user_id: int, user_update: schemas.user.UserUpdateAdmin):
    """
    Actualiza un usuario existente (modo administrador).
    Permite modificar todos los campos del usuario, incluyendo is_active, rol y estado.
    Maneja el hash de la contraseña si se proporciona.
    """
    db_user = await db.get(models.User, user_id)
    if not db_user:
        return None
    
    update_data = user_update.model_dump(exclude_unset=True)

    # Si se envía contraseña, la hasheamos
    if "contrasena" in update_data and update_data["contrasena"]:
        update_data["contrasena"] = get_password_hash(update_data["contrasena"])

    # Validar rol si se está actualizando
    if "id_rol" in update_data:
        role = await crud_role.get_role(db, update_data["id_rol"])
        if not role:
            raise ValueError(f"Rol con ID {update_data['id_rol']} no encontrado.")

    # Validar estado si se está actualizando
    if "id_estado" in update_data:
        estado = await crud_state.get_estado(db, update_data["id_estado"])
        if not estado:
            raise ValueError(f"Estado con ID {update_data['id_estado']} no encontrado.")

    # Actualizar todos los campos recibidos
    for key, value in update_data.items():
        if key == "is_active" and value is not None:
            setattr(db_user, key, int(value))  # convertimos bool → int
        else:
            setattr(db_user, key, value)

    await db.commit()
    await db.refresh(db_user)
    return db_user

# used in users.py
async def delete_user(db: AsyncSession, user_id: int):
    """
    Elimina un usuario por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_user = await get_user(db, user_id)
    if db_user:
        await db.delete(db_user)
        await db.commit()
        return True
    return False

# used in users.py
async def get_usuarios_por_dia(db: AsyncSession):
    stmt = (
        select(
            func.date(models.User.registro).label("fecha"),
            func.count(models.User.id_usuario).label("cantidad")
        )
        .group_by(func.date(models.User.registro))
        .order_by(func.date(models.User.registro))
    )
    result = await db.execute(stmt)
    return result.all()

# --- Funciones de recuperación de contraseñas ---
# used in auth.py 
async def set_user_verification_code(db: AsyncSession, user: models.User):
    """
    Genera un código de verificación de 6 dígitos y establece su caducidad para un usuario.
    Envía el código al correo electrónico del usuario.
    """
    code = random.randint(100000, 999999)
    # El código caduca en 15 minutos
    expiration_time = datetime.utcnow() + timedelta(minutes=15) 
    
    user.codigo_verificacion = code
    user.expiracion = expiration_time
    
    await db.commit()
    await db.refresh(user)
    
    # Enviar el código por correo electrónico
    subject = "Código de Recuperación de Contraseña"
    body = f"""
    Hola {user.usuario},

    Has solicitado restablecer tu contraseña.
    Tu código de verificación es: {code}

    Este código expirará en 15 minutos. Si no lo solicitaste, ignora este correo.

    Saludos,
    Equipo de Soporte
    """
    try:
        await send_email(user.correo, subject, body)
        print(f"Código de verificación enviado a {user.correo}")
    except Exception as e:
        print(f"Error al enviar el correo electrónico al usuario {user.correo}: {e}")
        # Dependiendo de la criticidad, es posible que desee registrar este error o notificar a un administrador
    
    return user

# used in auth.py 
async def clear_user_verification_code(db: AsyncSession, user: models.User):
    """
    Borra el código de verificación y el tiempo de expiración de un usuario.
    """
    user.codigo_verificacion = None
    user.expiracion = None
    await db.commit()
    await db.refresh(user)
    return user

# used in auth.py
async def update_user_password(db: AsyncSession, user: models.User, new_password: str):
    """
    Actualiza la contraseña de un usuario tras una verificación correcta.
    """
    user.contrasena = get_password_hash(new_password)
    await clear_user_verification_code(db, user) # Borrar código después de reiniciar correctamente
    await db.commit()
    await db.refresh(user)
    return user