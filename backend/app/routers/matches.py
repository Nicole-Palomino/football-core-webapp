import io
import pandas as pd

from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime

from app.schemas.match import PartidoOut
from app import crud, schemas, models
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user
from app.core.logger import logger
from app.middlewares.rate_limit import limiter

router = APIRouter(
    prefix="/partidos",
    tags=["Partidos"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# finished || used
@router.post("/", response_model=schemas.match.PartidoOut, dependencies=[Depends(get_current_admin_user)])
async def create_match(
    partido: schemas.PartidoCreate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Crea un nuevo Partido. Requiere privilegios de administrador.
    """
    try:
        return await crud.create_partido(db=db, partido=partido)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")

# finished
@router.get("/{estado_id}", response_model=List[PartidoOut])
@limiter.limit("5/minute")
async def read_match_by_state(request: Request, estado_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera los Partidos por su Estado. Accesible por cualquier usuario autenticado.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (estado_id={estado_id})")

    db_partido = await crud.get_partido(db, estado_id=estado_id)
    if db_partido is None:
        logger.warning(f"[NO ENCONTRADO] Partido con id={estado_id} solicitado desde {client_ip}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partido no encontrado")
    
    logger.info(f"[ENCONTRADO] Partido con id={estado_id} consultado exitosamente por {client_ip}")
    return db_partido

# finished
@router.get("/by-id/{partido_id}", response_model=schemas.Partido)
@limiter.limit("5/minute")
async def read_match_by_id(request: Request, partido_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera los Partidos por su Estado. Accesible por cualquier usuario autenticado.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (partido_id={partido_id})")

    db_partido = await crud.crud_match.get_partido_by_id(db, partido_id=partido_id)
    if db_partido is None:
        logger.warning(f"[NO ENCONTRADO] Partido con id={partido_id} solicitado desde {client_ip}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partido no encontrado")
    
    logger.info(f"[ENCONTRADO] Partido con id={partido_id} consultado exitosamente por {client_ip}")
    return db_partido

# finished || used
@router.get("/season/{season_id}", response_model=List[schemas.Partido])
@limiter.limit("5/minute")
async def get_matches_by_states_and_seasons(request: Request, season_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera los Partidos (coincidencia) por su estado y temporada. Accesible por cualquier usuario autenticado.
    """
    logger.info(f"[ENCONTRADO] Partidos con id_season={season_id} consultado exitosamente")
    return await crud.crud_match.get_matches_by_season(db, season_id = season_id)

# finished || used
@router.put("/{partido_id}", response_model=schemas.Partido, dependencies=[Depends(get_current_admin_user)])
async def update_match(
    partido_id: int, 
    partido: schemas.PartidoUpdate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Actualiza un Partido existente por su ID. Requiere privilegios de administrador.
    """
    logger.info(f"[ACCESO ADMIN] Intentando actualizar partido con ID: {partido_id}")
    try:
        db_partido = await crud.update_partido(db=db, partido_id=partido_id, partido=partido)
        if db_partido is None:
            logger.warning(f"[NO ENCONTRADO] Partido con ID {partido_id} no encontrado.")
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partido no encontrado")
        
        logger.info(f"[ENCONTRADO] Partido con ID {partido_id} actualizado exitosamente.")
        return db_partido
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")

# finished || used
@router.delete("/{partido_id}", status_code=status.HTTP_200_OK)
async def delete_match(
    partido_id: int, 
    db: AsyncSession = Depends(get_db),
    admin_user: schemas.user.User = Depends(get_current_admin_user)
):
    """
    Elimina un Partido por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_partido(db=db, partido_id=partido_id)
    if not success:
        logger.warning(f"[NO ENCONTRADO] Admin {admin_user.id_usuario} intentó eliminar partido {partido_id} pero no fue encontrado.")
        raise HTTPException(status_code=404, detail="Partido no encontrado")
    
    logger.info(f"[ENCONTRADO] Admin {admin_user.id_usuario} eliminó partido {partido_id}")
    return {"message": "Partido eliminado exitosamente"}

# finished || used
@router.post("/upload-data", status_code=status.HTTP_200_OK,
            summary="Sube un archivo CSV o Excel para registrar partidos y estadísticas",
            response_model=Dict[str, Any], # Devolverá un resumen de los resultados
            dependencies=[Depends(get_current_admin_user)]) # Solo administradores pueden subir archivos
async def upload_matches(
    file: UploadFile = File(..., description="Archivo CSV o Excel con datos de partidos y estadísticas."),
    db: AsyncSession = Depends(get_db),
):
    """
    Procesa un archivo CSV o Excel para cargar múltiples partidos y sus estadísticas asociadas.
    El archivo debe contener las columnas necesarias para `PartidoCreate`.
    """
    successful = []
    failed = []

    try:
        contents = await file.read()
        file_like = io.BytesIO(contents)

        if file.filename.endswith(".csv"):
            df = pd.read_csv(file_like)
        elif file.filename.endswith((".xls", ".xlsx")):
            df = pd.read_excel(file_like)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de archivo no soportado. Subir CSV o Excel."
            )

        partidos_to_create = []

        for idx, row in df.iterrows():
            try:
                # --- Validar y convertir hora (HH:MM:SS) ---
                hora_str = str(row.get("hora"))
                if not hora_str or hora_str.strip() == "":
                    raise ValueError("Campo 'hora' vacío")
                try:
                    hora_obj = datetime.strptime(hora_str.strip(), "%H:%M:%S").time()
                except ValueError:
                    raise ValueError(f"Formato de hora inválido: {hora_str}")

                # --- Preparar datos del Partido ---
                partido_data = {
                    "id_liga": int(row["id_liga"]),
                    "id_temporada": int(row["id_temporada"]),
                    "dia": pd.to_datetime(row["dia"]).date(),
                    "hora": hora_obj,
                    "id_equipo_local": int(row["id_equipo_local"]),
                    "id_equipo_visita": int(row["id_equipo_visita"]),
                    "enlace_threesixfive": row.get("enlace_threesixfive") or None,
                    "enlace_datafactory": row.get("enlace_datafactory") or None,
                    "id_estado": int(row["id_estado"]),
                }

                # Validar con Pydantic
                partido_create = schemas.PartidoCreate(**partido_data)
                partido_db = models.Partido(**partido_create.dict())
                partidos_to_create.append(partido_db)
                successful.append(idx + 2)  # +2 porque encabezado es fila 1

            except Exception as e:
                failed.append({
                    "row": idx + 2,
                    "error": str(e),
                    "data": row.to_dict()
                })

        # Guardar todos los partidos en bloque
        db.add_all(partidos_to_create)
        try:
            await db.commit()
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error al guardar en la base de datos: {e}")


        return {
            "message": "Carga completada",
            "procesadas": len(df),
            "exitosas": len(successful),
            "fallidas": failed
        }

    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error interno: {e}")
    
# finished || used
@router.get("/stats/total", response_model=int, status_code=status.HTTP_200_OK)
async def get_total_matches(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(models.Partido))
    total = result.scalar()
    logger.info(f"Total de partidos consultado: {total}")
    return total
