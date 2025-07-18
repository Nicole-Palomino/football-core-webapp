import logging
import io
import pandas as pd

from fastapi.responses import JSONResponse
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.schemas.match import PartidoOut
from app import crud, schemas, models
from app.core.state import state
from app.utils.matches import analizar_estadisticas, predecir_cluster_partido, generar_perfil_por_cluster, verificar_o_entrenar_modelo, predecir_cluster_nuevo_partido, verificar_o_entrenar_modelo_predictivo
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/partidos",
    tags=["Partidos"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

# ✅ 
@router.post("/", response_model=schemas.Partido)
async def create_match(
    partido: schemas.PartidoCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede crear
):
    """
    Crea un nuevo Partido. Requiere privilegios de administrador.
    """
    try:
        return await crud.create_partido(db=db, partido=partido)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")

# ⚠️
@router.get("/historicos")
async def read_matches(
    equipo_1_id: int = Query(..., description="ID del primer equipo"),
    equipo_2_id: int = Query(..., description="ID del segundo equipo"),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Obtiene partidos históricos (estado = 4) entre dos equipos.
    """
    partidos = await crud.get_partidos(db, equipo_1_id, equipo_2_id)
    return analizar_estadisticas(partidos)

# ✅
@router.get("/{estado_id}", response_model=List[PartidoOut])
async def read_match_by_state(estado_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera los Partidos por su Estado. Accesible por cualquier usuario autenticado.
    """
    db_partido = await crud.get_partido(db, estado_id=estado_id)
    if db_partido is None:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return db_partido

# ✅ 
@router.get("/season/{season_id}", response_model=List[schemas.Partido])
async def get_matches_by_states_and_seasons(season_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera los Partidos (coincidencia) por su estado y temporada. Accesible por cualquier usuario autenticado.
    """
    return await crud.crud_match.get_matches_by_state_and_season(db, season_id = season_id)

# ✅ 
@router.put("/{partido_id}", response_model=schemas.Partido)
async def update_match(
    partido_id: int, 
    partido: schemas.PartidoUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar
):
    """
    Actualiza un Partido existente por su ID. Requiere privilegios de administrador.
    """
    try:
        db_partido = await crud.update_partido(db=db, partido_id=partido_id, partido=partido)
        if db_partido is None:
            raise HTTPException(status_code=404, detail="Partido no encontrado")
        return db_partido
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")

# ✅ 
@router.delete("/{partido_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_match(
    partido_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede eliminar
):
    """
    Elimina un Partido por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_partido(db=db, partido_id=partido_id)
    if not success:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return {"message": "Partido eliminado exitosamente"}

# ✅ 
@router.post("/upload-data", status_code=status.HTTP_200_OK,
            summary="Sube un archivo CSV o Excel para registrar partidos y estadísticas",
            response_model=Dict[str, Any], # Devolverá un resumen de los resultados
            dependencies=[Depends(get_current_admin_user)]) # Solo administradores pueden subir archivos
async def upload_matches_and_stats(
    file: UploadFile = File(..., description="Archivo CSV o Excel con datos de partidos y estadísticas."),
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user)
):
    """
    Procesa un archivo CSV o Excel para cargar múltiples partidos y sus estadísticas asociadas.
    El archivo debe contener las columnas necesarias para `PartidoCreate` y `EstadisticaCreate`.

    **Columnas requeridas para el Partido (ej. para `PartidoCreate`):**
    - `id_liga` (int)
    - `id_temporada` (int)
    - `dia` (YYYY-MM-DD)
    - `id_equipo_local` (int)
    - `id_equipo_visita` (int)
    - `id_estado` (int)
    - `enlace_threesixfive` (opcional, str)
    - `enlace_fotmob` (opcional, str)
    - `enlace_datafactory` (opcional, str)

    **Columnas requeridas para las Estadísticas (ej. para `EstadisticaCreate`):**
    - `FTHG` (int)
    - `FTAG` (int)
    - `FTR` (str, H/D/A)
    - `HTHG` (int)
    - `HTAG` (int)
    - `HTR` (str, H/D/A)
    - `HS` (int)
    - `AS` (int) - Nota: usa 'AS' como cabecera en el archivo, se mapeará a `AS_` en el modelo
    - `HST` (int)
    - `AST` (int)
    - `HF` (int)
    - `AF` (int)
    - `HC` (int)
    - `AC` (int)
    - `HY` (int)
    - `AY` (int)
    - `HR` (int)
    - `AR` (int)
    """
    successful = []
    failed = []

    try:
        # Leer el contenido del archivo
        contents = await file.read()
        file_like = io.BytesIO(contents)

        df: pd.DataFrame
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_like)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file_like)
        else:
            raise HTTPException(status_code=400, detail="Formato de archivo no soportado. Por favor, sube un archivo CSV o Excel.")
        
        partidos_to_create = []
        estadisticas_to_create = []
        row_map = {}

        # Iterar sobre las filas del DataFrame
        for idx, row in df.iterrows():
            try:
                # --- Preparar y validar datos del Partido ---
                partido_data = {
                    "id_liga": row["id_liga"],
                    "id_temporada": row["id_temporada"],
                    "dia": row["dia"], # Pydantic es flexible con formatos de fecha comunes
                    "id_equipo_local": row["id_equipo_local"],
                    "id_equipo_visita": row["id_equipo_visita"],
                    "enlace_threesixfive": row.get("enlace_threesixfive") or None,
                    "enlace_fotmob": row.get("enlace_fotmob") or None,
                    "enlace_datafactory": row.get("enlace_datafactory") or None,
                    "id_estado": row["id_estado"],
                }

                partido_create = schemas.PartidoCreate(**partido_data)
                partido_db = models.Partido(**partido_create.dict())
                partidos_to_create.append(partido_db)
                row_map[idx] = partido_db
            except Exception as e:
                failed.append({
                    "row": idx + 2,
                    "error": f"Error al procesar partido: {e}",
                    "data": row.to_dict()
                })

        # Agrega los partidos en bloque
        db.add_all(partidos_to_create)
        await db.flush()  # Asigna IDs

        # Crea las estadísticas relacionadas
        for idx, row in df.iterrows():
            if idx not in row_map:
                continue
            try:
                # --- Preparar y validar datos de Estadísticas (usando el id_partido recién creado) ---
                estadistica_data = {
                    "id_partido": row_map[idx].id_partido,
                    "FTHG": row.get("FTHG"),
                    "FTAG": row.get("FTAG"),
                    "FTR": row.get("FTR"),
                    "HTHG": row.get("HTHG"),
                    "HTAG": row.get("HTAG"),
                    "HTR": row.get("HTR"),
                    "HS": row.get("HS"),
                    "AS": row.get("AS"), # Pydantic lo mapea a AS_ debido al alias
                    "HST": row.get("HST"),
                    "AST": row.get("AST"),
                    "HF": row.get("HF"),
                    "AF": row.get("AF"),
                    "HC": row.get("HC"),
                    "AC": row.get("AC"),
                    "HY": row.get("HY"),
                    "AY": row.get("AY"),
                    "HR": row.get("HR"),
                    "AR": row.get("AR"),
                }
                # Limpiar valores NaN
                estadistica_data = {k: (None if pd.isna(v) else v) for k, v in estadistica_data.items()}

                estadistica_create = schemas.EstadisticaCreate(**estadistica_data)
                estadistica_db = models.Estadistica(**estadistica_create.dict())
                estadisticas_to_create.append(estadistica_db)

                successful.append({
                    "row": idx + 2,
                    "id_partido": row_map[idx].id_partido
                })

            except Exception as e:
                failed.append({
                    "row": idx + 2,
                    "error": f"Error al procesar estadísticas: {e}",
                    "data": row.to_dict()
                })

        # Agrega todas las estadísticas en bloque
        db.add_all(estadisticas_to_create)
        await db.commit()

        return {
            "message": "Carga completada.",
            "procesadas": len(df),
            "exitosas": len(successful),
            "fallidas": failed
        }

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno: {e}")
    
