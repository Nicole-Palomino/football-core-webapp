from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class ResultadoKMeansBase(BaseModel):
    id_partido: int
    cluster_predicho: int
    resumen: Optional[str] = None
    predicciones: Optional[Any] = None  # JSON

class ResultadoKMeansCreate(ResultadoKMeansBase):
    pass

class ResultadoKMeansUpdate(BaseModel):
    cluster_predicho: Optional[int] = None
    resumen: Optional[str] = None
    predicciones: Optional[Any] = None

class ResultadoKMeans(ResultadoKMeansBase):
    id_resultado_kmeans: int
    created_at: datetime

    class Config:
        orm_mode = True

class KMeansInput(BaseModel):
    id_partido: int
