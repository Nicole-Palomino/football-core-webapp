import asyncio

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app import crud, schemas, models
from app.dependencies import get_db
from app.core.security import get_current_admin_user, get_current_active_user
from app.core.logger import logger
from app.middlewares.rate_limit import limiter

router = APIRouter(
    prefix="/equipos",
    tags=["Equipos"],
    dependencies=[Depends(get_current_active_user)], # Todos los endpoints de este router requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

# finished || used
@router.get("/activos", response_model=list[schemas.Equipo], dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def get_teams_actives(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Retorna todos los equipos cuyo estado es '1' (activo).
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path}")

    query = select(models.Equipo).where(models.Equipo.id_estado == 1)
    result = await db.execute(query)
    return result.scalars().all()

# finished || used
@router.post("/", response_model=schemas.Equipo, dependencies=[Depends(get_current_admin_user)])
async def create_team(
    equipo: schemas.EquipoCreate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Crea un nuevo Equipo. Requiere privilegios de administrador.
    """
    # Ejecutar validaciones de claves foráneas en paralelo
    estado_task = crud.get_estado(db, equipo.id_estado)
    liga_task = crud.get_liga(db, equipo.id_liga)
    equipo_existente_task = crud.get_equipo_by_name(db, nombre_equipo=equipo.nombre_equipo)

    estado, liga, db_equipo = await asyncio.gather(
        estado_task,
        liga_task,
        equipo_existente_task
    )

    if not estado:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Estado con ID {equipo.id_estado} no encontrado.")
    if not liga:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Liga con ID {equipo.id_liga} no encontrada.")
    if db_equipo:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El equipo ya existe.")

    return await crud.create_equipo(db=db, equipo=equipo)

# finished || used
@router.get("/", response_model=list[schemas.Equipo], dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_teams(request: Request, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    """
    Recupera una lista de todos los Equipos. Accesible por cualquier usuario autentificado.
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path}")

    equipos = await crud.get_equipos(db, skip=skip, limit=limit)
    return equipos

# finished
@router.get("/{equipo_id}", response_model=schemas.Equipo, dependencies=[Depends(get_current_admin_user)])
@limiter.limit("5/minute")
async def read_team_by_id(request: Request, equipo_id: int, db: AsyncSession = Depends(get_db)):
    """
    Recupera un único Equipo por su ID. 
    """
    client_ip = request.client.host
    logger.info(f"[ACCESO ADMIN] Consulta desde {client_ip} a {request.url.path} (equipo_id={equipo_id})")

    db_equipo = await crud.get_equipo(db, equipo_id=equipo_id)
    if db_equipo is None:
        logger.warning(f"[NO ENCONTRADO] Equipo con id={equipo_id} solicitado desde {client_ip}")
        raise HTTPException(status_code=404, detail="Equipo no encontrado")
    
    logger.info(f"[ENCONTRADO] Equipo con id={equipo_id} consultado exitosamente por {client_ip}")
    return db_equipo

# finished || used
@router.put("/{equipo_id}", response_model=schemas.Equipo, dependencies=[Depends(get_current_admin_user)])
async def update_team(
    equipo_id: int, 
    equipo: schemas.EquipoUpdate, 
    db: AsyncSession = Depends(get_db),
):
    """
    Actualiza un Equipo existente por su ID. Requiere privilegios de administrador.
    """
    tasks = []
    checks = {}

    if equipo.id_estado is not None:
        tasks.append(crud.get_estado(db, equipo.id_estado))
        checks["id_estado"] = equipo.id_estado

    if equipo.id_liga is not None:
        tasks.append(crud.get_liga(db, equipo.id_liga))
        checks["id_liga"] = equipo.id_liga

    # Ejecutar validaciones en paralelo
    if tasks:
        results = await asyncio.gather(*tasks)
        for (field, id_value), result in zip(checks.items(), results):
            if not result:
                raise HTTPException(
                    status_code=400,
                    detail=f"{'Estado' if field == 'id_estado' else 'Liga'} con ID {id_value} no encontrado."
                )

    db_equipo = await crud.update_equipo(db=db, equipo_id=equipo_id, equipo=equipo)
    if db_equipo is None:
        logger.warning(f"[NO ENCONTRADO] Equipo con ID {equipo_id} no encontrado.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipo no encontrado")
    
    logger.info(f"[ENCONTRADO] Equipo con ID {equipo_id} actualizado exitosamente.")
    return db_equipo

# finished || used
@router.delete("/{equipo_id}", status_code=status.HTTP_200_OK)
async def delete_team(
    equipo_id: int, 
    db: AsyncSession = Depends(get_db),
    admin_user: schemas.user.User = Depends(get_current_admin_user)
):
    """
    Elimina un Equipo por su ID. Requiere privilegios de administrador.
    """
    success = await crud.delete_equipo(db=db, equipo_id=equipo_id)
    if not success:
        logger.warning(f"[NO ENCONTRADO] Admin {admin_user.id_usuario} intentó eliminar equipo {equipo_id} pero no fue encontrado.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Equipo no encontrado")
    
    logger.info(f"[ENCONTRADO] Admin {admin_user.id_usuario} eliminó equipo {equipo_id}")
    return {"message": "Equipo eliminado exitosamente"}

# finished || used
@router.get("/stats/total", response_model=int, status_code=status.HTTP_200_OK)
async def get_total_teams(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count()).select_from(models.Equipo))
    total = result.scalar()
    logger.info(f"Total de equipos consultado: {total}")
    return total