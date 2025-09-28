import { useState, useCallback, useMemo } from 'react';
import type { 
  InventarioTipoDTO, 
  InventarioTableState,
  InventarioTableColumn 
} from '@/types/Inventario/inventario.types';

/**
 * Hook personalizado para manejar la lógica de la tabla de inventario
 * Gestiona paginación, ordenamiento y selección de filas
 */
export const useInventarioTable = (datos: InventarioTipoDTO[]) => {
  // Estado de la tabla
  const [tableState, setTableState] = useState<InventarioTableState>({
    page: 1,
    pageSize: 10,
    sortBy: 'fechaRegistro',
    sortOrder: 'desc'
  });

  /**
   * Datos ordenados según la configuración actual
   */
  const datosOrdenados = useMemo(() => {
    if (!datos.length) return [];

    return [...datos].sort((a, b) => {
      const aValue = a[tableState.sortBy];
      const bValue = b[tableState.sortBy];

      // Manejar valores nulos/undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return tableState.sortOrder === 'asc' ? -1 : 1;
      if (bValue == null) return tableState.sortOrder === 'asc' ? 1 : -1;

      // Ordenamiento para números
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return tableState.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Ordenamiento para fechas
      if (tableState.sortBy === 'fechaRegistro') {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        return tableState.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Ordenamiento para strings
      const stringA = String(aValue).toLowerCase();
      const stringB = String(bValue).toLowerCase();
      
      if (tableState.sortOrder === 'asc') {
        return stringA.localeCompare(stringB);
      } else {
        return stringB.localeCompare(stringA);
      }
    });
  }, [datos, tableState.sortBy, tableState.sortOrder]);

  /**
   * Datos paginados para la página actual
   */
  const datosPaginados = useMemo(() => {
    const startIndex = (tableState.page - 1) * tableState.pageSize;
    const endIndex = startIndex + tableState.pageSize;
    return datosOrdenados.slice(startIndex, endIndex);
  }, [datosOrdenados, tableState.page, tableState.pageSize]);

  /**
   * Información de paginación
   */
  const paginacion = useMemo(() => {
    const totalItems = datosOrdenados.length;
    const totalPages = Math.ceil(totalItems / tableState.pageSize);
    const startItem = totalItems === 0 ? 0 : (tableState.page - 1) * tableState.pageSize + 1;
    const endItem = Math.min(tableState.page * tableState.pageSize, totalItems);

    return {
      currentPage: tableState.page,
      totalPages,
      pageSize: tableState.pageSize,
      totalItems,
      startItem,
      endItem,
      hasNextPage: tableState.page < totalPages,
      hasPreviousPage: tableState.page > 1
    };
  }, [datosOrdenados.length, tableState.page, tableState.pageSize]);

  /**
   * Cambia la página actual
   */
  const cambiarPagina = useCallback((nuevaPagina: number) => {
    setTableState(prev => ({
      ...prev,
      page: Math.max(1, Math.min(nuevaPagina, paginacion.totalPages))
    }));
  }, [paginacion.totalPages]);

  /**
   * Cambia el tamaño de página
   */
  const cambiarTamanoPagina = useCallback((nuevoTamano: number) => {
    setTableState(prev => ({
      ...prev,
      pageSize: nuevoTamano,
      page: 1 // Resetear a la primera página
    }));
  }, []);

  /**
   * Cambia el ordenamiento
   */
  const cambiarOrden = useCallback((columna: InventarioTableColumn) => {
    setTableState(prev => {
      // Si es la misma columna, cambiar la dirección
      if (prev.sortBy === columna) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
        };
      }
      
      // Si es una columna diferente, usar orden descendente por defecto
      return {
        ...prev,
        sortBy: columna,
        sortOrder: 'desc'
      };
    });
  }, []);

  /**
   * Va a la página anterior
   */
  const paginaAnterior = useCallback(() => {
    if (paginacion.hasPreviousPage) {
      cambiarPagina(tableState.page - 1);
    }
  }, [cambiarPagina, paginacion.hasPreviousPage, tableState.page]);

  /**
   * Va a la página siguiente
   */
  const paginaSiguiente = useCallback(() => {
    if (paginacion.hasNextPage) {
      cambiarPagina(tableState.page + 1);
    }
  }, [cambiarPagina, paginacion.hasNextPage, tableState.page]);

  /**
   * Va a la primera página
   */
  const primeraPagina = useCallback(() => {
    cambiarPagina(1);
  }, [cambiarPagina]);

  /**
   * Va a la última página
   */
  const ultimaPagina = useCallback(() => {
    cambiarPagina(paginacion.totalPages);
  }, [cambiarPagina, paginacion.totalPages]);

  /**
   * Resetea la tabla al estado inicial
   */
  const resetearTabla = useCallback(() => {
    setTableState({
      page: 1,
      pageSize: 10,
      sortBy: 'fechaRegistro',
      sortOrder: 'desc'
    });
  }, []);

  /**
   * Obtiene el ícono de ordenamiento para una columna
   */
  const getIconoOrden = useCallback((columna: InventarioTableColumn) => {
    if (tableState.sortBy !== columna) {
      return 'neutral'; // Sin orden específico
    }
    return tableState.sortOrder;
  }, [tableState.sortBy, tableState.sortOrder]);

  return {
    // Datos procesados
    datosPaginados,
    datosOrdenados,

    // Estado de la tabla
    tableState,

    // Información de paginación
    paginacion,

    // Acciones de paginación
    cambiarPagina,
    cambiarTamanoPagina,
    paginaAnterior,
    paginaSiguiente,
    primeraPagina,
    ultimaPagina,

    // Acciones de ordenamiento
    cambiarOrden,
    getIconoOrden,

    // Acciones generales
    resetearTabla,

    // Estados útiles
    hayDatos: datosPaginados.length > 0,
    esPrimeraPagina: tableState.page === 1,
    esUltimaPagina: tableState.page === paginacion.totalPages
  };
};
