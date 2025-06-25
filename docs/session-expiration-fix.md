# Corrección del Problema de Redirección por Expiración de Sesión

## Problema Identificado

La aplicación no redirigía correctamente a `/empacadora/login` cuando expiraba la sesión, sino que intentaba redirigir a `/login`.

## Causa del Problema

La aplicación está configurada con `basename="/empacadora"` en el `BrowserRouter`, pero las redirecciones estaban usando rutas absolutas que no consideraban este basename.

## Solución Implementada

### 1. Configuración Centralizada

Se agregó configuración para el basename en `src/config/environment.ts`:

```typescript
interface EnvironmentConfig {
  app: {
    basename: string; // Nueva propiedad
  };
}
```

### 2. Función de Utilidad

Se creó una función centralizada en `src/lib/utils.ts`:

```typescript
export const redirectToLogin = (forceReload: boolean = false) => {
  const loginPath = `${config.app.basename}/login`;
  
  if (forceReload) {
    window.location.href = loginPath;
  } else {
    window.location.pathname = loginPath;
  }
};
```

### 3. Actualización de Archivos

Se actualizaron los siguientes archivos para usar la nueva función:

- `src/contexts/AuthContext.tsx`
- `src/lib/api.ts`
- `src/api/axios.ts`

### 4. Logs de Depuración

Se agregaron logs para facilitar la depuración:

```typescript
console.log('Verificando expiración del token:', {
  currentTime: new Date(currentTime).toISOString(),
  expirationTime: new Date(expirationTime).toISOString(),
  isExpired: currentTime >= expirationTime
});
```

### 5. Botón de Prueba

Se agregó un botón de prueba en el Dashboard para simular la expiración de sesión.

## Variables de Entorno

Se agregó la variable `VITE_APP_BASENAME` en `env.example`:

```env
VITE_APP_BASENAME=/empacadora
```

## Puntos de Verificación de Expiración

1. **Al cargar la aplicación**: Verifica si el token existe y no ha expirado
2. **Verificación periódica**: Cada minuto verifica la expiración del token
3. **Interceptores de Axios**: Manejan respuestas 401 del servidor
4. **Rutas protegidas**: Verifican autenticación antes de renderizar

## Cómo Probar

1. Inicia sesión en la aplicación
2. Ve al Dashboard
3. Usa el botón "Probar Expiración de Sesión" para simular la expiración
4. Verifica que redirija correctamente a `/empacadora/login`

## Logs de Depuración

Los logs aparecerán en la consola del navegador para ayudar a diagnosticar problemas:

- Verificación de token al cargar
- Verificación periódica de expiración
- Proceso de redirección
- Errores de autenticación

## Consideraciones Adicionales

- La función `redirectToLogin(true)` fuerza una recarga completa de la página
- Los componentes que usan `navigate()` de React Router no necesitan cambios
- El basename se puede configurar por entorno usando variables de entorno 