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

@pytest.mark.asyncio
async def test_read_users_requires_admin(async_client, test_db):
    # Limpiar tabla de usuarios
    await test_db.execute(text("DELETE FROM tb_users"))
    await test_db.commit()

    timestamp = datetime.now(timezone.utc).timestamp()

    # 1. Crear usuario normal
    user_data = {
        "usuario": f"user_{timestamp}",
        "correo": f"user_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=user_data)
    assert response.status_code == 201

    # Login como usuario normal → debe fallar al acceder a /users
    response = await async_client.post("/login", data={
        "username": user_data["correo"],
        "password": user_data["contrasena"]
    })
    assert response.status_code == 200
    normal_token = response.json()["access_token"]

    response = await async_client.get(
        "/users/",
        headers={"Authorization": f"Bearer {normal_token}"}
    )
    assert response.status_code == 403  # usuario sin permisos

    # 2. Convertir ese usuario en admin (actualizar DB directamente)
    await test_db.execute(
        text("UPDATE tb_users SET id_rol = 2 WHERE correo = :correo"),
        {"correo": user_data["correo"]}
    )
    await test_db.commit()

    # Login de nuevo, ahora como admin
    response = await async_client.post("/login", data={
        "username": user_data["correo"],
        "password": user_data["contrasena"]
    })
    assert response.status_code == 200
    admin_token = response.json()["access_token"]

    # Acceder a /users como admin → debe funcionar
    response = await async_client.get(
        "/users/",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_read_user_by_id_requires_admin(async_client, test_db):
    # Limpiar tabla de usuarios
    await test_db.execute(text("DELETE FROM tb_users"))
    await test_db.commit()

    timestamp = datetime.now(timezone.utc).timestamp()

    # 1. Crear usuario normal
    user_data = {
        "usuario": f"user_{timestamp}",
        "correo": f"user_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=user_data)
    assert response.status_code == 201

    # Login como usuario normal
    response = await async_client.post("/login", data={
        "username": user_data["correo"],
        "password": user_data["contrasena"]
    })
    assert response.status_code == 200
    normal_token = response.json()["access_token"]

    # Intentar acceder a /users/{id} → debe fallar con 403
    response = await async_client.get(
        "/users/1",
        headers={"Authorization": f"Bearer {normal_token}"}
    )
    assert response.status_code == 403  # usuario sin permisos

    # 2. Convertir ese usuario en admin
    await test_db.execute(
        text("UPDATE tb_users SET id_rol = 2 WHERE correo = :correo"),
        {"correo": user_data["correo"]}
    )
    await test_db.commit()

    # Login de nuevo, ahora como admin
    response = await async_client.post("/login", data={
        "username": user_data["correo"],
        "password": user_data["contrasena"]
    })
    assert response.status_code == 200
    admin_token = response.json()["access_token"]

    # Acceder a /users/{id} como admin → debe devolver 200
    response = await async_client.get(
        "/users/1",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id_usuario"] == 1
    assert data["correo"] == user_data["correo"]

@pytest.mark.asyncio
async def test_read_user_by_id_not_found(async_client, test_db):
    # Limpiar tabla de usuarios
    await test_db.execute(text("DELETE FROM tb_users"))
    await test_db.commit()

    timestamp = datetime.now(timezone.utc).timestamp()

    # Crear y promover a admin
    user_data = {
        "usuario": f"admin_{timestamp}",
        "correo": f"admin_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=user_data)
    assert response.status_code == 201

    await test_db.execute(
        text("UPDATE tb_users SET id_rol = 2 WHERE correo = :correo"),
        {"correo": user_data["correo"]}
    )
    await test_db.commit()

    # Login como admin
    response = await async_client.post("/login", data={
        "username": user_data["correo"],
        "password": user_data["contrasena"]
    })
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Buscar ID inexistente → debe dar 404
    response = await async_client.get(
        "/users/9999",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Usuario no encontrado"

@pytest.mark.asyncio
async def test_update_user_not_found(async_client, test_db):
    # Limpiar tabla de usuarios
    await test_db.execute(text("DELETE FROM tb_users"))
    await test_db.commit()

    timestamp = datetime.now(timezone.utc).timestamp()

    # Crear y promover a admin
    user_data = {
        "usuario": f"admin_{timestamp}",
        "correo": f"admin_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=user_data)
    assert response.status_code == 201

    await test_db.execute(
        text("UPDATE tb_users SET id_rol = 2 WHERE correo = :correo"),
        {"correo": user_data["correo"]}
    )
    await test_db.commit()

    # Login como admin
    response = await async_client.post("/login", data={
        "username": user_data["correo"],
        "password": user_data["contrasena"]
    })
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Intentar actualizar un usuario inexistente
    update_data = {
        "usuario": "new_name",
        "correo": "new_email@example.com"
    }
    response = await async_client.put(
        "/users/9999",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Usuario no encontrado"

@pytest.mark.asyncio
async def test_update_user_success(async_client, test_db):
    # Crear usuario normal
    timestamp = datetime.now(timezone.utc).timestamp()
    user_data = {
        "usuario": f"user_{timestamp}",
        "correo": f"user_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=user_data)
    assert response.status_code == 201

    # Promover a admin
    await test_db.execute(
        text("UPDATE tb_users SET id_rol = 2 WHERE correo = :correo"),
        {"correo": user_data["correo"]}
    )
    await test_db.commit()

    # Login como admin
    response = await async_client.post("/login", data={
        "username": user_data["correo"],
        "password": user_data["contrasena"]
    })
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Crear otro usuario a actualizar
    update_target = {
        "usuario": f"target_{timestamp}",
        "correo": f"target_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=update_target)
    assert response.status_code == 201
    target_id = response.json()["id_usuario"]

    # Actualizar datos
    new_data = {
        "usuario": "nuevo_nombre",
        "correo": "nuevo_correo@example.com"
    }
    response = await async_client.put(
        f"/users/{target_id}",
        json=new_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    # Verificaciones
    assert response.status_code == 200
    body = response.json()
    assert body["usuario"] == "nuevo_nombre"
    assert body["correo"] == "nuevo_correo@example.com"
    assert "id_usuario" in body

@pytest.mark.asyncio
async def test_update_user_admin_success(async_client: AsyncClient, test_db: AsyncSession):
    # Crear usuario normal (que luego será promovido a admin)
    timestamp = datetime.now(timezone.utc).timestamp()
    user_data = {
        "usuario": f"user_{timestamp}",
        "correo": f"user_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=user_data)
    assert response.status_code == 201

    # Promoverlo a admin (id_rol=2 en tus seeds corresponde a "Administrador")
    await test_db.execute(
        text("UPDATE tb_users SET id_rol = 2 WHERE correo = :correo"),
        {"correo": user_data["correo"]}
    )
    await test_db.commit()

    # Login como admin
    response = await async_client.post("/login", data={
        "username": user_data["correo"],
        "password": user_data["contrasena"]
    })
    assert response.status_code == 200
    token = response.json()["access_token"]

    # Crear otro usuario que será actualizado
    update_target = {
        "usuario": f"target_{timestamp}",
        "correo": f"target_{timestamp}@example.com",
        "contrasena": "Password123!"
    }
    response = await async_client.post("/register", json=update_target)
    assert response.status_code == 201
    target_id = response.json()["id_usuario"]

    # Datos de actualización (usando todos los campos posibles del esquema UserUpdateAdmin)
    new_data = {
        "usuario": "nuevo_usuario",
        "correo": "nuevo_correo@example.com",
        "nombre": "Nuevo Nombre",
        "contrasena": "NuevaPassword123!",
        "is_active": False,
        "id_estado": 1,   # este sí existe porque lo insertaste en conftest.py
        "id_rol": 1       # este también existe: "Editor"
    }

    # Hacer la actualización vía endpoint de admin
    response = await async_client.put(
        f"/users/admin/{target_id}",
        json=new_data,
        headers={"Authorization": f"Bearer {token}"}
    )

    # Validaciones
    assert response.status_code == 200, response.text
    body = response.json()

    assert body["usuario"] == "nuevo_usuario"
    assert body["correo"] == "nuevo_correo@example.com"
    assert body["nombre"] == "Nuevo Nombre"
    assert not body["is_active"]   # debe ser booleano
    assert body["id_estado"] == 1
    assert body["id_rol"] == 1

@pytest.mark.asyncio
async def test_delete_user_admin_success(async_client, test_db):
    # Crear usuario admin
    user_admin = {"usuario": "admin", "correo": "admin@example.com", "contrasena": "Password123!"}
    response = await async_client.post("/register", json=user_admin)
    assert response.status_code == 201

    # Promover a admin
    await test_db.execute(
        text("UPDATE tb_users SET id_rol = 2 WHERE correo = :correo"), {"correo": user_admin["correo"]}
    )
    await test_db.commit()

    # Login admin
    resp_login = await async_client.post("/login", data={"username": user_admin["correo"], "password": user_admin["contrasena"]})
    token = resp_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Crear usuario a eliminar
    target_user = {"usuario": "user_delete", "correo": "delete@example.com", "contrasena": "Password123!"}
    resp_target = await async_client.post("/register", json=target_user)
    target_id = resp_target.json()["id_usuario"]

    # Borrar usuario
    resp_delete = await async_client.delete(f"/users/{target_id}", headers=headers)
    assert resp_delete.status_code == 200  # o 204 según la versión

@pytest.mark.asyncio
async def test_get_total_users_and_stats(async_client, test_db):
    # 1️⃣ Crear usuario admin
    admin_data = {
        "usuario": "admin_stats",
        "correo": "admin_stats@example.com",
        "contrasena": "Password123!"
    }
    resp = await async_client.post("/register", json=admin_data)
    assert resp.status_code == 201

    # 2️⃣ Promover a admin
    await test_db.execute(
        text("UPDATE tb_users SET id_rol = 2, id_estado = 1, registro = :registro WHERE correo = :correo"),
        {"correo": admin_data["correo"], "registro": datetime.now(timezone.utc)}
    )
    await test_db.commit()

    # 3️⃣ Login admin
    resp_login = await async_client.post("/login", data={"username": admin_data["correo"], "password": admin_data["contrasena"]})
    assert resp_login.status_code == 200
    token = resp_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 4️⃣ Insertar algunos usuarios de prueba para estadísticas
    for i in range(3):
        ts = datetime.now(timezone.utc)
        await test_db.execute(
            text("INSERT INTO tb_users (usuario, correo, contrasena, id_rol, id_estado, registro) "
                 "VALUES (:usuario, :correo, :contrasena, 3, 1, :registro)"),
            {"usuario": f"user{i}", "correo": f"user{i}@example.com", "contrasena": "Password123!", "registro": ts}
        )
    await test_db.commit()

    # 5️⃣ Testear endpoint total users
    resp_total = await async_client.get("/users/stats/total", headers=headers)
    assert resp_total.status_code == 200
    total_users = resp_total.json()
    assert total_users >= 4  # admin + 3 usuarios insertados

    # 6️⃣ Testear endpoint usuarios por día
    resp_stats = await async_client.get("/users/stats/usuarios-por-dia", headers=headers)
    assert resp_stats.status_code == 200
    data = resp_stats.json()
    assert isinstance(data, list)
    for item in data:
        assert "fecha" in item and "cantidad" in item
        assert item["cantidad"] >= 1
