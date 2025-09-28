import type { TarimaDTO, CreateTarimaDTO, UpdateTarimaDTO, TarimaParcialCompletaDTO } from '@/types/Tarimas/tarima.types';
import type { PedidoClienteConDetallesDTO } from '@/types/Tarimas/tarima.types';
import type { TarimaAsignacionRequestDTO } from '@/types/Inventario/inventario.types';
import type { PedidoClienteResponseDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { TarimaUpdateParcialDTO } from '../types/Tarimas/tarimaParcial.types';
import api from '@/api/axios';
import { AxiosError } from 'axios';

/**
 * Custom error class for tarima service errors
 */
export class TarimaServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'TarimaServiceError';
  }
}

/**
 * Servicio para gestionar las tarimas del sistema
 * @namespace TarimasService
 */
export const TarimasService = {
  /**
   * Obtiene todas las tarimas desde la API externa
   * @returns {Promise<TarimaDTO[]>} Lista de tarimas
   * @throws {TarimaServiceError} Si hay un error al obtener las tarimas
   */
  async obtenerTarimas(): Promise<TarimaDTO[]> {
    try {
      const response = await api.get<TarimaDTO[]>('/Tarimas');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new TarimaServiceError(
          `Error al obtener tarimas: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al obtener tarimas', error);
    }
  },

  /**
   * Obtiene una tarima por su ID desde la API externa
   * @param {number} id - ID de la tarima
   * @returns {Promise<TarimaDTO>} Tarima encontrada
   * @throws {TarimaServiceError} Si hay un error al obtener la tarima o si no se encuentra
   */
  async obtenerTarima(id: number): Promise<TarimaDTO> {
    try {
      const response = await api.get<TarimaDTO>(`/Tarimas/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new TarimaServiceError(`Tarima con ID ${id} no encontrada`, error);
        }
        throw new TarimaServiceError(
          `Error al obtener la tarima: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al obtener la tarima', error);
    }
  },

  /**
   * Crea una nueva tarima según la especificación de la API externa
   * @param {CreateTarimaDTO} data - Datos de la tarima
   * @returns {Promise<TarimaDTO>} Tarima creada
   * @throws {TarimaServiceError} Si hay un error al crear la tarima
   */
  async crearTarima(data: CreateTarimaDTO): Promise<TarimaDTO> {
    try {
      const response = await api.post<TarimaDTO>('/Tarimas', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new TarimaServiceError(
          `Error al crear la tarima: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al crear la tarima', error);
    }
  },

  /**
   * Actualiza una tarima existente usando la API externa
   * @param {number} id - ID de la tarima
   * @param {UpdateTarimaDTO} data - Datos a actualizar
   * @returns {Promise<TarimaDTO>} Tarima actualizada
   * @throws {TarimaServiceError} Si hay un error al actualizar la tarima
   */
  async actualizarTarima(id: number, data: UpdateTarimaDTO): Promise<TarimaDTO> {
    try {
      const response = await api.put<TarimaDTO>(`/Tarimas/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new TarimaServiceError(`Tarima con ID ${id} no encontrada`, error);
        }
        throw new TarimaServiceError(
          `Error al actualizar la tarima: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al actualizar la tarima', error);
    }
  },

  /**
   * Elimina una tarima usando la API externa
   * @param {number} id - ID de la tarima
   * @throws {TarimaServiceError} Si hay un error al eliminar la tarima
   */
  async eliminarTarima(id: number): Promise<void> {
    try {
      await api.delete(`/Tarimas/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new TarimaServiceError(`Tarima con ID ${id} no encontrada`, error);
        }
        throw new TarimaServiceError(
          `Error al eliminar la tarima: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al eliminar la tarima', error);
    }
  },

  /**
   * Obtiene todas las tarimas con detalles desde la API externa
   * @returns {Promise<PedidoClienteConDetallesDTO[]>} Lista de tarimas con detalles
   * @throws {TarimaServiceError} Si hay un error al obtener las tarimas con detalles
   */
  async obtenerTarimasConDetalles(): Promise<PedidoClienteConDetallesDTO[]> {
    try {
      const response = await api.get<PedidoClienteConDetallesDTO[]>('/PedidoCliente/con-detalles');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new TarimaServiceError(
          `Error al obtener tarimas con detalles: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al obtener tarimas con detalles', error);
    }
  },

  /**
   * Obtiene todas las tarimas parciales desde la API externa
   * @returns {Promise<TarimaParcialCompletaDTO[]>} Lista de tarimas parciales
   * @throws {TarimaServiceError} Si hay un error al obtener las tarimas parciales
   */
  async getTarimasParciales(): Promise<TarimaParcialCompletaDTO[]> {
    try {
      const response = await api.get<TarimaParcialCompletaDTO[]>('/Tarimas/parciales');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new TarimaServiceError(
          `Error al obtener tarimas parciales: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al obtener tarimas parciales', error);
    }
  },

  /**
   * Actualiza una tarima parcial.
   * @param idTarima ID de la tarima a actualizar
   * @param data DTO con los datos de actualización
   * @returns Respuesta de la API
   */
  async updateTarimaParcial(idTarima: number, data: TarimaUpdateParcialDTO) {
    try {
      const response = await api.put(`/Tarimas/parcial/${idTarima}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new TarimaServiceError(`Tarima con ID ${idTarima} no encontrada`, error);
        }
        throw new TarimaServiceError(
          `Error al actualizar la tarima parcial: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al actualizar la tarima parcial', error);
    }
  },

  /**
   * Obtiene todas las tarimas parciales completas desde la API externa
   * @returns {Promise<TarimaParcialCompletaDTO[]>} Lista de tarimas parciales completas
   * @throws {TarimaServiceError} Si hay un error al obtener las tarimas parciales completas
   */
  async obtenerTarimasParcialesCompletas(): Promise<TarimaParcialCompletaDTO[]> {
    try {
      const response = await api.get<TarimaParcialCompletaDTO[]>('/Tarimas/parciales-completas');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new TarimaServiceError(
          `Error al obtener tarimas parciales completas: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al obtener tarimas parciales completas', error);
    }
  },

  /**
   * Obtiene la lista de clientes disponibles para asignación de tarimas
   * @param {TarimaAsignacionRequestDTO} request - Datos de la solicitud de asignación
   * @returns {Promise<PedidoClienteResponseDTO[]>} Lista de clientes disponibles
   * @throws {TarimaServiceError} Si hay un error al obtener los clientes disponibles
   */
  async obtenerClientesDisponiblesParaAsignacion(
    request: TarimaAsignacionRequestDTO[]
  ): Promise<PedidoClienteResponseDTO[]> {
    try {
      const response = await api.post<PedidoClienteResponseDTO[]>(
        '/Tarimas/buscarPedidosCompatibles', 
        request
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new TarimaServiceError(
          `Error al obtener clientes disponibles: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al obtener clientes disponibles', error);
    }
  },

  /**
   * Elimina una clasificación de una tarima específica
   * @param {number} idTarima - ID de la tarima
   * @param {number} idClasificacion - ID de la clasificación
   * @throws {TarimaServiceError} Si hay un error al eliminar la clasificación
   */
  async eliminarClasificacionTarima(idTarima: number, idClasificacion: number): Promise<void> {
    try {
      await api.delete(`/Tarimas/${idTarima}/clasificacion/${idClasificacion}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new TarimaServiceError(
            `Clasificación con ID ${idClasificacion} de la tarima ${idTarima} no encontrada`, 
            error
          );
        }
        throw new TarimaServiceError(
          `Error al eliminar la clasificación: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al eliminar la clasificación', error);
    }
  }
}; 