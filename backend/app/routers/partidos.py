import logging
import io
import pandas as pd
from typing import Optional, Dict, Any
from pydantic import ValidationError
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import Optional
from app import crud, schemas, models
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user

router = APIRouter(
    prefix="/partidos",
    tags=["Partidos"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

@router.post("/", response_model=schemas.Partido)
async def create_partido(
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

@router.get("/", response_model=list[schemas.Partido])
async def read_partidos(
    skip: int = 0, 
    limit: int = 20, 
    liga_id: Optional[int] = None,
    temporada_id: Optional[int] = None,
    equipo_id: Optional[int] = None,
    estado_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Recupera una lista de todos los Partidos (partidos) con filtros opcionales. Accesible por cualquier usuario autenticado.
    """
    query = select(models.Partido)

    if liga_id:
        query = query.where(models.Partido.id_liga == liga_id)
    if temporada_id:
        query = query.where(models.Partido.id_temporada == temporada_id)
    if equipo_id:
        query = query.where(
            (models.Partido.id_equipo_local == equipo_id) | 
            (models.Partido.id_equipo_visitante == equipo_id)
        )
    if estado_id:
        query = query.where(models.Partido.id_estado == estado_id)

    query = query.order_by(desc(models.Partido.created_at)).offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()

@router.get("/{partido_id}", response_model=schemas.Partido)
async def read_partido(partido_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un único Partido (coincidencia) por su ID. Accesible por cualquier usuario autenticado.
    """
    db_partido = await crud.get_partido(db, partido_id=partido_id)
    if db_partido is None:
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    return db_partido

@router.put("/{partido_id}", response_model=schemas.Partido)
async def update_partido(
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

@router.delete("/{partido_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_partido(
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
    
@router.get("/stats/total", response_model=int)
async def get_total_partidos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(models.Partido))
    total = result.scalar()
    return total