from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app.dependencies import get_db
from app import schemas, crud, models
from app.core.security import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
    get_current_admin_user,
    get_password_hash
)
from app.core.config import settings

router = APIRouter(
    tags=["Auth"],
    responses={404: {"description": "Not found"}},
)

@router.get("/users/me/", response_model=schemas.User)
async def read_users_me(
    current_user: models.User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Recupera información sobre el usuario autenticado actual.
    Requiere un token de usuario activo.
    """
    result = await db.execute(
        select(models.User)
        .options(selectinload(models.User.rol), selectinload(models.User.estado))
        .where(models.User.id_usuario == current_user.id_usuario)
    )
    user = result.scalars().first()
    return user

# ✅
@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)
):
    """
    Autentica a un usuario por correo electrónico/nombre de usuario y contraseña, y devuelve un token de acceso.
    El campo «username» de OAuth2PasswordRequestForm se utiliza para el nombre de usuario o el correo electrónico.
    """
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales de usuario incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Solo aquí se refresca el rol
    await db.refresh(user, attribute_names=["rol"])

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.correo, "roles": [user.rol.nombre_rol]},
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_create: schemas.UserCreate, 
    db: AsyncSession = Depends(get_db)
):
    """
    Registra un nuevo usuario en el sistema.
    """
    db_user_by_email = await crud.get_user_by_correo(db, correo=user_create.correo)
    if db_user_by_email:
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    
    db_user_by_username = await crud.get_user_by_username(db, username=user_create.usuario)
    if db_user_by_username:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso.")

    try:
        new_user = await crud.create_user(db=db, user=user_create)
        return new_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error al crear el usuario. Verifique los IDs de estado y rol.")

# ✅
@router.post("/register-admin", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
async def register_user_admin(
    user_create: schemas.user.UserCreateAdmin, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user)
):
    """
    Registra un nuevo usuario en el sistema.
    """
    db_user_by_email = await crud.get_user_by_correo(db, correo=user_create.correo)
    if db_user_by_email:
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")
    
    db_user_by_username = await crud.get_user_by_username(db, username=user_create.usuario)
    if db_user_by_username:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso.")

    try:
        new_user = await crud.crud_user.create_user_admin(db=db, user=user_create)
        return new_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error al crear el usuario. Verifique los IDs de estado y rol.")

@router.post("/request-password-reset")
async def request_password_reset(
    request: schemas.PasswordRecoveryRequest, 
    db: AsyncSession = Depends(get_db)
):
    """
    Solicita el restablecimiento de la contraseña. Genera un código de verificación y establece su caducidad.
    """
    user = await crud.get_user_by_correo(db, correo=request.correo)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    
    await crud.set_user_verification_code(db, user)
    return {"message": "Código de verificación enviado. Revise la consola/su correo."}

@router.post("/verify-password-code")
async def verify_password_code(
    verification: schemas.PasswordVerification, 
    db: AsyncSession = Depends(get_db)
):
    """
    Verifica el código de restablecimiento de contraseña proporcionado.
    """
    user = await crud.get_user_by_correo(db, correo=verification.correo)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    
    if user.codigo_verificacion is None or user.expiracion is None:
        raise HTTPException(status_code=400, detail="No hay código de verificación activo para este usuario.")
    
    if user.expiracion < datetime.utcnow():
        await crud.clear_user_verification_code(db, user)
        raise HTTPException(status_code=400, detail="El código de verificación ha expirado.")
    
    if user.codigo_verificacion != verification.codigo_verificacion:
        raise HTTPException(status_code=400, detail="Código de verificación incorrecto.")
    
    return {"message": "Código verificado exitosamente."}

@router.post("/reset-password")
async def reset_password(
    reset_data: schemas.PasswordReset, 
    db: AsyncSession = Depends(get_db)
):
    """
    Restablece la contraseña del usuario mediante un código verificado.
    """
    user = await crud.get_user_by_correo(db, correo=reset_data.correo)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")
    
    # Vuelva a verificar el código para asegurarse de que sigue siendo válido y coincide
    if user.codigo_verificacion is None or user.expiracion is None or user.expiracion < datetime.utcnow() or user.codigo_verificacion != reset_data.codigo_verificacion:
        raise HTTPException(status_code=400, detail="Código de verificación inválido o expirado. Solicite uno nuevo.")
    
    await crud.update_user_password(db, user, reset_data.nueva_contrasena)
    return {"message": "Contraseña restablecida exitosamente."}