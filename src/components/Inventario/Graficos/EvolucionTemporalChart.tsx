/**
 * Componente de gráfico de evolución temporal para el dashboard de analytics
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Solución temporal para el problema de tipos con ResponsiveContainer
const ResponsiveContainerAny = ResponsiveContainer as any;
const LineChartAny = LineChart as any;
const LineAny = Line as any;
const CartesianGridAny = CartesianGrid as any;
const XAxisAny = XAxis as any;
const YAxisAny = YAxis as any;
const TooltipAny = Tooltip as any;
const LegendAny = Legend as any;

import { TrendingUp, TrendingDown, Minus, Calendar, Package, Target, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { obtenerColorPorTipo } from '@/utils/colorUtils';

// Interfaces
interface EvolucionDato {
  fecha: string;
  fechaFormateada: string;
  XL: number;
  L: number;
  M: number;
  S: number;
}

interface EvolucionTemporalChartProps {
  datos: EvolucionDato[];
  isLoading?: boolean;
  metrica: 'peso' | 'tarimas';
  periodo: '7d' | '30d' | '90d' | '1y';
  agruparPor: 'dia' | 'semana' | 'mes';
  colores?: any;
  onMetricaChange?: (metrica: 'peso' | 'tarimas') => void;
  onPeriodoChange?: (periodo: '7d' | '30d' | '90d' | '1y') => void;
  onAgruparPorChange?: (agruparPor: 'dia' | 'semana' | 'mes') => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const EvolucionTemporalChart: React.FC<EvolucionTemporalChartProps> = ({
  datos,
  isLoading = false,
  metrica,
  periodo,
  agruparPor,
  colores,
  onMetricaChange,
  onPeriodoChange,
  onAgruparPorChange,
  onRefresh,
  isRefreshing = false
}) => {
  /**
   * Obtiene la unidad según la métrica
   */
  const obtenerUnidad = () => {
    return metrica === 'peso' ? 'kg' : 'tarimas';
  };

  /**
   * Obtiene el divisor para el eje Y según los valores máximos
   */
  const obtenerDivisorEjeY = () => {
    if (!datos || datos.length === 0) return 1;
    
    const valores = datos.flatMap(d => [d.XL, d.L, d.M, d.S]);
    const maximo = Math.max(...valores);
    
    if (metrica === 'peso' && maximo > 10000) {
      return 1000; // Mostrar en miles
    }
    return 1;
  };

  /**
   * Custom tooltip para el gráfico
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900 text-sm mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs mb-1" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString('es-MX')} {obtenerUnidad()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  /**
   * Calcula estadísticas de tendencia
   */
  const calcularTendencia = (tipo: 'XL' | 'L' | 'M' | 'S') => {
    if (!datos || datos.length < 2) return { tendencia: 'neutral', cambio: 0 };
    
    const ultimoValor = datos[datos.length - 1][tipo];
    const penultimoValor = datos[datos.length - 2][tipo];
    const cambio = ultimoValor - penultimoValor;
    
    if (cambio > 0) return { tendencia: 'up', cambio };
    if (cambio < 0) return { tendencia: 'down', cambio: Math.abs(cambio) };
    return { tendencia: 'neutral', cambio: 0 };
  };

  /**
   * Obtiene el ícono de tendencia
   */
  const obtenerIconoTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      default: return <Minus className="w-3 h-3 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 min-h-[500px] w-full flex flex-col md:p-4 max-[480px]:p-3 max-[480px]:min-h-[400px]">
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          Cargando evolución temporal...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 min-h-[500px] w-full flex flex-col md:p-4 max-[480px]:p-3 max-[480px]:min-h-[400px]">
      <div className="flex justify-between items-start mb-4 flex-wrap gap-4 md:flex-col md:items-stretch">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 m-0 max-[480px]:text-base">
            Evolución Temporal
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-[480px]:text-xs">
            {metrica === 'peso' 
              ? `Evolución del peso por tipo (${obtenerUnidad()})` 
              : `Evolución del número de ${obtenerUnidad()} por tipo`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center md:justify-center max-[480px]:gap-1">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600 font-medium">Métrica:</span>
            <Select value={metrica} onValueChange={onMetricaChange}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peso">Peso</SelectItem>
                <SelectItem value="tarimas">Tarimas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600 font-medium">Período:</span>
            <Select value={periodo} onValueChange={onPeriodoChange}>
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 días</SelectItem>
                <SelectItem value="30d">30 días</SelectItem>
                <SelectItem value="90d">90 días</SelectItem>
                <SelectItem value="1y">1 año</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600 font-medium">Agrupar:</span>
            <Select value={agruparPor} onValueChange={onAgruparPorChange}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dia">Día</SelectItem>
                <SelectItem value="semana">Semana</SelectItem>
                <SelectItem value="mes">Mes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="h-8 px-2"
            >
              <RefreshCw 
                size={14} 
                className={isRefreshing ? 'animate-spin' : ''} 
              />
            </Button>
          )}
        </div>
      </div>

      <ResponsiveContainerAny width="100%" height={300}>
        <LineChartAny data={datos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGridAny strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxisAny 
            dataKey="fechaFormateada" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxisAny 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ 
              value: obtenerUnidad(), 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '12px' }
            }}
            tickFormatter={(value) => {
              const divisor = obtenerDivisorEjeY();
              if (metrica === 'peso') {
                if (divisor === 1000) {
                  return `${(value / 1000).toFixed(0)}k`;
                } else {
                  return value.toLocaleString('es-MX');
                }
              } else {
                return value.toLocaleString('es-MX');
              }
            }}
          />
          <TooltipAny content={<CustomTooltip />} />
          <LegendAny />
          
          <LineAny
            type="monotone"
            dataKey="XL"
            stroke={obtenerColorPorTipo('XL')}
            strokeWidth={2}
            name={`XL (${obtenerUnidad()})`}
            dot={{ fill: obtenerColorPorTipo('XL'), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: obtenerColorPorTipo('XL'), strokeWidth: 2 }}
          />
          
          <LineAny
            type="monotone"
            dataKey="L"
            stroke={obtenerColorPorTipo('L')}
            strokeWidth={2}
            name={`L (${obtenerUnidad()})`}
            dot={{ fill: obtenerColorPorTipo('L'), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: obtenerColorPorTipo('L'), strokeWidth: 2 }}
          />
          
          <LineAny
            type="monotone"
            dataKey="M"
            stroke={obtenerColorPorTipo('M')}
            strokeWidth={2}
            name={`M (${obtenerUnidad()})`}
            dot={{ fill: obtenerColorPorTipo('M'), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: obtenerColorPorTipo('M'), strokeWidth: 2 }}
          />
          
          <LineAny
            type="monotone"
            dataKey="S"
            stroke={obtenerColorPorTipo('S')}
            strokeWidth={2}
            name={`S (${obtenerUnidad()})`}
            dot={{ fill: obtenerColorPorTipo('S'), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: obtenerColorPorTipo('S'), strokeWidth: 2 }}
          />
        </LineChartAny>
      </ResponsiveContainerAny>
    </div>
  );
};
