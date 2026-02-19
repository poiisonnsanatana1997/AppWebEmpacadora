import { useState, useCallback, useEffect } from 'react';
import { EstadisticasOrdenesEntradaService } from '@/services/estadisticasOrdenesEntrada.service';
import { DashboardEstadisticasDto } from '@/types/OrdenesEntrada/estadisticas.types';

/**
 * Hook personalizado para gestionar las estadísticas del dashboard de Órdenes de Entrada
 * Proporciona carga automática, refresh manual y manejo de errores
 *
 * @param {boolean} autoRefresh - Si debe refrescar automáticamente cada X segundos
 * @param {number} refreshInterval - Intervalo de refresh en milisegundos (default: 60000 = 1 min)
 */
export const useEstadisticasOrdenesEntrada = (
  autoRefresh: boolean = false,
  refreshInterval: number = 60000
) => {
  const [estadisticas, setEstadisticas] = useState<DashboardEstadisticasDto>(
    EstadisticasOrdenesEntradaService.obtenerEstadisticasDefault()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);

  /**
   * Carga las estadísticas del dashboard
   * Puede ser llamado manualmente para refrescar datos
   */
  const cargarEstadisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await EstadisticasOrdenesEntradaService.obtenerDashboardCompleto();
      setEstadisticas(data);
      setUltimaActualizacion(new Date());
    } catch (err: any) {
      console.error('Error al cargar estadísticas:', err);
      if (err?.response?.status !== 401) {
        setError('Error al cargar las estadísticas. Usando valores por defecto.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresca estadísticas de forma optimista
   * No muestra loading, actualiza en background
   */
  const refrescarSilenciosamente = useCallback(async () => {
    try {
      const data = await EstadisticasOrdenesEntradaService.obtenerDashboardCompleto();
      setEstadisticas(data);
      setUltimaActualizacion(new Date());
      setError(null);
    } catch (err) {
      // No establecer error en refresh silencioso
      console.warn('Error en refresh silencioso de estadísticas:', err);
    }
  }, []);

  /**
   * Invalida cache y fuerza recarga desde el servidor
   */
  const invalidarCache = useCallback(async () => {
    try {
      await EstadisticasOrdenesEntradaService.refrescarEstadisticas();
      await cargarEstadisticas();
    } catch (err) {
      console.error('Error al invalidar cache:', err);
    }
  }, [cargarEstadisticas]);

  // Carga inicial
  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      refrescarSilenciosamente();
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, refrescarSilenciosamente]);

  // Refresh cuando la ventana recupera el foco
  useEffect(() => {
    const handleFocus = () => {
      refrescarSilenciosamente();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refrescarSilenciosamente]);

  return {
    // Datos
    estadisticas,
    loading,
    error,
    ultimaActualizacion,

    // Acceso directo a métricas individuales (comodidad)
    ordenesPendientes: estadisticas.ordenesPendientes,
    pesoRecibido: estadisticas.pesoRecibido,
    ordenesClasificadas: estadisticas.ordenesClasificadas,
    ordenesRetrasadas: estadisticas.ordenesRetrasadas,
    ordenesEnClasificacion: estadisticas.ordenesEnClasificacion,
    tasaCumplimiento: estadisticas.tasaCumplimiento,
    proveedoresActivos: estadisticas.proveedoresActivos,

    // Acciones
    cargarEstadisticas,
    refrescarSilenciosamente,
    invalidarCache
  };
};