# ✅ 
@router.get("/stats/total", response_model=int)
async def get_total_matches(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(models.Partido))
    total = result.scalar()
    return total

# -------------------- K-MEANS --------------------
@router.get("/historicos/clusters")
async def clusterizar_partidos_historicos(
    equipo_1_id: int,
    equipo_2_id: int,
    k: int = 3,
    db: AsyncSession = Depends(get_db)
):
    resultado = await crud.crud_match.analizar_clusters_partidos_entre_equipos(db, equipo_1_id, equipo_2_id, k)
    if "error" in resultado:
        return resultado

    df_clusterizado = pd.DataFrame(resultado["partidos_clusterizados"])
    etiquetas = df_clusterizado["cluster"].values

    state.perfiles_clusters = generar_perfil_por_cluster(df_clusterizado, etiquetas)

    return resultado

@router.post("/predecir-k-means/")
async def predecir_cluster_automatico(
    equipo_1_id: int,
    equipo_2_id: int,
    db: AsyncSession = Depends(get_db)
):
    # Verificar o entrenar el modelo automáticamente
    verificacion = await verificar_o_entrenar_modelo(db, equipo_1_id, equipo_2_id)
    if "error" in verificacion:
        return JSONResponse(status_code=400, content={"error": verificacion["error"]})

    state.modelo_global = verificacion.get("modelo")
    state.perfiles_clusters = verificacion.get("perfiles")

    if state.modelo_global is None or state.perfiles_clusters is None:
        raise HTTPException(status_code=500, detail="No se pudo entrenar ni cargar el modelo.")

    partido = await crud.crud_match.obtener_ultimo_partido_entre_equipos(db, equipo_1_id, equipo_2_id)
    
    if not partido:
        return {"error": "No hay partidos entre los equipos especificados."}
    
    if not partido.estadisticas:
        return {"error": "El partido no tiene estadísticas asociadas."}

    datos_partido = {
        "goles_local": partido.estadisticas.FTHG,
        "goles_visitante": partido.estadisticas.FTAG,
        "goles_ht_local": partido.estadisticas.HTHG,
        "goles_ht_visitante": partido.estadisticas.HTAG,
        "tiros_local": partido.estadisticas.HS,
        "tiros_visitante": partido.estadisticas.AS_,
        "tiros_arco_local": partido.estadisticas.HST,
        "tiros_arco_visitante": partido.estadisticas.AST,
        "corners_local": partido.estadisticas.HC,
        "corners_visitante": partido.estadisticas.AC,
        "faltas_local": partido.estadisticas.HF,
        "faltas_visitante": partido.estadisticas.AF,
        "amarillas_local": partido.estadisticas.HY,
        "amarillas_visitante": partido.estadisticas.AY,
        "rojas_local": partido.estadisticas.HR,
        "rojas_visitante": partido.estadisticas.AR,
    }

    cluster_predicho = predecir_cluster_partido(state.modelo_global, datos_partido)
    perfil = state.perfiles_clusters.get(cluster_predicho, {})

    if not perfil:
        return {"error": "No se encontró un perfil para el cluster predicho."}
    
    goles_local = perfil.get('goles_esperados_local', 0)
    goles_visitante = perfil.get('goles_esperados_visitante', 0)
    total_goles = goles_local + goles_visitante

    resumen = (
        f"🔍 El partido pertenece al clúster {cluster_predicho}, caracterizado por una alta probabilidad de victoria del equipo local "
        f"({perfil.get('prob_victoria_local', 0) * 100:.1f}%), mientras que las chances de empate "
        f"({perfil.get('prob_empate', 0) * 100:.1f}%) y victoria visitante "
        f"({perfil.get('prob_victoria_visitante', 0) * 100:.1f}%) son menores.\n\n"
        
        f"📈 En el **primer tiempo**, el equipo local anota en promedio {perfil.get('goles_ht_local', 0):.1f} goles, mientras que el visitante marca "
        f"{perfil.get('goles_ht_visitante', 0):.1f}. Las probabilidades al descanso son: "
        f"victoria local ({perfil.get('prob_ht_local_gana', 0) * 100:.1f}%), empate ({perfil.get('prob_ht_empate', 0) * 100:.1f}%) y victoria visitante "
        f"({perfil.get('prob_ht_visitante_gana', 0) * 100:.1f}%).\n\n"

        f"⚽ A lo largo del partido, se espera un marcador promedio de {perfil.get('goles_esperados_local', 0):.1f} a {perfil.get('goles_esperados_visitante', 0):.1f}, "
        f"con {'alta' if perfil.get('ambos_marcan', 0) >= 0.5 else 'baja'} probabilidad de que ambos equipos marquen. "
        f"Se estiman un total de {total_goles:.1f} goles ({'over' if total_goles > 2.5 else 'under'} 2.5).\n\n"

        f"🎯 En promedio, el equipo local realiza {perfil.get('tiros_arco_local', 0):.1f} tiros al arco, frente a los {perfil.get('tiros_arco_visitante', 0):.1f} del visitante. "
        f"Además, se registran {perfil.get('corners_local', 0):.1f} corners para el local y {perfil.get('corners_visitante', 0):.1f} para el visitante.\n\n"

        f"🟨 En cuanto a disciplina, se esperan {perfil.get('amarillas_local', 0):.1f} amarillas y {perfil.get('rojas_local', 0):.2f} rojas para el equipo local, "
        f"y {perfil.get('amarillas_visitante', 0):.1f} amarillas y {perfil.get('rojas_visitante', 0):.2f} rojas para el visitante.\n\n"

        f"🔢 Marcador estimado más probable: {round(perfil.get('goles_esperados_local', 0))} - {round(perfil.get('goles_esperados_visitante', 0))}."
    )

    return {
        "cluster_predicho": int(cluster_predicho),
        "partido_usado": datos_partido,
        "predicciones": {
            "prob_victoria_local": perfil.get("prob_victoria_local"),
            "prob_empate": perfil.get("prob_empate"),
            "prob_victoria_visitante": perfil.get("prob_victoria_visitante"),
            "ambos_marcan": perfil.get("ambos_marcan"),
            "goles_esperados_local": perfil.get("goles_esperados_local"),
            "goles_esperados_visitante": perfil.get("goles_esperados_visitante"),
            "corners_local": perfil.get("corners_local"),
            "corners_visitante": perfil.get("corners_visitante"),
            "amarillas_local": perfil.get("amarillas_local"),
            "amarillas_visitante": perfil.get("amarillas_visitante"),
            "rojas_local": perfil.get("rojas_local"),
            "rojas_visitante": perfil.get("rojas_visitante"),
            "goles_ht_local": perfil.get("goles_ht_local"),
            "goles_ht_visitante": perfil.get("goles_ht_visitante"),
            "prob_ht_local_gana": perfil.get("prob_ht_local_gana"),
            "prob_ht_empate": perfil.get("prob_ht_empate"),
            "prob_ht_visitante_gana": perfil.get("prob_ht_visitante_gana"),
            "tiros_arco_local": perfil.get("tiros_arco_local"),
            "tiros_arco_visitante": perfil.get("tiros_arco_visitante"),
        },
        "resumen": resumen
    }

