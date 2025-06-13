from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

from app.schemas.rol import Rol 
from app.schemas.estado import Estado 

# Esta relación debe definirse si tb_estados está vinculado.
class BalanceUsuario(BaseModel):
    id_balance: int
    id_usuario: int
    cantidad_monedas: int
    ultima_actualizacion: datetime
    created_at: datetime
    class Config:
        from_attributes = True

class TransaccionMoneda(BaseModel):
    id_transaccion: int
    id_usuario: int
    id_paquete: Optional[int] = None
    cantidad_monedas: int
    tipo_transaccion: str
    fecha_transaccion: datetime
    paypal_transaction_id: Optional[str] = None
    estado_transaccion: str
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    """Esquema base para Usuario (tb_usuario)."""
    usuario: str = Field(..., min_length=3, max_length=50)
    correo: EmailStr

class UserCreate(UserBase):
    """Esquema para dar de alta un nuevo Usuario."""
    contrasena: str = Field(..., min_length=8)

class UserUpdate(BaseModel): # UserUpdate puede tener campos opcionales
    """Esquema para actualizar un Usuario existente."""
    usuario: Optional[str] = Field(None, min_length=3, max_length=50)
    correo: Optional[EmailStr] = None
    contrasena: Optional[str] = Field(None, min_length=8)
    is_active: Optional[bool] = None
    id_estado: Optional[int] = None
    id_rol: Optional[int] = None


class User(UserBase):
    """Esquema para devolver datos de Usuario (incluye ID, estado activo, roles, saldo, transacciones)."""
    id_usuario: int 
    is_active: bool
    registro: datetime
    updated_at: datetime
    
    # Campos de recuperación de contraseña (opcional en la respuesta)
    codigo_verificacion: Optional[int] = None
    expiracion: Optional[datetime] = None

    rol: Rol 
    estado: Estado

    balance: Optional[BalanceUsuario] = None 
    transacciones: List[TransaccionMoneda] = [] 

    class Config:
        from_attributes = True

# --- Esquemas para la recuperación de contraseñas ---
class PasswordRecoveryRequest(BaseModel):
    """Esquema para solicitar un código de restablecimiento de contraseña."""
    correo: EmailStr

class PasswordVerification(BaseModel):
    """Esquema para verificar un código de restablecimiento de contraseña."""
    correo: EmailStr
    codigo_verificacion: int = Field(..., ge=100000, le=999999) # Suponiendo un código de 6 cifras

class PasswordReset(BaseModel):
    """Esquema para restablecer la contraseña tras la verificación."""
    correo: EmailStr
    codigo_verificacion: int = Field(..., ge=100000, le=999999)
    nueva_contrasena: str = Field(..., min_length=8)