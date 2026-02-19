import axios from 'axios';
import { config } from '@/config/environment';
import { redirectToLogin } from '../lib/utils';
import { logger, logApiCall } from '../utils/logger';

// Crear una instancia de axios con configuración base usando variables de entorno
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout, // Tiempo máximo de espera para las peticiones
  headers: {
    'Content-Type': 'application/json',
  },
});

// Map para almacenar timestamps de requests sin usar headers
const requestTimestamps = new Map<string, number>();

// Interceptor para agregar el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Guardar timestamp localmente en lugar de como header
    const requestId = `${config.method}-${config.url}-${Date.now()}`;
    requestTimestamps.set(requestId, Date.now());

    // Guardar el ID en metadata para recuperarlo después
    (config as any)._requestId = requestId;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    // Calcular duración usando el timestamp guardado
    const requestId = (response.config as any)._requestId;
    let duration: number | undefined;

    if (requestId && requestTimestamps.has(requestId)) {
      const startTime = requestTimestamps.get(requestId);
      if (startTime) {
        duration = Date.now() - startTime;
      }
      requestTimestamps.delete(requestId); // Limpiar
    }

    logApiCall(
      response.config.method?.toUpperCase() || 'GET',
      response.config.url || '',
      response.status,
      duration
    );

    return response;
  },
  (error) => {
    // Manejar errores específicos
    if (error.response) {
      // Log de error de API
      logApiCall(
        error.config?.method?.toUpperCase() || 'GET',
        error.config?.url || '',
        error.response.status
      );

      // El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response.status === 401) {
        // Verificar si el token realmente expiró antes de borrarlo
        const token = localStorage.getItem('token');
        const expiration = localStorage.getItem('tokenExpiration');

        if (token && expiration) {
          const expirationTime = new Date(expiration).getTime();
          const currentTime = Date.now();

          // Solo borrar el token si realmente expiró
          if (currentTime >= expirationTime) {
            logger.warn('Token expirado, ejecutando logout desde interceptor');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiration');
            // Redirigir al login si el token expiró
            redirectToLogin(true);
          } else {
            logger.warn('Error 401 pero token no expirado, posible problema de permisos');
            // No borrar el token si no expiró, puede ser un problema de permisos
          }
        } else {
          logger.warn('No hay token o expiración, redirigiendo al login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiration');
          redirectToLogin(true);
        }
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta (error de red)
      logger.error('Error de red - no se recibió respuesta del servidor', {
        url: error.config?.url,
        method: error.config?.method
      });
    }
    return Promise.reject(error);
  }
);

export default api; 