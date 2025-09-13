from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Time
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.summary import ResumenEstadistico

class Partido(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_partidos”.
    Representa un partido deportivo.
    """
    __tablename__ = "tb_partidos"

    id_partido = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_liga = Column(Integer, ForeignKey("tb_liga.id_liga"), nullable=False)
    id_temporada = Column(Integer, ForeignKey("tb_temporada.id_temporada"), nullable=False)
    dia = Column(Date, nullable=False)
    hora = Column(Time, nullable=False)
    id_equipo_local = Column(Integer, ForeignKey("tb_equipos.id_equipo"), nullable=False)
    id_equipo_visita = Column(Integer, ForeignKey("tb_equipos.id_equipo"), nullable=False)
    enlace_threesixfive = Column(String(250), nullable=True)
    enlace_datafactory = Column(String(250), nullable=True)
    id_estado = Column(Integer, ForeignKey("tb_estados.id_estado"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    liga = relationship("Liga", back_populates="partidos", lazy="selectin")
    temporada = relationship("Temporada", back_populates="partidos", lazy="selectin")
    equipo_local = relationship(
        "Equipo", foreign_keys=[id_equipo_local], back_populates="partidos_local", lazy="selectin"
    )
    equipo_visita = relationship(
        "Equipo", foreign_keys=[id_equipo_visita], back_populates="partidos_visita", lazy="selectin"
    )
    estado = relationship("Estado", back_populates="partidos", lazy="selectin")
    estadisticas = relationship("Estadistica", back_populates="partido", uselist=False, cascade="all, delete-orphan", lazy="selectin")
    resumenes = relationship("ResumenEstadistico", back_populates="partido", cascade="all, delete-orphan", lazy="noload")
    favoritos = relationship("Favorito", back_populates="partido", cascade="all, delete-orphan")