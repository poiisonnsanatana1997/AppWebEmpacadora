import { useState, useCallback } from 'react';
import { TarimasService } from '../../services/tarimas.service';
import type { TarimaAsignacionRequestDTO } from '../../types/Inventario/inventario.types';
import type { PedidoClienteResponseDTO } from '../../types/PedidoCliente/pedidoCliente.types';

/**
 * Hook personalizado para manejar la asignación de tarimas
 * @returns {Object} Estado y funciones para la asignación de tarimas
 */
export const useTarimaAsignacion = () => {
  const [clientesDisponibles, setClientesDisponibles] = useState<PedidoClienteResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene la lista de clientes disponibles para asignación de tarimas
   * @param {TarimaAsignacionRequestDTO[]} request - Array de datos de solicitud de asignación
   * @returns {Promise<PedidoClienteResponseDTO[]>} Lista de clientes disponibles
   */
  const obtenerClientesDisponibles = useCallback(async (request: TarimaAsignacionRequestDTO[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await TarimasService.obtenerClientesDisponiblesParaAsignacion(request);
      setClientesDisponibles(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener clientes disponibles';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpia el estado de error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpia la lista de clientes disponibles
   */
  const clearClientesDisponibles = useCallback(() => {
    setClientesDisponibles([]);
  }, []);

  return {
    clientesDisponibles,
    isLoading,
    error,
    obtenerClientesDisponibles,
    clearError,
    clearClientesDisponibles
  };
};
