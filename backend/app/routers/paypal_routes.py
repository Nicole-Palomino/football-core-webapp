from fastapi import APIRouter, HTTPException, Depends
from app.services.client import paypal_client
from paypalserversdk.models.order_request import OrderRequest
from paypalserversdk.models.purchase_unit_request import PurchaseUnitRequest
from paypalserversdk.models.amount_with_breakdown import AmountWithBreakdown
from paypalserversdk.models.amount_breakdown import AmountBreakdown
from paypalserversdk.models.money import Money
from paypalserversdk.models.checkout_payment_intent import CheckoutPaymentIntent
from paypalserversdk.models.item import Item
from paypalserversdk.models.item_category import ItemCategory
from paypalserversdk.api_helper import ApiHelper
from paypalserversdk.exceptions.error_exception import ErrorException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.core.security import get_current_active_user
from app.crud import crud_compra_moneda

router = APIRouter(prefix="/paypal", tags=["PayPal"])

orders_controller = paypal_client.orders

@router.post("/create-order")
async def create_order(amount_usd: float, coins: int):
    """
    Crea una orden de PayPal basada en la cantidad y monedas seleccionadas.
    """
    try:
        order = orders_controller.create_order({
            "body": OrderRequest(
                intent=CheckoutPaymentIntent.CAPTURE,
                purchase_units=[
                    PurchaseUnitRequest(
                        amount=AmountWithBreakdown(
                            currency_code="USD",
                            value=str(amount_usd),
                            breakdown=AmountBreakdown(
                                item_total=Money(currency_code="USD", value=str(amount_usd))
                            ),
                        ),
                        items=[
                            Item(
                                name=f"{coins} Monedas",
                                unit_amount=Money(currency_code="USD", value=str(amount_usd)),
                                quantity="1",
                                description=f"Compra de {coins} monedas para la app",
                                sku=f"coinpack_{coins}",
                                category=ItemCategory.DIGITAL_GOODS,
                            )
                        ],
                    )
                ]
            )
        })
        return ApiHelper.json_deserialize(order.body)
    except ErrorException as e:
        raise HTTPException(status_code=400, detail="Error al crear orden en PayPal")

@router.post("/capture-order/{order_id}")
async def capture_order(order_id: str, db: AsyncSession = Depends(get_db), current_user=Depends(get_current_active_user)):
    """
    Captura una orden de PayPal existente y aplica la recarga de monedas al usuario actual.
    """
    try:
        # Buscar la compra por ID de orden
        compra = await crud_compra_moneda.get_compra_by_order_id(db, order_id)
        if not compra:
            raise HTTPException(status_code=404, detail="Compra no encontrada")

        resultado = await crud_compra_moneda.capture_and_apply_topup(
            db=db,
            compra=compra,
            paypal_client=paypal_client,
            current_user_id=current_user.id_usuario
        )
        return resultado
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))