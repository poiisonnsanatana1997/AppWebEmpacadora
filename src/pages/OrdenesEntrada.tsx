/**
 * Página principal de gestión de órdenes de entrada
 * Permite crear, actualizar, eliminar y gestionar órdenes de entrada
 */

// Importaciones de React y librerías externas
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Importaciones de componentes personalizados
import { NuevaOrdenEntradaModal } from '../components/OrdenesEntrada/NuevaOrdenEntradaModal';
import { ActualizarOrdenEntradaModal } from '../components/OrdenesEntrada/ActualizarOrdenEntradaModal';
import { OrdenesEntradaTable } from '@/components/OrdenesEntrada/OrdenesEntradaTable';
import { ImportarOrdenesModal } from '@/components/OrdenesEntrada/ImportarOrdenesModal';
import { TableHeader } from '@/components/OrdenesEntrada/TableHeader';
import { Indicators } from '@/components/OrdenesEntrada/Indicators';
import { ConfirmarClasificacionModal } from '@/components/Clasificacion/ConfirmarClasificacionModal';

// Importaciones de hooks y tipos
import { useOrdenesEntrada } from '@/hooks/OrdenesEntrada/useOrdenesEntrada';
import { ESTADO_ORDEN, OrdenEntradaDto, OrdenEntradaFormData, CrearOrdenEntradaDto, ActualizarOrdenEntradaDto, estadoOrdenUtils } from '@/types/OrdenesEntrada/ordenesEntrada.types';
import { ClasificacionService } from '@/services/clasificacion.service';

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

