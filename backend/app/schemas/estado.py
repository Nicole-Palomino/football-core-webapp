from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

# Referencia para el esquema de Equipo
class Equipo(BaseModel):
    id_equipo: int
    nombre_equipo: str
    estadio: Optional[str] = None
    logo: Optional[str] = None
    id_estado: int
    id_liga: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Referencia para el esquema Partido
class Partido(BaseModel):
    id_partido: int
    id_liga: int
    id_temporada: int
    dia: str # Representar como cadena para la fecha
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

# Referencia para el esquema PaqueteMoneda
class PaqueteMoneda(BaseModel):
    id_paquete: int
    nombre: str
    descripcion: Optional[str] = None
    cantidad_monedas: int
    precio: float
    id_estado: int
    paypal_product_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


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
    equipos: List["Equipo"] = [] # Relación con el Equipo
    partidos: List["Partido"] = [] # Relación con el Partido
    paquetes_moneda: List["PaqueteMoneda"] = [] # Relación con el PaqueteMoneda

    class Config:
        from_attributes = True