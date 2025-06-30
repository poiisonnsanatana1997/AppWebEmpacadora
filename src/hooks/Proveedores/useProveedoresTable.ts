import { useMemo, useState } from "react";
import type { ProveedorCompletoDto } from "@/types/Proveedores/proveedores.types";

export interface ProveedoresTableFilter {
  search?: string;
  activo?: boolean | null;
}

export const useProveedoresTable = (
  proveedores: ProveedorCompletoDto[],
  initialRowsPerPage = 10
) => {
  // Filtros
  const [filter, setFilter] = useState<ProveedoresTableFilter>({ search: "", activo: null });

  // Paginación
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  // Ordenamiento
  const [sortBy, setSortBy] = useState<keyof ProveedorCompletoDto>("nombre");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Filtrado y ordenamiento
  const filtered = useMemo(() => {
    let data = proveedores;

    // Filtro por búsqueda (nombre, RFC, correo, etc.)
    if (filter.search) {
      const search = filter.search.toLowerCase();
      data = data.filter(
        p =>
          p.nombre.toLowerCase().includes(search) ||
          p.rfc.toLowerCase().includes(search) ||
          p.correo.toLowerCase().includes(search)
      );
    }

    // Filtro por estado
    if (filter.activo !== null && filter.activo !== undefined) {
      data = data.filter(p => p.activo === filter.activo);
    }

    // Ordenamiento
    data = [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue === bValue) return 0;
      if (sortDir === "asc") return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });

    return data;
  }, [proveedores, filter, sortBy, sortDir]);

  // Paginación
  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const totalRows = filtered.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Métodos para cambiar filtros, orden y paginación
  const handleFilterChange = (newFilter: Partial<ProveedoresTableFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setPage(1); // Resetear a la primera página al filtrar
  };

  const handleSort = (column: keyof ProveedorCompletoDto) => {
    if (sortBy === column) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (n: number) => {
    setRowsPerPage(n);
    setPage(1);
  };

  return {
    page,
    rowsPerPage,
    totalRows,
    totalPages,
    paginated,
    filter,
    sortBy,
    sortDir,
    handleFilterChange,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
  };
}; 