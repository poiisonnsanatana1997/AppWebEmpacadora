import { useState, useCallback } from 'react';
import { ProductosService } from '@/services/productos.service';
import { toast } from 'sonner';
import { useGlobalCache } from '@/hooks/useGlobalCache';

interface UseProductoTableProps {
  onEdit: (id: number) => void;
}

export function useProductoTable({ onEdit }: UseProductoTableProps) {
  const { productos, isLoading: cacheLoading, error: cacheError, fetchProductos } = useGlobalCache();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarProductos = useCallback(async () => {
    if (loading) return; // Evitar múltiples llamadas simultáneas
    
    try {
      setLoading(true);
      setError(null);
      await fetchProductos();
    } catch (error) {
      setError('Error al cargar los productos');
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, [loading, fetchProductos]);

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
      
      // Refrescar productos desde el servicio para mantener el cache sincronizado
      await fetchProductos(true);
    } catch (error) {
      setError('Error al cambiar el estado del producto');
      toast.error('Error al cambiar el estado del producto');
    } finally {
      setLoading(false);
    }
  }, [loading, fetchProductos]);

  return {
    productos,
    loading: loading || cacheLoading.productos,
    error: error || cacheError.productos,
    cargarProductos,
    handleToggleStatus,
    onEdit
  };
} 