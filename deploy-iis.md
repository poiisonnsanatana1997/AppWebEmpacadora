# Guía de Despliegue en IIS

## Prerrequisitos

1. **IIS instalado** en el servidor Windows
2. **URL Rewrite Module** instalado en IIS
3. **Node.js** instalado en el servidor (para el build)
4. **.NET Core Runtime** (si tu API backend está en .NET)

## Pasos para el Despliegue

### 1. Preparar el Build de Producción

```bash
# Instalar dependencias
npm install

# Crear build de producción
npm run build:prod
```

### 2. Configurar IIS

1. **Crear un nuevo sitio web en IIS:**
   - Abrir IIS Manager
   - Click derecho en "Sites" → "Add Website"
   - Nombre: "AppWebEmpacadora"
   - Physical Path: `C:\inetpub\wwwroot\AppWebEmpacadora`
   - Puerto: 80 (o el puerto que prefieras)

2. **Configurar el Application Pool:**
   - Seleccionar el Application Pool del sitio
   - .NET CLR Version: "No Managed Code"
   - Managed Pipeline Mode: "Integrated"

3. **Configurar permisos:**
   - Dar permisos de lectura al usuario IIS_IUSRS en la carpeta del sitio

### 3. Copiar Archivos

1. **Copiar el contenido de la carpeta `dist`** a la carpeta del sitio web en IIS
2. **Asegurarse de que el archivo `web.config`** esté en la raíz del sitio

### 4. Configurar Variables de Entorno

Crear un archivo `.env.production` en la raíz del proyecto con:

```
VITE_API_BASE_URL=https://tu-servidor-api.com/api
VITE_APP_NAME=AppWebEmpacadora
VITE_APP_VERSION=1.0.0
```

### 5. Configurar CORS (si es necesario)

Si tu API está en un dominio diferente, configurar CORS en el backend.

### 6. Verificar la Configuración

1. **Probar el sitio web** en el navegador
2. **Verificar que las rutas funcionen** (React Router)
3. **Probar las llamadas a la API**

## Solución de Problemas Comunes

### Error 404 en rutas de React Router
- Verificar que el archivo `web.config` esté presente
- Asegurarse de que URL Rewrite Module esté instalado

### Error de CORS
- Configurar CORS en el backend
- Verificar que las URLs de la API sean correctas

### Archivos estáticos no se cargan
- Verificar permisos de la carpeta
- Comprobar que las rutas en `web.config` sean correctas

## Comandos Útiles

```bash
# Build para producción
npm run build:prod

# Preview local del build
npm run preview

# Limpiar cache de npm
npm cache clean --force
```

## Notas Importantes

- El archivo `web.config` es esencial para que React Router funcione correctamente
- Asegúrate de que la URL de la API en producción sea correcta
- Considera usar HTTPS en producción
- Configura logs de IIS para debugging 