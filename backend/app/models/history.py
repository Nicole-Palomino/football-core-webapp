from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.database import Base

class HistorialPrediccion(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_historial_predicciones”.
    Representa un Historial de las predicciones con K-Means y Poisson.
    """
    __tablename__ = "tb_historial_predicciones"

    # Clave principal del historial
    id_historial = Column(Integer, primary_key=True, index=True)
    # Clave foránea para tb_partidos (id_partido)
    id_partido = Column(Integer, ForeignKey("tb_partidos.id_partido", ondelete="CASCADE"))
    # Indica el número de cluster
    cluster_predicho = Column(Integer)
    # Texto plano del resumen de lo que será el partido
    resumen = Column(Text)
    # Predicciones del partido
    predicciones = Column(JSON)

    # Fecha de creación del registro, por defecto la hora actual
    created_at = Column(DateTime(timezone=True), server_default=func.now())