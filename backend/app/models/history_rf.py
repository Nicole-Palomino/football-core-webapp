from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime, JSON
from datetime import datetime
from app.database import Base
from sqlalchemy.orm import relationship

class ResultadoRF(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_resultados_rf”.
    Representa un Historial de las predicciones con Random Forest.
    """
    __tablename__ = "tb_resultados_rf"

    # Clave principal del historial
    id_resultado_rf = Column(Integer, primary_key=True, autoincrement=True)
    # Clave foránea para tb_partidos (id_partido)
    id_partido = Column(Integer, ForeignKey("tb_partidos.id_partido", ondelete="CASCADE"), nullable=False)
    # Indica el número de cluster
    cluster_predicho = Column(Integer, nullable=False)
    # Texto plano del resumen de lo que será el partido
    resumen = Column(Text, nullable=True)
    # Predicciones del partido
    predicciones = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    partido = relationship("Partido", back_populates="resultados_rf")
