import { motion } from 'motion/react';
import styled from 'styled-components';
import type { IndicadoresInventarioDTO } from '@/types/Inventario/inventario.types';

const IndicatorsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

interface IndicatorsProps {
  indicadores: IndicadoresInventarioDTO | null;
  loading: boolean;
  analyticsData?: {
    pesoTotal: number;
    cantidadTotal: number;
    clientesActivos: number;
    ocupacionPromedio: number;
  };
}

/**
 * Componente wrapper para indicadores (ahora integrados en AnalyticsDashboard)
 * Se mantiene por compatibilidad pero los indicadores están en AnalyticsDashboard
 */
export function Indicators({ indicadores, loading, analyticsData }: IndicatorsProps) {
  // Los indicadores ahora están integrados en AnalyticsDashboard
  // Este componente se mantiene por compatibilidad pero no renderiza nada
  return null;
}
