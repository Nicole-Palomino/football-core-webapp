from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.models.webhook_evento import WebhookEvento
from app.schemas.webhook_evento import WebhookEventoCreate
from datetime import datetime


async def crear_webhook_evento(db: AsyncSession, evento: WebhookEventoCreate) -> WebhookEvento:
    nuevo = WebhookEvento(
        event_id=evento.event_id,
        tipo_evento=evento.tipo_evento,
        payload=evento.payload,
        procesado=False
    )
    db.add(nuevo)
    await db.commit()
    await db.refresh(nuevo)
    return nuevo


async def obtener_webhook_evento(db: AsyncSession, id_webhook: int) -> WebhookEvento | None:
    result = await db.execute(
        select(WebhookEvento).where(WebhookEvento.id_webhook == id_webhook)
    )
    return result.scalar_one_or_none()


async def obtener_webhook_por_event_id(db: AsyncSession, event_id: str) -> WebhookEvento | None:
    result = await db.execute(
        select(WebhookEvento).where(WebhookEvento.event_id == event_id)
    )
    return result.scalar_one_or_none()


async def listar_webhooks(db: AsyncSession, solo_no_procesados: bool = False) -> list[WebhookEvento]:
    stmt = select(WebhookEvento)
    if solo_no_procesados:
        stmt = stmt.where(WebhookEvento.procesado.is_(False))
    stmt = stmt.order_by(WebhookEvento.recibido_at.desc())

    result = await db.execute(stmt)
    return result.scalars().all()


async def marcar_como_procesado(db: AsyncSession, id_webhook: int) -> WebhookEvento | None:
    evento = await obtener_webhook_evento(db, id_webhook)
    if evento:
        evento.procesado = True
        evento.procesado_at = datetime.utcnow()
        await db.commit()
        await db.refresh(evento)
        return evento
    return None


async def eliminar_webhook_evento(db: AsyncSession, id_webhook: int) -> bool:
    evento = await obtener_webhook_evento(db, id_webhook)
    if evento:
        await db.delete(evento)
        await db.commit()
        return True
    return False