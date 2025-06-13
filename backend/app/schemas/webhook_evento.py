from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class WebhookEventoBase(BaseModel):
    event_id: str = Field(..., max_length=100)
    tipo_evento: str = Field(..., max_length=100)
    payload: dict  # JSON completo del evento

class WebhookEventoCreate(WebhookEventoBase):
    """
    Para registrar un webhook entrante.
    Se reciben: event_id, tipo_evento, payload.
    procesado se inicializa en False.
    """
    pass

class WebhookEventoRead(WebhookEventoBase):
    """
    Para respuestas de lectura de eventos webhook.
    Incluye: id_webhook, procesado, recibido_at, procesado_at.
    """
    id_webhook: int
    procesado: bool
    recibido_at: datetime
    procesado_at: Optional[datetime] = None