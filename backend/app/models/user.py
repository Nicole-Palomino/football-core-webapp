from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_usuario”.
    Representa un usuario en el sistema, utilizado para la autenticación.
    """
    __tablename__ = "tb_users" 

    # Clave primaria para el usuario, renombrada a id_usuario
    id_usuario = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # Nombre de usuario, único e indexado
    usuario = Column(String(50), unique=True, index=True, nullable=False)
    # Correo electrónico del usuario, único e indexado para el inicio de sesión
    correo = Column(String(250), unique=True, index=True, nullable=False)
    # Contraseña codificada por seguridad
    contrasena = Column(String(350), nullable=False) # Renamed to contrasena
    # Indica si la cuenta de usuario está activa (usando 1 para activa, 0 para inactiva)
    is_active = Column(Integer, default=1) 
    
    # Campos de recuperación de contraseña
    codigo_verificacion = Column(Integer, nullable=True)
    expiracion = Column(DateTime, nullable=True)

    # Clave foránea a tb_estados implementada para saber si es free o tiene un plan (id_estado)
    id_estado = Column(Integer, ForeignKey("tb_estados.id_estado"), nullable=False)
    # Clave foránea a tb_rol (id_rol) - Relación uno a muchos (un rol por usuario)
    id_rol = Column(Integer, ForeignKey("tb_rol.id_rol"), nullable=False)

    # Fecha de creación del registro, por defecto la hora actual
    registro = Column(DateTime, default=datetime.utcnow, nullable=False) # Renamed to registro
    # Fecha de la última actualización del registro, se actualiza cuando se produce un cambio
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    
    # Relación muchos-a-uno con Rol (un usuario pertenece a un rol)
    rol = relationship("Rol", back_populates="users", lazy="selectin")
    estado = relationship("Estado") # Esta relación debe definirse si tb_estados está vinculado.
    favoritos = relationship("Favorito", back_populates="usuario", cascade="all, delete")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete")