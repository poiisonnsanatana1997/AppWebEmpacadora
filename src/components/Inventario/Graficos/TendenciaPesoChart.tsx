/**
 * Componente de gráfico de tendencias de peso para el dashboard de analytics
 */

import React from 'react';
import { motion } from 'motion/react';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// Solución temporal para el problema de tipos con ResponsiveContainer
const ResponsiveContainerAny = ResponsiveContainer as any;
const AreaChartAny = AreaChart as any;
const AreaAny = Area as any;
const CartesianGridAny = CartesianGrid as any;
const XAxisAny = XAxis as any;
const YAxisAny = YAxis as any;
const TooltipAny = Tooltip as any;
const LegendAny = Legend as any;
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Componentes estilizados
const ChartContainer = styled(motion.div)`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  height: 400px;
  width: 100%;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ChartSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
`;

const MetricContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetricValue = styled.span<{ isPositive?: boolean; isNegative?: boolean }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => {
    if (props.isPositive) return '#10b981';
    if (props.isNegative) return '#ef4444';
    return '#6b7280';
  }};
`;

const MetricLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
`;

// Tipos
interface TendenciaData {
  fecha: string;
  pesoTotal: number;
  tarimasAsignadas: number;
  tarimasNoAsignadas: number;
  fechaFormateada?: string;
}

interface TendenciaPesoChartProps {
  datos: TendenciaData[];
  isLoading?: boolean;
  colores?: {
    primario: string;
    secundario: string;
    exito: string;
    advertencia: string;
  };
}

/**
 * Componente de gráfico de tendencias de peso
 */
export const TendenciaPesoChart: React.FC<TendenciaPesoChartProps> = ({
  datos,
  isLoading = false,
  colores = {
    primario: '#6366f1',
    secundario: '#8b5cf6',
    exito: '#10b981',
    advertencia: '#f59e0b'
  }
}) => {
  /**
   * Calcula la variación porcentual
   */
  const calcularVariacion = (): { valor: number; esPositiva: boolean } => {
    if (datos.length < 2) return { valor: 0, esPositiva: false };

    const ultimo = datos[datos.length - 1];
    const penultimo = datos[datos.length - 2];
    
    if (penultimo.pesoTotal === 0) return { valor: 0, esPositiva: false };
    
    const variacion = ((ultimo.pesoTotal - penultimo.pesoTotal) / penultimo.pesoTotal) * 100;
    return {
      valor: Math.abs(variacion),
      esPositiva: variacion >= 0
    };
  };

  /**
   * Formatea el peso para mostrar en tooltip
   */
  const formatearPeso = (peso: number): string => {
    return `${(peso / 1000).toFixed(1)} ton`;
  };

  /**
   * Renderiza el icono de tendencia
   */
  const renderIconoTendencia = (esPositiva: boolean) => {
    if (esPositiva) {
      return <TrendingUp size={16} color="#10b981" />;
    } else {
      return <TrendingDown size={16} color="#ef4444" />;
    }
  };

  /**
   * Custom tooltip para el gráfico
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#1f2937' }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ 
              margin: '0.25rem 0', 
              color: entry.color,
              fontSize: '0.875rem'
            }}>
              {entry.name}: {formatearPeso(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const variacion = calcularVariacion();

  if (isLoading) {
    return (
      <ChartContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingContainer>
          <div>Cargando datos de tendencias...</div>
        </LoadingContainer>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ChartHeader>
        <div>
          <ChartTitle>Tendencia de Peso Total</ChartTitle>
          <ChartSubtitle>Evolución del peso total del inventario en el tiempo</ChartSubtitle>
        </div>
        <MetricContainer>
          {renderIconoTendencia(variacion.esPositiva)}
          <MetricValue isPositive={variacion.esPositiva} isNegative={!variacion.esPositiva}>
            {variacion.valor.toFixed(1)}%
          </MetricValue>
          <MetricLabel>vs período anterior</MetricLabel>
        </MetricContainer>
      </ChartHeader>

      <ResponsiveContainerAny width="100%" height={300}>
        <AreaChartAny data={datos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colores.primario} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={colores.primario} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
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
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <TooltipAny content={<CustomTooltip />} />
          <LegendAny />
          
          <AreaAny
            type="monotone"
            dataKey="pesoTotal"
            stroke={colores.primario}
            fillOpacity={1}
            fill="url(#colorPeso)"
            name="Peso Total (kg)"
            strokeWidth={2}
          />
        </AreaChartAny>
      </ResponsiveContainerAny>
    </ChartContainer>
  );
};
