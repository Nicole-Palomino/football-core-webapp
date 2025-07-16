# Panel de Administración - Football Core

## 📋 Descripción

Panel de administración de escritorio construido con Electron.js para gestionar todos los aspectos del sistema de ligas de fútbol.

## 🛠️ Tecnologías

- Electron.js v28.0.0
- HTML5
- CSS3
- JavaScript (ES6+)

## 🚀 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia la aplicación en modo desarrollo:
```bash
npm start
```

## 📦 Construir para Producción

Para crear un ejecutable para distribución:

```bash
npm run build
```

Esto generará los archivos de distribución en la carpeta `dist/`.

## 🗂️ Estructura del Proyecto

```
admin/
├── components/     # Componentes HTML reutilizables
├── css/           # Estilos CSS
├── images/        # Imágenes y recursos
├── js/            # Scripts JavaScript
│   ├── js-dashboard.js
│   ├── js-leagues.js
│   ├── js-login.js
│   └── ...
├── utils/         # Utilidades y funciones helper
└── views/         # Páginas HTML
    ├── dashboard.html
    ├── leagues.html
    └── ...
```

## 🔑 Características Principales

- **Gestión de Usuarios y Roles**
  - Crear y administrar usuarios
  - Asignar roles y permisos

- **Administración de Ligas**
  - Crear y gestionar ligas
  - Configurar temporadas
  - Administrar equipos

- **Control de Partidos**
  - Programar partidos
  - Registrar resultados
  - Gestionar estadísticas

- **Reportes y Estadísticas**
  - Visualizar estadísticas
  - Generar reportes

## 🔒 Seguridad

- Autenticación segura
- Gestión de sesiones
- Validación de permisos por rol

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