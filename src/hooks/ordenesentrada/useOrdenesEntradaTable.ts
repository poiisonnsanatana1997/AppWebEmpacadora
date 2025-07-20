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
}

/**
 * Hook personalizado para manejar el estado y la lógica de la tabla de órdenes de entrada
 */
export const useOrdenesEntradaTable = ({ onDelete }: UseOrdenesEntradaTableProps) => {
  const navigate = useNavigate();
  
  // Estado de la tabla
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [ordenACancelar, setOrdenACancelar] = useState<string | null>(null);

  // Handlers
  const handleCancelarOrden = (id: string | null): void => {
    setOrdenACancelar(id);
  };

  const handleConfirmarCancelacion = (): void => {
    if (ordenACancelar) {
      onDelete(ordenACancelar);
      setOrdenACancelar(null);
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
    
    // Handlers
    handleCancelarOrden,
    handleConfirmarCancelacion,
    
    // Utilidades
    navigate
  };
}; 