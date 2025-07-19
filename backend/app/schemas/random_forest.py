from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any

class ResultadoRFBase(BaseModel):
    id_partido: int
    cluster_predicho: int
    resumen: Optional[str] = None
    predicciones: Optional[Any] = None

class ResultadoRFCreate(ResultadoRFBase):
    pass

class ResultadoRFUpdate(BaseModel):
    cluster_predicho: Optional[int] = None
    resumen: Optional[str] = None
    predicciones: Optional[Any] = None

class ResultadoRF(ResultadoRFBase):
    id_resultado_rf: int
    created_at: datetime

    class Config:
        orm_mode = True