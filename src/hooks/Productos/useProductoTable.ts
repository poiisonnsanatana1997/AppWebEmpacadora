import { useState, useCallback } from 'react';
import { ProductoDto } from '@/types/Productos/productos.types';
import { ProductosService } from '@/services/productos.service';
import { toast } from 'sonner';

interface UseProductoTableProps {
  onEdit: (id: number) => void;
}

export function useProductoTable({ onEdit }: UseProductoTableProps) {
  const [productos, setProductos] = useState<ProductoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarProductos = useCallback(async () => {
    if (loading) return; // Evitar múltiples llamadas simultáneas
    
    try {
      setLoading(true);
      setError(null);
      const data = await ProductosService.obtenerProductos();
      setProductos(data);
    } catch (error) {
      setError('Error al cargar los productos');
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleToggleStatus = useCallback(async (id: number, activo: boolean) => {
    if (loading) return; // Evitar múltiples llamadas simultáneas
    
    try {
      setLoading(true);
      setError(null);
      
      if (activo) {
        await ProductosService.reactivarProducto(id);
        toast.success('Producto reactivado exitosamente');
      } else {
        await ProductosService.eliminarProducto(id);
        toast.success('Producto desactivado exitosamente');
      }
      
      // Actualizar el estado local en lugar de recargar todos los productos
      setProductos(prevProductos => 
        prevProductos.map(producto => 
          producto.id === id 
            ? { ...producto, activo } 
            : producto
        )
      );
    } catch (error) {
      setError('Error al cambiar el estado del producto');
      toast.error('Error al cambiar el estado del producto');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return {
    productos,
    loading,
    error,
    cargarProductos,
    handleToggleStatus,
    onEdit
  };
} 