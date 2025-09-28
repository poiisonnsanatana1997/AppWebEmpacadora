import { useState, useMemo } from 'react';
import { ClienteDTO } from '../../types/Cliente/cliente.types';

export interface ClienteFilters {
  nombre: string;
  razonSocial: string;
  rfc: string;
  activo: string;
  tipoCliente: string;
}

export const useClientesTable = (clientes: ClienteDTO[]) => {
  const [filters, setFilters] = useState<ClienteFilters>({
    nombre: '',
    razonSocial: '',
    rfc: '',
    activo: 'all',
    tipoCliente: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<keyof ClienteDTO>('fechaRegistro');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente => {
      const nombreMatch = cliente.nombre.toLowerCase().includes(filters.nombre.toLowerCase());
      const razonSocialMatch = cliente.razonSocial.toLowerCase().includes(filters.razonSocial.toLowerCase());
      const rfcMatch = cliente.rfc.toLowerCase().includes(filters.rfc.toLowerCase());
      const activoMatch = filters.activo === '' || filters.activo === 'all' || 
        (filters.activo === 'true' && cliente.activo) || 
        (filters.activo === 'false' && !cliente.activo);

      return nombreMatch && razonSocialMatch && rfcMatch && activoMatch;
    });
  }, [clientes, filters]);

  const sortedClientes = useMemo(() => {
    return [...filteredClientes].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      // Manejo especial para fechas
      if (sortField === 'fechaRegistro') {
        const dateA = new Date(aValue as string).getTime();
        const dateB = new Date(bValue as string).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortDirection === 'asc' 
          ? (aValue === bValue ? 0 : aValue ? 1 : -1)
          : (aValue === bValue ? 0 : aValue ? -1 : 1);
      }

      return 0;
    });
  }, [filteredClientes, sortField, sortDirection]);

  const paginatedClientes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedClientes.slice(startIndex, endIndex);
  }, [sortedClientes, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);

  const handleFilterChange = (field: keyof ClienteFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleSort = (field: keyof ClienteDTO) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setFilters({
      nombre: '',
      razonSocial: '',
      rfc: '',
      activo: 'all',
      tipoCliente: ''
    });
    setCurrentPage(1);
  };

  return {
    filters,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
    filteredClientes,
    sortedClientes,
    paginatedClientes,
    totalPages,
    handleFilterChange,
    handleSort,
    handlePageChange,
    clearFilters
  };
};
