from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from app import schemas, crud, models
from app.crud import crud_user
from app.crud import crud_refresh_token
from app.dependencies import get_db
from app.core.logger import logger
from app.core.security import (
    authenticate_user,
    create_access_token,
    get_current_active_user,
    get_current_admin_user,
    create_access_token_for_user, 
)
from app.core.config import settings
from app.middlewares.rate_limit import limiter

router = APIRouter(
    tags=["Auth"],
    responses={404: {"description": "Not found"}},
)

REFRESH_COOKIE_NAME = "refresh_token"

# used
def set_refresh_cookie(resp: Response, raw_refresh: str):
    # Cookie segura (ajusta domain y samesite)
    resp.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=raw_refresh,
        httponly=True,
        secure=True,             # True en producción (HTTPS)
        samesite="none",          # "strict" o "none" (si cross-site)
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
        path="/refresh",    # restringe solo al endpoint de refresh
    )

# used
def clear_refresh_cookie(resp: Response):
    resp.delete_cookie(REFRESH_COOKIE_NAME, path="/refresh")

# finished || tested || used in admin
@router.get("/users/me/")
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

    roles = []
    if user.rol:  # 👈 si existe relación con Rol
        roles.append(user.rol.nombre_rol)

    return {
        "id_usuario": user.id_usuario,
        "correo": user.correo,
        "nombre": user.usuario,
        "is_active": user.is_active,
        "registro": user.registro,
        "updated_at": user.updated_at,
        "estado": user.estado,
        "roles": roles
    }

# finished || tested || used in frontend
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
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El correo ya está registrado.")
    
    db_user_by_username = await crud.get_user_by_username(db, username=user_create.usuario)
    if db_user_by_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de usuario ya está en uso.")

    try:
        new_user = await crud.create_user(db=db, user=user_create)
        return new_user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el usuario. Verifique los IDs de estado y rol.")

# finished || tested || used in admin
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

# finished || tested || used in frontend
@router.post("/request-password-reset")
async def request_password_reset(
    request: schemas.PasswordRecoveryRequest, 
    db: AsyncSession = Depends(get_db),
):
    """
    Solicita el restablecimiento de la contraseña. Genera un código de verificación y establece su caducidad.
    """
    user = await crud.get_user_by_correo(db, correo=request.correo)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    
    await crud.set_user_verification_code(db, user)
    return {"message": "Código de verificación enviado. Revise la bandeja de entrada de su correo."}

# finished || tested || used in frontend
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    
    if user.codigo_verificacion is None or user.expiracion is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No hay código de verificación activo para este usuario.")
    
    if user.expiracion < datetime.utcnow():
        await crud.clear_user_verification_code(db, user)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El código de verificación ha expirado.")
    
    if user.codigo_verificacion != verification.codigo_verificacion:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Código de verificación incorrecto.")
    
    return {"message": "Código verificado exitosamente."}

# finished || tested || used in frontend
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    
    # Validar código nuevamente
    if (
        user.codigo_verificacion is None or
        user.expiracion is None or
        user.expiracion < datetime.utcnow() or
        user.codigo_verificacion != reset_data.codigo_verificacion
    ):
        raise HTTPException(status_code=400, detail="Código inválido o expirado. Solicite uno nuevo.")
    
    # Actualizar contraseña con hashing seguro
    await crud.update_user_password(db, user, reset_data.nueva_contrasena)
    
    # Limpiar código para que no se pueda reutilizar
    await crud.clear_user_verification_code(db, user)
    
    return {"message": "Contraseña restablecida exitosamente."}

# finished || tested || used in admin || used in frontend
@router.post("/login")
@limiter.limit("5/15minute")
async def login(
    request: Request,
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    # autentica
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        logger.warning(f"Intento fallido de login | usuario={form_data.username} | "
                       f"ip={request.client.host if request.client else None} | "
                       f"user-agent={request.headers.get('user-agent')}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")

    # crea access token
    roles = [user.rol.nombre_rol] if getattr(user, "rol", None) else []
    access = create_access_token_for_user(user_id=user.id_usuario, email=user.correo, roles=roles)

    # crea refresh en BD
    user_agent = request.headers.get("user-agent")
    ip = request.client.host if request.client else None
    raw_refresh, _ = await crud_refresh_token.create_refresh_token(db, user.id_usuario, user_agent, ip)
    await db.commit()

    # setea cookie HttpOnly
    set_refresh_cookie(response, raw_refresh)

    logger.info(f"Login exitoso | usuario={user.correo} | ip={ip} | user-agent={user_agent}")
    
    return {
        "access_token": access,
        "token_type": "bearer",
        "expires_in": 900
    }

# finished || tested || used in admin || used in frontend
@router.post("/refresh")
async def refresh_token(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    raw_refresh = request.cookies.get(REFRESH_COOKIE_NAME)
    if not raw_refresh:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Falta refresh token")

    # Usamos helper que ya valida expiración y revocado
    token_db = await crud_refresh_token.get_valid_token(db, raw_refresh)
    if not token_db:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token inválido o expirado")

    # Rotación
    user_agent = request.headers.get("user-agent")
    ip = request.client.host if request.client else None
    raw_new, new_db_token = await crud_refresh_token.rotate_refresh_token(db, token_db, user_agent, ip)

    # Nuevo access token
    user = await crud_user.get_user(db, token_db.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    roles = [user.rol.nombre_rol] if getattr(user, "rol", None) else []
    access = create_access_token_for_user(user_id=user.id_usuario, email=user.correo, roles=roles)

    await db.commit()

    await db.refresh(new_db_token)

    # Actualizar cookie
    set_refresh_cookie(response, raw_new)

    return {
        "access_token": access,
        "token_type": "bearer",
        "refresh_metadata": {
            "id": new_db_token.id,
            "user_id": new_db_token.user_id,
            "issued_at": new_db_token.created_at.isoformat() if new_db_token.created_at else None,
            "expires_at": new_db_token.expires_at.isoformat() if new_db_token.expires_at else None,
            "revoked": new_db_token.revoked,
            "ip": new_db_token.ip_address,
            "user_agent": new_db_token.user_agent,
        }
    }

# finished || tested || used in admin || used in frontend
@router.post("/logout")
async def logout(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    raw_refresh = request.cookies.get(REFRESH_COOKIE_NAME)
    # limpiar cookie siempre
    clear_refresh_cookie(response)

    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent")

    if not raw_refresh:
        logger.info(f"🔒 Logout anónimo desde {ip} | {ua}")
        return {"detail": "Sesión terminada"}

    token_db = await crud_refresh_token.get_token_by_raw(db, raw_refresh)
    try:
        if token_db and not token_db.revoked:
            await crud_refresh_token.revoke_token(db, token_db)
            await db.commit()
            logger.info(f"🔒 Logout de user_id={token_db.user_id} desde {ip} | {ua}")
    except Exception:
        await db.rollback()

    return {"detail": "Sesión terminada"}
