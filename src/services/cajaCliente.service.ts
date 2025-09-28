import type { CajaClienteDTO, CreateCajaClienteDTO, UpdateCajaClienteDTO } from '@/types/Cajas/cajaCliente.types';
import api from '@/api/axios';
import { AxiosError } from 'axios';

/**
 * Custom error class for caja cliente service errors
 */
export class CajaClienteServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'CajaClienteServiceError';
  }
}

/**
 * Servicio para gestionar las cajas cliente del sistema
 * @namespace CajaClienteService
 */
export const CajaClienteService = {
  /**
   * Obtiene todas las cajas cliente
   * @returns {Promise<CajaClienteDTO[]>} Lista de todas las cajas cliente
   * @throws {CajaClienteServiceError} Si hay un error al obtener las cajas cliente
   */
  async obtenerCajasCliente(): Promise<CajaClienteDTO[]> {
    try {
      const response = await api.get<CajaClienteDTO[]>('/CajaCliente');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new CajaClienteServiceError(
          `Error al obtener cajas cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new CajaClienteServiceError('Error desconocido al obtener cajas cliente', error);
    }
  },

  /**
   * Crea una nueva caja cliente
   * @param {CreateCajaClienteDTO} data - Datos de la nueva caja cliente
   * @returns {Promise<CajaClienteDTO>} Caja cliente creada
   * @throws {CajaClienteServiceError} Si hay un error al crear la caja cliente
   */
  async crearCajaCliente(data: CreateCajaClienteDTO): Promise<CajaClienteDTO> {
    try {
      // Validaciones básicas
      if (!data.peso || data.peso <= 0) {
        throw new CajaClienteServiceError('El peso es requerido y debe ser mayor a 0');
      }

      if (!data.idCliente || data.idCliente <= 0) {
        throw new CajaClienteServiceError('El ID del cliente es requerido y debe ser válido');
      }

      // Validar longitud del nombre si se proporciona
      if (data.nombre && data.nombre.length > 50) {
        throw new CajaClienteServiceError('El nombre no puede exceder 50 caracteres');
      }

      const response = await api.post<CajaClienteDTO>('/CajaCliente', data);
      return response.data;
    } catch (error) {
      if (error instanceof CajaClienteServiceError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          throw new CajaClienteServiceError(
            `Datos inválidos: ${error.response?.data?.message || 'Verifique los datos enviados'}`,
            error
          );
        }
        if (error.response?.status === 409) {
          throw new CajaClienteServiceError(
            'Ya existe una caja cliente con los mismos datos',
            error
          );
        }
        throw new CajaClienteServiceError(
          `Error al crear caja cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new CajaClienteServiceError('Error desconocido al crear caja cliente', error);
    }
  },

  /**
   * Obtiene una caja cliente específica por su ID
   * @param {number} id - ID de la caja cliente
   * @returns {Promise<CajaClienteDTO>} Caja cliente encontrada
   * @throws {CajaClienteServiceError} Si hay un error al obtener la caja cliente
   */
  async obtenerCajaClientePorId(id: number): Promise<CajaClienteDTO> {
    try {
      if (!id || id <= 0) {
        throw new CajaClienteServiceError('ID de caja cliente inválido');
      }

      const response = await api.get<CajaClienteDTO>(`/CajaCliente/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof CajaClienteServiceError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new CajaClienteServiceError(`Caja cliente con ID ${id} no encontrada`, error);
        }
        throw new CajaClienteServiceError(
          `Error al obtener caja cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new CajaClienteServiceError('Error desconocido al obtener caja cliente', error);
    }
  },

  /**
   * Actualiza una caja cliente existente
   * @param {number} id - ID de la caja cliente a actualizar
   * @param {UpdateCajaClienteDTO} data - Datos actualizados de la caja cliente
   * @returns {Promise<CajaClienteDTO>} Caja cliente actualizada
   * @throws {CajaClienteServiceError} Si hay un error al actualizar la caja cliente
   */
  async actualizarCajaCliente(id: number, data: UpdateCajaClienteDTO): Promise<CajaClienteDTO> {
    try {
      if (!id || id <= 0) {
        throw new CajaClienteServiceError('ID de caja cliente inválido');
      }

      // Validar que al menos un campo se esté actualizando
      if (Object.keys(data).length === 0) {
        throw new CajaClienteServiceError('Debe proporcionar al menos un campo para actualizar');
      }

      // Validar peso si se proporciona
      if (data.peso !== undefined && data.peso <= 0) {
        throw new CajaClienteServiceError('El peso debe ser mayor a 0');
      }

      // Validar ID del cliente si se proporciona
      if (data.idCliente !== undefined && data.idCliente <= 0) {
        throw new CajaClienteServiceError('El ID del cliente debe ser válido');
      }

      // Validar longitud del nombre si se proporciona
      if (data.nombre && data.nombre.length > 50) {
        throw new CajaClienteServiceError('El nombre no puede exceder 50 caracteres');
      }

      const response = await api.put<CajaClienteDTO>(`/CajaCliente/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof CajaClienteServiceError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new CajaClienteServiceError(`Caja cliente con ID ${id} no encontrada`, error);
        }
        if (error.response?.status === 400) {
          throw new CajaClienteServiceError(
            `Datos inválidos: ${error.response?.data?.message || 'Verifique los datos enviados'}`,
            error
          );
        }
        throw new CajaClienteServiceError(
          `Error al actualizar caja cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new CajaClienteServiceError('Error desconocido al actualizar caja cliente', error);
    }
  },

  /**
   * Elimina una caja cliente por su ID
   * @param {number} id - ID de la caja cliente a eliminar
   * @returns {Promise<void>} Confirmación de eliminación
   * @throws {CajaClienteServiceError} Si hay un error al eliminar la caja cliente
   */
  async eliminarCajaCliente(id: number): Promise<void> {
    try {
      if (!id || id <= 0) {
        throw new CajaClienteServiceError('ID de caja cliente inválido');
      }

      await api.delete(`/CajaCliente/${id}`);
    } catch (error) {
      if (error instanceof CajaClienteServiceError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new CajaClienteServiceError(`Caja cliente con ID ${id} no encontrada`, error);
        }
        if (error.response?.status === 409) {
          throw new CajaClienteServiceError(
            'No se puede eliminar la caja cliente porque está siendo utilizada',
            error
          );
        }
        throw new CajaClienteServiceError(
          `Error al eliminar caja cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new CajaClienteServiceError('Error desconocido al eliminar caja cliente', error);
    }
  },

  /**
   * Obtiene cajas cliente por cliente específico
   * @param {number} idCliente - ID del cliente
   * @returns {Promise<CajaClienteDTO[]>} Lista de cajas cliente del cliente
   * @throws {CajaClienteServiceError} Si hay un error al obtener las cajas cliente
   */
  async obtenerCajasClientePorCliente(idCliente: number): Promise<CajaClienteDTO[]> {
    try {
      if (!idCliente || idCliente <= 0) {
        throw new CajaClienteServiceError('ID de cliente inválido');
      }

      const response = await api.get<CajaClienteDTO[]>(`/CajaCliente/cliente/${idCliente}`);
      return response.data;
    } catch (error) {
      if (error instanceof CajaClienteServiceError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new CajaClienteServiceError(`Cliente con ID ${idCliente} no encontrado`, error);
        }
        throw new CajaClienteServiceError(
          `Error al obtener cajas cliente por cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new CajaClienteServiceError('Error desconocido al obtener cajas cliente por cliente', error);
    }
  },
};
