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
`;

const ProductsTableContainer = styled(motion.div)`
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
  padding: 1.5rem;
  overflow-x: auto;
  background: #fff;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const StyledTable = styled(motion.table)`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 1.08rem;
  border-radius: 1rem;
  overflow: hidden;

  th, td {
    padding: 1.1rem 1rem;
  }

  th {
    background: #f1f5f9;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  tr:hover td {
    background: #f8fafc;
    transition: background 0.2s;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    
    th, td {
      padding: 0.75rem 0.5rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
    
    th, td {
      padding: 0.5rem 0.25rem;
    }
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
      >
        {/* Mensaje de error si existe */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 mb-4"
          >
            Error: {error}
          </motion.div>
        )}

        {/* Sección de indicadores de estado */}
        <Indicators 
          stats={stats}
          loading={loading}
        />

        {/* Contenedor principal de la tabla de pedidos */}
        <ProductsTableContainer
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
            <StyledTable
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
                          <PedidosClienteTable
              pedidos={pedidosCliente}
              onView={handleOpenModalDetalle}
              onProgreso={handleOpenModalProgreso}
              onEstatusUpdate={actualizarEstatusPedidoCliente}
              loading={loading}
            />
            </StyledTable>
          </TableContentSection>
        </ProductsTableContainer>
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