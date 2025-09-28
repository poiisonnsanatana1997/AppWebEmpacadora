import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { 
  Users, 
  Building2, 
  Package, 
  Activity,
  Loader2
} from 'lucide-react';
import { ClienteDTO } from '../../types/Cliente/cliente.types';

// Styled Components
const IndicatorsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const IndicatorCard = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  &:hover {
    border-color: rgba(59, 130, 246, 0.2);
    background: #f8fafc;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
`;

const IndicatorIcon = styled.div`
  background: #f1f5f9;
  padding: 0.75rem;
  border-radius: 0.625rem;
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  ${IndicatorCard}:hover & {
    background: #3b82f6;
    color: white;
  }
`;

const IndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
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

const IndicatorSubtitle = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.125rem;
`;

interface IndicatorsProps {
  clientes: ClienteDTO[];
  loading?: boolean;
}

export const Indicators: React.FC<IndicatorsProps> = ({
  clientes,
  loading = false
}) => {
  const totalClientes = clientes.length;
  const clientesActivos = clientes.filter(cliente => cliente.activo).length;
  const totalSucursales = clientes.reduce((acc, cliente) => acc + (cliente.sucursales?.length || 0), 0);
  const totalCajas = clientes.reduce((acc, cliente) => acc + (cliente.cajasCliente?.length || 0), 0);
  const porcentajeActivos = totalClientes > 0 ? Math.round((clientesActivos / totalClientes) * 100) : 0;

  if (loading) {
    return (
      <IndicatorsContainer
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {[...Array(4)].map((_, i) => (
          <IndicatorCard
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <IndicatorIcon>
              <Loader2 className="w-5 h-5 animate-spin" />
            </IndicatorIcon>
            <IndicatorContent>
              <IndicatorValue>
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              </IndicatorValue>
              <IndicatorLabel>Cargando...</IndicatorLabel>
            </IndicatorContent>
          </IndicatorCard>
        ))}
      </IndicatorsContainer>
    );
  }

  return (
    <IndicatorsContainer
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Total de Clientes */}
      <IndicatorCard
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IndicatorIcon>
          <Users className="w-5 h-5" />
        </IndicatorIcon>
        <IndicatorContent>
          <IndicatorValue>{totalClientes}</IndicatorValue>
          <IndicatorLabel>Total de Clientes</IndicatorLabel>
          <IndicatorSubtitle>Clientes registrados en el sistema</IndicatorSubtitle>
        </IndicatorContent>
      </IndicatorCard>

      {/* Clientes Activos */}
      <IndicatorCard
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <IndicatorIcon>
          <Activity className="w-5 h-5" />
        </IndicatorIcon>
        <IndicatorContent>
          <IndicatorValue>{clientesActivos}</IndicatorValue>
          <IndicatorLabel>Clientes Activos</IndicatorLabel>
          <IndicatorSubtitle>{porcentajeActivos}% del total</IndicatorSubtitle>
        </IndicatorContent>
      </IndicatorCard>

      {/* Total de Sucursales */}
      <IndicatorCard
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <IndicatorIcon>
          <Building2 className="w-5 h-5" />
        </IndicatorIcon>
        <IndicatorContent>
          <IndicatorValue>{totalSucursales}</IndicatorValue>
          <IndicatorLabel>Total Sucursales</IndicatorLabel>
          <IndicatorSubtitle>Sucursales registradas</IndicatorSubtitle>
        </IndicatorContent>
      </IndicatorCard>

      {/* Total de Cajas */}
      <IndicatorCard
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <IndicatorIcon>
          <Package className="w-5 h-5" />
        </IndicatorIcon>
        <IndicatorContent>
          <IndicatorValue>{totalCajas}</IndicatorValue>
          <IndicatorLabel>Total Cajas</IndicatorLabel>
          <IndicatorSubtitle>Cajas registradas</IndicatorSubtitle>
        </IndicatorContent>
      </IndicatorCard>
    </IndicatorsContainer>
  );
};