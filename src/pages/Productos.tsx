/**
 * Página principal de gestión de productos
 * Permite crear, actualizar, eliminar y gestionar productos
 */

// Importaciones de React y librerías externas
import { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';

// Importaciones de componentes personalizados
import { ProductoTable } from '@/components/Productos/ProductoTable';
import { TableHeader } from '@/components/Productos/TableHeader';
import { ActualizarProductoModal } from '@/components/Productos/ActualizarProductoModal';
import { CrearProductoModal } from '@/components/Productos/CrearProductoModal';

// Importaciones de hooks y servicios
import { useProductos } from '@/hooks/Productos/useProductos';

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

export default function Productos() {
  // Hook personalizado para gestionar los productos
  const {
    productos,
    isLoading,
    isModalOpen,
    selectedProducto,
    cargarProductos,
    handleOpenModal,
    handleCloseModal,
    onSubmit
  } = useProductos();

  // Efecto para cargar los productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []); // Solo se ejecuta al montar el componente

  // Manejadores para abrir y cerrar modales
  const handleOpenModalNuevoProducto = useCallback(() => {
    handleOpenModal();
  }, [handleOpenModal]);

  const handleOpenModalEditar = useCallback((id: number) => {
    const producto = productos.find((p: { id: number }) => p.id === id);
    if (producto) {
      handleOpenModal(producto);
    }
  }, [productos, handleOpenModal]);

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
        {/* Contenedor principal de la tabla de productos */}
        <ProductsTableContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TableHeader 
            onNewProductClick={handleOpenModalNuevoProducto}
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
              <ProductoTable
                productos={productos}
                loading={isLoading}
                error={null}
                onEdit={handleOpenModalEditar}
              />
            </StyledTable>
          </TableContentSection>
        </ProductsTableContainer>
      </motion.div>

      {/* Modales de producto */}
      {selectedProducto ? (
        <ActualizarProductoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
          producto={selectedProducto}
        />
      ) : (
        <CrearProductoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
        />
      )}
    </PageContainer>
  );
}
