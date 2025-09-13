from fastapi import FastAPI
from dotenv import load_dotenv
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.middlewares.security import LoggingMiddleware
from app.middlewares.rate_limit import limiter
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

app.add_middleware(LoggingMiddleware)

app.state.limiter = limiter
app.add_exception_handler(
    RateLimitExceeded,
    lambda request, exc: JSONResponse(
        status_code=429,
        content={"detail": "Demasiadas solicitudes, intente más tarde."}
    )
)
app.add_middleware(SlowAPIMiddleware)

# @app.on_event("startup")
# async def on_startup():
#     await init_db()
    
# Configurar CORS (Cross-Origin Resource Sharing)
# Ajuste los orígenes según sea necesario para su aplicación frontend
origins = [
    "http://127.0.0.1:8000",
    "http://localhost:5173",
    "http://localhost:5174",
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

# finished || tested
app.include_router(auth.router)
# finished || tested
app.include_router(users.router)
# finished 
app.include_router(states.router)
# finished
app.include_router(roles.router)
# finished
app.include_router(leagues.router)
# finished
app.include_router(seasons.router)
# finished
app.include_router(teams.router)
# finished
app.include_router(matches.router)
# finished
app.include_router(stats.router)
# finished
app.include_router(summaries.router)
# finished
app.include_router(favorites.router)
# finished
app.include_router(analysis.router)
# finished
app.include_router(cluster.router)
# finished
app.include_router(predictions.router)
# finished
app.include_router(poisson.router)
# finished
app.include_router(clasification.router)