import { useState, useEffect, useCallback } from 'react';
import { 
  SortingState, 
  ColumnFiltersState, 
  RowSelectionState, 
  VisibilityState,
  PaginationState
} from '@tanstack/react-table';

interface PersistedTableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  rowSelection: RowSelectionState;
  columnVisibility: VisibilityState;
  pagination: PaginationState;
  fechaFilterValue: string;
}

interface UsePersistedTableStateProps {
  key: string; // Clave única para identificar la tabla en localStorage
  defaultState?: Partial<PersistedTableState>;
}

const DEFAULT_STATE: PersistedTableState = {
  sorting: [],
  columnFilters: [],
  rowSelection: {},
  columnVisibility: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  fechaFilterValue: "all"
};

/**
 * Hook personalizado para persistir el estado de una tabla en localStorage
 * Mantiene los filtros, ordenamiento, paginación y visibilidad de columnas
 * entre navegaciones y recargas de página
 */
export const usePersistedTableState = ({ 
  key, 
  defaultState = {} 
}: UsePersistedTableStateProps) => {
  const storageKey = `table-state-${key}`;
  
  // Función para cargar el estado desde localStorage
  const loadPersistedState = useCallback((): PersistedTableState => {
    try {
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_STATE,
          ...defaultState,
          ...parsed
        };
      }
    } catch (error) {
      console.warn(`Error al cargar estado persistido para ${key}:`, error);
    }
    
    return {
      ...DEFAULT_STATE,
      ...defaultState
    };
  }, [storageKey, defaultState, key]);

  // Estados de la tabla
  const [sorting, setSorting] = useState<SortingState>(() => loadPersistedState().sorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => loadPersistedState().columnFilters);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => loadPersistedState().rowSelection);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => loadPersistedState().columnVisibility);
  const [pagination, setPagination] = useState<PaginationState>(() => loadPersistedState().pagination);
  const [fechaFilterValue, setFechaFilterValue] = useState<string>(() => loadPersistedState().fechaFilterValue);

  // Función para guardar el estado en localStorage
  const saveState = useCallback((state: PersistedTableState) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error al guardar estado persistido para ${key}:`, error);
    }
  }, [storageKey, key]);

  // Efecto único para persistir todos los cambios
  useEffect(() => {
    const state: PersistedTableState = {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      pagination,
      fechaFilterValue
    };
    saveState(state);
  }, [sorting, columnFilters, rowSelection, columnVisibility, pagination, fechaFilterValue]);

  // Función para limpiar todo el estado persistido
  const clearPersistedState = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      
      // Resetear todos los estados a sus valores por defecto
      const resetState = {
        ...DEFAULT_STATE,
        ...defaultState
      };
      
      setSorting(resetState.sorting);
      setColumnFilters(resetState.columnFilters);
      setRowSelection(resetState.rowSelection);
      setColumnVisibility(resetState.columnVisibility);
      setPagination(resetState.pagination);
      setFechaFilterValue(resetState.fechaFilterValue);
    } catch (error) {
      console.warn(`Error al limpiar estado persistido para ${key}:`, error);
    }
  }, [storageKey, key, defaultState]);

  // Función para resetear solo los filtros
  const clearFilters = useCallback(() => {
    try {
      const currentState = loadPersistedState();
      const resetFilters = {
        ...currentState,
        columnFilters: [],
        fechaFilterValue: "all"
      };
      
      // Actualizar estados locales primero
      setColumnFilters([]);
      setFechaFilterValue("all");
      
      // Luego persistir
      saveState(resetFilters);
    } catch (error) {
      console.warn(`Error al limpiar filtros para ${key}:`, error);
      // Fallback: resetear solo los estados locales
      setColumnFilters([]);
      setFechaFilterValue("all");
    }
  }, [key]);

  // Función para obtener el estado actual completo
  const getCurrentState = useCallback((): PersistedTableState => ({
    sorting,
    columnFilters,
    rowSelection,
    columnVisibility,
    pagination,
    fechaFilterValue
  }), [sorting, columnFilters, rowSelection, columnVisibility, pagination, fechaFilterValue]);

  return {
    // Estados
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    pagination,
    setPagination,
    fechaFilterValue,
    setFechaFilterValue,
    
    // Utilidades
    clearPersistedState,
    clearFilters,
    getCurrentState,
    loadPersistedState
  };
};
