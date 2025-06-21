# Despliegue en Subcarpeta (/EMPACADORA/)

Esta guía explica cómo desplegar la aplicación AppWebEmpacadora en una subcarpeta del servidor web.

## Configuración Actual

La aplicación está configurada para funcionar en la subcarpeta `/EMPACADORA/` con las siguientes configuraciones:

### 1. Vite Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  base: '/EMPACADORA/',  // Base path para assets
  // ... resto de configuración
})
```

### 2. React Router (`src/routes/AppRouter.tsx`)

```typescript
<Router basename="/EMPACADORA">
  {/* Rutas de la aplicación */}
</Router>
```

### 3. IIS URL Rewrite (`public/web.config`)

```xml
<action type="Rewrite" url="/EMPACADORA/" />
```

## URLs de Acceso

Con esta configuración, las URLs de acceso serán:

- **Aplicación principal:** `http://localhost/EMPACADORA/`
- **Login:** `http://localhost/EMPACADORA/login`
- **Welcome:** `http://localhost/EMPACADORA/welcome`
- **Dashboard:** `http://localhost/EMPACADORA/dashboard`

## Proceso de Despliegue

### Opción 1: Despliegue Automático con PowerShell

```powershell
# Despliegue a producción
.\deploy.ps1 -Environment production

# Despliegue a staging
.\deploy.ps1 -Environment staging

# Despliegue a desarrollo
.\deploy.ps1 -Environment development
```

### Opción 2: Despliegue Manual

1. **Construir la aplicación:**
```bash
npm run build:prod
```

2. **Crear la carpeta de destino:**
```bash
mkdir C:\inetpub\wwwroot\EMPACADORA
```

3. **Copiar archivos:**
```bash
xcopy dist\* C:\inetpub\wwwroot\EMPACADORA\ /E /Y
```

4. **Verificar web.config:**
Asegúrate de que el archivo `web.config` esté presente en la carpeta de despliegue.

## Configuración del Servidor

### IIS (Internet Information Services)

1. **Crear la carpeta de aplicación:**
   - Crear la carpeta `EMPACADORA` en `C:\inetpub\wwwroot\`

2. **Configurar como aplicación:**
   - En IIS Manager, hacer clic derecho en la carpeta `EMPACADORA`
   - Seleccionar "Convert to Application"
   - Configurar el Application Pool (recomendado: .NET CLR Version: No Managed Code)

3. **Verificar URL Rewrite Module:**
   - Asegúrate de que el URL Rewrite Module esté instalado en IIS
   - El archivo `web.config` ya incluye la configuración necesaria

### Apache

Si usas Apache, necesitarás crear un archivo `.htaccess`:

```apache
RewriteEngine On
RewriteBase /EMPACADORA/
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /EMPACADORA/index.html [L]
```

### Nginx

Para Nginx, configura el `location` block:

```nginx
location /EMPACADORA/ {
    try_files $uri $uri/ /EMPACADORA/index.html;
}
```

## Solución de Problemas

### Error 404 en rutas de React Router

**Síntoma:** Las rutas como `/EMPACADORA/login` devuelven 404.

**Solución:** Verificar que el `web.config` esté configurado correctamente y que el URL Rewrite Module esté instalado.

### Assets no se cargan

**Síntoma:** Los archivos CSS, JS o imágenes no se cargan.

**Solución:** Verificar que la configuración `base: '/EMPACADORA/'` en `vite.config.ts` esté correcta.

### Rutas no funcionan después del refresh

**Síntoma:** Al refrescar la página, las rutas no funcionan.

**Solución:** Verificar que el servidor esté configurado para redirigir todas las rutas a `index.html`.

## Cambiar la Subcarpeta

Si necesitas cambiar la subcarpeta de `/EMPACADORA/` a otra (por ejemplo, `/mi-app/`):

1. **Actualizar `vite.config.ts`:**
```typescript
base: '/mi-app/',
```

2. **Actualizar `AppRouter.tsx`:**
```typescript
<Router basename="/mi-app">
```

3. **Actualizar `web.config`:**
```xml
<action type="Rewrite" url="/mi-app/" />
```

4. **Actualizar `deploy.ps1`:**
```powershell
$DeployPath = "C:\inetpub\wwwroot\mi-app"
```

## Verificación del Despliegue

Después del despliegue, verifica que:

1. ✅ La aplicación carga en `http://localhost/EMPACADORA/`
2. ✅ Las rutas funcionan correctamente
3. ✅ Los assets (CSS, JS, imágenes) se cargan
4. ✅ El refresh de página funciona en todas las rutas
5. ✅ La autenticación funciona correctamente

## Comandos Útiles

```bash
# Construir para diferentes entornos
npm run build:dev      # Desarrollo
npm run build:staging  # Staging
npm run build:prod     # Producción

# Preview local
npm run preview

# Limpiar build
rm -rf dist/
``` 