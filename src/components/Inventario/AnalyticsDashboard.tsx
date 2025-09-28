/**
 * Componente principal del dashboard de analytics para el inventario
 */

import React, { useCallback } from 'react';
import { motion } from 'motion/react';
import type { IndicadoresInventarioDTO } from '@/types/Inventario/inventario.types';
import type { TarimasResumenFilters } from '@/hooks/Inventario/useInventarioUnificado';
import type { AnalyticsFilters } from '@/types/Inventario/reportes.types';
import { DashboardHeader } from './Dashboard/DashboardHeader';
import { IndicatorsSection } from './Dashboard/IndicatorsSection';
import { ChartsSection } from './Dashboard/ChartsSection';
import { ErrorSection } from './Dashboard/ErrorSection';






















interface AnalyticsDashboardProps {
  indicadores?: IndicadoresInventarioDTO | null;
  loading?: boolean;
  // Datos del hook unificado
  datosFormateados: any;
  analyticsData: any;
  // Filtros
  filtrosTarimas: TarimasResumenFilters;
  filtrosAnalytics: AnalyticsFilters;
  // Estados
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  // Acciones
  actualizarFiltrosTarimas: (filtros: Partial<TarimasResumenFilters>) => void;
  actualizarFiltrosAnalytics: (filtros: Partial<AnalyticsFilters>) => void;
  refrescar: () => Promise<void>;
}

/**
 * Componente principal del dashboard de analytics
 */
export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  indicadores, 
  loading = false,
  // Datos del hook unificado
  datosFormateados,
  analyticsData,
  // Filtros
  filtrosTarimas,
  filtrosAnalytics,
  // Estados
  isLoading,
  error,
  isRefreshing,
  // Acciones
  actualizarFiltrosTarimas,
  actualizarFiltrosAnalytics,
  refrescar
}) => {

  /**
   * Maneja el cambio de período para analytics
   */
  const handlePeriodoChange = (periodo: string) => {
    actualizarFiltrosAnalytics({ periodo: periodo as '7d' | '30d' | '90d' | '1y' });
  };

  /**
   * Maneja el cambio de agrupación para analytics
   */
  const handleAgruparPorChange = (agruparPor: string) => {
    actualizarFiltrosAnalytics({ agruparPor: agruparPor as 'dia' | 'semana' | 'mes' });
  };

  /**
   * Maneja el cambio de métrica para evolución temporal
   */
  const handleMetricaEvolucionChange = (metrica: string) => {
    actualizarFiltrosTarimas({ metricaEvolucion: metrica as 'peso' | 'tarimas' });
  };

  /**
   * Maneja el cambio de período para tarimas
   */
  const handlePeriodoTarimasChange = (periodo: string) => {
    actualizarFiltrosTarimas({ periodo: periodo as '7d' | '30d' | '90d' | '1y' });
  };

  /**
   * Maneja el cambio de agrupación para tarimas
   */
  const handleAgruparPorTarimasChange = (agruparPor: string) => {
    actualizarFiltrosTarimas({ agruparPor: agruparPor as 'dia' | 'semana' | 'mes' });
  };

  /**
   * Función unificada para actualizar todos los datos del dashboard
   */
  const actualizarTodo = useCallback(async () => {
    await refrescar();
  }, [refrescar]);


  if (error) {
    return (
      <ErrorSection 
        error={error} 
        onRetry={actualizarTodo} 
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-200 w-full max-w-full overflow-hidden md:p-5 md:mb-5 lg:p-6 lg:mb-6 max-[480px]:p-3 max-[480px]:mb-3 max-[480px]:rounded-xl"
    >
      <DashboardHeader 
        onActualizarTodo={actualizarTodo}
        isRefreshingAll={isRefreshing}
      />

      <IndicatorsSection 
        indicadores={indicadores}
        loading={loading || isLoading}
      />

      <ChartsSection
        tarimasDatosFormateados={datosFormateados}
        tarimasLoading={isLoading}
        tarimasRefreshing={isRefreshing}
        coloresGraficos={{
          primario: '#6b21a8',
          secundario: '#1e40af',
          exito: '#166534',
          advertencia: '#9a3412',
          error: '#ef4444',
          gris: '#6b7280',
          coloresDistribucion: ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
        }}
        onMetricaEvolucionChange={handleMetricaEvolucionChange}
        onPeriodoTarimasChange={handlePeriodoTarimasChange}
        onAgruparPorTarimasChange={handleAgruparPorTarimasChange}
        distribucionDatosFormateados={datosFormateados}
        distribucionLoading={isLoading}
        analyticsLoading={isLoading}
      />
    </motion.div>
  );
};
