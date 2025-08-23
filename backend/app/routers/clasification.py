from fastapi import APIRouter, Depends, HTTPException, Query
import asyncio
import functools
from concurrent.futures import ThreadPoolExecutor
import numpy as np

from app.analysis.functions import (
    get_data,
    functions_clasificacion
)

from app.core.security import get_current_active_user
from app.schemas.user import User

# Executor para funciones síncronas
executor = ThreadPoolExecutor(max_workers=4)

def run_in_executor(func):
    """Decorator para ejecutar funciones síncronas de forma asíncrona"""
    @functools.wraps(func)
    async def wrapper(*args, **kwargs):
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(executor, func, *args, **kwargs)
    return wrapper

router = APIRouter(
    prefix="/clasificacion",
    tags=["Clasificación"],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}}
)

@router.get("/{liga}")
async def get_clasificacion(liga: str):
    """Obtiene la tabla de clasificación de una liga"""
    try:
        df_ultima = await asyncio.get_event_loop().run_in_executor(
            executor, get_data.obtener_ultima_temporada, liga
        )
        
        if df_ultima is None:
            raise HTTPException(
                status_code=404,
                detail=f"No se encontraron datos de la última temporada para {liga}"
            )
        
        clasificacion = await asyncio.get_event_loop().run_in_executor(
            executor, functions_clasificacion.generar_clasificacion, df_ultima
        )
        
        # Agregar posición y símbolos
        clasificacion_con_pos = []
        for i, row in clasificacion.iterrows():
            equipo_data = row.to_dict()
            if i == 0:
                equipo_data["simbolo"] = "🏆"
                equipo_data["categoria"] = "campeon"
            elif i >= len(clasificacion) - 3:
                equipo_data["simbolo"] = "⬇️"
                equipo_data["categoria"] = "descenso"
            else:
                equipo_data["simbolo"] = ""
                equipo_data["categoria"] = "normal"
            equipo_data["posicion"] = i + 1
            clasificacion_con_pos.append(equipo_data)
        
        return {
            "liga": liga,
            "total_equipos": len(clasificacion_con_pos),
            "clasificacion": clasificacion_con_pos
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener clasificación: {str(e)}")