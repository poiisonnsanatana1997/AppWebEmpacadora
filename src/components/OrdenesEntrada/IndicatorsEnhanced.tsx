import { motion } from 'motion/react';
import {
  Clock,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2
} from 'lucide-react';
import styled from 'styled-components';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IndicatorCardProps, TrendDirection, AlertLevel } from '@/types/OrdenesEntrada/estadisticas.types';

// Tokens de color semánticos
const INDICATOR_COLORS = {
  pending: {
    icon: '#f59e0b',
    iconBg: '#fef3c7',
    hoverBg: '#fffbeb',
    border: 'rgba(245, 158, 11, 0.2)'
  },
  weight: {
    icon: '#8b5cf6',
    iconBg: '#ede9fe',
    hoverBg: '#f5f3ff',
    border: 'rgba(139, 92, 246, 0.2)'
  },
  completed: {
    icon: '#10b981',
    iconBg: '#d1fae5',
    hoverBg: '#ecfdf5',
    border: 'rgba(16, 185, 129, 0.2)'
  },
  alert: {
    icon: '#ef4444',
    iconBg: '#fee2e2',
    hoverBg: '#fef2f2',
    border: 'rgba(239, 68, 68, 0.2)'
  },
  inProgress: {
    icon: '#3b82f6',
    iconBg: '#dbeafe',
    hoverBg: '#eff6ff',
    border: 'rgba(59, 130, 246, 0.2)'
  },
  kpi: {
    icon: '#6366f1',
    iconBg: '#e0e7ff',
    hoverBg: '#eef2ff',
    border: 'rgba(99, 102, 241, 0.2)'
  }
};

// Contenedor principal con grid responsivo
const IndicatorsGrid = styled(motion.div)`
  display: grid;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  width: 100%;

  /* Mobile: Scroll horizontal */
  @media (max-width: 767px) {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0.75rem;
    padding-bottom: 0.5rem;

    /* Ocultar scrollbar pero mantener funcionalidad */
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;

    &::-webkit-scrollbar {
      height: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
  }

  /* Tablet: 2 columnas */
  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  /* Desktop pequeño: 3 columnas */
  @media (min-width: 1024px) and (max-width: 1279px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  /* Desktop grande: 4 columnas */
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
`;

// Card individual con cursor pointer si es clickeable
const IndicatorCard = styled(motion.div)<{
  $clickable?: boolean;
  $colorScheme: keyof typeof INDICATOR_COLORS;
  $alertLevel?: AlertLevel;
}>`
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => INDICATOR_COLORS[props.$colorScheme].border};
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  position: relative;
  min-height: 120px;

  /* Badge de alerta en esquina superior derecha */
  ${props => props.$alertLevel === 'danger' && `
    &::before {
      content: '';
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 8px;
      height: 8px;
      background: #ef4444;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `}

  &:hover {
    border-color: ${props => INDICATOR_COLORS[props.$colorScheme].icon};
    background: ${props => INDICATOR_COLORS[props.$colorScheme].hoverBg};
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: ${props => props.$clickable ? 'translateY(-2px)' : 'none'};
  }

  &:active {
    transform: ${props => props.$clickable ? 'translateY(0)' : 'none'};
  }

  /* Mobile: ancho fijo para scroll */
  @media (max-width: 767px) {
    min-width: 160px;
    flex-shrink: 0;
    scroll-snap-align: start;
    padding: 1rem;
    min-height: 100px;
  }

  /* Tablet */
  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 1.25rem;
    min-height: 110px;
  }
`;

// Icono con fondo coloreado
const IndicatorIcon = styled.div<{ $colorScheme: keyof typeof INDICATOR_COLORS }>`
  background: ${props => INDICATOR_COLORS[props.$colorScheme].iconBg};
  padding: 0.75rem;
  border-radius: 0.625rem;
  color: ${props => INDICATOR_COLORS[props.$colorScheme].icon};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  ${IndicatorCard}:hover & {
    background: ${props => INDICATOR_COLORS[props.$colorScheme].icon};
    color: white;
  }

  @media (max-width: 767px) {
    padding: 0.625rem;
  }
