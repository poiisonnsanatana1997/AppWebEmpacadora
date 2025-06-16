import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { ProductosService } from '@/services/productos.service';
import { ProductoApi } from '@/types/product';
import { ProductoFormData } from '@/components/Productos/types';
import { ProductosTable } from '@/components/Productos/ProductosTable';
import { TableHeader } from '@/components/Productos/TableHeader';
import { NuevaProductoModal } from '@/components/Productos/NuevaProductoModal';
import { ActualizarProductoModal } from '@/components/Productos/ActualizarProductoModal';

const PageContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: rgba(255, 255, 255, 0);
`;

const ProductsTableContainer = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #E2E8F0;
  overflow: hidden;
  margin: 2rem;
`;

const TableContentSection = styled(motion.div)`
  padding: 1.5rem;
  overflow-x: auto;
  background: #fff;
`;

export default function Productos() {
  // Estados
  const [productos, setProductos] = useState<ProductoApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalNuevoProductoOpen, setModalNuevoProductoOpen] = useState(false);
  const [modalActualizarOpen, setModalActualizarOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoApi | null>(null);

  // Cargar productos
  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProductosService.obtenerProductos();
      setProductos(data);
    } catch (error: any) {
      console.error('Error al cargar productos:', error);
      setError(error.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  // Efecto para recargar productos cuando la ventana recupera el foco
  useEffect(() => {
    const handleFocus = async () => {
      await cargarProductos();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Manejadores de modales
  const handleOpenModalNuevoProducto = () => {
    setModalNuevoProductoOpen(true);
  };

  const handleOpenModalActualizar = (id: string) => {
    const producto = productos.find(p => p.id.toString() === id);
    if (producto) {
      setProductoSeleccionado(producto);
      setModalActualizarOpen(true);
    }
  };

  const handleCloseModalNuevoProducto = () => {
    setModalNuevoProductoOpen(false);
  };

  const handleCloseModalActualizar = () => {
    setModalActualizarOpen(false);
    setProductoSeleccionado(null);
  };

  // Manejadores de operaciones CRUD
  const handleSubmitNuevoProducto = async (formData: ProductoFormData) => {
    try {
      const data = new FormData();
      data.append('codigo', formData.codigo);
      data.append('nombre', formData.nombre);
      if (formData.descripcion) {
        data.append('descripcion', formData.descripcion);
      }
      if (formData.imagen) {
        data.append('imagen', formData.imagen);
      }

      await ProductosService.crearProducto(data);
      toast.success('Producto creado correctamente');
      handleCloseModalNuevoProducto();
      await cargarProductos();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear el producto');
    }
  };

  const handleSubmitActualizar = async (formData: ProductoFormData) => {
    if (!productoSeleccionado) return;
    try {
      const data = new FormData();
      data.append('codigo', formData.codigo);
      data.append('nombre', formData.nombre);
      if (formData.descripcion) {
        data.append('descripcion', formData.descripcion);
      }
      if (formData.imagen) {
        data.append('imagen', formData.imagen);
      }

      await ProductosService.actualizarProducto(productoSeleccionado.id, data);
      toast.success('Producto actualizado correctamente');
      handleCloseModalActualizar();
      await cargarProductos();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el producto');
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await ProductosService.eliminarProducto(parseInt(id));
      toast.success('Producto eliminado correctamente');
      await cargarProductos();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar el producto');
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await ProductosService.reactivarProducto(parseInt(id));
      toast.success('Producto reactivado correctamente');
      await cargarProductos();
    } catch (error: any) {
      toast.error(error.message || 'Error al reactivar el producto');
    }
  };

  // Calcular estadísticas
  const totalProductos = productos.length;
  const productosActivos = productos.filter(p => p.activo).length;

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
        {/* Mensaje de error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 mb-4 mx-8"
          >
            Error: {error}
          </motion.div>
        )}

        {/* Contenedor principal */}
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
            <ProductosTable
              productos={productos}
              onEdit={handleOpenModalActualizar}
              onDelete={handleEliminar}
              onReactivate={handleReactivate}
            />
          </TableContentSection>
        </ProductsTableContainer>
      </motion.div>

      {/* Modales */}
      <NuevaProductoModal
        isOpen={modalNuevoProductoOpen}
        onClose={handleCloseModalNuevoProducto}
        onSave={handleSubmitNuevoProducto}
      />

      {productoSeleccionado && (
        <ActualizarProductoModal
          isOpen={modalActualizarOpen}
          onClose={handleCloseModalActualizar}
          onSave={handleSubmitActualizar}
          producto={productoSeleccionado}
        />
      )}
    </PageContainer>
  );
} 