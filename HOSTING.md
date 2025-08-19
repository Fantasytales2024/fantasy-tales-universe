# Configuración de Firebase Hosting

## 1. Instalación de Firebase CLI

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Verificar la instalación
firebase --version
```

## 2. Iniciar Sesión en Firebase

```bash
# Iniciar sesión en tu cuenta de Google
firebase login
```

## 3. Inicializar Firebase en el Proyecto

```bash
# Navegar al directorio del proyecto
cd fantasy-tales-universe

# Inicializar Firebase
firebase init

# Seleccionar las siguientes opciones:
# - Hosting: Configure files for Firebase Hosting
# - Use an existing project
# - Seleccionar tu proyecto "fantasy-tales-universe"
# - What do you want to use as your public directory? dist
# - Configure as a single-page app (rewrite all urls to /index.html)? Yes
# - Set up automatic builds and deploys with GitHub? No
```

## 4. Configuración del archivo firebase.json

```json
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
      },
      {
        "source": "**/*.@(js|css)",
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

## 5. Configuración de Scripts en package.json

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "pnpm build && firebase deploy",
    "deploy:hosting": "pnpm build && firebase deploy --only hosting"
  }
}
```

## 6. Configuración de Variables de Entorno

Crear archivo `.env.production`:

```env
VITE_API_URL=https://fantasy-tales-universe.web.app
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=fantasy-tales-universe.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=fantasy-tales-universe
VITE_FIREBASE_STORAGE_BUCKET=fantasy-tales-universe.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

## 7. Despliegue

```bash
# Construir y desplegar
pnpm deploy

# O solo desplegar hosting
pnpm deploy:hosting
```

## 8. Configuración de Dominio Personalizado (Opcional)

1. En la consola de Firebase:
   - Ir a Hosting
   - Clic en "Add custom domain"
   - Seguir las instrucciones para verificar el dominio

2. Configurar registros DNS:
```txt
Tipo    Nombre    Valor
A       @         151.101.1.195
A       @         151.101.65.195
```

## 9. Configuración de SSL (Automático)

Firebase Hosting proporciona SSL automáticamente para:
- Dominio predeterminado (.web.app)
- Dominios personalizados

## 10. Buenas Prácticas

### Caché y Rendimiento
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(js|css|jpg|jpeg|gif|png)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(html|json)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

### Seguridad
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          }
        ]
      }
    ]
  }
}
```

## 11. Monitoreo y Análisis

1. Habilitar Firebase Analytics:
```bash
firebase init analytics
```

2. Agregar código de seguimiento en `index.html`:
```html
<script defer src="/__/firebase/init.js"></script>
```

## 12. Solución de Problemas Comunes

### Error 404 en Rutas
Verificar el archivo `firebase.json`:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Problemas de Caché
Forzar actualización de caché:
```bash
firebase hosting:channel:deploy preview_name
```

### Error en Despliegue
Limpiar caché y reconstruir:
```bash
# Limpiar caché
pnpm clean

# Reconstruir
pnpm build

# Desplegar
firebase deploy --only hosting
``` 