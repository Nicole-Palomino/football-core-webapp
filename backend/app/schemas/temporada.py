from datetime import datetime, date
from pydantic import BaseModel, Field
from typing import List, Optional

# Referencia del esquema del Partido
class Partido(BaseModel):
    id_partido: int
    id_liga: int
    id_temporada: int
    dia: date 
    id_equipo_local: int
    id_equipo_visita: int
    id_estado: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TemporadaBase(BaseModel):
    """Esquema base para Temporada."""
    nombre_temporada: str = Field(..., min_length=1, max_length=20)

class TemporadaCreate(TemporadaBase):
    """Esquema para crear una nueva Temporada."""
    pass

class TemporadaUpdate(TemporadaBase):
    """Esquema para actualizar una Temporada existente."""
    nombre_temporada: str | None = Field(None, min_length=1, max_length=20)

class Temporada(TemporadaBase):
    """Esquema para devolver datos de Temporada (incluye ID y marcas de tiempo)."""
    id_temporada: int
    created_at: datetime
    updated_at: datetime
    partidos: List[Partido] = [] # Relación con Partido

    class Config:
        from_attributes = True