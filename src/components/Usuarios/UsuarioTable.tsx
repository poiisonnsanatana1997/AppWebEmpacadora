import React from 'react';
import { UsuarioDto } from '../../types/Usuarios/usuarios.type';
import { Button } from '@/components/ui/button';
import { UserX, ChevronDown, ChevronUp, ChevronsUpDown, Edit2, RefreshCw, X } from 'lucide-react';
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

  const columns = React.useMemo<ColumnDef<UsuarioDto>[]>(() => [
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
        <Badge variant="outline" className="capitalize">
          {row.original.roleName.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
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
            <div className="mt-2">
              <FilterInput
                value={(filterValue as string) ?? ""}
                onChange={(value: string) => column.setFilterValue(value)}
                placeholder="Filtrar por estado..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          className={row.original.isActive ? 'bg-green-200 text-green-800 hover:bg-green-300 font-semibold' : 'bg-red-200 text-red-800 hover:bg-red-300 font-semibold'}
        >
          {row.original.isActive ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(row.original.id)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar usuario</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {row.original.isActive ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(row.original.id, false)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desactivar usuario</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(row.original.id, true)}
                  >
                    <RefreshCw className="h-4 w-4 text-green-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Activar usuario</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
    },
  ], [onEdit, onToggleStatus]);

  const table = useReactTable({
    data: usuarios,
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
  });

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <table className="w-full">
        <thead className="bg-[#f1f5f9]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-200 last:border-b-0">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
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
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Controles de paginación */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Mostrando {table.getFilteredRowModel().rows.length} usuario(s) en total.
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
}; 