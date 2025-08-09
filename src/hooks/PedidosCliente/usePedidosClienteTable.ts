import { useState, useCallback, useMemo, useEffect } from 'react';
import type { 
  PedidoClienteResponseDTO,
  PedidoClienteFilters
} from '@/types/PedidoCliente/pedidoCliente.types';

export const usePedidosClienteTable = (pedidosCliente: PedidoClienteResponseDTO[], loading: boolean, error: string | null, cargarPedidosCliente: () => Promise<void>, eliminarPedidoCliente: (id: number) => Promise<boolean>) => {

  // Estado de la tabla
  const [filters, setFilters] = useState<PedidoClienteFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Aplicar filtros
  const applyFilters = useCallback((data: PedidoClienteResponseDTO[], currentFilters: PedidoClienteFilters) => {
    let filteredData = [...data];

    // Filtro por estatus
    if (currentFilters.estatus && currentFilters.estatus !== 'all') {
      filteredData = filteredData.filter(pedido => pedido.estatus === currentFilters.estatus);
    }

    // Filtro por cliente - Comentado porque ahora viene como string en el DTO
    // if (currentFilters.idCliente) {
    //   filteredData = filteredData.filter(pedido => pedido.idCliente === currentFilters.idCliente);
    // }

    // Filtro por sucursal - Comentado porque ahora viene como string en el DTO
    // if (currentFilters.idSucursal) {
    //   filteredData = filteredData.filter(pedido => pedido.idSucursal === currentFilters.idSucursal);
    // }

    // Filtro por fechas
    if (currentFilters.fechaDesde) {
      filteredData = filteredData.filter(pedido => 
        new Date(pedido.fechaRegistro) >= currentFilters.fechaDesde!
      );
    }

    if (currentFilters.fechaHasta) {
      filteredData = filteredData.filter(pedido => 
        new Date(pedido.fechaRegistro) <= currentFilters.fechaHasta!
      );
    }

    // Filtro por estado activo
    if (currentFilters.activo !== undefined) {
      filteredData = filteredData.filter(pedido => pedido.activo === currentFilters.activo);
    }

    return filteredData;
  }, []);

  // Datos filtrados
  const filteredData = useMemo(() => {
    return applyFilters(pedidosCliente, filters);
  }, [pedidosCliente, filters, applyFilters]);

  // Datos paginados
  const paginatedData = useMemo(() => {
    const { page, pageSize } = pagination;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, pagination]);

  // Actualizar paginación cuando cambian los datos
  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / pagination.pageSize);
    setPagination(prev => ({
      ...prev,
      totalItems: filteredData.length,
      totalPages: totalPages,
      // Asegurar que la página actual no exceda el total de páginas
      page: prev.page > totalPages && totalPages > 0 ? totalPages : prev.page,
    }));
  }, [filteredData.length, pagination.pageSize]);

  // Actualizar paginación
  const updatePagination = useCallback((newPagination: Partial<typeof pagination>) => {
    setPagination(prev => ({
      ...prev,
      ...newPagination,
      totalItems: filteredData.length,
      totalPages: Math.ceil(filteredData.length / prev.pageSize),
    }));
  }, [filteredData.length]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<PedidoClienteFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Resetear a primera página
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Seleccionar/deseleccionar items
  const toggleItemSelection = useCallback((id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  }, []);

  // Seleccionar todos
  const selectAll = useCallback(() => {
    setSelectedItems(paginatedData.map(item => item.id));
  }, [paginatedData]);

  // Deseleccionar todos
  const deselectAll = useCallback(() => {
    setSelectedItems([]);
  }, []);

  // Eliminar items seleccionados
  const deleteSelectedItems = useCallback(async () => {
    if (selectedItems.length === 0) return;

    const success = await Promise.all(
      selectedItems.map(id => eliminarPedidoCliente(id))
    );

    if (success.every(Boolean)) {
      setSelectedItems([]);
    }
  }, [selectedItems, eliminarPedidoCliente]);

  // Cambiar página
  const changePage = useCallback((page: number) => {
    updatePagination({ page });
  }, [updatePagination]);

  // Cambiar tamaño de página
  const changePageSize = useCallback((pageSize: number) => {
    updatePagination({ pageSize, page: 1 });
  }, [updatePagination]);

  return {
    // Estado
    data: paginatedData,
    loading,
    error,
    filters,
    pagination,
    selectedItems,
    totalItems: filteredData.length,

    // Acciones
    updateFilters,
    clearFilters,
    changePage,
    changePageSize,
    toggleItemSelection,
    selectAll,
    deselectAll,
    deleteSelectedItems,
    cargarPedidosCliente,
  };
}; 