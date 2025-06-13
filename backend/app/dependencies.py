from typing import AsyncGenerator
from app.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Proporciona una sesión de base de datos asíncrona para cada solicitud.
    Garantiza que la sesión se cierre una vez procesada la solicitud.
    """
    async with AsyncSessionLocal() as session:
        yield session