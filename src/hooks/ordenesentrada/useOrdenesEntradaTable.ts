import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SortingState, 
  ColumnFiltersState, 
  RowSelectionState, 
  VisibilityState 
} from '@tanstack/react-table';
import { usePersistedTableState } from './usePersistedTableState';

interface UseOrdenesEntradaTableProps {
  onDelete: (id: string) => void;
}

/**
 * Hook personalizado para manejar el estado y la lógica de la tabla de órdenes de entrada
 */
export const useOrdenesEntradaTable = ({ onDelete }: UseOrdenesEntradaTableProps) => {
  const navigate = useNavigate();
  
  // Estado persistente de la tabla
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    fechaFilterValue,
    setFechaFilterValue,
    clearFilters,
    clearPersistedState
  } = usePersistedTableState({
    key: 'ordenes-entrada-table',
    defaultState: {
      pagination: { pageIndex: 0, pageSize: 10 }
    }
  });

  // Estado local para modales y acciones
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
    // Estado persistente
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    fechaFilterValue,
    setFechaFilterValue,
    
    // Estado local
    ordenACancelar,
    
    // Handlers
    handleCancelarOrden,
    handleConfirmarCancelacion,
    
    // Utilidades de filtros
    clearFilters,
    clearPersistedState,
    
    // Navegación
    navigate
  };
}; 