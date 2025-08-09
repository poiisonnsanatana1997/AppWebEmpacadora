# Solución al Problema de Pérdida de Sesión en Módulos de Órdenes de Entrada y Productos

## Problema Identificado

Al entrar a los módulos de **Órdenes de Entrada** y **Productos**, la información de sesión (token, user) se borraba automáticamente, causando que el usuario fuera redirigido al login.

## Causa Raíz

El problema se debía a **dos instancias duplicadas de axios** con interceptores que manejaban errores 401 de manera diferente:

1. **`src/api/axios.ts`** - Instancia principal usada por la mayoría de servicios
2. **`src/lib/api.ts`** - Instancia duplicada con interceptores conflictivos

### Problemas Específicos:

1. **Interceptores Conflictivos**: Ambas instancias tenían interceptores que borraban el token en errores 401 sin verificar si realmente había expirado.

2. **Manejo Inadecuado de Errores**: Los interceptores no distinguían entre:
   - Token realmente expirado
   - Errores de permisos (401 por falta de permisos)
   - Errores de red temporales

3. **Verificación de Expiración**: No se verificaba la fecha de expiración del token antes de borrarlo.

## Solución Implementada

### 1. Consolidación de Instancias de Axios

**Antes:**
```typescript
// src/api/axios.ts - Instancia principal
// src/lib/api.ts - Instancia duplicada con interceptores conflictivos
```

**Después:**
```typescript
// src/api/axios.ts - Única instancia con interceptores mejorados
// src/lib/api.ts - Re-exporta la instancia principal
```

### 2. Mejora del Interceptor de Respuesta

```typescript
// Interceptor mejorado que verifica la expiración real del token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      const expiration = localStorage.getItem('tokenExpiration');
      
      if (token && expiration) {
        const expirationTime = new Date(expiration).getTime();
        const currentTime = new Date().getTime();
        
        // Solo borrar el token si realmente expiró
        if (currentTime >= expirationTime) {
          console.log('Token expirado, ejecutando logout desde interceptor');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiration');
          redirectToLogin(true);
        } else {
          console.log('Error 401 pero token no expirado, puede ser un problema de permisos');
          // No borrar el token si no expiró
        }
      }
    }
    return Promise.reject(error);
  }
);
```

### 3. Mejora del Manejo de Errores en Hooks

**En `useProductos.ts` y `useOrdenesEntrada.ts`:**
```typescript
try {
  // ... operaciones de API
} catch (error: any) {
  console.error('Error en operación:', error);
  // No establecer error si es un error de autenticación (401)
  // ya que el interceptor de axios se encargará de manejar la sesión
  if (error?.response?.status !== 401) {
    setError('Error en la operación. Por favor, intenta nuevamente.');
  }
}
```

### 4. Mejora del AuthContext

- **Mejor logging** para debug
- **Manejo de errores** al parsear datos del usuario
- **Verificación más robusta** de la expiración del token

## Beneficios de la Solución

1. **Eliminación de Conflictos**: Una sola instancia de axios evita comportamientos inesperados.

2. **Manejo Inteligente de Errores 401**: Solo se borra la sesión cuando el token realmente expira.

3. **Mejor Experiencia de Usuario**: Los usuarios no son redirigidos al login innecesariamente.

4. **Debugging Mejorado**: Logs detallados para identificar problemas de sesión.

5. **Robustez**: Manejo de errores más robusto en todos los módulos.

## Archivos Modificados

- `src/api/axios.ts` - Interceptor mejorado
- `src/lib/api.ts` - Eliminación de instancia duplicada
- `src/contexts/AuthContext.tsx` - Mejor manejo de sesión
- `src/hooks/Productos/useProductos.ts` - Manejo de errores mejorado
- `src/hooks/OrdenesEntrada/useOrdenesEntrada.ts` - Manejo de errores mejorado
- `src/pages/Productos.tsx` - Visualización de errores

## Pruebas Recomendadas

1. **Verificar que la sesión se mantiene** al navegar entre módulos
2. **Probar con token expirado** para confirmar que se redirige correctamente
3. **Verificar logs en consola** para confirmar el comportamiento esperado
4. **Probar con errores de red** para confirmar que no se borra la sesión innecesariamente

## Notas Importantes

- Los errores 401 que no son por expiración de token (ej: falta de permisos) no borrarán la sesión
- Se mantiene el logging detallado para facilitar el debugging
- La solución es compatible con todos los módulos existentes 