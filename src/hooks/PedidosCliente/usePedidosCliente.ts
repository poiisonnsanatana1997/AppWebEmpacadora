import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { PedidosClienteService, PedidoClienteServiceError } from '@/services/pedidosCliente.service';
import type { 
  PedidoClienteResponseDTO, 
  CreatePedidoClienteDTO, 
  UpdatePedidoClienteDTO,
  PedidoClienteFilters,
  PedidoClientePagedResponse 
} from '@/types/PedidoCliente/pedidoCliente.types';

// Definir el tipo de estadísticas localmente
interface PedidoClienteStats {
  totalPedidos: number;
  pedidosPendientes: number;
  pedidosEnProceso: number;
  pedidosCompletados: number;
  pedidosCancelados: number;
}

export const usePedidosCliente = () => {
  const [pedidosCliente, setPedidosCliente] = useState<PedidoClienteResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PedidoClienteStats>({
    totalPedidos: 0,
    pedidosPendientes: 0,
    pedidosEnProceso: 0,
    pedidosCompletados: 0,
    pedidosCancelados: 0,
  });

  // Ref para evitar llamadas duplicadas en StrictMode
  const abortControllerRef = useRef<AbortController | null>(null);

  // Función para calcular estadísticas
  const calcularEstadisticas = (pedidos: PedidoClienteResponseDTO[]) => {
    return {
      totalPedidos: pedidos.length,
      pedidosPendientes: pedidos.filter(p => p.estatus === 'Pendiente').length,
      pedidosEnProceso: pedidos.filter(p => p.estatus === 'En Proceso').length,
      pedidosCompletados: pedidos.filter(p => p.estatus === 'Completado').length,
      pedidosCancelados: pedidos.filter(p => p.estatus === 'Cancelado').length,
    };
  };

  // Cargar todos los pedidos cliente
  const cargarPedidosCliente = useCallback(async () => {
    // Cancelar llamada anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      const data = await PedidosClienteService.obtenerPedidosCliente(abortControllerRef.current.signal);
      
      // Verificar si la llamada fue cancelada
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      // Ordenar por fecha de registro (más recientes primero)
      const dataOrdenada = data.sort((a, b) => {
        const fechaA = new Date(a.fechaRegistro);
        const fechaB = new Date(b.fechaRegistro);
        return fechaB.getTime() - fechaA.getTime();
      });
      
      setPedidosCliente(dataOrdenada);
      setStats(calcularEstadisticas(dataOrdenada));
    } catch (err) {
      // No mostrar error si la llamada fue cancelada
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      
      const errorMessage = err instanceof PedidoClienteServiceError 
        ? err.message 
        : 'Error al cargar los pedidos cliente';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener pedido cliente por ID
  const obtenerPedidoCliente = useCallback(async (id: number): Promise<PedidoClienteResponseDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      return await PedidosClienteService.obtenerPedidoCliente(id);
    } catch (err) {
      const errorMessage = err instanceof PedidoClienteServiceError 
        ? err.message 
        : 'Error al obtener el pedido cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo pedido cliente
  const crearPedidoCliente = useCallback(async (data: CreatePedidoClienteDTO): Promise<PedidoClienteResponseDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      const nuevoPedido = await PedidosClienteService.crearPedidoCliente(data);
      
      setPedidosCliente(prevPedidos => {
        const pedidosActualizados = [nuevoPedido, ...prevPedidos];
        setStats(calcularEstadisticas(pedidosActualizados));
        return pedidosActualizados;
      });
      
      toast.success('Pedido cliente creado exitosamente');
      return nuevoPedido;
    } catch (err) {
      const errorMessage = err instanceof PedidoClienteServiceError 
        ? err.message 
        : 'Error al crear el pedido cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar pedido cliente
  const actualizarPedidoCliente = useCallback(async (id: number, data: UpdatePedidoClienteDTO): Promise<PedidoClienteResponseDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      const pedidoActualizado = await PedidosClienteService.actualizarPedidoCliente(id, data);
      
      setPedidosCliente(prevPedidos => {
        const pedidosActualizados = prevPedidos.map(pedido => 
          pedido.id === id ? pedidoActualizado : pedido
        );
        setStats(calcularEstadisticas(pedidosActualizados));
        return pedidosActualizados;
      });
      
      toast.success('Pedido cliente actualizado exitosamente');
      return pedidoActualizado;
    } catch (err) {
      const errorMessage = err instanceof PedidoClienteServiceError 
        ? err.message 
        : 'Error al actualizar el pedido cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);



  // Eliminar pedido cliente
  const eliminarPedidoCliente = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await PedidosClienteService.eliminarPedidoCliente(id);
      
      setPedidosCliente(prevPedidos => {
        const pedidosActualizados = prevPedidos.filter(pedido => pedido.id !== id);
        setStats(calcularEstadisticas(pedidosActualizados));
        return pedidosActualizados;
      });
      
      toast.success('Pedido cliente eliminado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof PedidoClienteServiceError 
        ? err.message 
        : 'Error al eliminar el pedido cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrar pedidos cliente
  const filtrarPedidosCliente = useCallback(async (filters: PedidoClienteFilters): Promise<PedidoClienteResponseDTO[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await PedidosClienteService.filtrarPedidosCliente(filters);
      return data;
    } catch (err) {
      const errorMessage = err instanceof PedidoClienteServiceError 
        ? err.message 
        : 'Error al filtrar los pedidos cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener pedidos cliente paginados
  const obtenerPedidosClientePaginados = useCallback(async (
    page: number, 
    pageSize: number, 
    filters?: PedidoClienteFilters
  ): Promise<PedidoClientePagedResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      return await PedidosClienteService.obtenerPedidosClientePaginados(page, pageSize, filters);
    } catch (err) {
      const errorMessage = err instanceof PedidoClienteServiceError 
        ? err.message 
        : 'Error al obtener los pedidos cliente paginados';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar estatus de pedido cliente
  const actualizarEstatusPedidoCliente = useCallback(async (id: number, estatus: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await PedidosClienteService.actualizarEstatusPedidoCliente(id, estatus);
      
      setPedidosCliente(prevPedidos => {
        const pedidosActualizados = prevPedidos.map(pedido => 
          pedido.id === id ? { ...pedido, estatus } : pedido
        );
        setStats(calcularEstadisticas(pedidosActualizados));
        return pedidosActualizados;
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof PedidoClienteServiceError 
        ? err.message 
        : 'Error al actualizar el estatus del pedido cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Limpiar error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    pedidosCliente,
    loading,
    error,
    stats,
    cargarPedidosCliente,
    obtenerPedidoCliente,
    crearPedidoCliente,
    actualizarPedidoCliente,
    eliminarPedidoCliente,
    actualizarEstatusPedidoCliente,
    filtrarPedidosCliente,
    obtenerPedidosClientePaginados,
    limpiarError,
  };
}; 