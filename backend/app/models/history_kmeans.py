from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, JSON
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship

class ResultadoKMeans(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_resultados_kmeans”.
    Representa un Historial de las predicciones con K-Means.
    """
    __tablename__ = "tb_resultados_kmeans"

    # Clave principal del historial
    id_resultado_kmeans = Column(Integer, primary_key=True, autoincrement=True)
    # Clave foránea para tb_partidos (id_partido)
    id_partido = Column(Integer, ForeignKey("tb_partidos.id_partido", ondelete="CASCADE"), nullable=False)
    # Indica el número de cluster
    cluster_predicho = Column(Integer, nullable=False)
    # Texto plano del resumen de lo que será el partido
    resumen = Column(Text, nullable=True)
    # Predicciones del partido
    predicciones = Column(JSON, nullable=True)

    # Fecha de creación del registro, por defecto la hora actual
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    partido = relationship("Partido", back_populates="resultados_kmeans")