import logging
import time
from logging.handlers import RotatingFileHandler
from fastapi import Request
from fastapi.responses import JSONResponse
import os

# Crear carpeta logs si no existe
if not os.path.exists("logs"):
    os.makedirs("logs")

# Configuración de logger
logger = logging.getLogger("app_logger")
logger.setLevel(logging.INFO)

# Handler para archivo rotativo (10 MB máx, 5 backups)
file_handler = RotatingFileHandler(
    "logs/app.log", maxBytes=10*1024*1024, backupCount=5, encoding="utf-8"
)
file_handler.setLevel(logging.INFO)

# Handler para consola
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Formato de logs
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# Evitar duplicados
if not logger.handlers:
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)


# Middleware de seguridad y logging
async def log_requests_and_secure(request: Request, call_next):
    start_time = time.time()

    try:
        # Logging de cada request
        logger.info(f"📥 Request: {request.method} {request.url}")

        # Continuar la ejecución
        response = await call_next(request)

        # Calcular tiempo de ejecución
        process_time = (time.time() - start_time) * 1000
        logger.info(f"📤 Response: status {response.status_code} - {process_time:.2f} ms")

        # Headers de seguridad básicos
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=()"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        return response

    except Exception as e:
        logger.error(f"❌ Error: {str(e)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"error": "Internal Server Error"}
        )