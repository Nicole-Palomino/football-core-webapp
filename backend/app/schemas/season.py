from datetime import datetime, date
from pydantic import BaseModel, Field, ConfigDict

class TemporadaBase(BaseModel):
    """Esquema base para Temporada."""
    nombre_temporada: str = Field(..., min_length=1, max_length=20)

class TemporadaCreate(TemporadaBase):
    """Esquema para crear una nueva Temporada."""
    pass

class TemporadaUpdate(TemporadaBase):
    """Esquema para actualizar una Temporada existente."""
    nombre_temporada: str = Field(..., min_length=1, max_length=20)

class Temporada(TemporadaBase):
    """Esquema para devolver datos de Temporada (incluye ID y marcas de tiempo)."""
    id_temporada: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)