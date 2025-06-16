import { motion } from 'motion/react';
import { Calendar, CheckCircle, Loader2 } from 'lucide-react';
import styled from 'styled-components';

const IndicatorsContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const IndicatorCard = styled(motion.div)`
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(226, 232, 240, 0.5);
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(99, 102, 241, 0.2);
    background: #fafbff;
  }
`;

const IndicatorIcon = styled.div`
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 0.625rem;
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  ${IndicatorCard}:hover & {
    background: #6366f1;
    color: white;
  }
`;

const IndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const IndicatorValue = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #334155;
  line-height: 1.2;
`;

const IndicatorLabel = styled.span`
  font-size: 0.813rem;
  color: #64748B;
  font-weight: 500;
`;

interface IndicatorsProps {
  ordenesPendientesHoy: number;
  pesoTotalRecibidoHoy: number;
  loading: boolean;
}

export function Indicators({ ordenesPendientesHoy, pesoTotalRecibidoHoy, loading }: IndicatorsProps) {
  return (
    <IndicatorsContainer
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <IndicatorCard
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IndicatorIcon>
          <Calendar className="w-5 h-5" />
        </IndicatorIcon>
        <IndicatorContent>
          <IndicatorValue>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            ) : (
              ordenesPendientesHoy
            )}
          </IndicatorValue>
          <IndicatorLabel>Órdenes pendientes para hoy</IndicatorLabel>
        </IndicatorContent>
      </IndicatorCard>

      <IndicatorCard
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <IndicatorIcon>
          <CheckCircle className="w-5 h-5" />
        </IndicatorIcon>
        <IndicatorContent>
          <IndicatorValue>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            ) : (
              `${pesoTotalRecibidoHoy} kg`
            )}
          </IndicatorValue>
          <IndicatorLabel>Peso total recibido</IndicatorLabel>
        </IndicatorContent>
      </IndicatorCard>
    </IndicatorsContainer>
  );
} 