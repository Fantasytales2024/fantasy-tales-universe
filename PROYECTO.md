# Fantasy Tales Universe - Documentación del Proyecto

## 🌟 Descripción General
Fantasy Tales Universe es una aplicación web interactiva para explorar y compartir historias fantásticas. El proyecto utiliza React con TypeScript, Firebase para la autenticación y almacenamiento, y Three.js para efectos visuales 3D.

## 🏗️ Estructura del Proyecto

### 1. Componentes Principales

#### Portal Cósmico (`src/components/three/CosmicPortal.tsx`)
- Componente 3D que crea un efecto de portal interactivo
- Utiliza Three.js con React Three Fiber
- Características:
  - Partículas en espiral doradas
  - Interacción con el mouse
  - Efectos de scroll
  - Sistema de partículas flotantes

```typescript
interface CosmicPortalProps {
  mousePosition: { x: number; y: number };
  scrollProgress: number;
}
```

#### Banner Principal (`src/components/home/HeroBanner.tsx`)
- Sección hero con animaciones y efectos visuales
- Integra el portal cósmico con contenido interactivo
- Características:
  - Animaciones con Framer Motion
  - Seguimiento de mouse y scroll
  - Botones de llamada a la acción
  - Canvas 3D integrado

### 2. Sistema de Autenticación

#### Contexto de Autenticación (`src/contexts/AuthContext.tsx`)
- Maneja el estado global de autenticación
- Integración con Firebase Auth
- Funcionalidades:
  - Login con email/password
  - Login con Google
  - Registro de usuarios
  - Persistencia de sesión

#### Modal de Login (`src/components/auth/LoginModal.tsx`)
- Interfaz de usuario para autenticación
- Características:
  - Diseño responsive
  - Animaciones de transición
  - Manejo de errores
  - Alternancia entre login y registro

#### Rutas Protegidas (`src/components/auth/ProtectedRoute.tsx`)
- Componente HOC para proteger rutas
- Redirección automática
- Spinner de carga durante la verificación

### 3. Sistema de Iconos y UI

#### Iconos Cósmicos (`src/components/icons/NodeIconsIconosCósmicos.tsx`)
- Sistema de iconos personalizado
- Props configurables:
  - Tamaños predefinidos (sm, md, lg, xl)
  - Temas de color
  - Accesibilidad integrada
  - Interactividad

```typescript
const sizeMap = {
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64
};
```

#### Elementos UI (`src/components/ui/UiElementsBotonesMarcosYComponentesDeInterfaz.tsx`)
- Componentes de interfaz reutilizables
- Sistema de temas consistente
- Soporte para:
  - Diferentes variantes
  - Temas claro/oscuro
  - Tooltips
  - Estados interactivos

### 4. Configuración y Utilidades

#### Configuración de Firebase (`src/config/firebase.ts`)
- Inicialización de Firebase
- Variables de entorno seguras
- Servicios configurados:
  - Authentication
  - Firestore
  - Storage

#### Configuración de Tailwind (`tailwind.config.js`)
- Sistema de diseño personalizado
- Paleta de colores
- Animaciones personalizadas
- Utilidades CSS

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* ... */ },
      secondary: { /* ... */ }
    },
    animation: {
      'portal-spin': 'spin 20s linear infinite',
      'pulse-slow': 'pulse 3s infinite',
      'float': 'float 6s ease-in-out infinite'
    }
  }
}
```

### 5. Scripts de Utilidad

#### Procesamiento de Imágenes (`scripts/process-images.js`)
- Optimización automática de imágenes
- Generación de versiones responsive
- Manejo de diferentes formatos

#### Conversión de Iconos (`scripts/convert-icons.js`)
- Conversión de imágenes a componentes SVG
- Generación automática de tipos TypeScript
- Sistema de temas integrado

### 6. Pruebas

#### Pruebas de Componentes
- Suite completa de pruebas para:
  - Componentes de UI
  - Sistema de autenticación
  - Iconos y elementos visuales
- Utiliza:
  - Vitest
  - React Testing Library
  - Mocks personalizados

## 🛠️ Tecnologías Principales

- **Frontend**: React, TypeScript, Three.js
- **Estilos**: Tailwind CSS
- **Backend**: Firebase
- **Testing**: Vitest, React Testing Library
- **Animaciones**: Framer Motion
- **3D**: React Three Fiber
- **Optimización**: Sharp, PostCSS

## 📦 Scripts Disponibles

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "test": "vitest",
  "test:coverage": "vitest run --coverage",
  "process-images": "node scripts/process-images.js",
  "optimize-images": "node scripts/optimize-images.js"
}
```

## 🔐 Variables de Entorno Requeridas

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 📝 Convenciones de Código

- Componentes funcionales con TypeScript
- Props tipadas con interfaces
- Nombres descriptivos en español
- Documentación inline para funciones complejas
- Tests unitarios para cada componente
- Manejo de accesibilidad (ARIA) 