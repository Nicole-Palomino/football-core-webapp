from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional

class EquipoMini(BaseModel):
    id_equipo: int
    nombre_equipo: str
    logo: str

class LigaMini(BaseModel):
    id_liga: int
    nombre_liga: str
    pais: str

    model_config = ConfigDict(from_attributes=True)

class EstadoMini(BaseModel):
    id_estado: int
    nombre_estado: str

    model_config = ConfigDict(from_attributes=True)

class PartidoFavorito(BaseModel):
    id_partido: int
    dia: date
    equipo_local: EquipoMini
    equipo_visita: EquipoMini
    estado: Optional[EstadoMini]
    liga: Optional[LigaMini]

    model_config = ConfigDict(from_attributes=True)

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
    partido: Optional[PartidoFavorito]

    model_config = ConfigDict(from_attributes=True)
