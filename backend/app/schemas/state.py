from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class EstadoBase(BaseModel):
    """Esquema base para Estado (state)."""
    nombre_estado: str = Field(..., min_length=1, max_length=50)

class EstadoCreate(EstadoBase):
    """Esquema para crear un nuevo Estado."""
    pass

class EstadoUpdate(EstadoBase):
    """Esquema para actualizar un Estado existente."""
    nombre_estado: str | None = Field(None, min_length=1, max_length=50)

class Estado(EstadoBase):
    """Esquema para devolver los datos del Estado (incluye ID y marcas de tiempo)."""
    id_estado: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)