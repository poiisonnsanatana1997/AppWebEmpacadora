import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { UsuarioDto } from '../../types/Usuarios/usuarios.type';
import { Button } from '@/components/ui/button';
import { UserX, ChevronDown, ChevronUp, ChevronsUpDown, Edit2, RefreshCw, X, Loader2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { FilterInput } from '../../components/Usuarios/FilterInput';
import { FilterSelect } from '../../components/Usuarios/FilterSelect';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

// Styled Components
const StatusBadge = styled(Badge)`
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

// Función auxiliar para formatear valores
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

interface UsuarioTableProps {
  usuarios: UsuarioDto[];
  loading: boolean;
  error: string | null;
  onEdit: (id: number) => void;
  onToggleStatus: (id: number, activo: boolean) => void;
}

export const UsuarioTable: React.FC<UsuarioTableProps> = ({
  usuarios,
  loading,
  error,
  onEdit,
  onToggleStatus,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<UsuarioDto>[]>(() => [
    {
      accessorKey: 'username',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Usuario
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
                onChange={(value: string) => column.setFilterValue(value)}
                placeholder="Filtrar por usuario..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const username = row.getValue('username') as string;
        return (
          <div className="font-medium">
            {formatCellValue(username, 'Sin usuario')}
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
      accessorKey: 'name',
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
                onChange={(value: string) => column.setFilterValue(value)}
                placeholder="Filtrar por nombre..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const name = row.getValue('name') as string;
        return (
          <div>
            {formatCellValue(name, 'Sin nombre')}
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
      accessorKey: 'email',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Email
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
                onChange={(value: string) => column.setFilterValue(value)}
                placeholder="Filtrar por email..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const email = row.getValue('email') as string;
        return (
          <div className="font-mono text-sm">
            {formatCellValue(email, 'Sin email')}
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
      accessorKey: 'roleName',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Rol
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-1 h-3 w-3" />
              ) : (
                <ChevronsUpDown className="ml-1 h-3 w-3" />
              )}
            </Button>
            <div className="mt-2">
              <FilterSelect
                value={(filterValue as string) ?? ""}
                onChange={(value: string) => column.setFilterValue(value)}
                options={[
                  { value: "all", label: "Todos los roles" },
                  { value: "admin", label: "Administrador" },
                  { value: "supervisor", label: "Supervisor" },
                  { value: "operador", label: "Operador" }
                ]}
                placeholder="Seleccionar rol..."
              />
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true;
        return row.getValue(id) === value;
      },
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize font-medium">
          {row.original.roleName.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
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
        const isActive = row.original.isActive;
        return (
          <StatusBadge
            variant="secondary"
            className={`font-semibold ${isActive ? 'bg-green-200 text-green-800 hover:bg-green-300' : 'bg-red-200 text-red-800 hover:bg-red-300'}`}
          >
            {isActive ? 'Activo' : 'Inactivo'}
          </StatusBadge>
        );
      },
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const usuario = row.original;
        
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(usuario.id)}
                    className="hover:bg-blue-50"
                  >
                    <Edit2 className="h-4 w-4 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar usuario</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(usuario.id, !usuario.isActive)}
                    className={usuario.isActive ? "hover:bg-red-50" : "hover:bg-green-50"}
                  >
                    {usuario.isActive ? (
                      <X className="h-4 w-4 text-red-500" />
                    ) : (
                      <RefreshCw className="h-4 w-4 text-green-500" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{usuario.isActive ? 'Desactivar usuario' : 'Activar usuario'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ], [onEdit, onToggleStatus]);

  const tableData = useMemo(() => usuarios, [usuarios]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
    enableColumnFilters: true,
    enableMultiSort: false,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
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
          <span>Cargando usuarios...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-center py-4"
      >
        Error: {error}
      </motion.div>
    );
  }

  if (!usuarios.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-8"
      >
        <div className="text-gray-500 text-center">
          <div className="bg-gray-50 rounded-full p-4 w-fit mx-auto mb-4">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <p className="font-semibold text-lg">No hay usuarios registrados</p>
          <p className="text-sm">Comienza agregando un nuevo usuario</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full min-w-[800px]">
          <thead className="bg-[#f1f5f9]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="hover:bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 font-semibold text-gray-700 border-b border-[#e2e8f0] min-w-[120px]">
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
                    className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3 max-w-[200px]">
                        <div className="truncate">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
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
                        <UserX className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700">No se encontraron usuarios</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                          No hay usuarios que coincidan con los criterios de búsqueda actuales.
                          Intenta ajustar los filtros o crear un nuevo usuario.
                        </p>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium hidden sm:block">Filas por página</p>
            <p className="text-sm font-medium sm:hidden">Por página</p>
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
            <span className="hidden sm:inline">Página </span>
            {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer hidden md:flex"
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
              className="h-8 w-8 p-0 cursor-pointer hidden md:flex"
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
}; 