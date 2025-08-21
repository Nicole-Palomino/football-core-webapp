# tests/test_auth.py
import pytest
from datetime import datetime, timezone
from app.models.user import User  # ajusta según tu modelo
from app.core.password_utils import get_password_hash
from app.crud.crud_refresh_token import create_refresh_token
from sqlalchemy import text

@pytest.mark.asyncio
async def test_login(async_client, test_db):
    # Crear usuario de prueba
    user = User(
        usuario="Nicole Palomino",
        correo="nicolepalominoalvarado@gmail.com",
        contrasena=get_password_hash("Palomino2002"),
        is_active=True,
        id_estado=1, 
        id_rol = 2,
    )
    test_db.add(user)
    await test_db.commit()

    # Hacer login
    response = await async_client.post("/login", data={
        "username": "nicolepalominoalvarado@gmail.com",
        "password": "Palomino2002"
    })

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "expires_in" in data

    refresh_cookie = response.cookies.get("refresh_token")
    assert refresh_cookie is not None
    assert len(refresh_cookie) > 0

@pytest.mark.asyncio
async def test_refresh(async_client, test_db):
    # Limpiar usuarios previos
    await test_db.execute(text("DELETE FROM tb_users"))
    await test_db.execute(text("DELETE FROM tb_refresh_tokens"))
    await test_db.commit()

    # Crear usuario de prueba con correo único
    timestamp = datetime.now(timezone.utc).timestamp()
    unique_email = f"nicolepalomino+{timestamp}@gmail.com"
    user = User(
        usuario=f"Nicole Palomino {timestamp}",
        correo=unique_email,
        contrasena=get_password_hash("Palomino2002"),
        is_active=True,
        id_estado=1,
        id_rol=2,
        registro=datetime.now(timezone.utc),  # <- asegurar UTC aware
        updated_at=datetime.now(timezone.utc) # <- asegurar UTC aware
    )
    test_db.add(user)
    await test_db.commit()
    await test_db.refresh(user)  # user.id_usuario disponible

    # Generar refresh token en DB
    raw_token, db_token = await create_refresh_token(
        db=test_db,
        user_id=user.id_usuario,
        user_agent="pytest",
        ip_address="127.0.0.1"
    )
    await test_db.commit()

    # Llamar al endpoint /refresh usando la cookie
    async_client.cookies.set("refresh_token", raw_token)
    response = await async_client.post("/refresh")
    assert response.status_code == 200

    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "refresh_metadata" in data

@pytest.mark.asyncio
async def test_logout(async_client, test_db):
    # Crear usuario de prueba
    user = User(
        usuario="Nicole Palomino",
        correo="nicolepalominoalvarado@gmail.com",
        contrasena=get_password_hash("Palomino2002"),
        is_active=True,
        id_estado=1, 
        id_rol = 2,
    )
    test_db.add(user)
    await test_db.commit()

    # Login
    login = await async_client.post("/login", data={
        "username": "nicolepalominoalvarado@gmail.com",
        "password": "Palomino2002"
    })
    access_token = login.json()["access_token"]

    # Logout
    response = await async_client.post(
        "/logout",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_read_users_me(async_client, test_db):
    # Limpiar tabla de usuarios
    await test_db.execute(text("DELETE FROM tb_users"))
    await test_db.commit()

    # Crear usuario de prueba
    test_user = {
        "usuario": "user_me_test",
        "correo": "user_me_test@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=test_user)
    assert response.status_code == 201

    # Hacer login para obtener token
    login_data = {
        "username": test_user["correo"],  # si tu login usa correo
        "password": test_user["contrasena"]
    }
    response = await async_client.post("/login", data=login_data)
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Llamar a /users/me/ con token en headers
    headers = {"Authorization": f"Bearer {token}"}
    response = await async_client.get("/users/me/", headers=headers)
    assert response.status_code == 200

    user_data = response.json()
    assert user_data["correo"] == test_user["correo"]
    assert user_data["usuario"] == test_user["usuario"]
    assert "rol" in user_data
    assert "estado" in user_data