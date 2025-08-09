import { useState, useCallback, useEffect } from 'react';
import { PedidoClientePorAsignarDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { PedidosClienteService } from '@/services/pedidosCliente.service';

export const usePedidosCliente = () => {
  const [pedidosCliente, setPedidosCliente] = useState<PedidoClientePorAsignarDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarPedidosCliente = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Por defecto cargar todos los pedidos disponibles sin filtros
      const data = await PedidosClienteService.obtenerPedidosClienteDisponibles('', undefined);
      setPedidosCliente(data);
    } catch (error) {
      console.error('Error al cargar pedidos cliente:', error);
      setError('Error desconocido al cargar los pedidos cliente');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar pedidos cliente automáticamente al montar el hook
  useEffect(() => {
    cargarPedidosCliente();
  }, [cargarPedidosCliente]);

  const refetch = useCallback(() => {
    cargarPedidosCliente();
  }, [cargarPedidosCliente]);

  return {
    pedidosCliente,
    isLoading,
    error,
    cargarPedidosCliente: refetch
  };
}; 