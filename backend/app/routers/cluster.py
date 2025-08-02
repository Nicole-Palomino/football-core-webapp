from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
import asyncio
import functools
from concurrent.futures import ThreadPoolExecutor

from app.analysis.functions import (
    get_data,
    functions_analysis,
    functions_prediction,
    functions_cluster,
    functions_poisson,
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
    prefix="/clusters",
    tags=["Clusters"],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}}
)

@router.get("/analizar/{liga}")
async def analizar_clusters(
    liga: str,
    equipo1: str = Query(..., description="Nombre del primer equipo"),
    equipo2: str = Query(..., description="Nombre del segundo equipo")
):
    """Analiza los clusters de partidos entre dos equipos"""
    try:
        resultado = await asyncio.get_event_loop().run_in_executor(
            executor,
            functions_cluster.analizar_clusters_partidos_entre_equipos,
            equipo1, equipo2, liga
        )
        
        if resultado is None:
            raise HTTPException(
                status_code=404,
                detail=f"No hay partidos registrados entre {equipo1} y {equipo2}"
            )
        
        return {
            "clusters_encontrados": len(resultado["resumen_por_cluster"]),
            "resumen_por_cluster": resultado["resumen_por_cluster"],
            "descripcion_clusters": resultado["descripcion_clusters"],
            "total_partidos_analizados": len(resultado["partidos_clusterizados"])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis de clusters: {str(e)}")
    
@router.get("/predecir/{liga}")
async def predecir_cluster(
    liga: str,
    equipo1: str = Query(..., description="Nombre del primer equipo"),
    equipo2: str = Query(..., description="Nombre del segundo equipo")
):
    """Predice el cluster y estadísticas de un partido futuro"""
    try:
        resultado = await asyncio.get_event_loop().run_in_executor(
            executor,
            functions_cluster.predecir_cluster_automatico,
            equipo1, equipo2, liga
        )
        
        if resultado is None:
            raise HTTPException(
                status_code=404,
                detail=f"No se pudo realizar la predicción para {equipo1} vs {equipo2}"
            )
        
        return {
            "cluster_predicho": resultado["cluster_predicho"],
            "resumen": resultado["resumen"],
            "predicciones": resultado["predicciones"],
            "datos_utilizados": resultado["partido_usado"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en predicción de cluster: {str(e)}")
