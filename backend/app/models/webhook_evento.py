from sqlalchemy import Column, Integer, DateTime, JSON, String, Boolean, func
from sqlalchemy.orm import relationship
from app.database import Base

class WebhookEvento(Base):
    __tablename__ = "tb_webhook_evento"

    id_webhook = Column(Integer, primary_key=True, autoincrement=True)
    event_id = Column(String(100), unique=True, nullable=False)
    tipo_evento = Column(String(100), nullable=False)
    payload = Column(JSON, nullable=False)
    procesado = Column(Boolean, nullable=False, default=False)
    recibido_at = Column(DateTime, nullable=False, server_default=func.now())
    procesado_at = Column(DateTime, nullable=True)