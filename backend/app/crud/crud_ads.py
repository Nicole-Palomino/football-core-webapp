from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from app import models

async def get_or_create_balance(db: AsyncSession, id_usuario: int):
    balance = db.query(models.BalanceUsuario).filter_by(id_usuario=id_usuario).first()
    if not balance:
        balance = models.BalanceUsuario(id_usuario=id_usuario, cantidad_monedas=15)
        db.add(balance)
        db.commit()
        db.refresh(balance)
    return balance

async def attempt_download(db: AsyncSession, id_usuario: int) -> bool:
    balance = get_or_create_balance(db, id_usuario)
    if balance.cantidad_monedas > 0:
        balance.cantidad_monedas -= 1
        db.commit()
        return True
    return False

async def watch_ad(db: AsyncSession, id_usuario: int):
    today = date.today()
    ad = db.query(models.AdsWatched).filter_by(id_usuario=id_usuario, fecha=today).first()
    if not ad:
        ad = models.AdsWatched(id_usuario=id_usuario, fecha=today, cantidad=1)
        db.add(ad)
    elif ad.cantidad < 10:
        ad.cantidad += 1
    else:
        return {"allowed": False, "coins": get_or_create_balance(db, id_usuario).cantidad_monedas, "remaining": 0}

    balance = get_or_create_balance(db, id_usuario)
    balance.cantidad_monedas += 1
    db.commit()
    return {"allowed": True, "coins": balance.cantidad_monedas, "remaining": 10 - ad.cantidad}