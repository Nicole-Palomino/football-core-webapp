from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Annotated
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, desc

from app import schemas
from app.dependencies import get_db
from app.schemas.summary import ResumenOut, ResumenCreate, ResumenUpdate
from app.crud.crud_summary import crear_resumen, delete_resumen, listar_resumenes_por_partido, update_resumen, listar_resumenes
from app.models.summary import ResumenEstadistico
from app.core.security import get_current_admin_user, get_current_active_user
from app.core.logger import logger
from app.middlewares.rate_limit import limiter

router = APIRouter(
    prefix="/resumenes", 
    tags=["Resumenes"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# ✅
@router.post("/", response_model=ResumenOut)
async def create_summary(
    resumen: ResumenCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user)
):
    """
    Crea un nuevo Resumen. Requiere privilegios de administrador.
    """
    try:
        return await crear_resumen(db=db, resumen=resumen)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")
    
# ⚠️
@router.get("/", response_model=List[ResumenOut])
async def read_summaries(
    skip: int = 0, 
    limit: int = 50,
    partido_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Recupera una lista de todos los Resumenes con filtros opcionales. Accesible por cualquier usuario autenticado.
    """
    query = select(ResumenEstadistico)

    if partido_id:
        query = query.where(ResumenEstadistico.id_partido == partido_id)

    query = query.order_by(desc(ResumenEstadistico.created_at)).offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()

@router.get("/partido/{id_partido}", response_model=list[ResumenOut])
async def get_resumenes_por_partido(
    id_partido: int, 
    db: AsyncSession = Depends(get_db)
):
    """
    Devuelve todos los resúmenes de un partido.
    """
    resumenes = await listar_resumenes_por_partido(db, id_partido)
    if not resumenes:
        raise HTTPException(status_code=404, detail="No se encontraron resúmenes para este partido")
    return resumenes

# ✅
@router.get("/resumen-partido", response_model=List[ResumenOut])
async def read_summary_by_match(
    skip: int = 0,
    limit: int = 50,
    estados: Annotated[Optional[List[int]], Query()] = None,
    db: AsyncSession = Depends(get_db)
):
    return await listar_resumenes(db=db, skip=skip, limit=limit, estados=estados)

# ✅
@router.put("/{resumen_id}", response_model=ResumenOut)
async def update_summary(
    resumen_id: int, 
    resumen: ResumenUpdate, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede actualizar
):
    """
    Actualiza un Resumen existente por su ID. Requiere privilegios de administrador.
    """
    try:
        db_resumen = await update_resumen(db=db, resumen_id=resumen_id, resumen=resumen)
        if db_resumen is None:
            raise HTTPException(status_code=404, detail="Resumen no encontrado")
        return db_resumen
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")

# ✅
@router.delete("/{resumen_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_summary(
    resumen_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: schemas.User = Depends(get_current_admin_user) # Sólo el administrador puede eliminar
):
    """
    Elimina un Resumen por su ID. Requiere privilegios de administrador.
    """
    success = await delete_resumen(db=db, resumen_id=resumen_id)
    if not success:
        raise HTTPException(status_code=404, detail="Resumen no encontrado")
    return {"message": "Resumen eliminado exitosamente"}
