/**
 * Página principal de gestión de productos
 * Permite crear, actualizar, eliminar y gestionar productos
 */

// Importaciones de React y librerías externas
import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';

// Importaciones de componentes personalizados
import { ProductoTable } from '@/components/Productos/ProductoTable';
import { TableHeader } from '@/components/Productos/TableHeader';
import { ActualizarProductoModal } from '@/components/Productos/ActualizarProductoModal';
import { CrearProductoModal } from '@/components/Productos/CrearProductoModal';

// Importaciones de hooks y servicios
import { useProductos } from '@/hooks/Productos/useProductos';

export default function Productos() {
  // Hook personalizado para gestionar los productos
  const {
    productos,
    isLoading,
    isModalOpen,
    selectedProducto,
    error,
    cargarProductos,
    handleOpenModal,
    handleCloseModal,
    onSubmit
  } = useProductos();

  // Efecto para cargar los productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col justify-start bg-transparent w-full"
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

        {/* Contenedor principal de la tabla de productos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border-radius-1rem box-shadow-0-4px-6px-1px-rgba-0-0-0-0-1-0-2px-4px-1px-rgba-0-0-0-0-06 border-1px-solid-E2E8F0 overflow-hidden w-full rounded-2xl shadow-lg border border-gray-200"
        >
          <TableHeader 
            onNewProductClick={handleOpenModalNuevoProducto}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="p-2 overflow-x-auto bg-white w-full"
          >
            <ProductoTable
              productos={productos}
              loading={isLoading}
              error={error}
              onEdit={handleOpenModalEditar}
            />
          </motion.div>
        </motion.div>
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
    </motion.div>
  );
}
