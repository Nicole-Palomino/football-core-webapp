import math
import numpy as np

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.analysis.functions import (
    get_data, functions_prediction,
)
from app.core.security import get_current_active_user

router = APIRouter(
    prefix="/predictions",
    tags=["Predicciones"],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}}
)

# finished
@router.post("/entrenar-modelo/{liga}")
async def entrenar_modelo_prediccion(
    liga: str,
    equipo1: str = Query(..., description="Nombre del primer equipo"),
    equipo2: str = Query(..., description="Nombre del segundo equipo")
):
    """Entrena o carga un modelo de predicción para dos equipos"""
    try:
        modelos = await functions_prediction.verificar_o_entrenar_modelos_estadisticos(equipo1, equipo2, liga)
        
        if modelos is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No se pudieron entrenar o cargar los modelos"
            )
        
        return {
            "mensaje": "Modelos entrenados/cargados exitosamente",
            "modelos_disponibles": list(modelos.keys())
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al entrenar modelo: {str(e)}")

# finished
@router.get("/predecir/{liga}")
async def predecir_partido(
    liga: str,
    equipo1: str = Query(..., description="Nombre del primer equipo"),
    equipo2: str = Query(..., description="Nombre del segundo equipo")
):
    """Predice el resultado de un partido entre dos equipos"""
    try:
        modelos = await functions_prediction.verificar_o_entrenar_modelos_estadisticos(equipo1, equipo2, liga)
        if modelos is None:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No se pudieron entrenar o cargar los modelos")

        df_liga = await get_data.leer_y_filtrar_csv(liga)
        if df_liga is None or df_liga.empty:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No hay datos de la liga")

        partido = get_data.obtener_ultimo_partido_entre_equipos(df_liga, equipo1, equipo2)
        if partido is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontró un partido entre estos equipos")

        # función auxiliar
        def extraer(attr, serie):
            if hasattr(serie, "get"):
                val = serie.get(attr)
            else:
                val = getattr(serie, attr, None)
            # normaliza numpy/pandas scalars y NaN/inf
            if isinstance(val, (np.generic,)):
                val = val.item()
            if isinstance(val, float) and not math.isfinite(val):
                return None
            return val

        datos_partido = {
            "goles_local": extraer("FTHG", partido),
            "goles_visitante": extraer("FTAG", partido),
            "goles_ht_local": extraer("HTHG", partido),
            "goles_ht_visitante": extraer("HTAG", partido),
            "tiros_local": extraer("HS", partido),
            "tiros_visitante": extraer("AS", partido),
            "tiros_arco_local": extraer("HST", partido),
            "tiros_arco_visitante": extraer("AST", partido),
            "corners_local": extraer("HC", partido),
            "corners_visitante": extraer("AC", partido),
            "faltas_local": extraer("HF", partido),
            "faltas_visitante": extraer("AF", partido),
            "amarillas_local": extraer("HY", partido),
            "amarillas_visitante": extraer("AY", partido),
            "rojas_local": extraer("HR", partido),
            "rojas_visitante": extraer("AR", partido),
        }

        predicciones = functions_prediction.predecir_estadisticas_partido(modelos, datos_partido)
        if not isinstance(predicciones, dict):
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Predicciones en formato inesperado")

        # Normalizar recursivamente
        def to_native(value):
            if isinstance(value, (np.generic,)):
                value = value.item()
            if isinstance(value, float) and not math.isfinite(value):
                return None
            return value

        def normalize_dict(d):
            if isinstance(d, dict):
                return {k: normalize_dict(v) for k, v in d.items()}
            if isinstance(d, list):
                return [normalize_dict(i) for i in d]
            return to_native(d)

        predicciones = normalize_dict(predicciones)

        map_resultado = {
            1: "Victoria del equipo local",
            0: "Empate",
            -1: "Victoria del equipo visitante"
        }
        map_resultado_ht = {
            1: "Victoria del equipo local a medio tiempo",
            0: "Empate a medio tiempo",
            -1: "Victoria del equipo visitante a medio tiempo"
        }

        resultado_final_code = predicciones.get("resultado")
        resultado_ht_code = predicciones.get("resultado_ht")

        return {
            "predicciones": {
                "resultado_final": {
                    "codigo": to_native(resultado_final_code),
                    "descripcion": map_resultado.get(resultado_final_code, "Desconocido")
                },
                "resultado_medio_tiempo": {
                    "codigo": to_native(resultado_ht_code),
                    "descripcion": map_resultado_ht.get(resultado_ht_code, "Desconocido")
                },
                "ambos_marcan": {
                    "probabilidad": round(to_native(predicciones.get("prob_ambos_marcan", 0)) * 100, 2),
                    "alta_probabilidad": bool(predicciones.get("prob_ambos_marcan", 0) > 0.7)
                },
                "ambos_marcan_ht": {
                    "probabilidad": round(to_native(predicciones.get("prob_ambos_marcan_ht", 0)) * 100, 2),
                    "alta_probabilidad": bool(predicciones.get("prob_ambos_marcan_ht", 0) > 0.7)
                },
                "estadisticas_esperadas": {
                    "goles_local": round(to_native(predicciones.get("goles_local", 0)) or 0, 2),
                    "goles_visitante": round(to_native(predicciones.get("goles_visitante", 0)) or 0, 2),
                    "tiros_arco_local": round(to_native(predicciones.get("tiros_arco_local", 0)) or 0, 2),
                    "tiros_arco_visitante": round(to_native(predicciones.get("tiros_arco_visitante", 0)) or 0, 2),
                    "corners_local": round(to_native(predicciones.get("corners_local", 0)) or 0, 2),
                    "corners_visitante": round(to_native(predicciones.get("corners_visitante", 0)) or 0, 2),
                    "amarillas_local": round(to_native(predicciones.get("amarillas_local", 0)) or 0, 2),
                    "amarillas_visitante": round(to_native(predicciones.get("amarillas_visitante", 0)) or 0, 2),
                    "rojas_local": round(to_native(predicciones.get("rojas_local", 0)) or 0, 2),
                    "rojas_visitante": round(to_native(predicciones.get("rojas_visitante", 0)) or 0, 2),
                }
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en predicción: {str(e)}")