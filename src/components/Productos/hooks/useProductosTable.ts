import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SortingState, 
  ColumnFiltersState, 
  RowSelectionState, 
  VisibilityState 
} from '@tanstack/react-table';
import { ProductoApi } from '@/types/product';
import { toast } from 'sonner';

interface UseProductosTableProps {
  productos: ProductoApi[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
}

export const useProductosTable = ({ productos, onEdit, onDelete, onReactivate }: UseProductosTableProps) => {
  // Estados de la tabla
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  
  // Estados de modales
  const [productoAEliminar, setProductoAEliminar] = useState<ProductoApi | null>(null);
  const [productoAReactivar, setProductoAReactivar] = useState<ProductoApi | null>(null);
  
  const navigate = useNavigate();

  // Manejadores de acciones
  const handleEliminarProducto = useCallback((producto: ProductoApi) => {
    setProductoAEliminar(producto);
  }, []);

  const handleReactivarProducto = useCallback((producto: ProductoApi) => {
    setProductoAReactivar(producto);
  }, []);

  const handleConfirmarEliminacion = useCallback(async () => {
    if (!productoAEliminar) return;
    
    try {
      await onDelete(productoAEliminar.id.toString());
      toast.success('Producto eliminado correctamente');
      setProductoAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      toast.error('Error al eliminar el producto');
    }
  }, [productoAEliminar, onDelete]);

  const handleConfirmarReactivacion = useCallback(async () => {
    if (!productoAReactivar) return;
    
    try {
      await onReactivate(productoAReactivar.id.toString());
      toast.success('Producto reactivado correctamente');
      setProductoAReactivar(null);
    } catch (error) {
      console.error('Error al reactivar el producto:', error);
      toast.error('Error al reactivar el producto');
    }
  }, [productoAReactivar, onReactivate]);

  const handleCancelarAccion = useCallback(() => {
    setProductoAEliminar(null);
    setProductoAReactivar(null);
  }, []);

  const handleVerDetalles = useCallback((id: number) => {
    navigate(`/productos/${id}`);
  }, [navigate]);

  // Filtros y ordenamiento
  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
  }, []);

  const handleColumnFiltersChange = useCallback((newFilters: ColumnFiltersState) => {
    setColumnFilters(newFilters);
  }, []);

  const handleColumnVisibilityChange = useCallback((newVisibility: VisibilityState) => {
    setColumnVisibility(newVisibility);
  }, []);

  const handleRowSelectionChange = useCallback((newSelection: RowSelectionState) => {
    setRowSelection(newSelection);
  }, []);

  return {
    // Estados
    sorting,
    columnFilters,
    rowSelection,
    columnVisibility,
    productoAEliminar,
    productoAReactivar,
    
    // Manejadores de estado
    setSorting: handleSortingChange,
    setColumnFilters: handleColumnFiltersChange,
    setColumnVisibility: handleColumnVisibilityChange,
    setRowSelection: handleRowSelectionChange,
    
    // Acciones
    handleEliminarProducto,
    handleReactivarProducto,
    handleConfirmarEliminacion,
    handleConfirmarReactivacion,
    handleCancelarAccion,
    handleVerDetalles,
    
    // Utilidades
    navigate
  };
}; 