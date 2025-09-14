# Football Core WebApp

## 📋 Descripción

Aplicación web completa para la gestión de ligas de fútbol, que incluye un panel de administración, una API backend, una interfaz web para usuarios y una aplicación móvil.

## 🏗️ Estructura del Proyecto

El proyecto está dividido en cuatro componentes principales:

### 🖥️ Admin (Panel de Administración)
- Tecnología: React + Vite
- Propósito: Interfaz de escritorio para administradores del sistema
- Funcionalidades:
  - Gestión de usuarios y roles
  - Administración de ligas y equipos
  - Control de temporadas y partidos
  - Visualización de estadísticas

### ⚙️ Backend (API)
- Tecnología: FastAPI (Python)
- Propósito: API REST para manejar la lógica de negocio
- Características:
  - Arquitectura modular
  - Autenticación y autorización
  - Operaciones CRUD para todas las entidades
  - Documentación automática con Swagger

### 🌐 Frontend (Web)
- Tecnología: React + Vite
- Propósito: Interfaz web para usuarios finales
- Características:
  - Diseño responsive con TailwindCSS
  - Visualización de datos en tiempo real
  - Seguimiento de ligas y equipos
  - Experiencia de usuario optimizada

### 📱 Mobile (App)
- Tecnología: React Native + Expo
- Propósito: Aplicación móvil para acceso en dispositivos
- Características:
  - Interfaz nativa para iOS y Android
  - Navegación intuitiva
  - Funcionalidades offline
  - Notificaciones push

## 🚀 Inicio Rápido

1. Clona el repositorio:
```bash
git clone [url-del-repositorio]
cd football-core-webapp
```

2. Configura cada componente:

### Admin
```bash
cd admin
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Unix/MacOS
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Mobile
```bash
cd mobiles
npm install
npx expo start
```

## 🔒 Seguridad

- Autenticación JWT en todos los componentes
- Control de acceso basado en roles
- Protección de datos sensibles
- Rate limiting y validación de datos

## 📱 Compatibilidad

- **Web**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Mobile**: iOS 13+ y Android 8+
- **Desktop**: Windows 10+, macOS 10.15+, Linux

## 🧪 Testing

Cada componente incluye su propia suite de tests. Consulta los README individuales para más detalles sobre testing.

## 📝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 👥 Autores

- Nicole Palomino Alvarado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.