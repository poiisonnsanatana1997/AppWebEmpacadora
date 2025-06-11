import { motion } from 'framer-motion';
import { 
  ClipboardList, 
  Plus, 
  CloudUpload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #E2E8F0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, #1E40AF, #3B82F6);
    opacity: 0.8;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
  }

  @media (max-width: 640px) {
    padding: 1.5rem;
    gap: 1rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1.25rem;

  svg {
    color: #1E40AF;
    background: #F8FAFC;
    padding: 1.25rem;
    border-radius: 1rem;
    border: 1px solid #E2E8F0;
    width: 64px;
    height: 64px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  @media (min-width: 768px) {
    font-size: 1.75rem;

    svg {
      width: 72px;
      height: 72px;
      padding: 1.5rem;
    }
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
  max-width: 600px;
  line-height: 1.5;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
    flex-wrap: nowrap;
  }
`;

interface OrdenesEntradaHeaderProps {
  onNewOrder: () => void;
  onImport: () => void;
}

export function OrdenesEntradaHeader({ 
  onNewOrder,
  onImport,
}: OrdenesEntradaHeaderProps) {
  return (
    <Header>
      <HeaderContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HeaderTitle>
            <ClipboardList />
            <div>
              Órdenes de Entrada
              <HeaderSubtitle>
                Gestiona las órdenes de entrada de productos
              </HeaderSubtitle>
            </div>
          </HeaderTitle>
        </motion.div>
      </HeaderContent>

      <HeaderActions>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Button variant="outline" onClick={onImport} className="mr-2">
            <CloudUpload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button onClick={onNewOrder}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Orden
          </Button>
        </motion.div>
      </HeaderActions>
    </Header>
  );
}

export default OrdenesEntradaHeader; 