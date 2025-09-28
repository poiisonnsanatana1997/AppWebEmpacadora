/**
 * Componente de gráfico de distribución por tipos de tarimas para el dashboard de analytics
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

// Solución temporal para el problema de tipos con ResponsiveContainer
const ResponsiveContainerAny = ResponsiveContainer as any;
const PieChartAny = PieChart as any;
const PieAny = Pie as any;
const CellAny = Cell as any;
const TooltipAny = Tooltip as any;
const LegendAny = Legend as any;

import { Package, TrendingUp, BarChart3 } from 'lucide-react';
import { obtenerColorPorTipo } from '@/utils/colorUtils';

// Tipos
interface DistribucionTipo {
  tipo: string;
  cantidad: number;
  porcentaje: number;
}

interface DistribucionTiposChartProps {
  datos: DistribucionTipo[];
  isLoading?: boolean;
  colores?: string[];
}

/**
 * Componente de gráfico de distribución por tipos de tarimas
 */
export const DistribucionTiposChart: React.FC<DistribucionTiposChartProps> = ({
  datos,
  isLoading = false,
  colores = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
}) => {
  /**
   * Calcula estadísticas generales
   */
  const calcularEstadisticas = () => {
    const totalTipos = datos.length;
    const totalTarimas = datos.reduce((sum, item) => sum + item.cantidad, 0);
    const tipoMasComun = datos.reduce((max, item) => 
      item.cantidad > max.cantidad ? item : max, 
      { tipo: '', cantidad: 0, porcentaje: 0 }
    );
    
    return {
      totalTipos,
      totalTarimas,
      tipoMasComun: tipoMasComun.tipo
    };
  };

  /**
   * Custom tooltip para el gráfico
   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 text-sm mb-2">
            Tipo: {data.tipo}
          </p>
          <p className="text-gray-600 text-xs mb-1">
            Peso: {data.cantidad.toLocaleString()} kg
          </p>
          <p className="text-gray-600 text-xs">
            Porcentaje: {data.porcentaje.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  /**
   * Custom legend para el gráfico
   */
  const CustomLegend = ({ payload }: any) => {
    if (!payload || payload.length === 0) return null;
    
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload?.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1 text-xs">
            <div 
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const estadisticas = calcularEstadisticas();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 min-h-[500px] w-full flex flex-col md:p-4 max-[480px]:p-3 max-[480px]:min-h-[400px]"
      >
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          Cargando distribución por tipos...
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 min-h-[500px] w-full flex flex-col md:p-4 max-[480px]:p-3 max-[480px]:min-h-[400px]"
    >
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4 md:flex-col md:items-stretch">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 m-0 max-[480px]:text-base">
            Distribución por Tipo
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-[480px]:text-xs">
            Distribución de peso por tipo de tarima (kg)
          </p>
        </div>
        
        <div className="flex gap-3 flex-wrap md:gap-2 md:justify-center max-[480px]:gap-1">
          <div className="bg-slate-50 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 flex items-center gap-1 max-[480px]:px-2 max-[480px]:py-1 max-[480px]:text-[10px]">
            <BarChart3 className="w-3 h-3" />
            {estadisticas.totalTipos} Tipos
          </div>
          <div className="bg-slate-50 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 flex items-center gap-1 max-[480px]:px-2 max-[480px]:py-1 max-[480px]:text-[10px]">
            <Package className="w-3 h-3" />
            {estadisticas.totalTarimas.toLocaleString()} kg
          </div>
          {estadisticas.tipoMasComun && (
            <div className="bg-slate-50 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 flex items-center gap-1 max-[480px]:px-2 max-[480px]:py-1 max-[480px]:text-[10px]">
              <TrendingUp className="w-3 h-3" />
              Más Común: {estadisticas.tipoMasComun}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <ResponsiveContainerAny width="100%" height={300}>
          <PieChartAny>
            <PieAny
              data={datos}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ tipo, porcentaje }) => `${tipo} (${porcentaje.toFixed(1)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="cantidad"
            >
              {datos
                .sort((a, b) => {
                  // Ordenar por tamaño: XL, L, M, S primero, luego alfabéticamente
                  const orden = { 'XL': 0, 'L': 1, 'M': 2, 'S': 3 };
                  const ordenA = orden[a.tipo as keyof typeof orden] ?? 999;
                  const ordenB = orden[b.tipo as keyof typeof orden] ?? 999;
                  
                  if (ordenA !== 999 || ordenB !== 999) {
                    return ordenA - ordenB;
                  }
                  
                  return a.tipo.localeCompare(b.tipo);
                })
                .map((entry, index) => (
                  <CellAny 
                    key={`cell-${index}`} 
                    fill={obtenerColorPorTipo(entry.tipo) || colores[index % colores.length]} 
                  />
                ))
              }
            </PieAny>
            <TooltipAny content={<CustomTooltip />} />
            <LegendAny content={<CustomLegend />} />
          </PieChartAny>
        </ResponsiveContainerAny>
      </div>
    </motion.div>
  );
};