`;

// Contenido del indicador
const IndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0; /* Permite truncate en mobile */
`;

// Valor principal
const IndicatorValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;

  @media (max-width: 767px) {
    font-size: 1.5rem;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    font-size: 1.625rem;
  }
`;

// Label del indicador
const IndicatorLabel = styled.span`
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
  line-height: 1.4;

  @media (max-width: 767px) {
    font-size: 0.75rem;
  }
`;

// Tendencia
const TrendIndicator = styled.div<{ $direction: TrendDirection }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.25rem;
  color: ${props =>
    props.$direction === 'up' ? '#10b981' :
    props.$direction === 'down' ? '#ef4444' :
    '#64748b'
  };

  @media (max-width: 767px) {
    font-size: 0.688rem;
  }
`;

/**
 * Componente individual de tarjeta indicadora
 */
export const IndicatorCardComponent: React.FC<IndicatorCardProps> = ({
  icon,
  value,
  label,
  trend,
  alertLevel,
  loading = false,
  onClick,
  tooltip,
  colorScheme,
  ariaLabel
}) => {
  const getTrendIcon = (direction: TrendDirection) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const cardContent = (
    <IndicatorCard
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      $clickable={!!onClick}
      $colorScheme={colorScheme}
      $alertLevel={alertLevel}
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      aria-label={ariaLabel || `${label}: ${value}`}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <IndicatorIcon $colorScheme={colorScheme} aria-hidden="true">
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          icon
        )}
      </IndicatorIcon>
      <IndicatorContent>
        <IndicatorValue>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          ) : (
            value
          )}
        </IndicatorValue>
        <IndicatorLabel>{label}</IndicatorLabel>
        {trend && !loading && (
          <TrendIndicator $direction={trend.direction} aria-label={trend.label}>
            {getTrendIcon(trend.direction)}
            <span>{trend.value > 0 ? '+' : ''}{trend.value} {trend.label}</span>
          </TrendIndicator>
        )}
      </IndicatorContent>
    </IndicatorCard>
  );

  if (tooltip) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
};

/**
 * Props para el componente principal de indicadores
 */
interface IndicatorsEnhancedProps {
  ordenesPendientesHoy: number;
  pesoTotalRecibidoHoy: number;
  ordenesClasificadasHoy?: number;
  ordenesRetrasadas?: number;
  ordenesEnClasificacion?: number;
  tasaCumplimiento?: number;
  loading: boolean;
  onFilterByPendientes?: () => void;
  onFilterByClasificadas?: () => void;
  onFilterByRetrasadas?: () => void;
  onFilterByEnClasificacion?: () => void;
  comparacionAyer?: {
    pendientes: number;
    peso: number;
    clasificadas: number;
  };
}

/**
 * Componente principal de indicadores mejorado
 * Muestra métricas clave del dashboard de Órdenes de Entrada
 */
