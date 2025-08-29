from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.analysis.functions import (
    functions_cluster,
)
from app.core.security import get_current_active_user
from app.schemas.user import User

router = APIRouter(
    prefix="/clusters",
    tags=["Clusters"],
    dependencies=[Depends(get_current_active_user)],
    responses={404: {"description": "Not found"}}
)

# finished
@router.get("/analizar/{liga}")
async def analizar_clusters(
    liga: str,
    equipo1: str = Query(..., description="Nombre del primer equipo"),
    equipo2: str = Query(..., description="Nombre del segundo equipo")
):
    """Analiza los clusters de partidos entre dos equipos"""
    try:
        resultado = await functions_cluster.analizar_clusters_partidos_entre_equipos(equipo1, equipo2, liga)
        
        if resultado is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No hay partidos registrados entre {equipo1} y {equipo2}"
            )
        
        return {
            "clusters_encontrados": len(resultado["resumen_por_cluster"]),
            "resumen_por_cluster": resultado["resumen_por_cluster"],
            "descripcion_clusters": resultado["descripcion_clusters"],
            "total_partidos_analizados": len(resultado["partidos_clusterizados"])
        }
        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en análisis de clusters: {str(e)}")
    
# finished
@router.get("/predecir/{liga}")
async def predecir_cluster(
    liga: str,
    equipo1: str = Query(..., description="Nombre del primer equipo"),
    equipo2: str = Query(..., description="Nombre del segundo equipo")
):
    """Predice el cluster y estadísticas de un partido futuro"""
    try:
        resultado = await functions_cluster.predecir_cluster_automatico(equipo1, equipo2, liga)
        
        if resultado is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se pudo realizar la predicción para {equipo1} vs {equipo2}"
            )
        
        return {
            "cluster_predicho": resultado["cluster_predicho"],
            "resumen": resultado["resumen"],
            "predicciones": resultado["predicciones"],
            "datos_utilizados": resultado["partido_usado"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error en predicción de cluster: {str(e)}")
