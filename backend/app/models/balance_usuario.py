from datetime import datetime
from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class BalanceUsuario(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_balance_usuario”.
    Representa el saldo de monedas de un usuario.
    """
    __tablename__ = "tb_balance_usuario"

    id_balance = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("tb_users.id_usuario"), nullable=False, unique=True) # Uno a uno con Usuarios
    cantidad_monedas = Column(Integer, default=0, nullable=False)
    ultima_actualizacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relaciones
    usuario = relationship("User", back_populates="balance")