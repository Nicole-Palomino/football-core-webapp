# Aplicación Móvil - Football Core

## 📋 Descripción

Aplicación móvil desarrollada con React Native y Expo para el sistema de gestión de ligas de fútbol. Proporciona acceso móvil a las funcionalidades principales del sistema.

## 🛠️ Tecnologías

- React Native
- Expo SDK 53.0.17
- React Navigation 7.x
- Expo Router 5.1.3
- Vector Icons
- Expo Modules (Blur, Haptics, Image)

## 🚀 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npx expo start
```

3. Opciones de ejecución:
- Presiona `a` para Android
- Presiona `i` para iOS
- Presiona `w` para web

## 🗂️ Estructura del Proyecto

```
mobiles/
├── app/              # Código principal de la aplicación
│   ├── (tabs)/       # Navegación por pestañas
│   └── _layout.tsx   # Layout principal
├── assets/           # Recursos estáticos
│   ├── fonts/        # Fuentes personalizadas
│   └── images/       # Imágenes
├── components/       # Componentes reutilizables
│   ├── ui/           # Componentes de UI
│   └── ...           # Otros componentes
├── constants/        # Constantes y configuración
└── hooks/            # Custom hooks
```

## 🔑 Características Principales

- **Interfaz Nativa**
  - Diseño adaptativo iOS/Android
  - Gestos nativos
  - Animaciones fluidas

- **Navegación**
  - Navegación por pestañas
  - Stack navigation
  - Deep linking

- **Funcionalidades**
  - Autenticación segura
  - Modo offline
  - Notificaciones push
  - Caché de datos

- **Optimización**
  - Lazy loading
  - Memoria optimizada
  - Rendimiento nativo

## 📱 Desarrollo

### Requisitos Previos

- Node.js
- npm o yarn
- Expo CLI
- iOS Simulator (macOS) o Android Studio

### Comandos Útiles

```bash
# Iniciar en modo desarrollo
npx expo start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en web
npm run web

# Limpiar caché
npm run reset-project
```

## 🔒 Seguridad

- Almacenamiento seguro
- Encriptación de datos sensibles
- Validación de tokens
- Protección contra inyecciones

## 📦 Build y Publicación

### Android
```bash
eas build -p android
```

### iOS
```bash
eas build -p ios
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Modo watch
npm test:watch

# Coverage
npm test:coverage
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
