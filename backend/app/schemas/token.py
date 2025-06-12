from typing import Optional, List
from pydantic import BaseModel

class Token(BaseModel):
    """Esquema para la respuesta del token de acceso JWT."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Esquema de los datos contenidos en el token JWT."""
    email: Optional[str] = None
    roles: List[str] = [] # Lista de nombres de roles