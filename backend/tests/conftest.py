# tests/conftest.py
import pytest_asyncio
import pytest
import sys, os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import insert
from main import app as fastapi_app
from app.dependencies import get_db
from app.database import Base  # importa tu Base de modelos
from app.models.role import Rol
from app.models.state import Estado

# ------------------------
# Configuración DB de prueba
# ------------------------
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test_db.sqlite"
engine = create_async_engine(TEST_DATABASE_URL, echo=True)
TestSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# Crear las tablas antes de correr tests
@pytest_asyncio.fixture(scope="session", autouse=True)
async def create_test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.execute(
            insert(Rol).values(id_rol=3, nombre_rol="Usuario")
        )
        await conn.execute(
            insert(Rol).values(id_rol=2, nombre_rol="Administrador")
        )
        await conn.execute(
            insert(Rol).values(id_rol=1, nombre_rol="Editor")
        )
        await conn.execute(
            insert(Estado).values(id_estado=10, nombre_estado="Usuario Free")
        )
        await conn.execute(
            insert(Estado).values(id_estado=1, nombre_estado="Usuario Premium")
        )

    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

# ------------------------
# Sobrescribir dependencia de FastAPI
# ------------------------
async def override_get_db():
    async with TestSessionLocal() as session:
        yield session

fastapi_app.dependency_overrides[get_db] = override_get_db

# ------------------------
# Fixtures
# ------------------------
@pytest_asyncio.fixture
async def test_db():
    async with TestSessionLocal() as session:
        yield session

@pytest.fixture
def test_app():
    fastapi_app.user_middleware.clear()
    return fastapi_app

@pytest_asyncio.fixture
async def async_client(test_app):
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
