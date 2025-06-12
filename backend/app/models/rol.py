from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Rol(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_rol”.
    Representa un rol de usuario dentro del sistema.
    """
    __tablename__ = "tb_rol"

    # Clave principal para el puesto
    id_rol = Column(Integer, primary_key=True, index=True)
    # Nombre único para el rol, no puede ser nulo
    nombre_rol = Column(String(100), unique=True, nullable=False, index=True)
    # Fecha de creación del registro, por defecto la hora actual
    created_at = Column(DateTime, default=datetime.utcnow)
    # Fecha de la última actualización del registro, se actualiza cuando se produce un cambio
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relación uno a muchos con Usuario (un rol puede tener muchos usuarios)
    users = relationship("User", back_populates="rol")