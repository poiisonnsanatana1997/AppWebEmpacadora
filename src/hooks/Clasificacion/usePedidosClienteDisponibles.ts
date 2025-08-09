import { useState, useEffect } from 'react';
import { PedidosClienteService } from '@/services/pedidosCliente.service';
import { PedidoClientePorAsignarDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { toast } from 'sonner';

interface UsePedidosClienteDisponiblesProps {
  tipo?: string;
  idProducto?: number;
  enabled?: boolean;
}

interface UsePedidosClienteDisponiblesReturn {
  pedidosCliente: PedidoClientePorAsignarDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePedidosClienteDisponibles = ({
  tipo,
  idProducto,
  enabled = true
}: UsePedidosClienteDisponiblesProps): UsePedidosClienteDisponiblesReturn => {
  const [pedidosCliente, setPedidosCliente] = useState<PedidoClientePorAsignarDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidosCliente = async () => {
    if (!tipo || !enabled) {
      setPedidosCliente([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await PedidosClienteService.obtenerPedidosClienteDisponibles(tipo, idProducto);
      setPedidosCliente(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al obtener pedidos cliente disponibles';
      setError(errorMessage);
      toast.error(errorMessage);
      setPedidosCliente([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidosCliente();
  }, [tipo, idProducto, enabled]);

  const refetch = async () => {
    await fetchPedidosCliente();
  };

  return {
    pedidosCliente,
    loading,
    error,
    refetch
  };
}; 