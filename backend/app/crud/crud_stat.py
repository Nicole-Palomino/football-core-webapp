from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app import models, schemas
from app.crud import crud_match

# used in crud_stat.py
async def get_estadistica(db: AsyncSession, estadistica_id: int):
    """
    Recupera una Estadistica por su ID de forma asíncrona, con Partido relacionado.
    """
    result = await db.execute(
        select(models.Estadistica)
        .options(selectinload(models.Estadistica.partido))
        .filter(models.Estadistica.id_estadistica == estadistica_id)
    )
    return result.scalars().first()

# used in crud_stat.py
async def get_estadistica_by_partido_id(db: AsyncSession, partido_id: int):
    """
    Recupera de forma asíncrona una Estadística por su ID de Partido asociado.
    """
    result = await db.execute(
        select(models.Estadistica)
        .filter(models.Estadistica.id_partido == partido_id)
    )
    return result.scalars().first()

# used in crud_stat.py
async def get_estadisticas(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    Recupera una lista de Estadisticas de forma asíncrona.
    """
    result = await db.execute(select(models.Estadistica).offset(skip).limit(limit))
    return result.scalars().all()

# used in crud_stat.py
async def create_estadistica(db: AsyncSession, estadistica: schemas.EstadisticaCreate):
    """
    Crea una nueva Estadistica de forma asíncrona.
    Realiza la comprobación de existencia de Partido relacionado.
    """
    partido = await crud_match.get_partido_by_id(db, estadistica.id_partido)
    if not partido:
        raise ValueError(f"Partido con ID {estadistica.id_partido} no encontrado.")
    
    # Comprobar si ya existen estadísticas para este partido (relación uno a uno)
    existing_stats = await get_estadistica_by_partido_id(db, estadistica.id_partido)
    if existing_stats:
        raise ValueError(f"Las estadísticas para el Partido con ID {estadistica.id_partido} ya existen.")

    db_estadistica = models.Estadistica(
        id_partido=estadistica.id_partido,
        FTHG=estadistica.FTHG,
        FTAG=estadistica.FTAG,
        FTR=estadistica.FTR,
        HTHG=estadistica.HTHG,
        HTAG=estadistica.HTAG,
        HTR=estadistica.HTR,
        HS=estadistica.HS,
        AS_=estadistica.AS_,
        HST=estadistica.HST,
        AST=estadistica.AST,
        HF=estadistica.HF,
        AF=estadistica.AF,
        HC=estadistica.HC,
        AC=estadistica.AC,
        HY=estadistica.HY,
        AY=estadistica.AY,
        HR=estadistica.HR,
        AR=estadistica.AR,
    )
    db.add(db_estadistica)
    await db.commit()
    await db.refresh(db_estadistica)
    return db_estadistica

# used in crud_stat.py
async def update_estadistica(db: AsyncSession, estadistica_id: int, estadistica: schemas.EstadisticaUpdate):
    """
    Actualiza una Estadística existente de forma asíncrona.
    """
    db_estadistica = await get_estadistica(db, estadistica_id)
    if not db_estadistica:
        return None
    
    update_data = estadistica.model_dump(exclude_unset=True)

    # Si se actualiza id_partido, asegúrese de que el nuevo partido existe y no tiene ya estadísticas
    if "id_partido" in update_data and update_data["id_partido"] != db_estadistica.id_partido:
        partido = await crud_match.get_partido_by_id(db, update_data["id_partido"])
        if not partido:
            raise ValueError(f"Partido con ID {update_data['id_partido']} no encontrado para la actualización.")
        existing_stats_for_new_partido = await get_estadistica_by_partido_id(db, update_data["id_partido"])
        if existing_stats_for_new_partido and existing_stats_for_new_partido.id_estadistica != estadistica_id:
            raise ValueError(f"El Partido con ID {update_data['id_partido']} ya tiene estadísticas asociadas.")


    for key, value in update_data.items():
        if key == "AS_":
            setattr(db_estadistica, "AS_", value)
        else:
            setattr(db_estadistica, key, value)
    
    await db.commit()
    await db.refresh(db_estadistica)
    return db_estadistica

# used in crud_stat.py
async def delete_estadistica(db: AsyncSession, estadistica_id: int):
    """
    Borra una Estadistica por su ID de forma asíncrona.
    Devuelve True si la eliminación se ha realizado correctamente, False en caso contrario.
    """
    db_estadistica = await get_estadistica(db, estadistica_id)
    try:
        await db.delete(db_estadistica)
        await db.commit()
        return {"message": "Estadística eliminada correctamente"}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede eliminar el estado porque tiene relaciones asociadas"
        )