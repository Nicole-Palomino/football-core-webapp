from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class RolBase(BaseModel):
    """Esquema base para Rol (rol)."""
    nombre_rol: str = Field(..., min_length=1, max_length=100)

class RolCreate(RolBase):
    """Esquema para crear un nuevo Rol."""
    pass

class RolUpdate(RolBase):
    """Esquema para actualizar un Rol existente."""
    nombre_rol: str | None = Field(None, min_length=1, max_length=100)

class Rol(RolBase):
    """Esquema para devolver datos de Rol (incluye ID y marcas de tiempo)."""
    id_rol: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)