from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class EstadoOut(BaseModel):
    id_estado: int
    nombre_estado: str

class LigaOut(BaseModel):
    id_liga: int
    nombre_liga: str

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
    estado: EstadoOut 
    liga: LigaOut    

    model_config = ConfigDict(from_attributes=True)