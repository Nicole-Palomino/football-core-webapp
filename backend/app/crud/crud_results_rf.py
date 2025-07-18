from sqlalchemy.ext.asyncio import AsyncSession
from app.models.history_rf import ResultadoRF
from app.schemas.random_forest import ResultadoRFCreate, ResultadoRFUpdate
from sqlalchemy import select

async def get_resultado_rf(db: AsyncSession, id_historial: int):
    result = await db.execute(
        select(ResultadoRF).filter(ResultadoRF.id_resultado_rf == id_historial)
    )
    return result.scalars().first()

async def get_resultados_rf(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(ResultadoRF).offset(skip).limit(limit))
    return result.scalars().all()

async def create_resultado_rf(db: AsyncSession, resultado: ResultadoRFCreate):
    db_resultado = ResultadoRF(**resultado.model_dump())
    db.add(db_resultado)
    await db.commit()
    await db.refresh(db_resultado)
    return db_resultado

async def update_resultado_rf(db: AsyncSession, id_historial: int, resultado: ResultadoRFUpdate):
    db_resultado = await get_resultado_rf(db, id_historial)
    if db_resultado:
        for key, value in resultado.model_dump(exclude_unset=True).items():
            setattr(db_resultado, key, value)
        await db.commit()
        await db.refresh(db_resultado)
    return db_resultado

async def delete_resultado_rf(db: AsyncSession, id_historial: int):
    db_resultado = await get_resultado_rf(db, id_historial)
    if db_resultado:
        await db.delete(db_resultado)
        await db.commit()
        return True
    return False