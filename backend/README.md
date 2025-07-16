# Backend API - Football Core

## 📋 Descripción

API REST desarrollada con FastAPI para el sistema de gestión de ligas de fútbol. Proporciona endpoints para todas las operaciones necesarias del sistema.

## 🛠️ Tecnologías

- Python
- FastAPI
- SQLAlchemy (ORM)
- Pydantic
- JWT para autenticación

## 🚀 Instalación

1. Crea un entorno virtual:
```bash
python -m venv venv
```

2. Activa el entorno virtual:
- Windows:
```bash
venv\Scripts\activate
```
- Unix o MacOS:
```bash
source venv/bin/activate
```

3. Instala las dependencias:
```bash
pip install -r requirements.txt
```

4. Configura las variables de entorno:
```bash
cp .env.example .env
# Edita .env con tus configuraciones
```

5. Inicia el servidor de desarrollo:
```bash
./run.sh
# o
uvicorn main:app --reload
```

## 🗂️ Estructura del Proyecto

```
backend/
├── app/
│   ├── core/          # Configuraciones centrales
│   ├── crud/          # Operaciones CRUD
│   ├── models/        # Modelos SQLAlchemy
│   ├── routers/       # Endpoints de la API
│   ├── schemas/       # Esquemas Pydantic
│   └── utils/         # Utilidades
├── database.py        # Configuración de base de datos
├── main.py           # Punto de entrada de la aplicación
└── requirements.txt   # Dependencias del proyecto
```

## 📚 Documentación API

Cuando el servidor está en ejecución, puedes acceder a:

- Documentación Swagger UI: `/docs`
- Documentación ReDoc: `/redoc`

## 🔑 Endpoints Principales

### Autenticación
- POST `/auth/login` - Iniciar sesión
- POST `/auth/refresh` - Refrescar token

### Usuarios
- GET `/users/` - Listar usuarios
- POST `/users/` - Crear usuario
- GET `/users/{id}` - Obtener usuario
- PUT `/users/{id}` - Actualizar usuario
- DELETE `/users/{id}` - Eliminar usuario

### Ligas
- GET `/leagues/` - Listar ligas
- POST `/leagues/` - Crear liga
- GET `/leagues/{id}` - Obtener liga
- PUT `/leagues/{id}` - Actualizar liga
- DELETE `/leagues/{id}` - Eliminar liga

### Equipos
- GET `/teams/` - Listar equipos
- POST `/teams/` - Crear equipo
- GET `/teams/{id}` - Obtener equipo
- PUT `/teams/{id}` - Actualizar equipo
- DELETE `/teams/{id}` - Eliminar equipo

## 🔒 Seguridad

- Autenticación JWT
- Validación de roles y permisos
- Sanitización de datos de entrada
- Rate limiting

## 🧪 Tests

Ejecutar los tests:

```bash
pytest
```

Con cobertura:

```bash
pytest --cov=app tests/
```

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 👥 Autores

- Nicole Palomino Alvarado