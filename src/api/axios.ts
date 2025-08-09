import axios from 'axios';
import { config } from '@/config/environment';
import { redirectToLogin } from '../lib/utils';

// Crear una instancia de axios con configuración base usando variables de entorno
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout, // Tiempo máximo de espera para las peticiones
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores específicos
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      if (error.response.status === 401) {
        // Verificar si el token realmente expiró antes de borrarlo
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
            // Redirigir al login si el token expiró
            redirectToLogin(true);
          } else {
            console.log('Error 401 pero token no expirado, puede ser un problema de permisos');
            // No borrar el token si no expiró, puede ser un problema de permisos
          }
        } else {
          console.log('No hay token o expiración, redirigiendo al login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiration');
          redirectToLogin(true);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api; 