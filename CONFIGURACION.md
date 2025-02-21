# Configuración del Proyecto Fantasy Tales Universe

## 🔑 Configuración de Firebase

### 1. Crear Proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto: "fantasy-tales-universe"
3. Habilita los siguientes servicios:
   - Authentication
   - Firestore Database
   - Storage

### 2. Configuración de Authentication
```javascript
// Habilitar los siguientes métodos de autenticación:
- Email/Password
- Google Sign-In
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Firebase Config
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=fantasy-tales-universe.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fantasy-tales-universe
VITE_FIREBASE_STORAGE_BUCKET=fantasy-tales-universe.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Configuración de Imágenes
VITE_IMAGE_OPTIMIZATION_QUALITY=80
VITE_MAX_IMAGE_SIZE=5242880 # 5MB
```

### 4. Reglas de Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Perfil de usuario - lectura pública, escritura solo por el propietario
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Historias - lectura pública, escritura autenticada
    match /stories/{storyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'author';
    }
  }
}
```

### 5. Reglas de Storage
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024 // 5MB
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 🎨 Configuración de Three.js

### 1. Optimización de Rendimiento
```typescript
// src/config/three.ts
export const THREE_CONFIG = {
  pixelRatio: window.devicePixelRatio || 1,
  maxParticles: 5000,
  particleSize: 0.05,
  portalRadius: 4,
  cameraPosition: [0, 0, 8],
  cameraFOV: 75
};
```

## 📦 Instalación de Dependencias

```bash
# Instalación de dependencias principales
pnpm install

# Dependencias de desarrollo
pnpm add -D @types/three @types/react-three-fiber

# Dependencias de optimización de imágenes
pnpm add -D sharp imagemin
```

## 🖼️ Configuración de Imágenes

### 1. Dimensiones Requeridas
```javascript
// scripts/imageConfig.js
export const IMAGE_SIZES = {
  story: {
    desktop: { width: 800, height: 600 },
    mobile: { width: 400, height: 300 }
  },
  hero: {
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 960, height: 540 }
  },
  avatar: {
    default: { width: 200, height: 200 },
    thumbnail: { width: 100, height: 100 }
  }
};
```

## 🔒 Seguridad

### 1. Content Security Policy
Agregar al `index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://apis.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://firebasestorage.googleapis.com;
  connect-src 'self' https://*.firebase.com https://*.firebaseio.com;
  frame-src 'self' https://fantasy-tales-universe.firebaseapp.com;
">
```

## 🚀 Scripts de Despliegue

### 1. Configuración de Firebase Hosting
```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 2. Script de Despliegue
```bash
# package.json
{
  "scripts": {
    "deploy": "pnpm build && firebase deploy",
    "deploy:hosting": "pnpm build && firebase deploy --only hosting"
  }
}
```

## 🧪 Configuración de Pruebas

### 1. Setup de Vitest
```typescript
// vitest.setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de Firebase
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  getApp: vi.fn()
}));

// Mock de Three.js
vi.mock('@react-three/fiber', () => ({
  Canvas: vi.fn(({ children }) => <div>{children}</div>),
  useFrame: vi.fn()
}));
```

## 📱 Configuración PWA

### 1. Manifest
```json
// public/manifest.json
{
  "name": "Fantasy Tales Universe",
  "short_name": "FTU",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1f2937",
  "theme_color": "#4f46e5",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🌐 Variables de Entorno por Ambiente

### Development (.env.development)
```env
VITE_API_URL=http://localhost:5173
VITE_ENABLE_REDUX_DEVTOOLS=true
VITE_ENABLE_QUERY_DEVTOOLS=true
```

### Production (.env.production)
```env
VITE_API_URL=https://fantasy-tales-universe.web.app
VITE_ENABLE_REDUX_DEVTOOLS=false
VITE_ENABLE_QUERY_DEVTOOLS=false
```

## 🔧 Comandos de Mantenimiento

```bash
# Optimizar todas las imágenes
pnpm images:all

# Verificar tipos
pnpm type-check

# Lint y formato
pnpm lint
pnpm format

# Pruebas
pnpm test
pnpm test:coverage

# Construir para producción
pnpm build
``` 