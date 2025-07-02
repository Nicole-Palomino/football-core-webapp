from sqlalchemy import Column, Integer, ForeignKey, Date, func
from sqlalchemy.orm import relationship
from app.database import Base

class AdsWatched(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_ads_watched”.
    Representa un Anuncio para el usuario.
    """
    __tablename__ = "tb_ads_watched"

    # Clave principal del anuncio
    id = Column(Integer, primary_key=True, index=True)
    # Clave foránea para tb_users (id_usuario)
    id_usuario = Column(Integer, ForeignKey("tb_users.id_usuario", ondelete="CASCADE"))
    # Fecha de creación del registro, por defecto la hora actual
    fecha = Column(Date, default=func.current_date())
    # El costo del anuncio
    cantidad = Column(Integer, default=0)

    # Relaciones
    usuario = relationship("User", back_populates="anuncios", lazy="noload")
