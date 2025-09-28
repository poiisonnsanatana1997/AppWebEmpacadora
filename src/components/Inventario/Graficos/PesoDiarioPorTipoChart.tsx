/**
 * Componente de gráfico de peso diario por tipo para el dashboard de analytics
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
  Legend,
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
const LegendAny = Legend as any;
import { Scale, TrendingUp, Package, BarChart3 } from 'lucide-react';

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
interface PesoDiarioPorTipoData {
  fecha: string;
  pesoPorTipo: Record<string, number>;
  pesoTotal: number;
  fechaFormateada?: string;
}

interface PesoDiarioPorTipoChartProps {
  datos: PesoDiarioPorTipoData[];
  isLoading?: boolean;
  colores?: string[];
}

/**
 * Componente de gráfico de peso diario por tipo
 */
export const PesoDiarioPorTipoChart: React.FC<PesoDiarioPorTipoChartProps> = ({
  datos,
  isLoading = false,
  colores = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
}) => {
  /**
   * Procesa los datos para el gráfico de barras apiladas
   */
  const procesarDatos = () => {
    if (datos.length === 0) return [];

    // Obtener todos los tipos únicos
    const tiposUnicos = new Set<string>();
    datos.forEach(item => {
      Object.keys(item.pesoPorTipo).forEach(tipo => tiposUnicos.add(tipo));
    });

    // Crear estructura de datos para el gráfico
    return datos.map(item => {
      const datosProcesados: any = {
        fecha: item.fechaFormateada || item.fecha,
        pesoTotal: item.pesoTotal
      };

      // Agregar peso por cada tipo
      tiposUnicos.forEach(tipo => {
        datosProcesados[tipo] = item.pesoPorTipo[tipo] || 0;
      });

      return datosProcesados;
    });
  };

  /**
   * Calcula estadísticas generales
   */
  const calcularEstadisticas = () => {
    if (datos.length === 0) {
      return {
        pesoTotalPromedio: 0,
        diasAnalizados: 0,
        tipoMasPesado: '',
        pesoTotalPromedioFormateado: '0 ton'
      };
    }

    const pesoTotalPromedio = datos.reduce((sum, item) => sum + item.pesoTotal, 0) / datos.length;
    
    // Encontrar el tipo con mayor peso promedio
    const tiposUnicos = new Set<string>();
    datos.forEach(item => {
      Object.keys(item.pesoPorTipo).forEach(tipo => tiposUnicos.add(tipo));
    });

    let tipoMasPesado = '';
    let mayorPesoPromedio = 0;

    tiposUnicos.forEach(tipo => {
      const pesoPromedio = datos.reduce((sum, item) => sum + (item.pesoPorTipo[tipo] || 0), 0) / datos.length;
      if (pesoPromedio > mayorPesoPromedio) {
        mayorPesoPromedio = pesoPromedio;
        tipoMasPesado = tipo;
      }
    });

    return {
      pesoTotalPromedio,
      diasAnalizados: datos.length,
      tipoMasPesado,
      pesoTotalPromedioFormateado: `${(pesoTotalPromedio / 1000).toFixed(1)} ton`
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
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pesoTotal = payload.find((p: any) => p.dataKey === 'pesoTotal')?.value || 0;
      
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
            {label}
          </p>
          <p style={{ 
            margin: '0.25rem 0', 
            color: '#6b7280',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            Peso Total: {formatearPeso(pesoTotal)}
          </p>
          {payload
            .filter((p: any) => p.dataKey !== 'pesoTotal')
            .map((entry: any, index: number) => (
              <p key={index} style={{ 
                margin: '0.25rem 0', 
                color: entry.color,
                fontSize: '0.75rem'
              }}>
                {entry.name}: {formatearPeso(entry.value)}
              </p>
            ))}
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
        {payload?.filter((entry: any) => entry.dataKey !== 'pesoTotal').map((entry: any, index: number) => (
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

  const datosProcesados = procesarDatos();
  const estadisticas = calcularEstadisticas();

  if (isLoading) {
    return (
      <ChartContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingContainer>
          <div>Cargando peso diario por tipo...</div>
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
          <ChartTitle>Peso Diario por Tipo</ChartTitle>
          <ChartSubtitle>Distribución del peso por tipo de tarima en el tiempo</ChartSubtitle>
        </div>
        <StatsContainer>
          <StatItem>
            <Scale size={16} color="#6366f1" />
            <StatValue>{estadisticas.pesoTotalPromedioFormateado}</StatValue>
            <StatLabel>Promedio</StatLabel>
          </StatItem>
          <StatItem>
            <BarChart3 size={16} color="#10b981" />
            <StatValue>{estadisticas.diasAnalizados}</StatValue>
            <StatLabel>Días</StatLabel>
          </StatItem>
          <StatItem>
            <Package size={16} color="#f59e0b" />
            <StatValue style={{ fontSize: '0.875rem' }}>
              {estadisticas.tipoMasPesado}
            </StatValue>
            <StatLabel>Más Pesado</StatLabel>
          </StatItem>
        </StatsContainer>
      </ChartHeader>

      <ResponsiveContainerAny width="100%" height={250}>
        <BarChartAny data={datosProcesados} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGridAny strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxisAny 
            dataKey="fecha" 
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
          <LegendAny content={<CustomLegend />} />
          
          {/* Renderizar barras para cada tipo */}
          {datosProcesados.length > 0 && 
            Object.keys(datosProcesados[0])
              .filter(key => key !== 'fecha' && key !== 'pesoTotal')
              .sort((a, b) => {
                // Ordenar por tamaño: XL, L, M, S
                const orden = { 'XL': 0, 'L': 1, 'M': 2, 'S': 3 };
                return (orden[a as keyof typeof orden] || 999) - (orden[b as keyof typeof orden] || 999);
              })
              .map((tipo, index) => {
                // Colores estándar por tipo de tarima
                const getColorByTipo = (tipo: string) => {
                  switch (tipo) {
                    case 'XL': return '#7c3aed';
                    case 'L': return '#1e40af';
                    case 'M': return '#166534';
                    case 'S': return '#ea580c';
                    default: return colores[index % colores.length];
                  }
                };
                
                return (
                  <BarAny
                    key={tipo}
                    dataKey={tipo}
                    stackId="peso"
                    fill={getColorByTipo(tipo)}
                    name={tipo}
                    radius={index === 0 ? [0, 4, 4, 0] : 0}
                  />
                );
              })
          }
        </BarChartAny>
      </ResponsiveContainerAny>
    </ChartContainer>
  );
};
