from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.schemas.ads import AdWatchResponse, CoinBalance
from app.crud.crud_ads import get_or_create_balance, attempt_download, watch_ad
from app.core.security import get_current_active_user

router = APIRouter(
    prefix="/monedas", 
    tags=["Monedas y Anuncios"],
    dependencies=[Depends(get_current_active_user)], # Todos los terminales requieren un usuario activo
    responses={404: {"description": "Not found"}},
)

@router.get("/balance/{id_usuario}", response_model=CoinBalance)
async def get_balance(id_usuario: int, db: AsyncSession = Depends(get_db)):
    balance = get_or_create_balance(db, id_usuario)
    return {"id_usuario": balance.id_usuario, "cantidad_monedas": balance.cantidad_monedas}

@router.post("/descargar/{id_usuario}")
async def descargar_imagen(id_usuario: int, db: AsyncSession = Depends(get_db)):
    if attempt_download(db, id_usuario):
        return {"message": "✅ Imagen disponible. Moneda descontada."}
    raise HTTPException(status_code=402, detail="Sin monedas. Mostrar anuncio al usuario.")

@router.post("/ver-anuncio/{id_usuario}", response_model=AdWatchResponse)
async def ver_anuncio(id_usuario: int, db: AsyncSession = Depends(get_db)):
    resultado = watch_ad(db, id_usuario)
    if not resultado["allowed"]:
        raise HTTPException(status_code=403, detail="Límite de anuncios diarios alcanzado")
    return {
        "message": "✅ Moneda obtenida por ver anuncio.",
        "coins": resultado["coins"],
        "remaining_ads_today": resultado["remaining"]
    }