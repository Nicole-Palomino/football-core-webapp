from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import (
    estados, roles, ligas, auth, users, temporadas, equipos, partidos, estadisticas,
    paquetes_moneda, balances_usuario, paypal_routes, webhooks_eventos, compras_monedas
)

load_dotenv()

# Crear tablas de base de datos al iniciar
# Esto creará tablas basadas en models.py si no existen
# Para motores asíncronos, create_all se hace típicamente de forma síncrona una vez o a través de migraciones.
# Esto intentará crear tablas al inicio usando las capacidades de sincronización del motor.
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app = FastAPI(
    title="API de Football Core (MySQL Async)",
    description="Una API RESTful con FastAPI, SQLAlchemy (async) y JWT para gestionar entidades deportivas, balances de usuario y transacciones, incluyendo autenticación, autorización y conexión a MySQL.",
    version="1.0.0",
    docs_url="/documentacion",
    redoc_url="/redoc"
)

@app.on_event("startup")
async def on_startup():
    await init_db()
    
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

# Health check
@app.get("/", summary="Verificar estado del servidor")
async def read_root():
    return {"message": "Server is running"}

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(estados.router)
app.include_router(roles.router)
app.include_router(ligas.router)
app.include_router(temporadas.router)
app.include_router(equipos.router)
app.include_router(partidos.router)
app.include_router(estadisticas.router)
app.include_router(paquetes_moneda.router)
app.include_router(balances_usuario.router)
app.include_router(paypal_routes.router)
app.include_router(webhooks_eventos.router)
app.include_router(compras_monedas.router)