export function IndicatorsEnhanced({
  ordenesPendientesHoy,
  pesoTotalRecibidoHoy,
  ordenesClasificadasHoy = 0,
  ordenesRetrasadas = 0,
  ordenesEnClasificacion = 0,
  tasaCumplimiento = 0,
  loading,
  onFilterByPendientes,
  onFilterByClasificadas,
  onFilterByRetrasadas,
  onFilterByEnClasificacion,
  comparacionAyer
}: IndicatorsEnhancedProps) {

  // Formatear peso con separadores de miles
  const formatPeso = (peso: number): string => {
    return peso.toLocaleString('es-MX', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  // Formatear porcentaje
  const formatPorcentaje = (valor: number): string => {
    return `${valor.toFixed(1)}%`;
  };

  // Determinar nivel de alerta para retrasadas
  const alertLevelRetrasadas: AlertLevel =
    ordenesRetrasadas === 0 ? 'success' :
    ordenesRetrasadas <= 2 ? 'warning' :
    'danger';

  // Determinar nivel de alerta para cumplimiento
  const alertLevelCumplimiento: AlertLevel =
    tasaCumplimiento >= 90 ? 'success' :
    tasaCumplimiento >= 70 ? 'warning' :
    'danger';

  return (
    <IndicatorsGrid
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      role="region"
      aria-label="Indicadores de métricas de órdenes de entrada"
    >
      {/* Órdenes Pendientes */}
      <IndicatorCardComponent
        icon={<Clock className="w-6 h-6" />}
        value={ordenesPendientesHoy}
        label="Pendientes hoy"
        colorScheme="pending"
        loading={loading}
        onClick={onFilterByPendientes}
        tooltip="Órdenes con fecha estimada para hoy que aún no han sido recibidas. Click para filtrar."
        ariaLabel={`${ordenesPendientesHoy} órdenes pendientes para hoy`}
        trend={comparacionAyer ? {
          value: comparacionAyer.pendientes,
          direction: comparacionAyer.pendientes > 0 ? 'up' : comparacionAyer.pendientes < 0 ? 'down' : 'stable',
          label: 'vs ayer'
        } : undefined}
      />

      {/* Peso Total Recibido */}
      <IndicatorCardComponent
        icon={<Scale className="w-6 h-6" />}
        value={`${formatPeso(pesoTotalRecibidoHoy)} kg`}
        label="Recibido hoy"
        colorScheme="weight"
        loading={loading}
        tooltip="Peso total neto de todas las órdenes recibidas hoy"
        ariaLabel={`${formatPeso(pesoTotalRecibidoHoy)} kilogramos recibidos hoy`}
        trend={comparacionAyer ? {
          value: comparacionAyer.peso,
          direction: comparacionAyer.peso > 0 ? 'up' : comparacionAyer.peso < 0 ? 'down' : 'stable',
          label: 'kg vs ayer'
        } : undefined}
      />

      {/* Órdenes Clasificadas */}
      <IndicatorCardComponent
        icon={<CheckCircle2 className="w-6 h-6" />}
        value={ordenesClasificadasHoy}
        label="Clasificadas hoy"
        colorScheme="completed"
        loading={loading}
        onClick={onFilterByClasificadas}
        tooltip="Órdenes completamente clasificadas el día de hoy. Click para ver detalles."
        ariaLabel={`${ordenesClasificadasHoy} órdenes clasificadas hoy`}
        trend={comparacionAyer ? {
          value: comparacionAyer.clasificadas,
          direction: comparacionAyer.clasificadas > 0 ? 'up' : comparacionAyer.clasificadas < 0 ? 'down' : 'stable',
          label: 'vs ayer'
        } : undefined}
      />

      {/* Órdenes Retrasadas */}
      <IndicatorCardComponent
        icon={<AlertTriangle className="w-6 h-6" />}
        value={ordenesRetrasadas}
        label="Retrasadas"
        colorScheme="alert"
        loading={loading}
        onClick={onFilterByRetrasadas}
        alertLevel={alertLevelRetrasadas}
        tooltip="Órdenes con fecha estimada pasada que aún no han sido recibidas. Requieren atención urgente."
        ariaLabel={`${ordenesRetrasadas} órdenes retrasadas que requieren atención`}
      />

      {/* Órdenes en Clasificación */}
      <IndicatorCardComponent
        icon={<Activity className="w-6 h-6" />}
        value={ordenesEnClasificacion}
        label="En clasificación"
        colorScheme="inProgress"
        loading={loading}
        onClick={onFilterByEnClasificacion}
        tooltip="Órdenes actualmente en proceso de clasificación (Work In Progress)"
        ariaLabel={`${ordenesEnClasificacion} órdenes en proceso de clasificación`}
      />

      {/* Tasa de Cumplimiento */}
      <IndicatorCardComponent
        icon={<Target className="w-6 h-6" />}
        value={formatPorcentaje(tasaCumplimiento)}
        label="Cumplimiento"
        colorScheme="kpi"
        loading={loading}
        alertLevel={alertLevelCumplimiento}
        tooltip="Porcentaje de órdenes recibidas a tiempo vs. total esperadas para hoy"
        ariaLabel={`Tasa de cumplimiento del ${formatPorcentaje(tasaCumplimiento)}`}
      />
    </IndicatorsGrid>
  );
}
