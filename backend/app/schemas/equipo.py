from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

# Utilización de importaciones relativas y referencias directas para modelos que puedan tener dependencias circulares.
from app.schemas.estado import Estado 
from app.schemas.liga import Liga    

# Referencia para el esquema de Partido para evitar importaciones circulares.
# Este esquema de Partido es una representación mínima para su uso dentro de las relaciones de Equipo.
class Partido(BaseModel):
    id_partido: int
    id_liga: int
    id_temporada: int
    dia: str 
    id_equipo_local: int
    id_equipo_visita: int
    enlace_threesixfive: Optional[str] = None
    enlace_fotmob: Optional[str] = None
    enlace_datafactory: Optional[str] = None
    id_estado: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class EquipoBase(BaseModel):
    """Esquema base para Equipo."""
    nombre_equipo: str = Field(..., min_length=1, max_length=150)
    estadio: Optional[str] = Field(None, max_length=150)
    logo: Optional[str] = Field(None, max_length=250)
    id_estado: int # Llave foránea
    id_liga: int   # Llave foránea

class EquipoCreate(EquipoBase):
    """Esquema para crear un nuevo Equipo."""
    pass

class EquipoUpdate(EquipoBase):
    """Esquema para actualizar un Equipo existente."""
    nombre_equipo: Optional[str] = Field(None, min_length=1, max_length=150)
    estadio: Optional[str] = Field(None, max_length=150)
    logo: Optional[str] = Field(None, max_length=250)
    id_estado: Optional[int] = None
    id_liga: Optional[int] = None

class Equipo(EquipoBase):
    """Esquema para devolver los datos del Equipo (incluye ID, marcas de tiempo y objetos relacionados)."""
    id_equipo: int
    created_at: datetime
    updated_at: datetime
    estado: Estado 
    liga: Liga    
    partidos_local: List["Partido"] = [] 
    partidos_visita: List["Partido"] = []

    class Config:
        from_attributes = True