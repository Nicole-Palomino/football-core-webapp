from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class PaqueteMonedaBase(BaseModel):
    """Esquema base para PaqueteMoneda."""
    nombre: str = Field(..., min_length=1, max_length=100)
    descripcion: Optional[str] = Field(None, max_length=250)
    cantidad_monedas: int = Field(..., ge=1)
    precio: float = Field(..., ge=0)
    activo: bool = True
    paypal_product_id: Optional[str] = Field(None, max_length=100) # Id. de producto/plan de PayPal

class PaqueteMonedaCreate(PaqueteMonedaBase):
    """Esquema para crear un nuevo PaqueteMoneda."""
    # Asegúrese de que paypal_product_id se proporciona si es necesario para su integración de PayPal
    pass

class PaqueteMonedaUpdate(PaqueteMonedaBase):
    """Esquema para actualizar un PaqueteMoneda existente."""
    nombre: Optional[str] = Field(None, min_length=1, max_length=100)
    descripcion: Optional[str] = Field(None, max_length=250)
    cantidad_monedas: Optional[int] = Field(None, ge=1)
    precio: Optional[float] = Field(None, ge=0)
    activo: Optional[bool] = None
    paypal_product_id: Optional[str] = Field(None, max_length=100)

class PaqueteMonedaRead(PaqueteMonedaBase):
    """
    Para respuestas de lectura. Incluye campos de DB.
    """
    id_paquete: int
    created_at: datetime
    updated_at: datetime