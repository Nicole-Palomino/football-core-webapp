from datetime import date, datetime, time
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

# used
class Liga(BaseModel):
    id_liga: int
    nombre_liga: str
    imagen_pais: Optional[str] = None

# used
class Temporada(BaseModel):
    id_temporada: int
    nombre_temporada: str

# used
class Estado(BaseModel):
    id_estado: int
    nombre_estado: str

# used
class Equipo(BaseModel):
    id_equipo: int
    nombre_equipo: Optional[str] = None
    estadio: Optional[str] = None
    logo: Optional[str] = None

# Referencia para el esquema Estadistica
# used
class Estadistica(BaseModel):
    id_estadistica: int
    id_partido: Optional[int] = None
    FTHG: Optional[int] = None
    FTAG: Optional[int] = None
    FTR: Optional[str] = None
    HTHG: Optional[int] = None
    HTAG: Optional[int] = None
    HTR: Optional[str] = None
    HS: Optional[int] = None
    AS_: Optional[int] = None
    HST: Optional[int] = None
    AST: Optional[int] = None
    HF: Optional[int] = None
    AF: Optional[int] = None
    HC: Optional[int] = None
    AC: Optional[int] = None
    HY: Optional[int] = None
    AY: Optional[int] = None
    HR: Optional[int] = None
    AR: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

# used
class PartidoBase(BaseModel):
    """Esquema base para Partido (partido)."""
    id_liga: int
    id_temporada: int
    dia: date 
    hora: time
    id_equipo_local: int
    id_equipo_visita: int
    enlace_threesixfive: Optional[str] = Field(None, max_length=250)
    enlace_datafactory: Optional[str] = Field(None, max_length=250)
    id_estado: int

# used
class PartidoCreate(PartidoBase):
    """Esquema para crear un nuevo Partido."""
    pass

# used
class PartidoUpdate(PartidoBase):
    """Esquema para actualizar un Partido existente."""
    id_liga: Optional[int] = None
    id_temporada: Optional[int] = None
    dia: Optional[date] = None
    hora: Optional[time] = None
    id_equipo_local: Optional[int] = None
    id_equipo_visita: Optional[int] = None
    enlace_threesixfive: Optional[str] = Field(None, max_length=250)
    enlace_datafactory: Optional[str] = Field(None, max_length=250)
    id_estado: Optional[int] = None

# used
class Partido(PartidoBase):
    """Esquema para devolver datos de Partido (incluye ID, marcas de tiempo y objetos relacionados)."""
    id_partido: int
    created_at: datetime
    updated_at: datetime
    liga: Liga
    temporada: Temporada
    equipo_local: Equipo
    equipo_visita: Equipo
    estado: Estado
    estadisticas: Optional[Estadistica] = None # Relación de uno a uno

    model_config = ConfigDict(from_attributes=True)

# used
class PartidoOut(PartidoBase):
    id_partido: int
    created_at: datetime
    updated_at: datetime
    liga: Liga
    temporada: Temporada
    equipo_local: Equipo
    equipo_visita: Equipo
    estado: Estado
    
    model_config = ConfigDict(from_attributes=True)