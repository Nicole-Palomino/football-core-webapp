from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Estado(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_estados”.
    Representa el estado de una entidad.
    """
    __tablename__ = "tb_estados"

    # Clave principal del Estado
    id_estado = Column(Integer, primary_key=True, index=True)
    # Nombre único para el estado, no puede ser nulo
    nombre_estado = Column(String(50), unique=True, nullable=False, index=True)
    # Fecha de creación del registro, por defecto la hora actual
    created_at = Column(DateTime, default=datetime.utcnow)
    # Fecha de la última actualización del registro, se actualiza cuando se produce un cambio
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación uno a muchos con Equipo y Partido
    equipos = relationship("Equipo", back_populates="estado", lazy="noload")
    partidos = relationship("Partido", back_populates="estado", lazy="noload")