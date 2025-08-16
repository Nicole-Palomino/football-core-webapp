import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional, List
from app.models.summary import ResumenEstadistico
from app.schemas.summary import ResumenCreate, ResumenUpdate
from app.crud import crud_match
from app import models

async def get_resumen(db: AsyncSession, resumen_id: int):
    """
    Recupera un único Resumen por su ID de forma asíncrona, con Partido relacionado.
    """
    result = await db.execute(
        select(ResumenEstadistico)
        .options(
            selectinload(ResumenEstadistico.partido),
        )
        .filter(ResumenEstadistico.id_resumen == resumen_id)
    )
    return result.scalars().first()

async def listar_resumenes(
    db: AsyncSession,
    skip: int = 0, 
    limit: int = 50,
    estados: Optional[List[int]] = None
):
    """
    Recupera una lista de Resúmenes solo de partidos con los estados dados.
    """
    query = select(ResumenEstadistico).options(
        selectinload(ResumenEstadistico.partido),
    )

    if estados:
        query = query.join(ResumenEstadistico.partido).where(models.Partido.id_estado.in_(estados))

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def listar_resumenes_por_partido(db: AsyncSession, id_partido: int):
    """
    Recupera los Resumenes por Partido de forma asíncrona.
    """
    result = await db.execute(
        select(ResumenEstadistico)
        .options(
            selectinload(ResumenEstadistico.partido),
        )
        .filter(ResumenEstadistico.id_partido == id_partido)
    )
    return result.scalars().all()

async def crear_resumen(db: AsyncSession, resumen: ResumenCreate):
    """
    Crea un nuevo Resumen de forma asíncrona con validación optimizada de claves externas.
    """
    # Ejecutar verificacion
    partido_task = crud_match.get_partido(db, resumen.id_partido)
    partido = await asyncio.gather(
        partido_task
    )

    # Validación
    if not partido:
        raise ValueError(f"Partido con ID {resumen.id_partido} no encontrado.")
    
    db_resumen = ResumenEstadistico(
        nombre =  resumen.nombre,
        url_imagen =  resumen.url_imagen,
        id_partido = resumen.id_partido
    )
    db.add(db_resumen)
    await db.commit()
    await db.refresh(db_resumen)
    return db_resumen

async def update_resumen(db: AsyncSession, resumen_id: int, resumen: ResumenUpdate):
    """
    Actualiza un Resumen existente de forma asíncrona.
    Realiza comprobaciones de existencia de claves externas sólo si se actualizan.
    """
    db_resumen = await get_resumen(db, resumen_id)
    if not db_resumen:
        return None
    
    update_data = resumen.model_dump(exclude_unset=True)

    # Preparar tareas asíncronas solo para las claves foráneas que se actualizan
    tasks = []
    checks = {}

    if "id_partido" in update_data:
        tasks.append(crud_match.get_partido(db, update_data["id_partido"]))
        checks["id_partido"] = "Partido"

    # Ejecutar todas las validaciones en paralelo
    if tasks:
        results = await asyncio.gather(*tasks)
        for (field, label), result in zip(checks.items(), results):
            if not result:
                raise ValueError(f"{label} con ID {update_data[field]} no encontrado.")
            
    # Aplicar la actualización
    for key, value in update_data.items():
        setattr(db_resumen, key, value)

    await db.commit()
    await db.refresh(db_resumen)
    return db_resumen

async def delete_resumen(db: AsyncSession, resumen_id: int):
    """
    Borra un Resumen por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_resumen = await get_resumen(db, resumen_id)
    if db_resumen:
        await db.delete(db_resumen)
        await db.commit()
        return True
    return False