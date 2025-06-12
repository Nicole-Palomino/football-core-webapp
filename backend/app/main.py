import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import (
    estados, roles
)

# Crear tablas de base de datos al iniciar
# Esto creará tablas basadas en models.py si no existen
# Para motores asíncronos, create_all se hace típicamente de forma síncrona una vez o a través de migraciones.
# Esto intentará crear tablas al inicio usando las capacidades de sincronización del motor.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Football Core (MySQL Async)",
    description="Una API RESTful con FastAPI, SQLAlchemy (async) y JWT para gestionar entidades deportivas, balances de usuario y transacciones, incluyendo autenticación, autorización y conexión a MySQL.",
    version="1.0.0",
    docs_url="/documentacion",
    redoc_url="/redoc"
)

# Configurar CORS (Cross-Origin Resource Sharing)
# Ajuste los orígenes según sea necesario para su aplicación frontend
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000", # Example for a React/Vue/Angular frontend
    "*" # WARNING: For development only, be specific in production!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(estados.router)
app.include_router(roles.router)