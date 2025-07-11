import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional
from app import models, schemas
from app.crud import crud_liga, crud_temporada, crud_equipo, crud_estado

async def get_partido(db: AsyncSession, partido_id: int):
    """
    Recupera un único Partido por su ID de forma asíncrona, con Liga, Temporada, Equipos y Estado relacionados.
    """
    result = await db.execute(
        select(models.Partido)
        .options(
            selectinload(models.Partido.liga),
            selectinload(models.Partido.temporada),
            selectinload(models.Partido.equipo_local),
            selectinload(models.Partido.equipo_visita),
            selectinload(models.Partido.estado),
            selectinload(models.Partido.estadisticas)
        )
        .filter(models.Partido.id_partido == partido_id)
    )
    return result.scalars().first()

async def get_partidos(
    db: AsyncSession, 
    skip: int = 0, 
    limit: int = 100,
    liga_id: Optional[int] = None,
    temporada_id: Optional[int] = None,
    equipo_id: Optional[int] = None,
    estado_id: Optional[int] = None,
):
    """
    Recupera una lista de Partidos de forma asíncrona con filtrado opcional.
    """
    query = select(models.Partido).options(
        selectinload(models.Partido.liga),
        selectinload(models.Partido.temporada),
        selectinload(models.Partido.equipo_local),
        selectinload(models.Partido.equipo_visita),
        selectinload(models.Partido.estado)
    )

    if liga_id:
        query = query.filter(models.Partido.id_liga == liga_id)
    if temporada_id:
        query = query.filter(models.Partido.id_temporada == temporada_id)
    if equipo_id:
        query = query.filter(
            (models.Partido.id_equipo_local == equipo_id) | 
            (models.Partido.id_equipo_visita == equipo_id)
        )
    if estado_id:
        query = query.filter(models.Partido.id_estado == estado_id)

    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()

async def create_partido(db: AsyncSession, partido: schemas.PartidoCreate):
    """
    Crea un nuevo Partido de forma asíncrona con validación optimizada de claves externas.
    """
    # Ejecutar verificaciones en paralelo
    liga_task = crud_liga.get_liga(db, partido.id_liga)
    temporada_task = crud_temporada.get_temporada(db, partido.id_temporada)
    equipo_local_task = crud_equipo.get_equipo(db, partido.id_equipo_local)
    equipo_visita_task = crud_equipo.get_equipo(db, partido.id_equipo_visita)
    estado_task = crud_estado.get_estado(db, partido.id_estado)

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

    db_partido = models.Partido(
        id_liga=partido.id_liga,
        id_temporada=partido.id_temporada,
        dia=partido.dia,
        id_equipo_local=partido.id_equipo_local,
        id_equipo_visita=partido.id_equipo_visita,
        enlace_threesixfive=partido.enlace_threesixfive,
        enlace_fotmob=partido.enlace_fotmob,
        enlace_datafactory=partido.enlace_datafactory,
        id_estado=partido.id_estado,
    )
    db.add(db_partido)
    await db.commit()
    await db.refresh(db_partido)
    return db_partido

async def update_partido(db: AsyncSession, partido_id: int, partido: schemas.PartidoUpdate):
    """
    Actualiza un Partido existente de forma asíncrona.
    Realiza comprobaciones de existencia de claves externas sólo si se actualizan.
    """
    db_partido = await get_partido(db, partido_id)
    if not db_partido:
        return None

    update_data = partido.model_dump(exclude_unset=True)

    # Preparar tareas asíncronas solo para las claves foráneas que se actualizan
    tasks = []
    checks = {}

    if "id_liga" in update_data:
        tasks.append(crud_liga.get_liga(db, update_data["id_liga"]))
        checks["id_liga"] = "Liga"
    if "id_temporada" in update_data:
        tasks.append(crud_temporada.get_temporada(db, update_data["id_temporada"]))
        checks["id_temporada"] = "Temporada"
    if "id_equipo_local" in update_data:
        tasks.append(crud_equipo.get_equipo(db, update_data["id_equipo_local"]))
        checks["id_equipo_local"] = "Equipo local"
    if "id_equipo_visita" in update_data:
        tasks.append(crud_equipo.get_equipo(db, update_data["id_equipo_visita"]))
        checks["id_equipo_visita"] = "Equipo visita"
    if "id_estado" in update_data:
        tasks.append(crud_estado.get_estado(db, update_data["id_estado"]))
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

async def delete_partido(db: AsyncSession, partido_id: int):
    """
    Borra un Partido por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_partido = await get_partido(db, partido_id)
    if db_partido:
        await db.delete(db_partido)
        await db.commit()
        return True
    return False