from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional
from concurrent.futures import ThreadPoolExecutor

from app.analysis.functions import (
    get_data, functions_analysis,
)
from app.core.security import get_current_active_user
from app.core.logger import logger

# Executor global
executor = ThreadPoolExecutor(max_workers=4)

# normalizar scalars de numpy
def to_native(x):
    try:
        return x.item()  # funciona para np.generic
    except AttributeError:
        return x  # ya es nativo

router = APIRouter(
    prefix="/analysis",
    tags=["Análisis"],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}}
)

# finished
@router.get("/ligas")
async def get_ligas():
    """Obtiene todas las ligas disponibles"""
    return {"ligas": get_data.LIGAS_DATA}

# finished
@router.get("/equipos/{liga}")
async def get_equipos_liga(liga: str):
    """Obtiene todos los equipos de una liga"""
    try:
        datos_liga = await get_data.obtener_datos_liga(liga)
        return datos_liga
    except KeyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Liga '{liga}' no encontrada")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Liga no encontrada: {str(e)}")

# finished
@router.get("/partidos/{liga}")
async def get_partidos_liga(liga: str, limite: Optional[int] = Query(None, description="Límite de partidos")):
    """Obtiene los partidos de una liga"""
    try:
        df = await get_data.leer_y_filtrar_csv(liga)
        if df is None or df.empty:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron partidos para esta liga")
        
        if limite:
            df = df.head(limite)
        
        return {
            "total_partidos": len(df),
            "partidos": df.to_dict('records')
        }
    
    except HTTPException:
        raise  # re-lanzamos para no convertirlo en 500
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al obtener partidos: {str(e)}")

# finished
@router.get("/enfrentamientos/{liga}")
async def get_enfrentamientos(
    liga: str, 
    equipo1: str = Query(..., description="Nombre del primer equipo"),
    equipo2: str = Query(..., description="Nombre del segundo equipo")
):
    """Obtiene el historial de enfrentamientos entre dos equipos"""
    try:
        df = await get_data.leer_y_filtrar_csv(liga)

        if df is None or df.empty:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No se encontraron partidos para la liga '{liga}'")

        
        partidos = await get_data.filtrar_partidos_entre_equipos(df, equipo1, equipo2)
        
        if partidos is None or partidos.empty:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"No se encontraron enfrentamientos entre {equipo1} y {equipo2}"
            )
        
        return {
            "total_enfrentamientos": len(partidos),
            "enfrentamientos": partidos.to_dict('records')
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al obtener enfrentamientos: {str(e)}")

# finished
@router.get("/analisis-completo/{liga}")
async def get_analisis_completo(
    liga: str,
    equipo1: str,
    equipo2: str
):
    """Obtiene el análisis completo entre dos equipos (similar a show_analysis.py)"""
    try:
        logger.info(f"🔍 Analizando liga={liga}, equipo1={equipo1}, equipo2={equipo2}")
        # Leer datos de la liga
        df = await get_data.leer_y_filtrar_csv(liga)
        if df is None:
            logger.error("❌ leer_y_filtrar_csv devolvió None")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No se encontraron partidos para la liga '{liga}'")
        
        logger.info(f"✅ DataFrame cargado con {df.shape[0]} filas y {df.shape[1]} columnas")

        # Filtrar partidos entre equipos
        partidos = get_data.filtrar_partidos_sin_importar_local_visita(df, equipo1, equipo2)
        if partidos.empty:
            logger.warning("⚠️ No se encontraron partidos entre los equipos")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No hay partidos registrados entre {equipo1} y {equipo2}"
            )
        logger.info(f"✅ Partidos filtrados: {partidos.shape}")

        # Obtener últimos partidos de cada equipo
        partidos_eq1 = get_data.filtrar_ultimos_partidos_de_equipo(df, equipo1)
        partidos_eq2 = get_data.filtrar_ultimos_partidos_de_equipo(df, equipo2)
        logger.info(f"✅ Últimos partidos: {equipo1}={len(partidos_eq1)}, {equipo2}={len(partidos_eq2)}")

        # Construir estadísticas
        df_stats = await functions_analysis.construir_estadisticas_equipos(partidos)
        if df_stats is None:
            logger.error("❌ construir_estadisticas_equipos devolvió None")
        else:
            logger.info(f"✅ Estadísticas generadas: {df_stats.shape}")

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

        # Primer Tiempo
        total_eq1, total_eq2 = await functions_analysis.goles_primer_tiempo_entre_dos(partidos, equipo1, equipo2)
        ventaja1, ventaja2, empates_ht, total = await functions_analysis.ventaja_primer_tiempo_entre_equipos(df, equipo1, equipo2)
        
        return {
            "resumen": {
                "total_enfrentamientos": len(partidos),
                "victorias_por_equipo": {
                    "local": victorias_equipo1,
                    "visitante": victorias_equipo2,
                    "empates": empates
                },
                "victorias_por_localia": {
                    "local": victorias_local,
                    "visitante": victorias_visitante,
                    "empates": empates
                }
            },
            "primer_tiempo": {
                "goles_primer_tiempo": {
                    "local": to_native(total_eq1),
                    "visitante": to_native(total_eq2)
                },
                "ventaja_primer_tiempo": {
                    "local": to_native(ventaja1),
                    "visitante": to_native(ventaja2),
                    "empate_ht": to_native(empates_ht),
                    "total_ht": to_native(total)
                }
            },
            "enfrentamientos_directos_sugerencias": functions_analysis.generar_sugerencias_enfrentamientos_directos(partidos, equipo1, equipo2),
            "racha_equipo_1": functions_analysis.generar_sugerencias_racha_equipo(partidos_eq1, equipo1),
            "racha_equipo_2": functions_analysis.generar_sugerencias_racha_equipo(partidos_eq2, equipo2),
            "ultimos_partidos": {
                equipo1: partidos_eq1.head(5).to_dict('records'),
                equipo2: partidos_eq2.head(5).to_dict('records')
            },
            "estadisticas_avanzadas": df_stats.to_dict('records'),
            "enfrentamientos_directos": partidos.to_dict('records')
        }
    except HTTPException:
        raise    
    except Exception as e:
        logger.exception(f"🔥 Error inesperado en get_analisis_completo: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en análisis completo: {str(e)}")
