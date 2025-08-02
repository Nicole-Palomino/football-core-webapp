
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
    prefix="/analysis",
    tags=["Análisis"],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}}
)

@router.get("/ligas")
async def get_ligas():
    """Obtiene todas las ligas disponibles"""
    return {"ligas": get_data.LIGAS_DATA}

@router.get("/equipos/{liga}")
async def get_equipos_liga(liga: str):
    """Obtiene todos los equipos de una liga"""
    try:
        datos_liga = await asyncio.get_event_loop().run_in_executor(
            executor, get_data.obtener_datos_liga, liga
        )
        return datos_liga
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Liga no encontrada: {str(e)}")
    
@router.get("/partidos/{liga}")
async def get_partidos_liga(liga: str, limite: Optional[int] = Query(None, description="Límite de partidos")):
    """Obtiene los partidos de una liga"""
    try:
        df = await asyncio.get_event_loop().run_in_executor(
            executor, get_data.leer_y_filtrar_csv, liga
        )
        if df is None or df.empty:
            raise HTTPException(status_code=404, detail="No se encontraron partidos para esta liga")
        
        if limite:
            df = df.head(limite)
        
        return {
            "total_partidos": len(df),
            "partidos": df.to_dict('records')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener partidos: {str(e)}")
    
@router.get("/enfrentamientos/{liga}")
async def get_enfrentamientos(
    liga: str, 
    equipo1: str = Query(..., description="Nombre del primer equipo"),
    equipo2: str = Query(..., description="Nombre del segundo equipo")
):
    """Obtiene el historial de enfrentamientos entre dos equipos"""
    try:
        df = await asyncio.get_event_loop().run_in_executor(
            executor, get_data.leer_y_filtrar_csv, liga
        )
        
        partidos = await asyncio.get_event_loop().run_in_executor(
            executor, get_data.filtrar_partidos_entre_equipos, df, equipo1, equipo2
        )
        
        if partidos.empty:
            raise HTTPException(
                status_code=404, 
                detail=f"No se encontraron enfrentamientos entre {equipo1} y {equipo2}"
            )
        
        return {
            "total_enfrentamientos": len(partidos),
            "enfrentamientos": partidos.to_dict('records')
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener enfrentamientos: {str(e)}")

@router.get("/analisis-completo/{liga}")
async def get_analisis_completo(
    liga: str,
    equipo1: str = Query(..., description="Nombre del primer equipo"),
    equipo2: str = Query(..., description="Nombre del segundo equipo")
):
    """Obtiene el análisis completo entre dos equipos (similar a show_analysis.py)"""
    try:
        # Leer datos de la liga
        df = await asyncio.get_event_loop().run_in_executor(
            executor, get_data.leer_y_filtrar_csv, liga
        )
        
        # Filtrar partidos entre equipos
        partidos = await asyncio.get_event_loop().run_in_executor(
            executor, get_data.filtrar_partidos_sin_importar_local_visita, df, equipo1, equipo2
        )
        
        if partidos.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No hay partidos registrados entre {equipo1} y {equipo2}"
            )
        
        # Obtener últimos partidos de cada equipo
        partidos_eq1 = await asyncio.get_event_loop().run_in_executor(
            executor, get_data.filtrar_ultimos_partidos_de_equipo, df, equipo1
        )
        
        partidos_eq2 = await asyncio.get_event_loop().run_in_executor(
            executor, get_data.filtrar_ultimos_partidos_de_equipo, df, equipo2
        )
        
        # Construir estadísticas
        df_stats = await asyncio.get_event_loop().run_in_executor(
            executor, functions_analysis.construir_estadisticas_equipos, partidos
        )
        
        # Contar resultados
        victorias_local = int((partidos["FTHG"] > partidos["FTAG"]).sum())
        victorias_visitante = int((partidos["FTAG"] > partidos["FTHG"]).sum())
        empates = int((partidos["FTHG"] == partidos["FTAG"]).sum())
        
        # Contar victorias por equipos
        victorias_equipo1 = int((
            ((partidos["HomeTeam"] == equipo1) & (partidos["FTHG"] > partidos["FTAG"])) |
            ((partidos["AwayTeam"] == equipo1) & (partidos["FTAG"] > partidos["FTHG"]))
        ).sum())
        
        victorias_equipo2 = int((
            ((partidos["HomeTeam"] == equipo2) & (partidos["FTHG"] > partidos["FTAG"])) |
            ((partidos["AwayTeam"] == equipo2) & (partidos["FTAG"] > partidos["FTHG"]))
        ).sum())
        
        return {
            "resumen": {
                "total_enfrentamientos": len(partidos),
                "victorias_por_equipo": {
                    equipo1: victorias_equipo1,
                    equipo2: victorias_equipo2,
                    "empates": empates
                },
                "victorias_por_localia": {
                    "local": victorias_local,
                    "visitante": victorias_visitante,
                    "empates": empates
                }
            },
            "ultimos_partidos": {
                equipo1: partidos_eq1.head(5).to_dict('records'),
                equipo2: partidos_eq2.head(5).to_dict('records')
            },
            "estadisticas_avanzadas": df_stats.to_dict('records'),
            "enfrentamientos_directos": partidos.to_dict('records')
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis completo: {str(e)}")
