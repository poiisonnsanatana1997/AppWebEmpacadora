import api from './axios';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  isActive: boolean;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  password: string;
  isActive: boolean;
  phoneNumber?: string;
}

const usersService = {
  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   * @returns Promesa con el usuario creado
   */
  createUser: async (userData: CreateUserData): Promise<User> => {
    try {
      const response = await api.post<User>('/user', userData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          throw { 
            message: data.message || "Datos inválidos. Por favor, verifica la información proporcionada", 
            code: "INVALID_DATA",
            status 
          };
        } else if (status === 409) {
          throw { 
            message: "El correo electrónico ya está registrado", 
            code: "EMAIL_EXISTS",
            status 
          };
        } else if (status >= 500) {
          throw { 
            message: "Error en el servidor. Por favor, intenta más tarde", 
            code: "SERVER_ERROR",
            status 
          };
        } else {
          throw { 
            message: data.message || "Error al crear el usuario", 
            code: data.code || "UNKNOWN_ERROR",
            status 
          };
        }
      } else if (error.request) {
        throw { 
          message: "No se pudo conectar con el servidor. Verifica tu conexión a internet", 
          code: "NETWORK_ERROR" 
        };
      } else {
        throw { 
          message: "Error al procesar la solicitud", 
          code: "REQUEST_ERROR" 
        };
      }
    }
  },

  /**
   * Obtiene todos los usuarios
   * @returns Promesa con la lista de usuarios
   */
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get<User[]>('/users');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          throw { 
            message: "No autorizado. Por favor, inicia sesión nuevamente", 
            code: "UNAUTHORIZED",
            status 
          };
        } else if (status >= 500) {
          throw { 
            message: "Error en el servidor. Por favor, intenta más tarde", 
            code: "SERVER_ERROR",
            status 
          };
        } else {
          throw { 
            message: data.message || "Error al obtener los usuarios", 
            code: data.code || "UNKNOWN_ERROR",
            status 
          };
        }
      } else if (error.request) {
        throw { 
          message: "No se pudo conectar con el servidor. Verifica tu conexión a internet", 
          code: "NETWORK_ERROR" 
        };
      } else {
        throw { 
          message: "Error al procesar la solicitud", 
          code: "REQUEST_ERROR" 
        };
      }
    }
  }
};

export default usersService; 