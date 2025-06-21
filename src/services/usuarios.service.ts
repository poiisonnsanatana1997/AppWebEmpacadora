import api from '../api/axios';
import { UsuarioDto, CrearUsuarioDto, ActualizarUsuarioDto } from '@/types/Usuarios/usuarios.type';

/**
 * Interfaz para los errores del servicio de usuarios
 */
export interface UsuarioError {
  message: string;
  code: string;
  status?: number;
}

/**
 * Servicio para manejar las operaciones relacionadas con usuarios
 */
export const usuariosService = {
  /**
   * Obtiene todos los usuarios
   * @returns Promise con el array de usuarios
   * @throws UsuarioError si ocurre un error al obtener los usuarios
   */
  obtenerUsuarios: async (): Promise<UsuarioDto[]> => {
    try {
      const response = await api.get<UsuarioDto[]>('/users');
      return response.data;
    } catch (error: any) {
      throw handleError(error, 'Error al obtener los usuarios');
    }
  },

  /**
   * Obtiene un usuario específico por su ID
   * @param id ID del usuario a obtener
   * @returns Promise con los datos del usuario
   * @throws UsuarioError si el usuario no existe o hay un error al obtenerlo
   */
  obtenerUsuarioPorId: async (id: number): Promise<UsuarioDto> => {
    try {
      if (!id || id <= 0) {
        throw {
          message: 'ID de usuario inválido',
          code: 'INVALID_USER_ID'
        };
      }

      const response = await api.get<UsuarioDto>(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw handleError(error, 'Error al obtener el usuario');
    }
  },

  /**
   * Crea un nuevo usuario
   * @param usuario Datos del usuario a crear
   * @returns Promise con los datos del usuario creado
   * @throws UsuarioError si hay un error al crear el usuario
   */
  crearUsuario: async (usuario: CrearUsuarioDto): Promise<UsuarioDto> => {
    try {
      // Validaciones básicas
      if (!usuario.username || !usuario.password || !usuario.email) {
        throw {
          message: 'Faltan campos requeridos',
          code: 'MISSING_REQUIRED_FIELDS'
        };
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(usuario.email)) {
        throw {
          message: 'Formato de email inválido',
          code: 'INVALID_EMAIL_FORMAT'
        };
      }

      const response = await api.post<UsuarioDto>('/users', usuario);
      return response.data;
    } catch (error: any) {
      throw handleError(error, 'Error al crear el usuario');
    }
  },

  /**
   * Actualiza un usuario existente
   * @param id ID del usuario a actualizar
   * @param usuario Datos actualizados del usuario
   * @returns Promise con los datos del usuario actualizado
   * @throws UsuarioError si hay un error al actualizar el usuario
   */
  actualizarUsuario: async (id: number, usuario: ActualizarUsuarioDto): Promise<UsuarioDto> => {
    try {
      if (!id || id <= 0) {
        throw {
          message: 'ID de usuario inválido',
          code: 'INVALID_USER_ID'
        };
      }

      // Validar que al menos un campo sea actualizado
      if (!usuario.name && !usuario.phoneNumber && usuario.isActive === undefined) {
        throw {
          message: 'Debe proporcionar al menos un campo para actualizar',
          code: 'NO_FIELDS_TO_UPDATE'
        };
      }

      const response = await api.put<UsuarioDto>(`/users/${id}`, usuario);
      return response.data;
    } catch (error: any) {
      throw handleError(error, 'Error al actualizar el usuario');
    }
  }
};

/**
 * Función auxiliar para manejar errores de manera consistente
 * @param error Error capturado
 * @param defaultMessage Mensaje por defecto si no hay un mensaje específico
 * @returns Error formateado
 */
const handleError = (error: any, defaultMessage: string): UsuarioError => {
  if (error.response) {
    // El servidor respondió con un código de estado fuera del rango 2xx
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return {
          message: data.message || 'Datos de usuario inválidos',
          code: 'INVALID_DATA',
          status
        };
      case 401:
        return {
          message: 'No autorizado para realizar esta operación',
          code: 'UNAUTHORIZED',
          status
        };
      case 403:
        return {
          message: 'No tiene permisos para realizar esta operación',
          code: 'FORBIDDEN',
          status
        };
      case 404:
        return {
          message: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND',
          status
        };
      case 409:
        return {
          message: 'Ya existe un usuario con estos datos',
          code: 'USER_ALREADY_EXISTS',
          status
        };
      default:
        return {
          message: data.message || defaultMessage,
          code: data.code || 'UNKNOWN_ERROR',
          status
        };
    }
  } else if (error.request) {
    // La petición fue hecha pero no se recibió respuesta
    return {
      message: 'No se pudo conectar con el servidor',
      code: 'NETWORK_ERROR'
    };
  } else {
    // Error en la configuración de la petición
    return {
      message: error.message || defaultMessage,
      code: error.code || 'REQUEST_ERROR'
    };
  }
};
