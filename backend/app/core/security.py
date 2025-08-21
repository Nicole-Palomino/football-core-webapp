from datetime import datetime, timedelta, timezone
from typing import List, Optional, AsyncGenerator 

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession # Utilizar AsyncSession para operaciones db asíncronas

from app import schemas
from app.crud import crud_user
from app.database import AsyncSessionLocal # Utilizar AsyncSessionLocal como dependencia para get_db_for_auth
from app.core.config import settings
from app.core.password_utils import verify_password
from app.dependencies import get_db

# OAuth2PasswordBearer para gestionar la extracción de tokens de la cabecera Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un token de acceso JWT.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({
        "exp": expire,
        "iat": now,
        "nbf": now,
        "iss": "football-core-api",   # Identificador de tu API
        "aud": "football-clients"     # Quien debería usarlo (frontend / apps autorizadas)
    })
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# used
def create_access_token_for_user(user_id: int, email: str, roles: list[str] | None = None) -> str:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": email,
        "user_id": str(user_id),
        "roles": roles or [],
        "iss": settings.JWT_ISSUER,
        "aud": settings.JWT_AUDIENCE,
        "iat": now,
        "nbf": now,
        "exp": exp,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

# used
async def authenticate_user(db: AsyncSession, username_or_email: str, password: str):
    """
    Autentica a un usuario por nombre de usuario o correo electrónico y contraseña de forma asíncrona.
    """
    # Try to get user by email first
    user = await crud_user.get_user_by_correo(db, correo=username_or_email)
    if not user:
        # If not found by email, try by username
        user = await crud_user.get_user_by_username(db, username=username_or_email)
    
    if not user:
        return False
    if not verify_password(password, user.contrasena): # Use 'contrasena' for hashed password
        return False
    return user

# used
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    """
    Dependencia que recupera el usuario actual del token JWT.
    No comprueba el estado activo.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM],
            audience=settings.JWT_AUDIENCE,
            issuer=settings.JWT_ISSUER,
        )
        correo: str = payload.get("sub") # 'sub' contiene normalmente el identificador único, como el correo electrónico
        roles: List[str] = payload.get("roles", [])
        if correo is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=correo, roles=roles) # Aún se utiliza «email» en TokenData
    except JWTError:
        raise credentials_exception
    user = await crud_user.get_user_by_correo(db, correo=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# used
async def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    """
    Dependencia que garantiza que el usuario actual está activo.
    """
    if current_user.is_active == 0: # Comprueba si el usuario está activo (0 para inactivo, 1 para activo)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario inactivo")
    return current_user

# used
async def get_current_admin_user(current_user: schemas.User  = Depends(get_current_active_user)):
    """
    Dependencia que asegura que el usuario activo actual tiene rol “admin”.
    """
    admin_role_found = False
    # Comprobar si el atributo roles existe y es iterable
    if hasattr(current_user, 'rol') and current_user.rol: # Acceso directo a la función única
        if current_user.rol.nombre_rol == "Administrador":
            admin_role_found = True
    
    if not admin_role_found:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos suficientes para realizar esta acción. Se requiere rol de administrador.",
        )
    return current_user