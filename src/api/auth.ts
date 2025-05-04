import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

/**
 * Servicio para manejar la autenticación
 */
const authService = {
  /**
   * Inicia sesión con las credenciales proporcionadas
   * @param credentials Credenciales de inicio de sesión
   * @returns Promesa con la respuesta del servidor
   * @throws Error con mensaje descriptivo si falla la autenticación
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // Manejar diferentes tipos de errores
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          throw { 
            message: "Credenciales inválidas. Por favor, verifica tu correo y contraseña", 
            code: "INVALID_CREDENTIALS",
            status 
          };
        } else if (status === 403) {
          throw { 
            message: "No tienes permiso para acceder a esta aplicación", 
            code: "ACCESS_DENIED",
            status 
          };
        } else if (status === 404) {
          throw { 
            message: "El servicio de autenticación no está disponible", 
            code: "SERVICE_NOT_FOUND",
            status 
          };
        } else if (status >= 500) {
          throw { 
            message: "Error en el servidor. Por favor, intenta más tarde", 
            code: "SERVER_ERROR",
            status 
          };
        } else {
          // Otros errores con respuesta del servidor
          throw { 
            message: data.message || "Error al iniciar sesión. Por favor, intenta nuevamente", 
            code: data.code || "UNKNOWN_ERROR",
            status 
          };
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        throw { 
          message: "No se pudo conectar con el servidor. Verifica tu conexión a internet", 
          code: "NETWORK_ERROR" 
        };
      } else {
        // Algo ocurrió al configurar la petición
        throw { 
          message: "Error al procesar la solicitud. Por favor, intenta nuevamente.", 
          code: "REQUEST_ERROR" 
        };
      }
    }
  },

  /**
   * Cierra la sesión del usuario actual
   */
  logout: () => {
    localStorage.removeItem('token');
    // La navegación debe manejarse desde el contexto o componente, no aquí
  },

  /**
   * Verifica si el usuario está autenticado
   * @returns true si el usuario está autenticado, false en caso contrario
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtiene el token de autenticación
   * @returns El token de autenticación o null si no existe
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};

export default authService; 