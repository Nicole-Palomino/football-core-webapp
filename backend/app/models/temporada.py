from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Temporada(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_temporada”.
    Representa una temporada en un contexto deportivo.
    """
    __tablename__ = "tb_temporada"

    # Clave principal de la temporada
    id_temporada = Column(Integer, primary_key=True, index=True)
    # Nombre único para la temporada (por ejemplo, «2023-2024»)
    nombre_temporada = Column(String(20), unique=True, nullable=False, index=True)
    # Fecha de creación del registro, por defecto la hora actual
    created_at = Column(DateTime, default=datetime.utcnow)
    # Fecha de la última actualización del registro, se actualiza cuando se produce un cambio
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación de uno a muchos con Partido
    partidos = relationship("Partido", back_populates="temporada", lazy="selectin")