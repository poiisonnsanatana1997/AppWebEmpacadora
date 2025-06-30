import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterSelect } from './FilterSelect';
import { FilterInput } from './FilterInput';
import { Edit2, ChevronDown, ChevronUp, ChevronsUpDown, Loader2, User, Mail, Phone, Building, Calendar, X, RefreshCw, Eye } from 'lucide-react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import type { ProveedorCompletoDto } from '@/types/Proveedores/proveedores.types';

const StatusBadge = styled(Badge)`
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

// Función auxiliar para manejar valores nulos o vacíos
const formatCellValue = (value: any, fallbackText: string = 'No disponible') => {
  if (value === null || value === undefined || value === '') {
    return (
      <span className="text-gray-400 italic">
        {fallbackText}
      </span>
    );
  }
  return String(value);
};

// Función para formatear fechas
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return formatCellValue(dateString, 'Sin fecha');
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return formatCellValue(dateString, 'Fecha inválida');
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return formatCellValue(dateString, 'Fecha inválida');
  }
};

interface ProveedorTableProps {
  proveedores: ProveedorCompletoDto[];
  loading: boolean;
  error: string | null;
  onEdit: (id: number) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onViewDetail: (id: number) => void;
}

export function ProveedorTable({ proveedores, loading, error, onEdit, onToggleStatus, onViewDetail }: ProveedorTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});

  const columns = useMemo<ColumnDef<ProveedorCompletoDto>[]>(() => [
    {
      accessorKey: 'nombre',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Nombre
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-1 h-3 w-3" />
              ) : (
                <ChevronsUpDown className="ml-1 h-3 w-3" />
              )}
            </Button>
            <div className="mt-2">
              <FilterInput
                value={(filterValue as string) ?? ""}
                onChange={(value) => column.setFilterValue(value)}
                placeholder="Filtrar por nombre..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const nombre = row.getValue('nombre') as string;
        return (
          <div className="font-medium">
            {formatCellValue(nombre, 'Sin nombre')}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!value) return true;
        const cellValue = row.getValue(id);
        if (!cellValue) return false;
        return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      accessorKey: 'rfc',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              RFC
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-1 h-3 w-3" />
              ) : (
                <ChevronsUpDown className="ml-1 h-3 w-3" />
              )}
            </Button>
            <div className="mt-2">
              <FilterInput
                value={(filterValue as string) ?? ""}
                onChange={(value) => column.setFilterValue(value)}
                placeholder="Filtrar por RFC..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const rfc = row.getValue('rfc') as string;
        return (
          <div className="font-mono">
            {formatCellValue(rfc, 'Sin RFC')}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!value) return true;
        const cellValue = row.getValue(id);
        if (!cellValue) return false;
        return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      accessorKey: 'telefono',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <span className="font-semibold">Teléfono</span>
            <div className="mt-2">
              <FilterInput
                value={(filterValue as string) ?? ""}
                onChange={(value) => column.setFilterValue(value)}
                placeholder="Filtrar por teléfono..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const telefono = row.getValue('telefono') as string;
        return (
          <div>
            {formatCellValue(telefono, 'Sin teléfono')}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!value) return true;
        const cellValue = row.getValue(id);
        if (!cellValue) return false;
        return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      accessorKey: 'correo',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <span className="font-semibold">Correo</span>
            <div className="mt-2">
              <FilterInput
                value={(filterValue as string) ?? ""}
                onChange={(value) => column.setFilterValue(value)}
                placeholder="Filtrar por correo..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const correo = row.getValue('correo') as string;
        return (
          <div>
            {formatCellValue(correo, 'Sin correo')}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!value) return true;
        const cellValue = row.getValue(id);
        if (!cellValue) return false;
        return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      accessorKey: 'fechaRegistro',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
        >
          Fecha de Registro
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-1 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-1 h-3 w-3" />
          ) : (
            <ChevronsUpDown className="ml-1 h-3 w-3" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const fechaRegistro = row.getValue('fechaRegistro') as string;
        return (
          <div>
            {formatDate(fechaRegistro)}
          </div>
        );
      },
    },
    {
      accessorKey: 'activo',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold h-8 px-2 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
        >
          Estado
          {column.getIsSorted() === "asc" ? (
            <ChevronUp className="ml-1 h-3 w-3" />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown className="ml-1 h-3 w-3" />
          ) : (
            <ChevronsUpDown className="ml-1 h-3 w-3" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const activo = row.original.activo;
        // Manejar el caso donde activo puede ser null o undefined
        if (activo === null || activo === undefined) {
          return (
            <StatusBadge
              variant="secondary"
              className="bg-gray-200 text-gray-600 hover:bg-gray-300 font-semibold"
            >
              No definido
            </StatusBadge>
          );
        }
        return (
          <StatusBadge
            variant="secondary"
            className={`font-semibold ${activo ? 'bg-green-200 text-green-800 hover:bg-green-300' : 'bg-red-200 text-red-800 hover:bg-red-300'}`}
          >
            {activo ? 'Activo' : 'Inactivo'}
          </StatusBadge>
        );
      },
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const activo = row.original.activo;
        const isActive = activo === true;
        
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetail(row.original.id)}
                    className="hover:bg-blue-50"
                    aria-label="Ver detalle del proveedor"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver detalle</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(row.original.id)}
                    className="hover:bg-blue-50"
                    aria-label="Editar proveedor"
                  >
                    <Edit2 className="h-4 w-4 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar proveedor</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(row.original.id, isActive)}
                    className="hover:bg-gray-50"
                    aria-label={isActive ? "Desactivar proveedor" : "Activar proveedor"}
                  >
                    {isActive ? (
                      <X className="h-4 w-4 text-gray-600" />
                    ) : (
                      <RefreshCw className="h-4 w-4 text-gray-600" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isActive ? "Desactivar proveedor" : "Activar proveedor"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ], [onEdit, onToggleStatus, onViewDetail]);

  const tableData = useMemo(() => proveedores, [proveedores]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableFilters: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableMultiSort: false,
    enableSortingRemoval: false,
    enableColumnResizing: false,
  });

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-8"
      >
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando proveedores...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-8"
      >
        <div className="text-red-500 text-center">
          <p className="font-semibold">Error al cargar proveedores</p>
          <p className="text-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!proveedores.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-8"
      >
        <div className="text-gray-500 text-center">
          <p className="font-semibold">No hay proveedores registrados</p>
          <p className="text-sm">Comienza agregando un nuevo proveedor</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <table className="w-full">
        <thead className="bg-[#f1f5f9]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="hover:bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 font-semibold text-gray-700 border-b border-[#e2e8f0]">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <AnimatePresence mode="wait">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <td colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="bg-gray-50 rounded-full p-4">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-700">No se encontraron proveedores</h3>
                      <p className="text-sm text-gray-500 max-w-md">
                        No hay proveedores que coincidan con los criterios de búsqueda actuales.
                        Intenta ajustar los filtros o crear un nuevo proveedor.
                      </p>
                    </div>
                  </div>
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
      
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer hidden lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a primera página</span>
              <ChevronUp className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a página anterior</span>
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a página siguiente</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer hidden lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a última página</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProveedorTable; 