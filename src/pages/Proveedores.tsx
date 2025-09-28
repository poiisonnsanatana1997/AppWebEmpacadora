/**
 * Página principal de gestión de proveedores
 * Permite crear, actualizar, eliminar y gestionar proveedores
 */

// Importaciones de React y librerías externas
import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { Toaster, toast } from 'sonner';

// Importaciones de componentes personalizados
import { ProveedorTable } from '@/components/Proveedores/ProveedorTable';
import { TableHeader } from '@/components/Proveedores/TableHeader';
import { CrearProveedorModal } from '@/components/Proveedores/CrearProveedorModal';
import { ActualizarProveedorModal } from '@/components/Proveedores/ActualizarProveedorModal';
import { DetalleProveedorModal } from '@/components/Proveedores/DetalleProveedorModal';
import { useProveedores } from '@/hooks/Proveedores/useProveedores';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ProveedorCompletoDto } from '@/types/Proveedores/proveedores.types';

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

export default function Proveedores() {
  // Hook personalizado para gestionar los proveedores
  const {
    proveedores,
    loading,
    error,
    cargarProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    cambiarEstadoProveedor,
    obtenerProveedor,
  } = useProveedores();

  // Estados para modales
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProveedor, setSelectedProveedor] = React.useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [proveedorToDeactivate, setProveedorToDeactivate] = React.useState<{id: number, nombre: string} | null>(null);
  
  // Estados para modal de detalle
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [selectedProveedorForDetail, setSelectedProveedorForDetail] = React.useState<ProveedorCompletoDto | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  // Efecto para cargar los proveedores al montar el componente
  useEffect(() => {
    cargarProveedores();
  }, []); // Solo se ejecuta al montar el componente

  // Manejadores para abrir y cerrar modales
  const handleOpenModal = useCallback((proveedor = null) => {
    setSelectedProveedor(proveedor);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProveedor(null);
  }, []);

  const handleOpenModalNuevoProveedor = useCallback(() => {
    handleOpenModal();
  }, [handleOpenModal]);

  const handleOpenModalEditar = useCallback((id: number) => {
    const proveedor = proveedores.find((p: { id: number }) => p.id === id);
    if (proveedor) {
      handleOpenModal(proveedor);
    }
  }, [proveedores, handleOpenModal]);

  // Manejador para cambiar estado del proveedor
  const handleToggleStatus = useCallback(async (id: number, currentStatus: boolean) => {
    if (currentStatus) {
      // Si está activo, mostrar confirmación para desactivar
      const proveedor = proveedores.find((p: { id: number }) => p.id === id);
      if (proveedor) {
        setProveedorToDeactivate({ id, nombre: proveedor.nombre });
        setShowConfirmDialog(true);
      }
    } else {
      // Si está inactivo, activar directamente
      try {
        await cambiarEstadoProveedor(id, true);
        toast.success('Proveedor activado correctamente');
      } catch (error) {
        console.error('Error al activar proveedor:', error);
        toast.error('Error al activar proveedor');
      }
    }
  }, [cambiarEstadoProveedor, proveedores]);

  // Manejador para confirmar desactivación
  const handleConfirmDeactivate = useCallback(async () => {
    if (proveedorToDeactivate) {
      try {
        await cambiarEstadoProveedor(proveedorToDeactivate.id, false);
        toast.success('Proveedor desactivado correctamente');
      } catch (error) {
        console.error('Error al desactivar proveedor:', error);
        toast.error('Error al desactivar proveedor');
      }
      setShowConfirmDialog(false);
      setProveedorToDeactivate(null);
    }
  }, [cambiarEstadoProveedor, proveedorToDeactivate]);

  // Manejador para cancelar desactivación
  const handleCancelDeactivate = useCallback(() => {
    setShowConfirmDialog(false);
    setProveedorToDeactivate(null);
  }, []);

  // Manejador para ver detalle del proveedor
  const handleViewDetail = useCallback(async (id: number) => {
    setDetailLoading(true);
    try {
      // Obtener el proveedor completo usando el método GET
      const proveedorCompleto = await obtenerProveedor(id);
      if (proveedorCompleto) {
        setSelectedProveedorForDetail(proveedorCompleto);
        setIsDetailModalOpen(true);
      } else {
        toast.error('No se pudo obtener la información del proveedor');
      }
    } catch (error) {
      console.error('Error al obtener detalle del proveedor:', error);
      toast.error('Error al cargar el detalle del proveedor');
    } finally {
      setDetailLoading(false);
    }
  }, [obtenerProveedor]);

  // Manejador para cerrar modal de detalle
  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setSelectedProveedorForDetail(null);
    setDetailLoading(false);
  }, []);

  // Manejador para submit de formularios
  const onSubmit = useCallback(async (data) => {
    try {
      if (selectedProveedor) {
        await actualizarProveedor(selectedProveedor.id, data);
      } else {
        await crearProveedor(data);
      }
      handleCloseModal();
      cargarProveedores();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
    }
  }, [selectedProveedor, actualizarProveedor, crearProveedor, handleCloseModal, cargarProveedores]);

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
            className="text-red-500 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            Error: {error}
          </motion.div>
        )}

        {/* Contenedor principal de la tabla de proveedores */}
        <ProductsTableContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TableHeader 
            onNewProveedorClick={handleOpenModalNuevoProveedor}
          />

          <TableContentSection
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ProveedorTable
              proveedores={proveedores}
              loading={loading}
              error={error}
              onEdit={handleOpenModalEditar}
              onToggleStatus={handleToggleStatus}
              onViewDetail={handleViewDetail}
            />
          </TableContentSection>
        </ProductsTableContainer>
      </motion.div>

      {/* Modales de proveedor */}
      {selectedProveedor ? (
        <ActualizarProveedorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
          proveedor={selectedProveedor}
        />
      ) : (
        <CrearProveedorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
        />
      )}

      {/* Modal de detalle del proveedor */}
      <DetalleProveedorModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        proveedor={selectedProveedorForDetail}
        loading={detailLoading}
      />

      {/* Modal de confirmación para desactivar */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar desactivación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas desactivar el proveedor "{proveedorToDeactivate?.nombre}"?
              <br />
              <br />
              <strong>Esta acción puede afectar las órdenes de entrada asociadas a este proveedor.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDeactivate}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDeactivate}
              className="bg-red-600 hover:bg-red-700"
            >
              Desactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
} 