from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from decimal import Decimal

import enum

# --- Esquemas CRUD de compra_moneda existentes ---

class PurchaseStatusEnum(str, enum.Enum):
    CREATED = "CREATED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class CompraMonedaBase(BaseModel):
    id_usuario: int
    id_paquete: Optional[int] = None
    paypal_order_id: str = Field(..., max_length=100)
    monto_usd: Decimal
    cantidad_monedas: int
    status: PurchaseStatusEnum = PurchaseStatusEnum.CREATED
    capture_id: Optional[str] = Field(None, max_length=100)

class CompraMonedaCreate(BaseModel):
    """
    Para iniciar la creación de orden:
    Dependiendo de tu lógica, aquí podrías recibir:
      - id_paquete: int
    En el backend se buscará precio y monedas.
    """
    id_paquete: int

class CompraMonedaRead(CompraMonedaBase):
    """
    Para respuestas de lectura de compras/top-ups.
    Incluye: id_compra, created_at, updated_at.
    """
    id_compra: int
    created_at: datetime
    updated_at: datetime