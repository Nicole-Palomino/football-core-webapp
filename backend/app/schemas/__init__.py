from .favorite import FavoritoBase, FavoritoCreate, FavoritoOut
from .league import LigaBase, LigaCreate, LigaUpdate, Liga
from .match import PartidoBase, PartidoCreate, PartidoUpdate, Partido
from .role import RolBase, RolCreate, RolUpdate, Rol
from .season import TemporadaBase, TemporadaCreate, TemporadaUpdate, Temporada
from .stat import EstadisticaBase, EstadisticaCreate, EstadisticaUpdate, Estadistica
from .state import EstadoBase, EstadoCreate, EstadoUpdate, Estado
from .team import EquipoBase, EquipoCreate, EquipoUpdate, Equipo
from .token import Token, TokenData, RefreshTokenBase, RefreshTokenCreate, RefreshTokenRead
from .user import UserBase, UserCreate, UserUpdate, User, PasswordRecoveryRequest, PasswordVerification, PasswordReset