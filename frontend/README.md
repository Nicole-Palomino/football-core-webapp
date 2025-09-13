# Frontend Web - Football Core

## 📋 Descripción

Aplicación web desarrollada con React y Vite para el sistema de gestión de ligas de fútbol. Proporciona una interfaz moderna y responsive para los usuarios finales.

## 🛠️ Tecnologías

- React 19.1.0
- Vite 7.0.0
- TailwindCSS 4.1.11
- Material-UI 7.2.0
- React Router DOM 7.6.3
- Axios para peticiones HTTP
- Framer Motion para animaciones

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
frontend/
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

### Visualización de Datos
- Estadísticas en tiempo real
- Gráficos interactivos
- Tablas de posiciones
- Calendarios de partidos

### Gestión de Equipos
- Perfiles de equipos
- Plantillas de jugadores
- Estadísticas por equipo
- Historial de partidos

### Seguimiento de Ligas
- Múltiples ligas
- Temporadas activas
- Clasificaciones
- Resultados en vivo

### Experiencia de Usuario
- Diseño responsive
- Temas claros y oscuros
- Animaciones fluidas
- Navegación intuitiva

## 🔒 Seguridad

### Autenticación
- JWT (JSON Web Tokens)
- Persistencia de sesión
- Rutas protegidas

### Protección de Datos
- Validación de formularios
- Sanitización de datos
- Manejo de errores
- Rate limiting

## 📱 Responsive Design

La aplicación está optimizada para:
- Dispositivos móviles (>320px)
- Tablets (>768px)
- Escritorio (>1024px)
- Pantallas grandes (>1440px)

## 🧪 Testing

Ejecutar tests:

```bash
npm run test
```

Con coverage:

```bash
npm run test:coverage
```

## 📝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
