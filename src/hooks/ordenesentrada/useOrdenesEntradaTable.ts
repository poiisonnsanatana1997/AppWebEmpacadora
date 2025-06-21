import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SortingState, 
  ColumnFiltersState, 
  RowSelectionState, 
  VisibilityState 
} from '@tanstack/react-table';

interface UseOrdenesEntradaTableProps {
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
}

/**
 * Hook personalizado para manejar el estado y la lógica de la tabla de órdenes de entrada
 */
export const useOrdenesEntradaTable = ({ onDelete, onReactivate }: UseOrdenesEntradaTableProps) => {
  const navigate = useNavigate();
  
  // Estado de la tabla
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [ordenACancelar, setOrdenACancelar] = useState<string | null>(null);
  const [ordenAReactivar, setOrdenAReactivar] = useState<string | null>(null);

  // Handlers
  const handleCancelarOrden = (id: string | null): void => {
    setOrdenACancelar(id);
  };

  const handleReactivarOrden = (id: string | null): void => {
    setOrdenAReactivar(id);
  };

  const handleConfirmarCancelacion = (): void => {
    if (ordenACancelar) {
      onDelete(ordenACancelar);
      setOrdenACancelar(null);
    }
  };

  const handleConfirmarReactivacion = (): void => {
    if (ordenAReactivar) {
      onReactivate(ordenAReactivar);
      setOrdenAReactivar(null);
    }
  };

  return {
    // Estado
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    ordenACancelar,
    ordenAReactivar,
    
    // Handlers
    handleCancelarOrden,
    handleReactivarOrden,
    handleConfirmarCancelacion,
    handleConfirmarReactivacion,
    
    // Utilidades
    navigate
  };
}; 