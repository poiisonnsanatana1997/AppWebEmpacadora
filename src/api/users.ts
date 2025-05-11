import api from './axios';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  roleName: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserData {
  name: string;
  username: string;
  email: string;
  roleId: number;
  password: string;
  isActive: boolean;
  phoneNumber: string;
}

/**
 * Actualiza un usuario existente
 * @param id ID del usuario a actualizar
 * @param data Campos a actualizar (parcial)
 * @returns Promesa con el usuario actualizado
 */
async function updateUser(id: number, data: Partial<User>): Promise<User> {
  try {
    const response = await api.put<User>(`/users/${id}`, data);
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
      } else if (status === 404) {
        throw {
          message: "Usuario no encontrado",
          code: "NOT_FOUND",
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
          message: data.message || "Error al actualizar el usuario",
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

const usersService = {
  /**
   * Crea un nuevo usuario
   * @param userData Datos del usuario a crear
   * @returns Promesa con el usuario creado
   */
  createUser: async (userData: CreateUserData): Promise<User> => {
    try {
      const response = await api.post<User>('/users', userData);
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
  },

  updateUser,
};

export default usersService; 