from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

# -----------------------------
# Base Schema
# -----------------------------
class RefreshTokenBase(BaseModel):
    user_id: int
    user_agent: str | None = None
    ip_address: str | None = None

# -----------------------------
# Schema para crear
# -----------------------------
class RefreshTokenCreate(RefreshTokenBase):
    token: str 

# -----------------------------
# Schema para lectura
# -----------------------------
class RefreshTokenRead(RefreshTokenBase):
    id: int
    revoked: bool
    replaced_by_token_hash: str | None = None
    created_at: datetime
    expires_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    """Esquema para la respuesta del token de acceso JWT."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Esquema de los datos contenidos en el token JWT."""
    email: Optional[str] = None
    roles: List[str] = [] # Lista de nombres de roles