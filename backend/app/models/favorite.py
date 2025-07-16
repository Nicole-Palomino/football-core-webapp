from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Favorito(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_favorito”.
    Representa un Favorito marcado por un usuario.
    """
    __tablename__ = "tb_favorito"

    # Clave principal del favorito
    id_favorito = Column(Integer, primary_key=True, index=True)
    # Clave foránea para tb_users (id_usuario)
    id_usuario = Column(Integer, ForeignKey("tb_users.id_usuario", ondelete="CASCADE"), nullable=False)
    # Clave foránea para tb_partidos (id_partido)
    id_partido = Column(Integer, ForeignKey("tb_partidos.id_partido", ondelete="CASCADE"), nullable=False)
    # Indica si la cuenta de usuario está activa (usando 1 para activa, 0 para inactiva)
    is_active = Column(Boolean, default=True, nullable=False)
    # Fecha de creación del registro, por defecto la hora actual
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relaciones
    usuario = relationship("User", back_populates="favoritos", lazy="noload")
    partido = relationship("Partido", back_populates="favoritos", lazy="noload")