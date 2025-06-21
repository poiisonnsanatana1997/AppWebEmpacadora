# Configuración de Variables de Entorno

## Descripción General

Este proyecto utiliza variables de entorno para configurar diferentes aspectos de la aplicación según el entorno de ejecución (desarrollo, staging, producción).

## Variables de Entorno Disponibles

### Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base de la API | `https://api.tu-servidor.com/api` |
| `VITE_APP_NAME` | Nombre de la aplicación | `AppWebEmpacadora` |
| `VITE_APP_VERSION` | Versión de la aplicación | `1.0.0` |

### Variables Opcionales

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_APP_ENVIRONMENT` | Entorno de la aplicación | `development` |
| `VITE_AUTH_TIMEOUT` | Timeout de autenticación (ms) | `3600000` |
| `VITE_ENABLE_LOGGING` | Habilitar logging | `true` (dev), `false` (prod) |
| `VITE_LOG_LEVEL` | Nivel de logging | `info` (dev), `error` (prod) |

## Configuración por Entorno

### Desarrollo

Crear archivo `.env.development`:

```bash
VITE_API_BASE_URL=http://localhost:5177/api
VITE_APP_NAME=AppWebEmpacadora (Dev)
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=development
VITE_ENABLE_LOGGING=true
VITE_LOG_LEVEL=info
```

### Staging

Crear archivo `.env.staging`:

```bash
VITE_API_BASE_URL=https://staging-api.tu-servidor.com/api
VITE_APP_NAME=AppWebEmpacadora (Staging)
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=staging
VITE_ENABLE_LOGGING=true
VITE_LOG_LEVEL=warn
```

### Producción

Crear archivo `.env.production`:

```bash
VITE_API_BASE_URL=https://api.tu-servidor.com/api
VITE_APP_NAME=AppWebEmpacadora
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production
VITE_ENABLE_LOGGING=false
VITE_LOG_LEVEL=error
```

## Comandos de Construcción

### Desarrollo
```bash
npm run build:dev
```

### Staging
```bash
npm run build:staging
```

### Producción
```bash
npm run build:prod
```

## Seguridad

### Buenas Prácticas

1. **Nunca incluyas credenciales** en las variables de entorno del frontend
2. **Usa HTTPS** en producción
3. **No commits de archivos .env** (ya están en .gitignore)
4. **Valida las URLs** antes de desplegar

### Archivos a Ignorar

Los siguientes archivos están en `.gitignore`:

```
.env
.env.local
.env.development
.env.staging
.env.production
```

## Validación de Configuración

La aplicación valida automáticamente la configuración al iniciar:

- Verifica que `VITE_API_BASE_URL` esté definida
- Valida que la URL sea válida (comience con `http` o `https`)
- Muestra logs de configuración en desarrollo

## Troubleshooting

### Error: "VITE_API_BASE_URL no está configurada"

**Solución:** Crear el archivo `.env` correspondiente al entorno.

### Error: "VITE_API_BASE_URL debe ser una URL válida"

**Solución:** Verificar que la URL comience con `http://` o `https://`.

### La aplicación no se conecta a la API

**Solución:** 
1. Verificar que la URL de la API sea correcta
2. Comprobar que el servidor esté funcionando
3. Verificar la configuración de CORS en el backend

## Ejemplos de Configuración

### Configuración Local con API Remota

```bash
VITE_API_BASE_URL=https://api.tu-servidor.com/api
VITE_APP_NAME=AppWebEmpacadora (Local)
VITE_APP_VERSION=1.0.0
VITE_ENABLE_LOGGING=true
VITE_LOG_LEVEL=debug
```

### Configuración para Testing

```bash
VITE_API_BASE_URL=https://test-api.tu-servidor.com/api
VITE_APP_NAME=AppWebEmpacadora (Test)
VITE_APP_VERSION=1.0.0
VITE_ENABLE_LOGGING=true
VITE_LOG_LEVEL=debug
``` 