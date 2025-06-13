from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app import crud

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@router.post("/paypal")
async def procesar_webhook_paypal(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    try:
        evento = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Payload inválido")

    event_type = evento.get("event_type")
    resource = evento.get("resource", {})

    if event_type != "CHECKOUT.ORDER.APPROVED":
        return {"status": "ignorado", "evento": event_type}

    paypal_order_id = resource.get("id")
    if not paypal_order_id:
        raise HTTPException(status_code=400, detail="ID de orden no encontrado en el webhook")

    # Buscar la compra por paypal_order_id
    compra = await crud.crud_compra_moneda.get_compra_by_order_id(db, paypal_order_id)
    if not compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")

    # Capturar y acreditar monedas si aún no fue procesado
    if compra.status != "COMPLETED":
        return await crud.crud_compra_moneda.capture_and_apply_topup(
            db=db,
            compra=compra,
            orders_controller=crud.crud_compra_moneda.orders_controller,
            current_user_id=compra.id_usuario,
        )

    return {"status": "ya procesado"}
