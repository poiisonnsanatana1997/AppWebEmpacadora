import api from '@/api/axios';
import { AxiosError } from 'axios';
import { TarimaDashboardDTO, TarimaEvolucionDTO, TarimaPesoDiarioDTO } from '@/types/Tarimas/tarima.resumen.types';
import { inventarioEvents } from '@/utils/inventario-events';

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
 * Cache simple para evitar llamadas duplicadas
 */
interface TarimaResumenCache {
  [key: string]: {
    data: any;
    timestamp: number;
  };
}

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos
let tarimaResumenCache: TarimaResumenCache = {};

/**
 * Invalida todo el cache del servicio
 */
const invalidateCache = (source: string = 'TarimaResumenService'): void => {
  tarimaResumenCache = {};
  console.log(`[TarimaResumenService] Cache invalidado por: ${source}`);
  
  // Emitir evento
  inventarioEvents.emitCacheInvalidated(source);
};

/**
 * Helper para obtener datos con cache
 */
const getWithCache = async <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  // Verificar cache
  const cached = tarimaResumenCache[key];
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`[TarimaResumenService] Cache hit para: ${key}`);
    return cached.data;
  }

  // Obtener datos frescos
  console.log(`[TarimaResumenService] Cache miss para: ${key}, obteniendo datos frescos`);
  const data = await fetcher();
  
  // Guardar en cache
  tarimaResumenCache[key] = {
    data,
    timestamp: Date.now()
  };

  return data;
};

export const TarimaResumenService = {
    /**
     * Obtiene el dashboard de tarimas para una fecha específica.
     * @param fecha Fecha en formato ISO string (YYYY-MM-DD)
     * @returns {Promise<TarimaDashboardDTO>} Datos del dashboard de tarimas
     * @throws {TarimaServiceError} Si ocurre un error en la petición
     */
    async getDashboard(fecha: string): Promise<TarimaDashboardDTO> {
      const cacheKey = `dashboard-${fecha}`;
      
      return getWithCache(cacheKey, async () => {
        try {
          const response = await api.get<TarimaDashboardDTO>('/Tarimas/dashboard', {
            params: { fecha }
          });
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new TarimaServiceError(
              `Error al obtener dashboard de tarimas: ${error.response?.data?.message || error.message}`,
              error
            );
          }
          throw new TarimaServiceError('Error desconocido al obtener dashboard de tarimas', error);
        }
      });
    },
    /**
     * Obtiene el peso diario de las tarimas por tipo para un rango de fechas.
     * @param fechaInicio Fecha de inicio en formato ISO string (YYYY-MM-DD)
     * @param fechaFin Fecha de fin en formato ISO string (YYYY-MM-DD)
     * @returns {Promise<TarimaPesoDiarioDTO[]>} Datos del peso diario de las tarimas por tipo
     * @throws {TarimaServiceError} Si ocurre un error en la petición
     */
    async getPesoDiarioPorTipo(fechaInicio: string, fechaFin: string): Promise<TarimaPesoDiarioDTO[]> {
      const cacheKey = `peso-diario-${fechaInicio}-${fechaFin}`;
      
      return getWithCache(cacheKey, async () => {
        try {
          const response = await api.get<TarimaPesoDiarioDTO[]>('/Tarimas/peso/diario-por-tipo', {
            params: { fechaInicio, fechaFin }
          });
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new TarimaServiceError(
              `Error al obtener peso diario por tipo de las tarimas: ${error.response?.data?.message || error.message}`,
              error
            );
          }
          throw new TarimaServiceError('Error desconocido al obtener peso diario por tipo de las tarimas', error);
        }
      });
    },
    /**
     * Obtiene la evolución diaria de las tarimas para un rango de fechas.
     * @param fechaInicio Fecha de inicio en formato ISO string (YYYY-MM-DD)
     * @param fechaFin Fecha de fin en formato ISO string (YYYY-MM-DD)
     * @returns {Promise<TarimaEvolucionDTO[]>} Datos de la evolución diaria de las tarimas
     * @throws {TarimaServiceError} Si ocurre un error en la petición
     */
    async getEvolucionDiaria(fechaInicio: string, fechaFin: string): Promise<TarimaEvolucionDTO[]> {
      const cacheKey = `evolucion-diaria-${fechaInicio}-${fechaFin}`;
      
      return getWithCache(cacheKey, async () => {
        try {
          const response = await api.get<TarimaEvolucionDTO[]>('/Tarimas/graficas/evolucion-diaria', {
            params: { fechaInicio, fechaFin }
          });
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new TarimaServiceError(
              `Error al obtener la evolución diaria de las tarimas: ${error.response?.data?.message || error.message}`,
              error
            );
          }
          throw new TarimaServiceError('Error desconocido al obtener la evolución diaria de las tarimas', error);
        }
      });
    },
    /**
     * Obtiene la evolución semanal de las tarimas para un rango de fechas.
     * @param fechaInicio Fecha de inicio en formato ISO string (YYYY-MM-DD)
     * @param fechaFin Fecha de fin en formato ISO string (YYYY-MM-DD)
     * @returns {Promise<TarimaEvolucionDTO[]>} Datos de la evolución semanal de las tarimas
     * @throws {TarimaServiceError} Si ocurre un error en la petición
     */
    async getEvolucionSemanal(fechaInicio: string, fechaFin: string): Promise<TarimaEvolucionDTO[]> {
      const cacheKey = `evolucion-semanal-${fechaInicio}-${fechaFin}`;
      
      return getWithCache(cacheKey, async () => {
        try {
          const response = await api.get<TarimaEvolucionDTO[]>('/Tarimas/graficas/evolucion-semanal', {
            params: { fechaInicio, fechaFin }
          });
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new TarimaServiceError(
              `Error al obtener la evolución semanal de las tarimas: ${error.response?.data?.message || error.message}`,
              error
            );
          }
          throw new TarimaServiceError('Error desconocido al obtener la evolución semanal de las tarimas', error);
        }
      });
    },
    /**
     * Obtiene la evolución mensual de las tarimas para un rango de fechas.
     * @param fechaInicio Fecha de inicio en formato ISO string (YYYY-MM-DD)
     * @param fechaFin Fecha de fin en formato ISO string (YYYY-MM-DD)
     * @returns {Promise<TarimaEvolucionDTO[]>} Datos de la evolución mensual de las tarimas
     * @throws {TarimaServiceError} Si ocurre un error en la petición
     */
    async getEvolucionMensual(fechaInicio: string, fechaFin: string): Promise<TarimaEvolucionDTO[]> {
      const cacheKey = `evolucion-mensual-${fechaInicio}-${fechaFin}`;
      
      return getWithCache(cacheKey, async () => {
        try {
          const response = await api.get<TarimaEvolucionDTO[]>('/Tarimas/graficas/evolucion-mensual', {
            params: { fechainicio: fechaInicio, fechaFin }
          });
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new TarimaServiceError(
              `Error al obtener la evolución mensual de las tarimas: ${error.response?.data?.message || error.message}`,
              error
            );
          }
          throw new TarimaServiceError('Error desconocido al obtener la evolución mensual de las tarimas', error);
        }
      });
    },

    /**
     * Invalida todo el cache del servicio
     * Se puede llamar externamente cuando sea necesario
     */
    invalidateCache: (source?: string) => invalidateCache(source)
  }