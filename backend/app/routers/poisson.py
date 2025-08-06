from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
import asyncio
import functools
from collections import Counter
from starlette.concurrency import run_in_threadpool
from concurrent.futures import ThreadPoolExecutor
from starlette.concurrency import run_in_threadpool
import math
import numpy as np

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


def to_native(value):
    if isinstance(value, (np.generic,)):
        value = value.item()
    if isinstance(value, float):
        if not math.isfinite(value):
            return None
    return value

def normalize(obj):
    if isinstance(obj, dict):
        return {str(k): normalize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [normalize(i) for i in obj]
    return to_native(obj)

router = APIRouter(
    prefix="/poisson",
    tags=["Análisis Poisson"],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}}
)

@router.get("/probabilidades/{liga}")
async def calcular_probabilidades_poisson(
    liga: str,
    equipo1: str = Query(..., description="Equipo local"),
    equipo2: str = Query(..., description="Equipo visitante"),
    max_goles: int = Query(5, description="Máximo número de goles a considerar")
):
    """Calcula probabilidades usando distribución de Poisson"""
    try:
        # Obtener datos de liga
        df_liga = await run_in_threadpool(get_data.leer_y_filtrar_csv, liga)
        if df_liga is None or df_liga.empty:
            raise HTTPException(status_code=404, detail=f"No hay datos para la liga {liga}")

        partidos = await run_in_threadpool(
            get_data.filtrar_partidos_sin_importar_local_visita, df_liga, equipo1, equipo2
        )
        if partidos is None or getattr(partidos, "empty", False):
            raise HTTPException(
                status_code=404,
                detail=f"No hay partidos entre {equipo1} y {equipo2}"
            )

        # Estandarizar columnas
        dataframe_partidos = await run_in_threadpool(
            functions_poisson.estandarizar_columnas_futbol, partidos
        )

        # Últimos partidos de cada equipo
        partidos_eq1 = await run_in_threadpool(
            get_data.filtrar_ultimos_partidos_de_equipo, df_liga, equipo1
        )
        partidos_eq2 = await run_in_threadpool(
            get_data.filtrar_ultimos_partidos_de_equipo, df_liga, equipo2
        )

        promedio_eq1 = await run_in_threadpool(
            functions_cluster.calcular_promedios, partidos_eq1, equipo1
        )
        promedio_eq2 = await run_in_threadpool(
            functions_cluster.calcular_promedios, partidos_eq2, equipo2
        )

        datos_partido = {
            "goles_local": to_native(promedio_eq1.get("goles")),
            "goles_visitante": to_native(promedio_eq2.get("goles")),
            "tiros_local": to_native(promedio_eq1.get("tiros")),
            "tiros_visitante": to_native(promedio_eq2.get("tiros")),
            "tiros_arco_local": to_native(promedio_eq1.get("tiros_arco")),
            "tiros_arco_visitante": to_native(promedio_eq2.get("tiros_arco")),
            "corners_local": to_native(promedio_eq1.get("corners")),
            "corners_visitante": to_native(promedio_eq2.get("corners")),
            "faltas_local": to_native(promedio_eq1.get("faltas")),
            "faltas_visitante": to_native(promedio_eq2.get("faltas")),
            "amarillas_local": to_native(promedio_eq1.get("amarillas")),
            "amarillas_visitante": to_native(promedio_eq2.get("amarillas")),
            "rojas_local": to_native(promedio_eq1.get("rojas")),
            "rojas_visitante": to_native(promedio_eq2.get("rojas")),
        }

        # Entrenar modelos Poisson
        modelo_local = await run_in_threadpool(
            functions_poisson.entrenar_modelo_poisson,
            dataframe_partidos, "goles_local", "local"
        )
        modelo_visitante = await run_in_threadpool(
            functions_poisson.entrenar_modelo_poisson,
            dataframe_partidos, "goles_visitante", "visitante"
        )

        # Predicciones esperadas
        goles_pred_local = await run_in_threadpool(
            functions_poisson.predecir_goles, modelo_local, datos_partido, "local"
        )
        goles_pred_visitante = await run_in_threadpool(
            functions_poisson.predecir_goles, modelo_visitante, datos_partido, "visitante"
        )

        goles_pred_local = to_native(goles_pred_local)
        goles_pred_visitante = to_native(goles_pred_visitante)

        # Simulación Monte Carlo
        resultados, scores = await run_in_threadpool(
            functions_poisson.simular_resultados_monte_carlo,
            goles_pred_local, goles_pred_visitante
        )
        if not isinstance(resultados, dict):
            resultados = {}
        if not isinstance(scores, Counter):
            scores = Counter(scores)

        # Matriz de scores exactos
        matriz = await run_in_threadpool(
            functions_poisson.matriz_score_exacto,
            goles_pred_local, goles_pred_visitante, max_goles
        )

        # Seguridad: evitar división por cero
        total_simulaciones = sum(to_native(v) or 0 for v in resultados.values())
        if total_simulaciones == 0:
            raise HTTPException(status_code=500, detail="No se pudieron obtener simulaciones válidas")

        # Construir respuesta con normalización
        response = {
            "goles_esperados": {
                "local": round(goles_pred_local or 0, 2),
                "visitante": round(goles_pred_visitante or 0, 2)
            },
            "probabilidades_1x2": {
                "local": round((to_native(resultados.get("1", 0)) / total_simulaciones) * 100, 2),
                "empate": round((to_native(resultados.get("X", 0)) / total_simulaciones) * 100, 2),
                "visita": round((to_native(resultados.get("2", 0)) / total_simulaciones) * 100, 2)
            },
            "matriz_scores_exactos": matriz.to_dict() if hasattr(matriz, "to_dict") else {},
            "scores_mas_probables": dict(scores.most_common(10)),
            "total_simulaciones": total_simulaciones,
            "datos_entrada": datos_partido
        }

        return normalize(response)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en análisis Poisson: {str(e)}")