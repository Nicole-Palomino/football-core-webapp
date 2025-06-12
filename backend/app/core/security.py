import os
from datetime import datetime, timedelta, timezone
from typing import List, Optional, AsyncGenerator 

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession # Utilizar AsyncSession para operaciones db asíncronas
from sqlalchemy import select # Importar select para consultas asíncronas

from app import schemas
from app.crud import crud_user
from app.database import AsyncSessionLocal # Utilizar AsyncSessionLocal como dependencia para get_db_for_auth
from app.core.config import settings

# Contexto hash de la contraseña
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2PasswordBearer para gestionar la extracción de tokens de la cabecera Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_db_for_auth() -> AsyncGenerator[AsyncSession, None, None]:
    """
    Proporciona una sesión de base de datos asíncrona específica para funciones de autenticación.
    Garantiza el manejo adecuado de la sesión incluso cuando se llama fuera del flujo típico del punto final FastAPI.
    """
    async with AsyncSessionLocal() as session:
        yield session

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si una contraseña simple coincide con su versión hash.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Comprime una contraseña simple utilizando bcrypt.
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un token de acceso JWT.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

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


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db_for_auth)):
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
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
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

async def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    """
    Dependencia que garantiza que el usuario actual está activo.
    """
    if current_user.is_active == 0: # Comprueba si el usuario está activo (0 para inactivo, 1 para activo)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Usuario inactivo")
    return current_user

async def get_current_admin_user(current_user: schemas.User = Depends(get_current_active_user)):
    """
    Dependencia que asegura que el usuario activo actual tiene rol “admin”.
    """
    admin_role_found = False
    # Comprobar si el atributo roles existe y es iterable
    if hasattr(current_user, 'rol') and current_user.rol: # Acceso directo a la función única
        if current_user.rol.nombre_rol == "admin":
            admin_role_found = True
    
    if not admin_role_found:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos suficientes para realizar esta acción. Se requiere rol de administrador.",
        )
    return current_user