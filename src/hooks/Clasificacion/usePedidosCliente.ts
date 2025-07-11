import { useState, useCallback, useEffect } from 'react';
import { PedidoClienteConDetallesDTO } from '@/types/Tarimas/tarima.types';
import { TarimasService, TarimaServiceError } from '@/services/tarimas.service';

export const usePedidosCliente = () => {
  const [pedidosCliente, setPedidosCliente] = useState<PedidoClienteConDetallesDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarPedidosCliente = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await TarimasService.obtenerTarimasConDetalles();
      setPedidosCliente(data);
    } catch (error) {
      console.error('Error al cargar pedidos cliente:', error);
      
      if (error instanceof TarimaServiceError) {
        setError(error.message);
      } else {
        setError('Error desconocido al cargar los pedidos cliente');
      }
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