from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class PaqueteMoneda(Base):
    """
    Modelo SQLAlchemy para la tabla “tb_paquete_moneda”.
    Representa un paquete de monedas para su compra.
    """
    __tablename__ = "tb_paquete_moneda"

    id_paquete = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(250), nullable=True)
    cantidad_monedas = Column(Integer, nullable=False)
    precio = Column(Float, nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
    # Nuevo campo para vincular con el Id. de producto de PayPal (por ejemplo, de Pagos)
    paypal_product_id = Column(String(100), unique=True, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    compras = relationship("CompraMoneda", back_populates="paquete")