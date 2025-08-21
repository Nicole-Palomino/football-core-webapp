import pytest
from unittest.mock import patch
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from datetime import datetime, timezone

@pytest.mark.asyncio
async def test_register_user(async_client: AsyncClient, test_db: AsyncSession):
    # Limpiar tabla de usuarios antes de la prueba
    await test_db.execute(text("DELETE FROM tb_users"))
    await test_db.commit()

    timestamp = datetime.now(timezone.utc).timestamp()
    user_data = {
        "usuario": f"testuser_{timestamp}",
        "correo": f"test_{timestamp}@example.com",
        "contrasena": "Password123!"
    }

    # Registro exitoso
    response = await async_client.post("/register", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["correo"] == user_data["correo"]
    assert data["usuario"] == user_data["usuario"]
    assert "id_usuario" in data
    assert "rol" in data
    assert "estado" in data

    # Intento con correo duplicado
    user_data2 = {
        "usuario": f"anotheruser_{timestamp}",
        "correo": user_data["correo"],  # mismo correo
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=user_data2)
    assert response.status_code == 400
    assert response.json()["detail"] == "El correo ya está registrado."

    # Intento con usuario duplicado
    user_data3 = {
        "usuario": user_data["usuario"],  # mismo usuario
        "correo": f"unique_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=user_data3)
    assert response.status_code == 400
    assert response.json()["detail"] == "El nombre de usuario ya está en uso."

@pytest.mark.asyncio
async def test_register_user_admin(async_client: AsyncClient, test_db):
    # Limpiar tabla de usuarios antes de la prueba
    await test_db.execute(text("DELETE FROM tb_users"))
    await test_db.commit()

    timestamp = datetime.now(timezone.utc).timestamp()
    user_data = {
        "usuario": f"adminuser_{timestamp}",
        "correo": f"admin_{timestamp}@example.com",
        "contrasena": "AdminPass123!"
    }

    # --- Sobrescribir current_user para simular un admin ---
    async def mock_current_admin_user():
        from app.schemas.user import User
        return User(
            id_usuario=999,
            usuario="superadmin",
            correo="superadmin@test.com",
            is_active=True,
            registro=datetime.now(timezone.utc),
            rol={"id_rol": 2, "nombre_rol": "Administrador"},
            estado={"id_estado": 10, "nombre_estado": "Usuario Free"},
            updated_at=None
        )
    from main import app as fastapi_app
    from app.core.security import get_current_admin_user
    fastapi_app.dependency_overrides[get_current_admin_user] = mock_current_admin_user

    # Registro exitoso
    response = await async_client.post("/register-admin", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["correo"] == user_data["correo"]
    assert data["usuario"] == user_data["usuario"]
    assert "id_usuario" in data
    assert "rol" in data and data["rol"]["nombre_rol"] == "Administrador"
    assert "estado" in data

    # Intento con correo duplicado
    user_data2 = {
        "usuario": f"anotheradmin_{timestamp}",
        "correo": user_data["correo"],  # mismo correo
        "contrasena": "AdminPass123!"
    }
    response = await async_client.post("/register-admin", json=user_data2)
    assert response.status_code == 400
    assert response.json()["detail"] == "El correo ya está registrado."

    # Intento con usuario duplicado
    user_data3 = {
        "usuario": user_data["usuario"],  # mismo usuario
        "correo": f"uniqueadmin_{timestamp}@example.com",
        "contrasena": "AdminPass123!"
    }
    response = await async_client.post("/register-admin", json=user_data3)
    assert response.status_code == 400
    assert response.json()["detail"] == "El nombre de usuario ya está en uso."

    # Limpiar override
    fastapi_app.dependency_overrides.pop(get_current_admin_user, None)

@pytest.mark.asyncio
async def test_request_password_reset(async_client, test_db):
    # Limpiar tabla de usuarios antes de la prueba
    await test_db.execute(text("DELETE FROM tb_users"))
    await test_db.commit()

    # Insertar usuario de prueba
    timestamp = datetime.now(timezone.utc).timestamp()
    test_user = {
        "usuario": f"resetuser_{timestamp}",
        "correo": f"reset_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=test_user)
    assert response.status_code == 201
    user_data = response.json()

    # Mockear el envío de correo
    with patch("app.utils.email_sender.send_email") as mock_send_email:
        mock_send_email.return_value = None  # no hace nada

        # Solicitar código de recuperación
        response = await async_client.post("/request-password-reset", json={"correo": test_user["correo"]})
        assert response.status_code == 200
        data = response.json()
        assert "Código de verificación enviado" in data["message"]

    # Intentar con correo que no existe
    response = await async_client.post("/request-password-reset", json={"correo": "noexiste@example.com"})
    assert response.status_code == 404
    assert response.json()["detail"] == "Usuario no encontrado."

@pytest.mark.asyncio
async def test_verify_password_code_and_reset(async_client, test_db):
    # Limpiar tabla de usuarios antes de la prueba
    await test_db.execute(text("DELETE FROM tb_users"))
    await test_db.commit()

    # Insertar usuario de prueba
    timestamp = datetime.now(timezone.utc).timestamp()
    test_user = {
        "usuario": f"testuser_{timestamp}",
        "correo": f"test_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=test_user)
    assert response.status_code == 201

    # Solicitar código de recuperación (mockeando envío de correo)
    with patch("app.utils.email_sender.send_email") as mock_send_email:
        mock_send_email.return_value = None
        response = await async_client.post("/request-password-reset", json={"correo": test_user["correo"]})
        assert response.status_code == 200

    # Obtener usuario actualizado de la DB para obtener el código
    result = await test_db.execute(
        text(f"SELECT codigo_verificacion, expiracion FROM tb_users WHERE correo='{test_user['correo']}'")
    )
    user_row = result.first()
    codigo = user_row.codigo_verificacion

    # ✅ Test /verify-password-code con código correcto
    response = await async_client.post("/verify-password-code", json={
        "correo": test_user["correo"],
        "codigo_verificacion": codigo
    })
    assert response.status_code == 200
    assert response.json()["message"] == "Código verificado exitosamente."

    # ❌ Test /verify-password-code con código incorrecto
    response = await async_client.post("/verify-password-code", json={
        "correo": test_user["correo"],
        "codigo_verificacion": 123456
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Código de verificación incorrecto."

    # ✅ Test /reset-password con código correcto
    new_password = "NewPassword123!"
    response = await async_client.post("/reset-password", json={
        "correo": test_user["correo"],
        "codigo_verificacion": codigo,
        "nueva_contrasena": new_password
    })
    assert response.status_code == 200
    assert response.json()["message"] == "Contraseña restablecida exitosamente."

    # ❌ Test /reset-password con código ya usado
    response = await async_client.post("/reset-password", json={
        "correo": test_user["correo"],
        "codigo_verificacion": codigo,
        "nueva_contrasena": "OtraPass123!"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Código inválido o expirado. Solicite uno nuevo."