# Panel de Administración - Football Core

## 📋 Descripción

Panel de administración desarrollado con React y Vite para el sistema de gestión de ligas de fútbol. Proporciona una interfaz de escritorio para los administradores del sistema.

## 🛠️ Tecnologías

- React 19.1.0
- Vite 7.0.0
- TailwindCSS
- Material-UI
- React Router DOM
- Axios para peticiones HTTP

## 🚀 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Para producción:
```bash
npm run build
npm run preview
```

## 🗂️ Estructura del Proyecto

```
admin/
├── src/
│   ├── assets/        # Recursos estáticos
│   ├── components/    # Componentes reutilizables
│   ├── contexts/      # Contextos de React
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Páginas de la aplicación
│   ├── routers/       # Configuración de rutas
│   ├── services/      # Servicios y API calls
│   └── utils/         # Utilidades y helpers
├── public/           # Archivos públicos
└── index.html        # Punto de entrada HTML
```

## 🔑 Características Principales

- **Gestión de Usuarios y Roles**
  - Creación y edición de usuarios
  - Asignación de roles y permisos
  - Gestión de accesos

- **Administración de Ligas**
  - Creación y configuración de ligas
  - Gestión de temporadas
  - Control de equipos participantes

- **Control de Partidos**
  - Programación de encuentros
  - Registro de resultados
  - Actualización de estadísticas

- **Reportes y Estadísticas**
  - Visualización de datos
  - Generación de informes
  - Análisis de rendimiento

## 🔒 Seguridad

- Autenticación segura
- Control de acceso basado en roles
- Registro de actividades
- Protección de datos sensibles

## 📱 Interfaz de Usuario

El panel está optimizado para:
- Pantallas de escritorio
- Monitores de alta resolución
- Múltiples ventanas

## 🧪 Testing

Ejecutar tests:

```bash
npm run test
```

Con coverage:

```bash
npm run test:coverage
```
