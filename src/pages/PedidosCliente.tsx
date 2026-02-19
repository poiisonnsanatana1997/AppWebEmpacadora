/**
 * Página principal de gestión de pedidos clientes
 * Permite crear, actualizar, eliminar y gestionar pedidos clientes
 */

// Importaciones de React y librerías externas
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { toast, Toaster } from 'sonner';

// Importaciones de componentes personalizados
import { PedidosClienteTable } from '@/components/PedidosCliente/PedidosClienteTable';
import { CrearPedidoClienteModal } from '@/components/PedidosCliente/CrearPedidoClienteModal';
import { PedidoClienteDetalleModal } from '@/components/PedidosCliente/PedidoClienteDetalleModal';
import { TableHeader } from '@/components/PedidosCliente/TableHeader';
import { Indicators } from '@/components/PedidosCliente/Indicators';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Importaciones de hooks y servicios
import { usePedidosCliente } from '@/hooks/PedidosCliente/usePedidosCliente';
import type { PedidoClienteResponseDTO, CreatePedidoClienteDTO } from '@/types/PedidoCliente/pedidoCliente.types';

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

  // Funciones para gestionar las operaciones CRUD
  const handleSubmitCrear = async (data: CreatePedidoClienteDTO) => {
    try {
      await crearPedidoCliente(data);
      handleCloseModalCrear();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error al crear el pedido');
    }
  };

  // Renderizado del componente
  return (
    <motion.div
      className="min-h-screen flex flex-col bg-transparent w-full md:px-2 sm:px-1"
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
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>Error: {error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Sección de indicadores de estado */}
        <Indicators
          stats={stats}
          loading={loading}
        />

        {/* Contenedor principal de la tabla de pedidos */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full md:rounded-xl sm:rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TableHeader loading={loading} />

          <motion.div
            className="p-2 overflow-x-auto bg-white w-full md:p-0 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <PedidosClienteTable
              pedidos={pedidosCliente}
              onView={handleOpenModalDetalle}
              onEstatusUpdate={actualizarEstatusPedidoCliente}
              loading={loading}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modales de la aplicación */}
      <CrearPedidoClienteModal
        isOpen={modalCrearOpen}
        onClose={handleCloseModalCrear}
        onSubmit={handleSubmitCrear}
        loading={loading}
      />

      <PedidoClienteDetalleModal
        isOpen={modalDetalleOpen}
        onClose={handleCloseModalDetalle}
        pedidoId={pedidoIdSeleccionado}
      />
    </motion.div>
  );
}
