from pydantic import BaseModel
from datetime import datetime

class Partido(BaseModel):
    id_partido: int

class Usuario(BaseModel):
    id_usuario: int

class FavoritoBase(BaseModel):
    """Esquema base para Favorito (tb_favorito)."""
    id_partido: int
    id_usuario: int

class FavoritoCreate(FavoritoBase):
    pass

class FavoritoOut(FavoritoBase):
    id_favorito: int
    id_usuario: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
