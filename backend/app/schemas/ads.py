from pydantic import BaseModel

class AdWatchResponse(BaseModel):
    message: str
    coins: int
    remaining_ads_today: int

class CoinBalance(BaseModel):
    id_usuario: int
    cantidad_monedas: int