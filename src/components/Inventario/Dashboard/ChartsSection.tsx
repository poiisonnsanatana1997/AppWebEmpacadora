/**
 * Sección de gráficos del dashboard
 */

import React from 'react';
import { Package } from 'lucide-react';
import { DistribucionTiposChart } from '../Graficos/DistribucionTiposChart';
import { EvolucionTemporalChart } from '../Graficos/EvolucionTemporalChart';

interface ChartsSectionProps {
  // Datos para evolución temporal
  tarimasDatosFormateados: any;
  tarimasLoading: boolean;
  tarimasRefreshing: boolean;
  coloresGraficos: any;
  onMetricaEvolucionChange: (metrica: string) => void;
  onPeriodoTarimasChange: (periodo: string) => void;
  onAgruparPorTarimasChange: (agruparPor: string) => void;
  
  // Datos para distribución por tipos
  distribucionDatosFormateados: any;
  distribucionLoading: boolean;
  
  // Estados generales
  analyticsLoading: boolean;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  tarimasDatosFormateados,
  tarimasLoading,
  tarimasRefreshing,
  coloresGraficos,
  onMetricaEvolucionChange,
  onPeriodoTarimasChange,
  onAgruparPorTarimasChange,
  distribucionDatosFormateados,
  distribucionLoading,
  analyticsLoading
}) => {
  const isLoading = analyticsLoading || tarimasLoading || distribucionLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-72 text-gray-500 w-full md:h-96 max-[480px]:h-60">
        <div>Cargando gráficos...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 w-full md:gap-5 lg:grid-cols-3 lg:gap-6 max-[480px]:gap-3">
      {/* Gráfico de Evolución Temporal */}
      {tarimasDatosFormateados?.evolucionTemporal && tarimasDatosFormateados.evolucionTemporal.length > 0 && (
        <div className="lg:col-span-2">
          <EvolucionTemporalChart
            datos={tarimasDatosFormateados.evolucionTemporal}
            isLoading={tarimasLoading}
            metrica={tarimasDatosFormateados.metricaEvolucion || 'peso'}
            periodo={tarimasDatosFormateados.periodo || '30d'}
            agruparPor={tarimasDatosFormateados.agruparPor || 'dia'}
            colores={coloresGraficos}
            onMetricaChange={onMetricaEvolucionChange}
            onPeriodoChange={onPeriodoTarimasChange}
            onAgruparPorChange={onAgruparPorTarimasChange}
            onRefresh={undefined}
            isRefreshing={tarimasRefreshing}
          />
        </div>
      )}

      {/* Gráfico de Distribución por Tipos */}
      <div className="lg:col-span-1">
        {distribucionDatosFormateados?.distribucionTipos?.length > 0 ? (
          <DistribucionTiposChart
            datos={distribucionDatosFormateados.distribucionTipos}
            isLoading={distribucionLoading}
            colores={coloresGraficos.coloresDistribucion}
          />
        ) : distribucionLoading ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 min-h-[500px] flex items-center justify-center">
            <div className="text-gray-500">Cargando distribución...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Distribución por Tipos
            </h3>
            <div className="flex-1 flex items-center justify-center text-center">
              <div className="text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay datos de inventario disponibles</p>
                <p className="text-xs mt-1 opacity-75">Los gráficos aparecerán cuando haya datos en el sistema</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
