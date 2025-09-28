/**
 * Página principal de gestión de pedidos clientes
 * Permite crear, actualizar, eliminar y gestionar pedidos clientes
 */

// Importaciones de React y librerías externas
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { toast, Toaster } from 'sonner';

// Importaciones de componentes personalizados
import { PedidosClienteTable } from '@/components/PedidosCliente/PedidosClienteTable';
import { CrearPedidoClienteModal } from '@/components/PedidosCliente/CrearPedidoClienteModal';
import { DetallePedidoClienteModal } from '@/components/PedidosCliente/DetallePedidoClienteModal';
import { ProgresoPedidoClienteModal } from '@/components/PedidosCliente/ProgresoPedidoClienteModal';
import { TableHeader } from '@/components/PedidosCliente/TableHeader';
import { Indicators } from '@/components/PedidosCliente/Indicators';

// Importaciones de hooks y servicios
import { usePedidosCliente } from '@/hooks/PedidosCliente/usePedidosCliente';
import type { PedidoClienteResponseDTO, CreatePedidoClienteDTO } from '@/types/PedidoCliente/pedidoCliente.types';

// Componentes estilizados para la interfaz
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: rgba(255, 255, 255, 0);
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.25rem;
  }
`;

const MainContentContainer = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #E2E8F0;
  overflow: hidden;
  width: 100%;
  
  @media (max-width: 768px) {
    border-radius: 0.75rem;
  }
  
  @media (max-width: 480px) {
    border-radius: 0.5rem;
  }
`;

const TableContentSection = styled(motion.div)`
  padding: 0.5rem;
  overflow-x: auto;
  background: #fff;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0;
  }
  
  @media (max-width: 480px) {
    padding: 0;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
`;

export default function PedidosCliente() {
  // Hook personalizado para gestionar los pedidos clientes
  const {
    pedidosCliente,
    loading,
    error,
    stats,
    cargarPedidosCliente,
    crearPedidoCliente,
    actualizarEstatusPedidoCliente,
  } = usePedidosCliente();

  // Estados para controlar los modales
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalProgresoOpen, setModalProgresoOpen] = useState(false);
  const [pedidoIdSeleccionado, setPedidoIdSeleccionado] = useState<number | null>(null);

  // Efecto para cargar los pedidos cuando se ingresa al módulo
  useEffect(() => {
    cargarPedidosCliente();
  }, []); // Solo se ejecuta al montar el componente

  // Manejadores para abrir y cerrar modales
  const handleOpenModalCrear = () => {
    setModalCrearOpen(true);
  };

  const handleOpenModalDetalle = (pedido: PedidoClienteResponseDTO) => {
    setPedidoIdSeleccionado(pedido.id);
    setModalDetalleOpen(true);
  };

  const handleCloseModalCrear = () => {
    setModalCrearOpen(false);
  };

  const handleCloseModalDetalle = () => {
    setModalDetalleOpen(false);
    setPedidoIdSeleccionado(null);
  };

  const handleOpenModalProgreso = (pedidoId: number) => {
    setPedidoIdSeleccionado(pedidoId);
    setModalProgresoOpen(true);
  };

  const handleCloseModalProgreso = () => {
    setModalProgresoOpen(false);
    setPedidoIdSeleccionado(null);
  };

  // Funciones para gestionar las operaciones CRUD
  const handleSubmitCrear = async (data: CreatePedidoClienteDTO) => {
    try {
      await crearPedidoCliente(data);
      // No es necesario recargar la lista, el estado se actualiza automáticamente
      handleCloseModalCrear();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error al crear el pedido');
    }
  };

  // Renderizado del componente
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster richColors position="top-right" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Mensaje de error si existe */}
        {error && (
          <ErrorMessage 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Error: {error}
          </ErrorMessage>
        )}

        {/* Sección de indicadores de estado */}
        <Indicators 
          stats={stats}
          loading={loading}
        />

        {/* Contenedor principal de la tabla de pedidos */}
        <MainContentContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TableHeader 
            onNewPedido={handleOpenModalCrear}
            loading={loading}
          />

          <TableContentSection
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <PedidosClienteTable
              pedidos={pedidosCliente}
              onView={handleOpenModalDetalle}
              onProgreso={handleOpenModalProgreso}
              onEstatusUpdate={actualizarEstatusPedidoCliente}
              loading={loading}
            />
          </TableContentSection>
        </MainContentContainer>
      </motion.div>

      {/* Modales de la aplicación */}
      <CrearPedidoClienteModal
        isOpen={modalCrearOpen}
        onClose={handleCloseModalCrear}
        onSubmit={handleSubmitCrear}
        loading={loading}
      />

      <DetallePedidoClienteModal
        isOpen={modalDetalleOpen}
        onClose={handleCloseModalDetalle}
        pedidoId={pedidoIdSeleccionado}
        onProgreso={handleOpenModalProgreso}
      />

      <ProgresoPedidoClienteModal
        isOpen={modalProgresoOpen}
        onClose={handleCloseModalProgreso}
        pedidoId={pedidoIdSeleccionado}
      />
    </PageContainer>
  );
} 