export default function OrdenesEntrada() {
  // Hook personalizado para gestionar las órdenes de entrada
  const {
    ordenes,
    error,
    loading,
    pesoTotalRecibidoHoy,
    ordenesPendientesHoy,
    cargarOrdenes,
    crearOrden,
    actualizarOrden,
    importarOrdenes,
  } = useOrdenesEntrada();

  // Estados para controlar los modales
  const [modalNuevaOrdenOpen, setModalNuevaOrdenOpen] = useState(false);
  const [modalActualizarOpen, setModalActualizarOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<OrdenEntradaDto | undefined>();
  const [modalClasificacionOpen, setModalClasificacionOpen] = useState(false);
  const [ordenParaClasificar, setOrdenParaClasificar] = useState<OrdenEntradaDto | null>(null);

  const navigate = useNavigate();

  // Efecto para cargar las órdenes al montar el componente
  useEffect(() => {
    cargarOrdenes();
  }, [cargarOrdenes]);

  // Efecto para recargar las órdenes cuando la ventana recupera el foco
  useEffect(() => {
    const handleFocus = async () => {
      await cargarOrdenes();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [cargarOrdenes]);

  // Manejadores para abrir y cerrar modales
  const handleOpenModalNuevaOrden = () => {
    setModalNuevaOrdenOpen(true);
  };

  const handleOpenModalActualizar = (codigo: string) => {
    const orden = ordenes.find(o => o.codigo === codigo);
    if (orden) {
      if (!estadoOrdenUtils.puedeEditar(orden.estado)) {
        toast.error('Solo se pueden editar órdenes en estado Pendiente');
        return;
      }
      setOrdenSeleccionada(orden);
      setModalActualizarOpen(true);
    }
  };

  const handleCloseModalNuevaOrden = () => {
    setModalNuevaOrdenOpen(false);
  };

  const handleCloseModalActualizar = () => {
    setModalActualizarOpen(false);
    setOrdenSeleccionada(undefined);
  };

  // Funciones para gestionar las operaciones CRUD
  const handleSubmitNuevaOrden = async (orden: OrdenEntradaFormData) => {
    try {
      const ordenParaCrear: CrearOrdenEntradaDto = {
        proveedorId: Number(orden.proveedor.id),
        productoId: Number(orden.producto.id),
        fechaEstimada: orden.fechaEstimada,
        fechaRegistro: orden.fechaRegistro,
        estado: orden.estado,
        observaciones: orden.observaciones
      };
      await crearOrden(ordenParaCrear);
      toast.success('Orden creada correctamente');
      handleCloseModalNuevaOrden();
    } catch (error) {
      toast.error('Error al guardar la orden');
    }
  };

  const handleSubmitActualizar = async (orden: OrdenEntradaFormData) => {
    try {
      if (ordenSeleccionada) {
        const ordenParaActualizar: ActualizarOrdenEntradaDto = {
          proveedorId: Number(orden.proveedor.id),
          productoId: Number(orden.producto.id),
          fechaEstimada: orden.fechaEstimada,
          fechaRecepcion: orden.fechaRecepcion,
          estado: orden.estado,
          observaciones: orden.observaciones
        };
        await actualizarOrden(ordenSeleccionada.codigo, ordenParaActualizar);
        toast.success('Orden actualizada correctamente');
        handleCloseModalActualizar();
      }
    } catch (error) {
      toast.error('Error al guardar la orden');
    }
  };

  // Funciones para gestionar los estados de las órdenes
  const handleEliminar = async (codigo: string) => {
    try {
      const orden = ordenes.find(o => o.codigo === codigo);
      if (!orden) return;

      if (!estadoOrdenUtils.esCancelable(orden.estado)) {
        toast.error('Solo se pueden cancelar órdenes en estado Pendiente, Procesando o Recibida');
        return;
      }

      const ordenParaAPI: ActualizarOrdenEntradaDto = {
        proveedorId: orden.proveedor.id,
        productoId: orden.producto.id,
        fechaEstimada: orden.fechaEstimada,
        fechaRecepcion: orden.fechaRecepcion,
        estado: ESTADO_ORDEN.CANCELADA,
        observaciones: orden.observaciones
      };

      await actualizarOrden(codigo, ordenParaAPI);
      toast.success('Orden cancelada exitosamente');
    } catch (error) {
      console.error('Error al cancelar la orden:', error);
      toast.error('Error al cancelar la orden');
    }
  };



  // Función para manejar la importación de órdenes
  const handleImportar = async (file: File) => {
    try {
      await importarOrdenes(file);
      toast.success('Órdenes importadas correctamente');
      setImportModalOpen(false);
    } catch (error) {
      toast.error('Error al importar las órdenes');
    }
  };

  // Manejador para abrir el modal de clasificación
  const handleRegistrarClasificacion = (orden: OrdenEntradaDto) => {
    setOrdenParaClasificar(orden);
    setModalClasificacionOpen(true);
  };

  // Manejador para confirmar la clasificación
  const handleConfirmarClasificacion = async () => {
    if (!ordenParaClasificar) return;
    try {
      const response = await ClasificacionService.create({ idPedidoProveedor: ordenParaClasificar.id });
      setModalClasificacionOpen(false);
      setOrdenParaClasificar(null);
      await cargarOrdenes();
      toast.success('Clasificación registrada correctamente');
      // Navegar automáticamente al detalle de clasificación después de un breve delay
      setTimeout(() => {
        navigate(`/clasificacion-orden/${ordenParaClasificar.id}`);
      }, 1000);
    } catch (error) {
      toast.error('Error al registrar la clasificación');
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
        {/* Sección de indicadores de estado */}
        <Indicators 
          ordenesPendientesHoy={ordenesPendientesHoy}
          pesoTotalRecibidoHoy={pesoTotalRecibidoHoy}
          loading={loading}
        />

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

        {/* Contenedor principal de la tabla de órdenes */}
        <ProductsTableContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TableHeader 
            onImportClick={() => setImportModalOpen(true)}
            onNewOrderClick={handleOpenModalNuevaOrden}
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
              <OrdenesEntradaTable
                ordenes={ordenes}
                onEdit={handleOpenModalActualizar}
                onDelete={handleEliminar}
                onRegistrarClasificacion={handleRegistrarClasificacion}
              />
            </StyledTable>
          </TableContentSection>
        </ProductsTableContainer>
      </motion.div>

      {/* Modales de la aplicación */}
      <NuevaOrdenEntradaModal
        isOpen={modalNuevaOrdenOpen}
        onClose={handleCloseModalNuevaOrden}
        onSave={handleSubmitNuevaOrden}
      />

      {ordenSeleccionada && (
        <ActualizarOrdenEntradaModal
          isOpen={modalActualizarOpen}
          onClose={handleCloseModalActualizar}
          onSave={handleSubmitActualizar}
          orden={ordenSeleccionada}
        />
      )}

      <ImportarOrdenesModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportar}
      />

      <ConfirmarClasificacionModal
        isOpen={modalClasificacionOpen}
        onClose={() => { setModalClasificacionOpen(false); setOrdenParaClasificar(null); }}
        onConfirm={handleConfirmarClasificacion}
      />
    </PageContainer>
  );
} 