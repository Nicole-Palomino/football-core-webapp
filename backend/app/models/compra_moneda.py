from sqlalchemy import Column, Integer, DateTime, ForeignKey, DECIMAL, Enum as SQLEnum, func, String
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class PurchaseStatusEnum(enum.Enum):
    CREATED = "CREATED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    # Si en el futuro se necesita más estados, agregarlos aquí.

class CompraMoneda(Base):
    __tablename__ = "tb_compra_monedas"

    id_compra = Column(Integer, primary_key=True, autoincrement=True)
    id_usuario = Column(Integer, ForeignKey("tb_users.id_usuario"), nullable=False)
    id_paquete = Column(Integer, ForeignKey("tb_paquete_moneda.id_paquete"), nullable=True)
    paypal_order_id = Column(String(100), unique=True, nullable=False)
    monto_usd = Column(DECIMAL(10, 2), nullable=False)
    cantidad_monedas = Column(Integer, nullable=False)
    status = Column(SQLEnum(PurchaseStatusEnum), nullable=False, default=PurchaseStatusEnum.CREATED)
    capture_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relaciones inversas:
    usuario = relationship("User", back_populates="compras")
    paquete = relationship("PaqueteMoneda", back_populates="compras")