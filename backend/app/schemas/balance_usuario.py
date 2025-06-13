from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

from app.schemas.user import User

class BalanceUsuarioBase(BaseModel):
    """Esquema base para BalanceUsuario."""
    id_usuario: int
    cantidad_monedas: int = Field(..., ge=0) # Las monedas no pueden ser negativas

class BalanceUsuarioCreate(BalanceUsuarioBase):
    """Esquema para crear un nuevo BalanceUsuario. Normalmente se hace al registrarse el usuario."""
    pass

class BalanceUsuarioUpdate(BalanceUsuarioBase):
    """Esquema para actualizar un BalanceUsuario existente."""
    cantidad_monedas: Optional[int] = Field(None, ge=0)
    ultima_actualizacion: Optional[datetime] = None # El sistema lo establecerá en la actualización

class BalanceAddDeduct(BaseModel):
    """Esquema para añadir o deducir monedas de un saldo."""
    cantidad: int = Field(..., gt=0, description="Cantidad de monedas a sumar o restar")
    # Para la deducción, asegúrese de que `cantidad` es positivo y manejar la lógica de saldo negativo en CRUD

class BalanceUsuario(BalanceUsuarioBase):
    """Esquema para devolver datos de BalanceUsuario (incluye ID, marcas de tiempo y usuario relacionado)."""
    id_balance: int
    ultima_actualizacion: datetime
    created_at: datetime
    usuario: User

    class Config:
        from_attributes = True