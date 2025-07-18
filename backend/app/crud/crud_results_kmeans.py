from sqlalchemy.ext.asyncio import AsyncSession
from app.models.history_kmeans import ResultadoKMeans
from app.schemas.kmeans import ResultadoKMeansCreate, ResultadoKMeansUpdate
from sqlalchemy import select

async def get_resultado_kmeans(db: AsyncSession, id_historial: int):
    result = await db.execute(
        select(ResultadoKMeans).filter(ResultadoKMeans.id_resultado_kmeans == id_historial)
    )
    return result.scalars().first()

async def get_resultados_kmeans(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(ResultadoKMeans).offset(skip).limit(limit))
    return result.scalars().all()

async def create_resultado_kmeans(db: AsyncSession, resultado: ResultadoKMeansCreate):
    db_resultado = ResultadoKMeans(**resultado.model_dump())
    db.add(db_resultado)
    await db.commit()
    await db.refresh(db_resultado)
    return db_resultado

async def update_resultado_kmeans(db: AsyncSession, id_historial: int, resultado: ResultadoKMeansUpdate):
    db_resultado = await get_resultado_kmeans(db, id_historial)
    if db_resultado:
        for key, value in resultado.model_dump(exclude_unset=True).items():
            setattr(db_resultado, key, value)
        await db.commit()
        await db.refresh(db_resultado)
    return db_resultado

async def delete_resultado_kmeans(db: AsyncSession, id_historial: int):
    db_resultado = await get_resultado_kmeans(db, id_historial)
    if db_resultado:
        await db.delete(db_resultado)
        await db.commit()
        return True
    return False