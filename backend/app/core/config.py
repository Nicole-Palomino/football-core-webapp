import os
from dotenv import load_dotenv
from pydantic import Field

# Cargar variables de entorno del archivo .env
load_dotenv()

# Configuración centralizada
class Settings:
    """
    Configuración de la aplicación cargada desde variables de entorno.
    """
    SECRET_KEY: str = os.getenv("SECRET_KEY") 
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
    JWT_ISSUER: str = os.getenv("JWT_ISSUER", "football-core-api")
    JWT_AUDIENCE: str = os.getenv("JWT_AUDIENCE", "football-clients")
    # URL de la base de datos MySQL
    MYSQL_DATABASE_URL: str = os.getenv("MYSQL_DATABASE_URL")

    # Credenciales de Gmail para enviar correos electrónicos (para recuperar la contraseña)
    GMAIL_EMAIL: str = os.getenv("GMAIL_EMAIL")
    GMAIL_APP_PASSWORD: str = os.getenv("GMAIL_APP_PASSWORD") 

    # PayPal Webhook
    PAYPAL_WEBHOOK_SECRET: str = os.getenv("PAYPAL_WEBHOOK_SECRET")


settings = Settings()