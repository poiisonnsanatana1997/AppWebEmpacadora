/**
 * Componente de gráfico de distribución por clientes para el dashboard de analytics
 */

import React from 'react';
import { motion } from 'motion/react';
import styled from 'styled-components';
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
import { Users, Package } from 'lucide-react';

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

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
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
interface DistribucionCliente {
  cliente: string;
  cantidad: number;
  pesoTotal: number;
  porcentaje: number;
  pesoFormateado?: string;
  porcentajeFormateado?: string;
}

interface DistribucionClientesChartProps {
  datos: DistribucionCliente[];
  isLoading?: boolean;
  colores?: string[];
}

/**
 * Componente de gráfico de distribución por clientes
 */
export const DistribucionClientesChart: React.FC<DistribucionClientesChartProps> = ({
  datos,
  isLoading = false,
  colores = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
}) => {
  /**
   * Calcula estadísticas generales
   */
  const calcularEstadisticas = () => {
    const totalClientes = datos.filter(d => d.cliente !== 'Sin asignar').length;
    const totalTarimas = datos.reduce((sum, item) => sum + item.cantidad, 0);
    const pesoTotal = datos.reduce((sum, item) => sum + item.pesoTotal, 0);
    
    return {
      totalClientes,
      totalTarimas,
      pesoTotal: `${(pesoTotal / 1000).toFixed(1)} ton`
    };
  };

  /**
   * Formatea el peso para mostrar en tooltip
   */
  const formatearPeso = (peso: number): string => {
    return `${(peso / 1000).toFixed(1)} ton`;
  };

  /**
   * Custom tooltip para el gráfico
   */
  const CustomTooltip = ({ active, payload }: any) => {
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
            {data.cliente}
          </p>
          <p style={{ 
            margin: '0.25rem 0', 
            color: '#6b7280',
            fontSize: '0.75rem'
          }}>
            Tarimas: {data.cantidad}
          </p>
          <p style={{ 
            margin: '0.25rem 0', 
            color: '#6b7280',
            fontSize: '0.75rem'
          }}>
            Peso: {formatearPeso(data.pesoTotal)}
          </p>
          <p style={{ 
            margin: '0.25rem 0', 
            color: '#6b7280',
            fontSize: '0.75rem'
          }}>
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
    return (
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.5rem',
        justifyContent: 'center',
        marginTop: '1rem'
      }}>
        {payload?.map((entry: any, index: number) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem',
            fontSize: '0.75rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: entry.color,
              borderRadius: '2px'
            }} />
            <span style={{ color: '#6b7280' }}>
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
      <ChartContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingContainer>
          <div>Cargando distribución por clientes...</div>
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
          <ChartTitle>Distribución por Cliente</ChartTitle>
          <ChartSubtitle>Distribución del inventario por cliente</ChartSubtitle>
        </div>
        <StatsContainer>
          <StatItem>
            <Users size={16} color="#6366f1" />
            <StatValue>{estadisticas.totalClientes}</StatValue>
            <StatLabel>Clientes</StatLabel>
          </StatItem>
          <StatItem>
            <Package size={16} color="#10b981" />
            <StatValue>{estadisticas.totalTarimas}</StatValue>
            <StatLabel>Tarimas</StatLabel>
          </StatItem>
          <StatItem>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937' }}>
              {estadisticas.pesoTotal}
            </span>
            <StatLabel>Peso Total</StatLabel>
          </StatItem>
        </StatsContainer>
      </ChartHeader>

      <ResponsiveContainerAny width="100%" height={250}>
        <PieChartAny>
          <PieAny
            data={datos}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ cliente, porcentaje }) => `${cliente} (${porcentaje.toFixed(1)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="cantidad"
          >
            {datos.map((entry, index) => (
              <CellAny 
                key={`cell-${index}`} 
                fill={colores[index % colores.length]}
              />
            ))}
          </PieAny>
          <TooltipAny content={<CustomTooltip />} />
          <LegendAny content={<CustomLegend />} />
        </PieChartAny>
      </ResponsiveContainerAny>
    </ChartContainer>
  );
};
