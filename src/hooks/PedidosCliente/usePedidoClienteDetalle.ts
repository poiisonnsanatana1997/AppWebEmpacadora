import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { PedidosClienteService, PedidoClienteServiceError } from '@/services/pedidosCliente.service';
import type { PedidoClienteResponseDTO } from '@/types/PedidoCliente/pedidoCliente.types';

export const usePedidoClienteDetalle = () => {
  const [pedidoDetalle, setPedidoDetalle] = useState<PedidoClienteResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener detalle de pedido cliente por ID
  const obtenerPedidoClienteDetalle = useCallback(async (id: number): Promise<PedidoClienteResponseDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      const pedido = await PedidosClienteService.obtenerPedidoCliente(id);
      setPedidoDetalle(pedido);
      return pedido;
    } catch (err) {
      const errorMessage = err instanceof PedidoClienteServiceError 
        ? err.message 
        : 'Error al obtener el detalle del pedido cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar datos del detalle
  const limpiarDetalle = useCallback(() => {
    setPedidoDetalle(null);
    setError(null);
  }, []);

  // Limpiar solo el error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    pedidoDetalle,
    loading,
    error,
    obtenerPedidoClienteDetalle,
    limpiarDetalle,
    limpiarError,
  };
}; 