import { useState, useEffect } from 'react';
import { PedidosClienteService } from '@/services/pedidosCliente.service';
import { PedidoClientePorAsignarDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { toast } from 'sonner';

interface UseDisponibilidadCajasProps {
  idPedido?: number;
  tipo?: string;
  idProducto?: number;
  enabled?: boolean;
}

interface UseDisponibilidadCajasReturn {
  disponibilidad: PedidoClientePorAsignarDTO | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDisponibilidadCajas = ({
  idPedido,
  tipo,
  idProducto,
  enabled = true
}: UseDisponibilidadCajasProps): UseDisponibilidadCajasReturn => {
  const [disponibilidad, setDisponibilidad] = useState<PedidoClientePorAsignarDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDisponibilidad = async () => {
    if (!idPedido || !tipo || !enabled) {
      setDisponibilidad(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await PedidosClienteService.obtenerDisponibilidadCajas(idPedido, tipo, idProducto);
      setDisponibilidad(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al obtener disponibilidad de cajas';
      setError(errorMessage);
      toast.error(errorMessage);
      setDisponibilidad(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisponibilidad();
  }, [idPedido, tipo, idProducto, enabled]);

  const refetch = async () => {
    await fetchDisponibilidad();
  };

  return {
    disponibilidad,
    loading,
    error,
    refetch
  };
};
