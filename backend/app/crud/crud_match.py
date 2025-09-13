import asyncio

from sqlalchemy import select, asc, or_, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from datetime import time
from fastapi import HTTPException, status

from app import models, schemas
from app.crud import crud_season
from app.crud import crud_league, crud_state, crud_team

# used in matches.py
async def get_partido(db: AsyncSession, estado_id: int):
    """
    Recupera todos los Partidos que pertenecen a un estado específico (id_estado),
    incluyendo los equipos local y visita, y el estado del partido.
    """
    result = await db.execute(
        select(models.Partido)
        .options(
            selectinload(models.Partido.equipo_local),
            selectinload(models.Partido.equipo_visita),
            selectinload(models.Partido.estado),
        )
        .filter(models.Partido.id_estado == estado_id)
    )
    return result.scalars().all()

# used in matches.py || crud_stat.py || crud_summary.py
async def get_partido_by_id(db: AsyncSession, partido_id: int):
    """
    Recupera un único Partido según su ID,
    incluyendo los equipos local y visita, estadísticas y el estado del partido.
    """
    result = await db.execute(
        select(models.Partido)
        .options(
            selectinload(models.Partido.equipo_local),
            selectinload(models.Partido.equipo_visita),
            selectinload(models.Partido.estado),
            selectinload(models.Partido.estadisticas)
        )
        .where(models.Partido.id_partido == partido_id)
    )
    print(result)
    return result.scalars().first()

async def get_partidos(
    db: AsyncSession, 
    equipo_1_id: int,
    equipo_2_id: int,
):
    """
    Recupera partidos históricos (id_estado = 4) entre dos equipos específicos.
    """
    query = select(models.Partido).options(
        selectinload(models.Partido.equipo_local),
        selectinload(models.Partido.equipo_visita),
        selectinload(models.Partido.estado),
        selectinload(models.Partido.estadisticas)
    ).where(
        models.Partido.id_estado == 4,
        or_(
            and_(
                models.Partido.id_equipo_local == equipo_1_id,
                models.Partido.id_equipo_visita == equipo_2_id
            ),
            and_(
                models.Partido.id_equipo_local == equipo_2_id,
                models.Partido.id_equipo_visita == equipo_1_id
            )
        )
    ).order_by(desc(models.Partido.dia))

    result = await db.execute(query)
    return result.scalars().all()

# used in matches.py
async def get_matches_by_season(
    db: AsyncSession, 
    season_id: int
):
    """
    Recupera una lista de Partidos filtrados únicamente por temporada y ordenados por fecha ascendente.
    """
    query = (
        select(models.Partido)
        .options(
            selectinload(models.Partido.liga),
            selectinload(models.Partido.temporada),
            selectinload(models.Partido.equipo_local),
            selectinload(models.Partido.equipo_visita),
            selectinload(models.Partido.estado),
            selectinload(models.Partido.estadisticas)
        )
        .where(
            models.Partido.id_temporada == season_id,
            models.Partido.id_estado.in_([5, 8])
        )
        .order_by(asc(models.Partido.dia))
    )

    result = await db.execute(query)
    return result.scalars().all()

# used in matches.py
async def create_partido(db: AsyncSession, partido: schemas.PartidoCreate):
    """
    Crea un nuevo Partido de forma asíncrona con validación optimizada de claves externas.
    """
    # Ejecutar verificaciones en paralelo
    liga_task = crud_league.get_liga(db, partido.id_liga)
    temporada_task = crud_season.get_temporada(db, partido.id_temporada)
    equipo_local_task = crud_team.get_equipo(db, partido.id_equipo_local)
    equipo_visita_task = crud_team.get_equipo(db, partido.id_equipo_visita)
    estado_task = crud_state.get_estado(db, partido.id_estado)

    liga, temporada, equipo_local, equipo_visita, estado = await asyncio.gather(
        liga_task,
        temporada_task,
        equipo_local_task,
        equipo_visita_task,
        estado_task
    )

    # Validación
    if not liga:
        raise ValueError(f"Liga con ID {partido.id_liga} no encontrada.")
    if not temporada:
        raise ValueError(f"Temporada con ID {partido.id_temporada} no encontrada.")
    if not equipo_local:
        raise ValueError(f"Equipo local con ID {partido.id_equipo_local} no encontrado.")
    if not equipo_visita:
        raise ValueError(f"Equipo visita con ID {partido.id_equipo_visita} no encontrado.")
    if not estado:
        raise ValueError(f"Estado con ID {partido.id_estado} no encontrado.")

    hora_peru = time(partido.hora.hour, partido.hora.minute, partido.hora.second)

    db_partido = models.Partido(
        id_liga=partido.id_liga,
        id_temporada=partido.id_temporada,
        dia=partido.dia,
        hora=hora_peru,
        id_equipo_local=partido.id_equipo_local,
        id_equipo_visita=partido.id_equipo_visita,
        enlace_threesixfive=partido.enlace_threesixfive,
        enlace_datafactory=partido.enlace_datafactory,
        id_estado=partido.id_estado,
    )
    db.add(db_partido)
    try:
        await db.commit()
        await db.refresh(db_partido)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El partido ya existe")
    return db_partido

# used in matches.py
async def update_partido(db: AsyncSession, partido_id: int, partido: schemas.PartidoUpdate):
    """
    Actualiza un Partido existente de forma asíncrona.
    Realiza comprobaciones de existencia de claves externas sólo si se actualizan.
    """
    db_partido = await get_partido_by_id(db, partido_id)
    if not db_partido:
        return None

    update_data = partido.model_dump(exclude_unset=True)

    # Preparar tareas asíncronas solo para las claves foráneas que se actualizan
    tasks = []
    checks = {}

    if "id_liga" in update_data:
        tasks.append(crud_league.get_liga(db, update_data["id_liga"]))
        checks["id_liga"] = "Liga"
    if "id_temporada" in update_data:
        tasks.append(crud_season.get_temporada(db, update_data["id_temporada"]))
        checks["id_temporada"] = "Temporada"
    if "id_equipo_local" in update_data:
        tasks.append(crud_team.get_equipo(db, update_data["id_equipo_local"]))
        checks["id_equipo_local"] = "Equipo local"
    if "id_equipo_visita" in update_data:
        tasks.append(crud_team.get_equipo(db, update_data["id_equipo_visita"]))
        checks["id_equipo_visita"] = "Equipo visita"
    if "id_estado" in update_data:
        tasks.append(crud_state.get_estado(db, update_data["id_estado"]))
        checks["id_estado"] = "Estado"

    # Ejecutar todas las validaciones en paralelo
    if tasks:
        results = await asyncio.gather(*tasks)
        for (field, label), result in zip(checks.items(), results):
            if not result:
                raise ValueError(f"{label} con ID {update_data[field]} no encontrado.")

    # Aplicar la actualización
    for key, value in update_data.items():
        setattr(db_partido, key, value)
    
    await db.commit()
    await db.refresh(db_partido)
    return db_partido

# used in matches.py
async def delete_partido(db: AsyncSession, partido_id: int):
    """
    Borra un Partido por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_partido = await get_partido_by_id(db, partido_id)
    try:
        await db.delete(db_partido)
        await db.commit()
        return {"message": "Partido eliminado correctamente"}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar el partido porque tiene relaciones asociadas"
        )