import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { PedidosClienteService, PedidoClienteServiceError } from '@/services/pedidosCliente.service';
import type { PedidoClienteProgresoDTO, TarimaProgresoDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import type { OrdenPedidoClienteResponseDTO } from '@/types/PedidoCliente/ordenPedidoCliente.types';

interface CalculoDiferencias {
  tipo: string;
  cantidadRequerida: number;
  cantidadAsignada: number;
  cantidadFaltante: number;
  pesoRequerido: number;
  pesoAsignado: number;
  pesoFaltante: number;
  porcentajeCumplimiento: number;
}

export const usePedidoClienteProgreso = () => {
  const [progreso, setProgreso] = useState<PedidoClienteProgresoDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener progreso del pedido cliente por ID
  const obtenerProgresoPedidoCliente = useCallback(async (id: number): Promise<PedidoClienteProgresoDTO | null> => {
    try {
      setLoading(true);
      setError(null);
      const progresoData = await PedidosClienteService.obtenerPedidoClienteProgreso(id);
      setProgreso(progresoData);
      return progresoData;
    } catch (err) {
      const errorMessage = err instanceof PedidoClienteServiceError 
        ? err.message 
        : 'Error al obtener el progreso del pedido cliente';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcular diferencias entre órdenes y tarimas asignadas
  const calcularDiferencias = useCallback((): CalculoDiferencias[] => {
    if (!progreso) return [];

    const diferencias: CalculoDiferencias[] = [];
    const ordenesPorTipo = new Map<string, OrdenPedidoClienteResponseDTO[]>();
    const tarimasPorTipo = new Map<string, TarimaProgresoDTO[]>();

    // Agrupar órdenes por tipo
    progreso.ordenes.forEach(orden => {
      const tipo = orden.tipo;
      if (!ordenesPorTipo.has(tipo)) {
        ordenesPorTipo.set(tipo, []);
      }
      ordenesPorTipo.get(tipo)!.push(orden);
    });

    // Agrupar tarimas por tipo de clasificación
    progreso.tarimas.forEach(tarima => {
      tarima.tarimasClasificaciones.forEach(clasificacion => {
        const tipo = clasificacion.tipo;
        if (!tarimasPorTipo.has(tipo)) {
          tarimasPorTipo.set(tipo, []);
        }
        tarimasPorTipo.get(tipo)!.push(tarima);
      });
    });

    // Calcular diferencias por tipo
    ordenesPorTipo.forEach((ordenes, tipo) => {
      const cantidadRequerida = ordenes.reduce((sum, orden) => sum + (orden.cantidad || 0), 0);
      const pesoRequerido = ordenes.reduce((sum, orden) => sum + (orden.peso || 0), 0);

      const tarimasDelTipo = tarimasPorTipo.get(tipo) || [];
      const cantidadAsignada = tarimasDelTipo.reduce((sum, tarima) => {
        const clasificacion = tarima.tarimasClasificaciones.find(c => c.tipo === tipo);
        return sum + (clasificacion?.cantidad || 0);
      }, 0);
      const pesoAsignado = tarimasDelTipo.reduce((sum, tarima) => {
        const clasificacion = tarima.tarimasClasificaciones.find(c => c.tipo === tipo);
        return sum + (clasificacion?.peso || 0);
      }, 0);

      const cantidadFaltante = Math.max(0, cantidadRequerida - cantidadAsignada);
      const pesoFaltante = Math.max(0, pesoRequerido - pesoAsignado);
      const porcentajeCumplimiento = cantidadRequerida > 0 
        ? Math.round((cantidadAsignada / cantidadRequerida) * 100) 
        : 100;

      diferencias.push({
        tipo,
        cantidadRequerida,
        cantidadAsignada,
        cantidadFaltante,
        pesoRequerido,
        pesoAsignado,
        pesoFaltante,
        porcentajeCumplimiento
      });
    });

    return diferencias;
  }, [progreso]);

  // Limpiar datos del progreso
  const limpiarProgreso = useCallback(() => {
    setProgreso(null);
    setError(null);
  }, []);

  // Limpiar solo el error
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  return {
    progreso,
    loading,
    error,
    obtenerProgresoPedidoCliente,
    calcularDiferencias,
    limpiarProgreso,
    limpiarError,
  };
}; 