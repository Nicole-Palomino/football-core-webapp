from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middlewares.security import log_requests_and_secure
from app.database import engine, Base
from app.routers import (
    favorites, leagues, matches, seasons, states, stats, summaries, 
    teams, roles, users, auth, analysis, cluster, predictions,
    poisson, clasification
)

load_dotenv()

# Crear tablas de base de datos al iniciar
# Esto creará tablas basadas en models.py si no existen
# Para motores asíncronos, create_all se hace típicamente de forma síncrona una vez o a través de migraciones.
# Esto intentará crear tablas al inicio usando las capacidades de sincronización del motor.
# async def init_db():
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)

app = FastAPI(
    title="API de Football Core (MySQL Async)",
    description="Una API RESTful con FastAPI, SQLAlchemy (async) y JWT para gestionar entidades deportivas, incluyendo autenticación, autorización y conexión a MySQL.",
    version="1.0.0",
    docs_url="/documentacion",
    redoc_url="/redoc"
)

app.middleware('http')(log_requests_and_secure)

# @app.on_event("startup")
# async def on_startup():
#     await init_db()
    
# Configurar CORS (Cross-Origin Resource Sharing)
# Ajuste los orígenes según sea necesario para su aplicación frontend
origins = [
    "http://127.0.0.1:8000",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
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
app.include_router(states.router)
app.include_router(roles.router)
app.include_router(leagues.router)
app.include_router(seasons.router)
app.include_router(teams.router)
app.include_router(matches.router)
app.include_router(stats.router)
app.include_router(users.router)
app.include_router(summaries.router)
app.include_router(favorites.router)
app.include_router(analysis.router)
app.include_router(cluster.router)
app.include_router(predictions.router)
app.include_router(poisson.router)
app.include_router(clasification.router)