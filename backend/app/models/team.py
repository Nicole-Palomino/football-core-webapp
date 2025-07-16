from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Equipo(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_equipos”.
    Representa un equipo deportivo.
    """
    __tablename__ = "tb_equipos"

    # Clave principal del equipo
    id_equipo = Column(Integer, primary_key=True, index=True)
    # Nombre único para el equipo, no puede ser nulo
    nombre_equipo = Column(String(150), unique=True, nullable=False, index=True)
    # Nombre del estadio del equipo (opcional)
    estadio = Column(String(150), nullable=True)
    # URL o ruta al logotipo del equipo (opcional)
    logo = Column(String(250), nullable=True)

    # Clave foránea para tb_estados (id_estado)
    id_estado = Column(Integer, ForeignKey("tb_estados.id_estado"), nullable=False)
    # Clave foránea para tb_liga (id_liga)
    id_liga = Column(Integer, ForeignKey("tb_liga.id_liga"), nullable=False)

    # Relaciones con otros modelos
    estado = relationship("Estado", back_populates="equipos", lazy="selectin")
    liga = relationship("Liga", back_populates="equipos", lazy="selectin")

    # Relaciones con el Partido para los equipos locales y visitantes
    partidos_local = relationship(
        "Partido", foreign_keys="Partido.id_equipo_local", back_populates="equipo_local", lazy="noload"
    )
    partidos_visita = relationship(
        "Partido", foreign_keys="Partido.id_equipo_visita", back_populates="equipo_visita", lazy="noload"
    )

    # Fecha de creación del registro, por defecto la hora actual
    created_at = Column(DateTime, default=datetime.utcnow)
    # Fecha de la última actualización del registro, se actualiza cuando se produce un cambio
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)