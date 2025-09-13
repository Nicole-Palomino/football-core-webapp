from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from sqlalchemy.exc import IntegrityError

from app import schemas, crud
from app.dependencies import get_db
from app.schemas.summary import ResumenOut, ResumenCreate, ResumenUpdate
from app.crud.crud_summary import crear_resumen, delete_resumen, listar_resumenes_por_partido, update_resumen, listar_resumenes, get_resumen
from app.core.security import get_current_admin_user, get_current_active_user
from app.core.logger import logger
from app.middlewares.rate_limit import limiter

router = APIRouter(
    prefix="/resumenes", 
    tags=["Resumenes"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# finished || used
@router.post("/", response_model=ResumenOut, dependencies=[Depends(get_current_admin_user)])
async def create_summary(
    resumen: ResumenCreate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Crea un nuevo Resumen. Requiere privilegios de administrador.
    """
    try:
        return await crear_resumen(db=db, resumen=resumen)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error inesperado: {str(e)}")

# finished 
@router.get("/partido/{id_partido}", response_model=list[ResumenOut])
@limiter.limit("5/minute")
async def get_resumenes_por_partido(
    request: Request,
    id_partido: int, 
    db: AsyncSession = Depends(get_db)
):
    """
    Devuelve todos los resúmenes de un partido.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (id_partido={id_partido})")

    resumenes = await listar_resumenes_por_partido(db, id_partido)
    if not resumenes:
        logger.warning(f"[NO ENCONTRADO] Resumen con id_partido={id_partido} solicitado desde {client_ip}")
        raise HTTPException(status_code=404, detail="No se encontraron resúmenes para este partido")
    
    logger.info(f"[ENCONTRADO] Resumen con id_partido={id_partido} consultado exitosamente por {client_ip}")
    return resumenes

# finished || used
@router.get("/", response_model=List[ResumenOut], dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_summaries(
    request: Request,
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path}")

    return await listar_resumenes(db=db, skip=skip, limit=limit)

# finished
@router.get("/{resumen_id}", response_model=ResumenOut, dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_resumen_por_id(request: Request, resumen_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un único Resumen por su ID.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (resumen_id={resumen_id})")

    resumen = await get_resumen(db, resumen_id)
    if not resumen:
        logger.warning(f"[NO ENCONTRADO] Resumen con id={resumen_id} solicitado desde {client_ip}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resumen no encontrado")
    
    logger.info(f"[ENCONTRADO] Resumen con id={resumen_id} consultado exitosamente por {client_ip}")
    return resumen

# finished || used
@router.put("/{resumen_id}", response_model=ResumenOut, dependencies=[Depends(get_current_admin_user)])
async def update_summary(
    resumen_id: int, 
    resumen: ResumenUpdate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Actualiza un Resumen existente por su ID. Requiere privilegios de administrador.
    """
    try:
        logger.info(f"[ACCESO ADMIN] Intentando actualizar resumen con ID: {resumen_id}")

        db_resumen = await update_resumen(db=db, resumen_id=resumen_id, resumen=resumen)
        if db_resumen is None:
            logger.warning(f"[NO ENCONTRADO] Resumen con ID {resumen_id} no encontrado.")
            raise HTTPException(status_code=404, detail="Resumen no encontrado")
        
        logger.info(f"[ENCONTRADO] Resumen con ID {resumen_id} actualizado exitosamente.")
        return db_resumen
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Error de integridad de datos. Verifique los IDs de las relaciones.")

# finished || used
@router.delete("/{resumen_id}", status_code=status.HTTP_200_OK)
async def delete_summary(
    resumen_id: int, 
    db: AsyncSession = Depends(get_db),
    admin_user: schemas.user.User = Depends(get_current_admin_user)
):
    """
    Elimina un Resumen por su ID. Requiere privilegios de administrador.
    """
    success = await delete_resumen(db=db, resumen_id=resumen_id)
    if not success:
        logger.warning(f"[NO ENCONTRADO] Admin {admin_user.id_usuario} intentó eliminar resumen {resumen_id} pero no fue encontrado.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resumen no encontrado")
    
    logger.info(f"[ENCONTRADO] Admin {admin_user.id_usuario} eliminó resumen {resumen_id}")
    return {"message": "Resumen eliminado exitosamente"}
