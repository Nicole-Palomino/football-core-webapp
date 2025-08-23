import logging
import sys
from logging.handlers import RotatingFileHandler
import os

# Crear carpeta logs si no existe
if not os.path.exists("logs"):
    os.makedirs("logs")

logger = logging.getLogger("app_logger")
logger.setLevel(logging.INFO)

if not logger.hasHandlers():
    # Formato de logs
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s] "
        "%(message)s (in %(pathname)s:%(lineno)d)",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Handler consola
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)

    # Handler archivo rotativo (5 MB, 5 backups)
    file_handler = RotatingFileHandler(
        "logs/app.log", maxBytes=5 * 1024 * 1024, backupCount=5, encoding="utf-8"
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

# Evita duplicar logs al importar varias veces
logger.propagate = False
