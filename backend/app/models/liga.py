from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Liga(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_liga”.
    Representa una liga deportiva.
    """
    __tablename__ = "tb_liga"

    # Clave principal de la liga
    id_liga = Column(Integer, primary_key=True, index=True)
    # Nombre único para la liga, no puede ser nulo
    nombre_liga = Column(String(140), unique=True, nullable=False, index=True)
    # País donde se encuentra la liga, no puede ser nulo
    pais = Column(String(100), nullable=False)
    # URL o ruta a la imagen de la liga (opcional)
    imagen_liga = Column(String(250), nullable=True)
    # URL o ruta a la imagen del país (opcional)
    imagen_pais = Column(String(250), nullable=True)
    # Fecha de creación del registro, por defecto la hora actual
    created_at = Column(DateTime, default=datetime.utcnow)
    # Fecha de la última actualización del registro, se actualiza cuando se produce un cambio
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación uno a muchos con Equipo y Partido
    equipos = relationship("Equipo", back_populates="liga", lazy="selectin")
    partidos = relationship("Partido", back_populates="liga", lazy="selectin")