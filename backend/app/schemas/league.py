from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class LigaBase(BaseModel):
    """Esquema base de la Liga."""
    nombre_liga: str = Field(..., min_length=1, max_length=140)
    pais: str = Field(..., min_length=1, max_length=100)
    imagen_liga: Optional[str] = Field(None, max_length=250)
    imagen_pais: Optional[str] = Field(None, max_length=250)

class LigaCreate(LigaBase):
    """Esquema para crear una nueva Liga."""
    pass

class LigaUpdate(LigaBase):
    """Esquema para actualizar una Liga existente."""
    nombre_liga: Optional[str] = Field(None, min_length=1, max_length=140)
    pais: Optional[str] = Field(None, min_length=1, max_length=100)
    imagen_liga: Optional[str] = Field(None, max_length=250)
    imagen_pais: Optional[str] = Field(None, max_length=250)

class Liga(LigaBase):
    """Esquema para devolver datos de la Liga (incluye ID y marcas de tiempo)."""
    id_liga: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)