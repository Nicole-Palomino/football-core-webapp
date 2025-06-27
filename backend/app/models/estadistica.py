from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Estadistica(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_estadistica”.
    Representa las estadísticas de un partido deportivo.
    """
    __tablename__ = "tb_estadistica"

    id_estadistica = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_partido = Column(Integer, ForeignKey("tb_partidos.id_partido"), nullable=True, unique=True) # Único para uno a uno
    FTHG = Column(Integer, nullable=True) # Full Time Home Goals
    FTAG = Column(Integer, nullable=True) # Full Time Away Goals
    FTR = Column(String(2), nullable=True) # Full Time Result (H, D, A)
    HTHG = Column(Integer, nullable=True) # Half Time Home Goals
    HTAG = Column(Integer, nullable=True) # Half Time Away Goals
    HTR = Column(String(2), nullable=True) # Half Time Result (H, D, A)
    HS = Column(Integer, nullable=True) # Home Shots
    AS_ = Column(Integer, nullable=True) # Away Shots (AS_ para evitar conflictos con la palabra clave `as` de python)
    HST = Column(Integer, nullable=True) # Home Shots on Target
    AST = Column(Integer, nullable=True) # Away Shots on Target
    HF = Column(Integer, nullable=True) # Home Fouls Committed
    AF = Column(Integer, nullable=True) # Away Fouls Committed
    HC = Column(Integer, nullable=True) # Home Corners
    AC = Column(Integer, nullable=True) # Away Corners
    HY = Column(Integer, nullable=True) # Home Yellow Cards
    AY = Column(Integer, nullable=True) # Away Yellow Cards
    HR = Column(Integer, nullable=True) # Home Red Cards
    AR = Column(Integer, nullable=True) # Away Red Cards
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación con Partido
    partido = relationship("Partido", back_populates="estadisticas", lazy="selectin")