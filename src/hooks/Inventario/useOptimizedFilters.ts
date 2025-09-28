import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * Hook personalizado para optimizar filtros con debouncing
 * Especialmente útil para grandes volúmenes de datos (50,000+ registros)
 */
export const useOptimizedFilters = <T>(
  data: T[],
  filterConfig: {
    searchTerm?: string;
    filters?: Record<string, any>;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  },
  debounceMs: number = 300
) => {
  // Estado interno para el término de búsqueda con debouncing
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(filterConfig.searchTerm || '');
  const [debouncedFilters, setDebouncedFilters] = useState(filterConfig.filters || {});

  // Debouncing para el término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(filterConfig.searchTerm || '');
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [filterConfig.searchTerm, debounceMs]);

  // Debouncing para los filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filterConfig.filters || {});
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [filterConfig.filters, debounceMs]);

  // Función de búsqueda difusa optimizada
  const fuzzySearch = useCallback((item: any, searchTerm: string): boolean => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    // Buscar en campos específicos de manera optimizada
    const searchableFields = [
      item.codigo,
      item.lote,
      item.tarimaOriginal?.upc,
      item.estatus,
      item.tipo,
      // Información de pedidos
      ...(item.tarimaOriginal?.pedidoTarimas?.map((p: any) => 
        `${p.idPedidoCliente} ${p.nombreCliente} ${p.nombreSucursal}`
      ) || [])
    ].filter(Boolean);

    return searchableFields.some(field => 
      String(field).toLowerCase().includes(searchLower)
    );
  }, []);

  // Función de filtrado optimizada
  const applyFilters = useCallback((item: any, filters: Record<string, any>): boolean => {
    for (const [key, value] of Object.entries(filters)) {
      if (!value || value === 'all') continue;
      
      switch (key) {
        case 'estatus':
          if (item.estatus !== value) return false;
          break;
        case 'tipo':
          if (item.tipo !== value) return false;
          break;
        case 'tienePedidos':
          const tienePedidos = item.tarimaOriginal?.pedidoTarimas?.length > 0;
          if (value === 'true' && !tienePedidos) return false;
          if (value === 'false' && tienePedidos) return false;
          break;
        default:
          // Filtro genérico
          if (item[key] !== value) return false;
      }
    }
    return true;
  }, []);

  // Función de ordenamiento optimizada
  const sortData = useCallback((data: T[], sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc'): T[] => {
    if (!sortBy) return data;

    return [...data].sort((a: any, b: any) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Manejar valores anidados
      if (sortBy === 'fechaRegistro') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Manejar valores nulos
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
      if (bValue == null) return sortOrder === 'asc' ? 1 : -1;

      // Ordenamiento numérico
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Ordenamiento de strings
      const stringA = String(aValue).toLowerCase();
      const stringB = String(bValue).toLowerCase();
      
      if (sortOrder === 'asc') {
        return stringA.localeCompare(stringB);
      } else {
        return stringB.localeCompare(stringA);
      }
    });
  }, []);

  // Datos filtrados y ordenados con memoización
  const filteredAndSortedData = useMemo(() => {
    // Aplicar búsqueda difusa
    let filtered = data.filter(item => fuzzySearch(item, debouncedSearchTerm));
    
    // Aplicar filtros específicos
    filtered = filtered.filter(item => applyFilters(item, debouncedFilters));
    
    // Aplicar ordenamiento
    if (filterConfig.sortBy) {
      filtered = sortData(filtered, filterConfig.sortBy, filterConfig.sortOrder);
    }
    
    return filtered;
  }, [
    data, 
    debouncedSearchTerm, 
    debouncedFilters, 
    filterConfig.sortBy, 
    filterConfig.sortOrder,
    fuzzySearch,
    applyFilters,
    sortData
  ]);

  // Estadísticas de filtrado
  const filterStats = useMemo(() => {
    const total = data.length;
    const filtered = filteredAndSortedData.length;
    const reduction = total - filtered;
    const reductionPercentage = total > 0 ? (reduction / total) * 100 : 0;

    return {
      total,
      filtered,
      reduction,
      reductionPercentage: Math.round(reductionPercentage * 100) / 100
    };
  }, [data.length, filteredAndSortedData.length]);

  return {
    filteredData: filteredAndSortedData,
    filterStats,
    debouncedSearchTerm,
    debouncedFilters,
    isFiltering: debouncedSearchTerm || Object.keys(debouncedFilters).some(key => debouncedFilters[key] && debouncedFilters[key] !== 'all')
  };
};
