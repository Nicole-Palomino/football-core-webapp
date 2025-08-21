from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship
from app.database import Base

class RefreshToken(Base):
    __tablename__ = "tb_refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("tb_users.id_usuario"), nullable=False, index=True)

    # Guardamos solo el HASH del refresh token por seguridad
    token_hash = Column(String(255), nullable=False, unique=True, index=True)

    # Rotación/estado
    revoked = Column(Boolean, nullable=False, default=False)
    replaced_by_token_hash = Column(String(255), nullable=True)

    # Metadatos útiles
    user_agent = Column(String(255), nullable=True)
    ip_address = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)

    # relación con tu modelo User
    user = relationship("User", back_populates="refresh_tokens")