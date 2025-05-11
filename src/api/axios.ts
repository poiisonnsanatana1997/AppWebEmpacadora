import axios from 'axios';

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:5177/api', // URL base de la API
  timeout: 10000, // Tiempo máximo de espera para las peticiones (10 segundos)
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
        // Token expirado o inválido
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // No redirigir aquí, dejar que el componente maneje la navegación
      }
    }
    return Promise.reject(error);
  }
);

export default api; 