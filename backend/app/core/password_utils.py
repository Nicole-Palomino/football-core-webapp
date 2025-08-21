from passlib.context import CryptContext

# Contexto hash de la contraseña
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si una contraseña simple coincide con su versión hash.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Comprime una contraseña simple utilizando bcrypt.
    """
    return pwd_context.hash(password)