# -------------------- RANDOM FOREST --------------------
@router.get("/predecir-random-forest/")
async def predecir_cluster_modelo(
    equipo_1_id: int,
    equipo_2_id: int,
    db: AsyncSession = Depends(get_db)
):
    # 0. Asegurar que el modelo y los perfiles estén cargados
    if state.modelo_predictivo is None or state.perfiles_clusters is None:
        verificacion = await verificar_o_entrenar_modelo_predictivo(db, equipo_1_id, equipo_2_id)
        if "error" in verificacion:
            raise HTTPException(status_code=500, detail=verificacion["error"])
        state.modelo_predictivo = verificacion.get("modelo")
        state.perfiles_clusters = verificacion.get("perfiles")

    # 1. Obtener partido más reciente entre equipos
    partido = await crud.crud_match.obtener_ultimo_partido_entre_equipos(db, equipo_1_id, equipo_2_id)

    if partido is None:
        raise HTTPException(status_code=404, detail="No se encontró un partido reciente entre estos equipos.")
    
    if partido.estadisticas is None:
        raise HTTPException(status_code=400, detail="El partido no tiene estadísticas disponibles.")

    # 2. Preparar datos
    datos_partido = {
        "goles_local": partido.estadisticas.FTHG,
        "goles_visitante": partido.estadisticas.FTAG,
        "goles_ht_local": partido.estadisticas.HTHG,
        "goles_ht_visitante": partido.estadisticas.HTAG,
        "tiros_local": partido.estadisticas.HS,
        "tiros_visitante": partido.estadisticas.AS_,
        "tiros_arco_local": partido.estadisticas.HST,
        "tiros_arco_visitante": partido.estadisticas.AST,
        "corners_local": partido.estadisticas.HC,
        "corners_visitante": partido.estadisticas.AC,
        "faltas_local": partido.estadisticas.HF,
        "faltas_visitante": partido.estadisticas.AF,
        "amarillas_local": partido.estadisticas.HY,
        "amarillas_visitante": partido.estadisticas.AY,
        "rojas_local": partido.estadisticas.HR,
        "rojas_visitante": partido.estadisticas.AR,
    }

    # 3. Predecir con modelo supervisado
    cluster_predicho = predecir_cluster_nuevo_partido(datos_partido)["cluster"]
    perfil = state.perfiles_clusters.get(cluster_predicho, {})

    if not perfil:
        return {"error": "No se encontró un perfil para el cluster predicho."}

    goles_local = perfil.get('goles_esperados_local', 0)
    goles_visitante = perfil.get('goles_esperados_visitante', 0)
    total_goles = goles_local + goles_visitante

    resumen = (
        f"📊 Modelo Predictivo: El partido se clasifica en el clúster {cluster_predicho}. "
        f"Probabilidad de victoria local: {perfil.get('prob_victoria_local', 0) * 100:.1f}%, "
        f"empate: {perfil.get('prob_empate', 0) * 100:.1f}%, victoria visitante: {perfil.get('prob_victoria_visitante', 0) * 100:.1f}%.\n\n"

        f"🏟️ Primer tiempo: {perfil.get('goles_ht_local', 0):.1f} - {perfil.get('goles_ht_visitante', 0):.1f}. "
        f"HT: Local gana {perfil.get('prob_ht_local_gana', 0) * 100:.1f}%, Empate {perfil.get('prob_ht_empate', 0) * 100:.1f}%, "
        f"Visitante gana {perfil.get('prob_ht_visitante_gana', 0) * 100:.1f}%.\n\n"

        f"⚽ Goles esperados: {goles_local:.1f} - {goles_visitante:.1f} "
        f"({'over' if total_goles > 2.5 else 'under'} 2.5), ambos marcan: {'sí' if perfil.get('ambos_marcan', 0) >= 0.5 else 'no'}.\n\n"

        f"🎯 Tiros al arco: {perfil.get('tiros_arco_local', 0):.1f} vs {perfil.get('tiros_arco_visitante', 0):.1f}, "
        f"corners: {perfil.get('corners_local', 0):.1f} vs {perfil.get('corners_visitante', 0):.1f}.\n\n"

        f"🟨 Tarjetas: {perfil.get('amarillas_local', 0):.1f} amarillas y {perfil.get('rojas_local', 0):.1f} rojas para el local, "
        f"{perfil.get('amarillas_visitante', 0):.1f} amarillas y {perfil.get('rojas_visitante', 0):.1f} rojas para el visitante.\n\n"

        f"🔢 Marcador estimado: {round(goles_local)} - {round(goles_visitante)}"
    )

    return {
        "modelo": "Random Forest",
        "cluster_predicho": cluster_predicho,
        "partido_usado": datos_partido,
        "predicciones": {
            "prob_victoria_local": perfil.get("prob_victoria_local"),
            "prob_empate": perfil.get("prob_empate"),
            "prob_victoria_visitante": perfil.get("prob_victoria_visitante"),
            "ambos_marcan": perfil.get("ambos_marcan"),
            "goles_esperados_local": goles_local,
            "goles_esperados_visitante": goles_visitante,
            "corners_local": perfil.get("corners_local"),
            "corners_visitante": perfil.get("corners_visitante"),
            "amarillas_local": perfil.get("amarillas_local"),
            "amarillas_visitante": perfil.get("amarillas_visitante"),
            "rojas_local": perfil.get("rojas_local"),
            "rojas_visitante": perfil.get("rojas_visitante"),
            "goles_ht_local": perfil.get("goles_ht_local"),
            "goles_ht_visitante": perfil.get("goles_ht_visitante"),
            "prob_ht_local_gana": perfil.get("prob_ht_local_gana"),
            "prob_ht_empate": perfil.get("prob_ht_empate"),
            "prob_ht_visitante_gana": perfil.get("prob_ht_visitante_gana"),
            "tiros_arco_local": perfil.get("tiros_arco_local"),
            "tiros_arco_visitante": perfil.get("tiros_arco_visitante"),
        },
        "resumen": resumen
    }
