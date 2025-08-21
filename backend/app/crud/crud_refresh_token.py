import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.refresh_token import RefreshToken
from app.core.config import settings

# --- helpers hashing ---
def _hash_token(raw_token: str) -> str:
    # Hash rápido y suficiente (puedes usar bcrypt/argon2 si quieres más seguridad)
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

def generate_raw_refresh_token() -> str:
    # Token seguro y URL-safe
    return secrets.token_urlsafe(64)

# used int auth.py
# --- create ---
async def create_refresh_token(
    db: AsyncSession,
    user_id: int,
    user_agent: str | None,
    ip_address: str | None,
) -> tuple[str, RefreshToken]:
    raw_token = generate_raw_refresh_token()
    token_hash = _hash_token(raw_token)
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    db_obj = RefreshToken(
        user_id=user_id,
        token_hash=token_hash,
        revoked=False,
        replaced_by_token_hash=None,
        user_agent=user_agent,
        ip_address=ip_address,
        expires_at=expires_at,
    )
    db.add(db_obj)
    await db.flush()   # Para obtener ID si lo necesitas
    return raw_token, db_obj

# used
# --- get by raw token (sin validar expiración/estado) ---
async def get_token_by_raw(db: AsyncSession, raw_token: str) -> RefreshToken | None:
    token_hash = _hash_token(raw_token)
    q = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    res = await db.execute(q)
    return res.scalar_one_or_none()

# used
# --- get valid token (verifica expiración y estado) ---
async def get_valid_token(db: AsyncSession, raw_token: str) -> RefreshToken | None:
    token = await get_token_by_raw(db, raw_token)
    if not token:
        return None

    token_expires = token.expires_at
    if token_expires.tzinfo is None:
        token_expires = token_expires.replace(tzinfo=timezone.utc)

    if token.revoked or token_expires < datetime.now(timezone.utc):
        return None
    return token

# used
# --- revoke ---
async def revoke_token(db: AsyncSession, token: RefreshToken):
    token.revoked = True
    await db.flush()
    await db.commit()

# --- revoke all for user (logout global) ---
async def revoke_all_user_tokens(db: AsyncSession, user_id: int):
    q = update(RefreshToken).where(RefreshToken.user_id == user_id).values(revoked=True)
    await db.execute(q)
    await db.commit()

# used
# --- rotate (revocar actual y crear nuevo) ---
async def rotate_refresh_token(
    db: AsyncSession,
    current_token: RefreshToken,
    user_agent: str | None,
    ip_address: str | None,
) -> tuple[str, RefreshToken]:
    # Revocamos actual
    await revoke_token(db, current_token)

    # Creamos nuevo
    raw_new, new_token = await create_refresh_token(
        db, user_id=current_token.user_id,
        user_agent=user_agent,
        ip_address=ip_address,
    )
    # Relacionamos el reemplazo
    current_token.replaced_by_token_hash = new_token.token_hash
    await db.flush()
    return raw_new, new_token
