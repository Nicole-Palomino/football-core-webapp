import os

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# URL de base de datos para MySQL usando el controlador aiomysql
# Cargado desde ajustes para una mejor gestión de la configuración
SQLALCHEMY_DATABASE_URL = settings.MYSQL_DATABASE_URL

# Crear el motor asíncrono SQLAlchemy
# Para MySQL con aiomysql, el formato URL es mysql+aiomysql://user:password@host:port/dbname
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True, # Establecer a True para ver las sentencias SQL en los registros
    pool_recycle=3600 # Ayuda con conexiones de larga duración para MySQL
)

# Crear una clase AsyncSessionLocal.
# Cada instancia de AsyncSessionLocal será una sesión de base de datos asíncrona.
# El expire_on_commit=False es importante para evitar que los objetos expiren
# después de un commit, permitiendo que sean accedidos fuera de la sesión.
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False # Autoflush en False para un control más explícito
)

# Declarar una clase Base para modelos declarativos.
# Esta clase Base será heredada por todos tus modelos SQLAlchemy.
Base = declarative_base()