from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.database import Base

class ResumenEstadistico(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_resumenes”.
    Representa un resumen estadístico deportivo.
    """
    __tablename__ = "tb_resumenes"

    # Clave principal del resumen
    id_resumen = Column(Integer, primary_key=True, index=True)
    # Nombre único para el resumen, no puede ser nulo
    nombre = Column(String(100), nullable=False, unique=True)
    # URL o ruta al resumen del partido
    url_imagen = Column(String(250), nullable=False)
    url_mvp = Column(String(250), nullable=False)
    url_shotmap = Column(String(250), nullable=False)
    # Costo en monedas del resumen
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Clave foránea para tb_partidos (id_partido)
    id_partido = Column(Integer, ForeignKey("tb_partidos.id_partido"), nullable=False)

    # Relaciones
    partido = relationship("Partido", back_populates="resumenes", lazy="selectin")