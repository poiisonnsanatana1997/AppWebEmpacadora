import type { SucursalDTO, CreateSucursalDTO, UpdateSucursalDTO } from '@/types/Sucursales/sucursales.types';
import api from '@/api/axios';
import { AxiosError } from 'axios';

/**
 * Custom error class for sucursales service errors
 */
export class SucursalesServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'SucursalesServiceError';
  }
}

/**
 * Servicio para gestionar las sucursales del sistema
 * @namespace SucursalesService
 */
export const SucursalesService = {
  /**
   * Obtiene todas las sucursales
   * @returns {Promise<SucursalDTO[]>} Lista de todas las sucursales
   * @throws {SucursalesServiceError} Si hay un error al obtener las sucursales
   */
  async obtenerSucursales(): Promise<SucursalDTO[]> {
    try {
      const response = await api.get<SucursalDTO[]>('/Sucursales');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new SucursalesServiceError(
          `Error al obtener sucursales: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new SucursalesServiceError('Error desconocido al obtener sucursales', error);
    }
  },

  /**
   * Crea una nueva sucursal
   * @param {CreateSucursalDTO} data - Datos de la nueva sucursal
   * @returns {Promise<SucursalDTO>} Sucursal creada
   * @throws {SucursalesServiceError} Si hay un error al crear la sucursal
   */
  async crearSucursal(data: CreateSucursalDTO): Promise<SucursalDTO> {
    try {
      // Validaciones básicas
      if (!data.nombre || data.nombre.trim().length === 0) {
        throw new SucursalesServiceError('El nombre es requerido');
      }

      if (data.nombre.length > 150) {
        throw new SucursalesServiceError('El nombre no puede exceder 150 caracteres');
      }

      if (!data.direccion || data.direccion.trim().length === 0) {
        throw new SucursalesServiceError('La dirección es requerida');
      }

      if (data.direccion.length > 200) {
        throw new SucursalesServiceError('La dirección no puede exceder 200 caracteres');
      }

      if (!data.telefono || data.telefono.trim().length === 0) {
        throw new SucursalesServiceError('El teléfono es requerido');
      }

      if (data.telefono.length > 20) {
        throw new SucursalesServiceError('El teléfono no puede exceder 20 caracteres');
      }

      if (!data.idCliente || data.idCliente <= 0) {
        throw new SucursalesServiceError('El ID del cliente es requerido y debe ser válido');
      }

      // Validar encargado de almacén si se proporciona
      if (data.encargadoAlmacen && data.encargadoAlmacen.length > 50) {
        throw new SucursalesServiceError('El encargado de almacén no puede exceder 50 caracteres');
      }

      // Validar correo si se proporciona
      if (data.correo) {
        if (data.correo.length > 100) {
          throw new SucursalesServiceError('El correo no puede exceder 100 caracteres');
        }
        
        // Validar formato de email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.correo)) {
          throw new SucursalesServiceError('Formato de correo inválido');
        }
      }

      const response = await api.post<SucursalDTO>('/Sucursales', data);
      return response.data;
    } catch (error) {
      if (error instanceof SucursalesServiceError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          throw new SucursalesServiceError(
            `Datos inválidos: ${error.response?.data?.message || 'Verifique los datos enviados'}`,
            error
          );
        }
        if (error.response?.status === 409) {
          throw new SucursalesServiceError(
            'Ya existe una sucursal con los mismos datos',
            error
          );
        }
        throw new SucursalesServiceError(
          `Error al crear sucursal: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new SucursalesServiceError('Error desconocido al crear sucursal', error);
    }
  },

  /**
   * Obtiene una sucursal específica por su ID
   * @param {number} id - ID de la sucursal
   * @returns {Promise<SucursalDTO>} Sucursal encontrada
   * @throws {SucursalesServiceError} Si hay un error al obtener la sucursal
   */
  async obtenerSucursalPorId(id: number): Promise<SucursalDTO> {
    try {
      if (!id || id <= 0) {
        throw new SucursalesServiceError('ID de sucursal inválido');
      }

      const response = await api.get<SucursalDTO>(`/Sucursales/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof SucursalesServiceError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new SucursalesServiceError(`Sucursal con ID ${id} no encontrada`, error);
        }
        throw new SucursalesServiceError(
          `Error al obtener sucursal: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new SucursalesServiceError('Error desconocido al obtener sucursal', error);
    }
  },

  /**
   * Actualiza una sucursal existente
   * @param {number} id - ID de la sucursal a actualizar
   * @param {UpdateSucursalDTO} data - Datos actualizados de la sucursal
   * @returns {Promise<SucursalDTO>} Sucursal actualizada
   * @throws {SucursalesServiceError} Si hay un error al actualizar la sucursal
   */
  async actualizarSucursal(id: number, data: UpdateSucursalDTO): Promise<SucursalDTO> {
    try {
      if (!id || id <= 0) {
        throw new SucursalesServiceError('ID de sucursal inválido');
      }

      // Validar que al menos un campo se esté actualizando
      if (Object.keys(data).length === 0) {
        throw new SucursalesServiceError('Debe proporcionar al menos un campo para actualizar');
      }

      // Validar nombre si se proporciona
      if (data.nombre !== undefined) {
        if (!data.nombre || data.nombre.trim().length === 0) {
          throw new SucursalesServiceError('El nombre no puede estar vacío');
        }
        if (data.nombre.length > 150) {
          throw new SucursalesServiceError('El nombre no puede exceder 150 caracteres');
        }
      }

      // Validar dirección si se proporciona
      if (data.direccion !== undefined) {
        if (!data.direccion || data.direccion.trim().length === 0) {
          throw new SucursalesServiceError('La dirección no puede estar vacía');
        }
        if (data.direccion.length > 200) {
          throw new SucursalesServiceError('La dirección no puede exceder 200 caracteres');
        }
      }

      // Validar teléfono si se proporciona
      if (data.telefono !== undefined) {
        if (!data.telefono || data.telefono.trim().length === 0) {
          throw new SucursalesServiceError('El teléfono no puede estar vacío');
        }
        if (data.telefono.length > 20) {
          throw new SucursalesServiceError('El teléfono no puede exceder 20 caracteres');
        }
      }

      // Validar ID del cliente si se proporciona
      if (data.idCliente !== undefined && data.idCliente <= 0) {
        throw new SucursalesServiceError('El ID del cliente debe ser válido');
      }

      // Validar encargado de almacén si se proporciona
      if (data.encargadoAlmacen && data.encargadoAlmacen.length > 50) {
        throw new SucursalesServiceError('El encargado de almacén no puede exceder 50 caracteres');
      }

      // Validar correo si se proporciona
      if (data.correo) {
        if (data.correo.length > 100) {
          throw new SucursalesServiceError('El correo no puede exceder 100 caracteres');
        }
        
        // Validar formato de email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.correo)) {
          throw new SucursalesServiceError('Formato de correo inválido');
        }
      }

      const response = await api.put<SucursalDTO>(`/Sucursales/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof SucursalesServiceError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new SucursalesServiceError(`Sucursal con ID ${id} no encontrada`, error);
        }
        if (error.response?.status === 400) {
          throw new SucursalesServiceError(
            `Datos inválidos: ${error.response?.data?.message || 'Verifique los datos enviados'}`,
            error
          );
        }
        throw new SucursalesServiceError(
          `Error al actualizar sucursal: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new SucursalesServiceError('Error desconocido al actualizar sucursal', error);
    }
  },

  /**
   * Elimina una sucursal por su ID
   * @param {number} id - ID de la sucursal a eliminar
   * @returns {Promise<void>} Confirmación de eliminación
   * @throws {SucursalesServiceError} Si hay un error al eliminar la sucursal
   */
  async eliminarSucursal(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new SucursalesServiceError('ID de sucursal inválido');
      }

      await api.delete(`/Sucursales/${id}`);
    } catch (error) {
      if (error instanceof SucursalesServiceError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new SucursalesServiceError(`Sucursal con ID ${id} no encontrada`, error);
        }
        if (error.response?.status === 409) {
          throw new SucursalesServiceError(
            'No se puede eliminar la sucursal porque está siendo utilizada',
            error
          );
        }
        throw new SucursalesServiceError(
          `Error al eliminar sucursal: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new SucursalesServiceError('Error desconocido al eliminar sucursal', error);
    }
  },

  /**
   * Obtiene sucursales por cliente específico
   * @param {number} idCliente - ID del cliente
   * @returns {Promise<SucursalDTO[]>} Lista de sucursales del cliente
   * @throws {SucursalesServiceError} Si hay un error al obtener las sucursales
   */
  async obtenerSucursalesPorCliente(idCliente: number): Promise<SucursalDTO[]> {
    try {
      if (!idCliente || idCliente <= 0) {
        throw new SucursalesServiceError('ID de cliente inválido');
      }

      const response = await api.get<SucursalDTO[]>(`/Sucursales/${idCliente}`);
      return response.data;
    } catch (error) {
      if (error instanceof SucursalesServiceError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new SucursalesServiceError(`Cliente con ID ${idCliente} no encontrado`, error);
        }
        throw new SucursalesServiceError(
          `Error al obtener sucursales por cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new SucursalesServiceError('Error desconocido al obtener sucursales por cliente', error);
    }
  },

  /**
   * Obtiene solo sucursales activas
   * @returns {Promise<SucursalDTO[]>} Lista de sucursales activas
   * @throws {SucursalesServiceError} Si hay un error al obtener las sucursales
   */
  async obtenerSucursalesActivas(): Promise<SucursalDTO[]> {
    try {
      const response = await api.get<SucursalDTO[]>('/Sucursales/activas');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new SucursalesServiceError(
          `Error al obtener sucursales activas: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new SucursalesServiceError('Error desconocido al obtener sucursales activas', error);
    }
  },
};
