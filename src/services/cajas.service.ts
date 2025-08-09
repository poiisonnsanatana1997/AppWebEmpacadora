import type { CajaDto, AjustarCantidadCajaDto } from '@/types/Cajas/cajas.types';
import api from '@/api/axios';
import { AxiosError } from 'axios';

/**
 * Custom error class for caja service errors
 */
export class CajaServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'CajaServiceError';
  }
}

/**
 * Servicio para gestionar las cajas del sistema
 * @namespace CajasService
 */
export const CajasService = {
  /**
   * Obtiene cajas por clasificación
   * @param {number} idClasificacion - ID de la clasificación
   * @returns {Promise<CajaDto[]>} Lista de cajas de la clasificación
   * @throws {CajaServiceError} Si hay un error al obtener las cajas
   */
  async obtenerCajasPorClasificacion(idClasificacion: number): Promise<CajaDto[]> {
    try {
      const response = await api.get<CajaDto[]>(`/Cajas/por-clasificacion/${idClasificacion}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new CajaServiceError(`Clasificación con ID ${idClasificacion} no encontrada`, error);
        }
        throw new CajaServiceError(
          `Error al obtener cajas por clasificación: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new CajaServiceError('Error desconocido al obtener cajas por clasificación', error);
    }
  },

  /**
   * Ajusta la cantidad de una caja
   * @param {AjustarCantidadCajaDto} data - Datos del ajuste
   * @returns {Promise<CajaDto>} Caja ajustada
   * @throws {CajaServiceError} Si hay un error al ajustar la caja
   */
  async ajustarCantidadCaja(data: AjustarCantidadCajaDto): Promise<CajaDto> {
    try {
      const response = await api.post<CajaDto>('/Cajas/ajustar-cantidad', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new CajaServiceError(
          `Error al ajustar la cantidad de la caja: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new CajaServiceError('Error desconocido al ajustar la cantidad de la caja', error);
    }
  },

}; 