/**
 * Componente de gráfico de eficiencia por tipo de tarimas para el dashboard de analytics
 */

import React from 'react';
import { motion } from 'motion/react';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Solución temporal para el problema de tipos con ResponsiveContainer
const ResponsiveContainerAny = ResponsiveContainer as any;
const BarChartAny = BarChart as any;
const BarAny = Bar as any;
const CartesianGridAny = CartesianGrid as any;
const XAxisAny = XAxis as any;
const YAxisAny = YAxis as any;
const TooltipAny = Tooltip as any;
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

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

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const StatValue = styled.span<{ isPositive?: boolean; isNegative?: boolean }>`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => {
    if (props.isPositive) return '#10b981';
    if (props.isNegative) return '#ef4444';
    return '#1f2937';
  }};
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
`;

// Tipos
interface EficienciaTipo {
  tipo: string;
  eficiencia: number;
  eficienciaFormateada: string;
}

interface EficienciaPorTipoChartProps {
  datos: EficienciaTipo[];
  isLoading?: boolean;
  colores?: {
    primario: string;
    secundario: string;
    exito: string;
    advertencia: string;
  };
}

/**
 * Componente de gráfico de eficiencia por tipo de tarimas
 */
export const EficienciaPorTipoChart: React.FC<EficienciaPorTipoChartProps> = ({
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
   * Calcula estadísticas de eficiencia
   */
  const calcularEstadisticas = () => {
    if (datos.length === 0) {
      return {
        eficienciaPromedio: 0,
        tipoMasEficiente: '',
        tipoMenosEficiente: '',
        eficienciaPromedioFormateada: '0%'
      };
    }

    const eficienciaPromedio = datos.reduce((sum, item) => sum + item.eficiencia, 0) / datos.length;
    const tipoMasEficiente = datos.reduce((max, item) => 
      item.eficiencia > max.eficiencia ? item : max
    );
    const tipoMenosEficiente = datos.reduce((min, item) => 
      item.eficiencia < min.eficiencia ? item : min
    );

    return {
      eficienciaPromedio,
      tipoMasEficiente: tipoMasEficiente.tipo,
      tipoMenosEficiente: tipoMenosEficiente.tipo,
      eficienciaPromedioFormateada: `${eficienciaPromedio.toFixed(1)}%`
    };
  };

  /**
   * Obtiene el color de la barra según la eficiencia
   */
  const getBarColor = (eficiencia: number): string => {
    if (eficiencia >= 90) return colores.exito;
    if (eficiencia >= 70) return colores.primario;
    if (eficiencia >= 50) return colores.advertencia;
    return '#ef4444';
  };

  /**
   * Custom tooltip para el gráfico
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ 
            margin: '0 0 0.5rem 0', 
            fontWeight: 600, 
            color: '#1f2937',
            fontSize: '0.875rem'
          }}>
            Tipo: {label}
          </p>
          <p style={{ 
            margin: '0.25rem 0', 
            color: payload[0].color,
            fontSize: '0.75rem'
          }}>
            Eficiencia: {data.eficienciaFormateada}
          </p>
        </div>
      );
    }
    return null;
  };

  const estadisticas = calcularEstadisticas();

  if (isLoading) {
    return (
      <ChartContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingContainer>
          <div>Cargando eficiencia por tipo...</div>
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
          <ChartTitle>Eficiencia por Tipo</ChartTitle>
          <ChartSubtitle>Análisis de eficiencia operativa por tipo de tarima</ChartSubtitle>
        </div>
        <StatsContainer>
          <StatItem>
            <Target size={16} color="#6366f1" />
            <StatValue>{estadisticas.eficienciaPromedioFormateada}</StatValue>
            <StatLabel>Promedio</StatLabel>
          </StatItem>
          <StatItem>
            <TrendingUp size={16} color="#10b981" />
            <StatValue style={{ fontSize: '0.875rem' }}>
              {estadisticas.tipoMasEficiente}
            </StatValue>
            <StatLabel>Más Eficiente</StatLabel>
          </StatItem>
          <StatItem>
            <TrendingDown size={16} color="#ef4444" />
            <StatValue style={{ fontSize: '0.875rem' }}>
              {estadisticas.tipoMenosEficiente}
            </StatValue>
            <StatLabel>Menos Eficiente</StatLabel>
          </StatItem>
        </StatsContainer>
      </ChartHeader>

      <ResponsiveContainerAny width="100%" height={250}>
        <BarChartAny 
          data={datos} 
          layout="horizontal"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGridAny strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxisAny 
            type="number"
            domain={[0, 100]}
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxisAny 
            type="category"
            dataKey="tipo"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <TooltipAny content={<CustomTooltip />} />
          
          <BarAny
            dataKey="eficiencia"
            radius={[0, 4, 4, 0]}
            fill={(entry: any) => getBarColor(entry.eficiencia)}
          >
            {datos.map((entry, index) => (
              <BarAny
                key={`bar-${index}`}
                fill={getBarColor(entry.eficiencia)}
              />
            ))}
          </BarAny>
        </BarChartAny>
      </ResponsiveContainerAny>
    </ChartContainer>
  );
};
