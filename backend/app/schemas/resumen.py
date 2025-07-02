from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Partido(BaseModel):
    id_partido: int

class ResumenBase(BaseModel):
    """Esquema base para Resumen."""
    nombre: str
    url_imagen: str
    costo_monedas: int
    id_partido: int

class ResumenCreate(ResumenBase):
    """Esquema para crear un nuevo Resumen."""
    pass

class ResumenUpdate(ResumenBase):
    """Esquema para actualizar un Resumen existente."""
    nombre: Optional[str] = Field(None, max_length=100)
    url_imagen: Optional[str] = Field(None, max_length=250)
    costo_monedas: Optional[int] = None
    id_partido: Optional[int] = None

class ResumenOut(ResumenBase):
    id_resumen: int
    created_at: datetime
    updated_at: datetime
    partido: Partido

    class Config:
        from_attributes = True
