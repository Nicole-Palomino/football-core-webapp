from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

# Referencia del esquema del Partido para evitar importaciones circulares
class Partido(BaseModel):
    id_partido: int
    id_liga: int
    id_temporada: int
    dia: date 
    id_equipo_local: int
    id_equipo_visita: int
    enlace_threesixfive: Optional[str] = None
    enlace_datafactory: Optional[str] = None
    id_estado: int

    model_config = ConfigDict(from_attributes=True)

class EstadisticaBase(BaseModel):
    """Esquema base de Estadística."""
    id_partido: int
    FTHG: Optional[int] = Field(None, ge=0)
    FTAG: Optional[int] = Field(None, ge=0)
    FTR: Optional[str] = Field(None, pattern="^(H|D|A)$") # Home, Draw, Away
    HTHG: Optional[int] = Field(None, ge=0)
    HTAG: Optional[int] = Field(None, ge=0)
    HTR: Optional[str] = Field(None, pattern="^(H|D|A)$")
    HS: Optional[int] = Field(None, ge=0)
    AS_: Optional[int] = Field(None, alias="AS", ge=0) # Uso de alias para el nombre de campo Pydantic frente al nombre de columna SQL
    HST: Optional[int] = Field(None, ge=0)
    AST: Optional[int] = Field(None, ge=0)
    HF: Optional[int] = Field(None, ge=0)
    AF: Optional[int] = Field(None, ge=0)
    HC: Optional[int] = Field(None, ge=0)
    AC: Optional[int] = Field(None, ge=0)
    HY: Optional[int] = Field(None, ge=0)
    AY: Optional[int] = Field(None, ge=0)
    HR: Optional[int] = Field(None, ge=0)
    AR: Optional[int] = Field(None, ge=0)

class EstadisticaCreate(EstadisticaBase):
    """Esquema para crear una nueva Estadistica."""
    pass

class EstadisticaUpdate(EstadisticaBase):
    """Esquema para actualizar una Estadística existente."""
    id_partido: Optional[int] = None
    pass

class Estadistica(EstadisticaBase):
    """Esquema para devolver datos de Estadística (incluye ID, marcas de tiempo y Partido relacionado)."""
    id_estadistica: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    partido: Optional[Partido] = None 

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )