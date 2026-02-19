import { motion } from 'motion/react';
import { Clock, Scale, Loader2 } from 'lucide-react';
import styled from 'styled-components';

const IndicatorsContainer = styled(motion.div)`
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 640px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const IndicatorCard = styled(motion.div)`
  background: #ffffff;
  padding: 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    padding: 1.25rem;
    gap: 1rem;
  }
`;

const IndicatorIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const IndicatorIcon = styled.div<{ color?: string }>`
  background: ${props => props.color ? `${props.color}10` : '#f9fafb'};
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: ${props => props.color || '#6b7280'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (min-width: 640px) {
    padding: 0.75rem;
    border-radius: 0.5rem;
  }
`;

const IndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;

  @media (min-width: 640px) {
    gap: 0.25rem;
  }
`;

const IndicatorValue = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  line-height: 1;

  @media (min-width: 640px) {
    font-size: 1.5rem;
    line-height: 1.2;
  }
`;

const IndicatorLabel = styled.span`
  font-size: 0.688rem;
  color: #6b7280;
  font-weight: 400;
  line-height: 1.2;

  @media (min-width: 640px) {
    font-size: 0.875rem;
    line-height: 1.4;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UnitText = styled.span`
  font-size: 0.688rem;
  font-weight: 500;
  color: #6b7280;
  margin-left: 0.125rem;

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
`;

interface IndicatorsProps {
  ordenesPendientesHoy: number;
  pesoTotalRecibidoHoy: number;
  loading: boolean;
}

export function Indicators({ ordenesPendientesHoy, pesoTotalRecibidoHoy, loading }: IndicatorsProps) {
  // Formatear peso con separadores de miles
  const formatearPeso = (peso: number): string => {
    return new Intl.NumberFormat('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(peso);
  };

  return (
    <IndicatorsContainer
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Indicador de Órdenes Pendientes */}
      <IndicatorCard
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        role="article"
        aria-label="Órdenes pendientes para hoy"
      >
        <IndicatorIcon color="#f59e0b" aria-hidden="true">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
        </IndicatorIcon>

        <IndicatorContent>
          <IndicatorValue aria-live="polite">
            {loading ? (
              <LoadingContainer>
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-gray-400" />
                <span className="sr-only">Cargando órdenes pendientes</span>
              </LoadingContainer>
            ) : (
              <>
                {ordenesPendientesHoy}
                <span className="sr-only">órdenes pendientes</span>
              </>
            )}
          </IndicatorValue>
          <IndicatorLabel>
            <span className="sm:hidden">Pendientes</span>
            <span className="hidden sm:inline">Órdenes pendientes para hoy</span>
          </IndicatorLabel>
        </IndicatorContent>
      </IndicatorCard>

      {/* Indicador de Peso Recibido */}
      <IndicatorCard
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        role="article"
        aria-label="Peso total recibido hoy"
      >
        <IndicatorIcon color="#10b981" aria-hidden="true">
          <Scale className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
        </IndicatorIcon>

        <IndicatorContent>
          <IndicatorValue aria-live="polite">
            {loading ? (
              <LoadingContainer>
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-gray-400" />
                <span className="sr-only">Cargando peso recibido</span>
              </LoadingContainer>
            ) : (
              <>
                {formatearPeso(pesoTotalRecibidoHoy)} <UnitText>kg</UnitText>
                <span className="sr-only">kilogramos recibidos hoy</span>
              </>
            )}
          </IndicatorValue>
          <IndicatorLabel>
            <span className="sm:hidden">Recibido</span>
            <span className="hidden sm:inline">Peso total recibido hoy</span>
          </IndicatorLabel>
        </IndicatorContent>
      </IndicatorCard>
    </IndicatorsContainer>
  );
}
