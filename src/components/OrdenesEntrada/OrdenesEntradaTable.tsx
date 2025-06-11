import React from 'react';
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
  RowSelectionState,
  VisibilityState,
  FilterFn,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, ChevronDown, ChevronUp, ChevronsUpDown, Search, SlidersHorizontal, Filter, X, RefreshCw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from 'clsx';
import { ESTADO_ORDEN, OrdenEntradaDto } from '@/types/ordenesEntrada';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OrdenesEntradaTableProps {
  ordenes: OrdenEntradaDto[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

export function OrdenesEntradaTable({ ordenes, onEdit, onDelete, onReactivate }: OrdenesEntradaTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: 'fecha',
      desc: true
    }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [ordenACancelar, setOrdenACancelar] = React.useState<string | null>(null);
  const [ordenAReactivar, setOrdenAReactivar] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const columns = React.useMemo<ColumnDef<OrdenEntradaDto, any>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-semibold h-8 px-2 cursor-pointer"
              >
                Orden
                {column.getIsSorted() === "asc" ? (
                  <ChevronUp className="ml-1 h-3 w-3" />
                ) : column.getIsSorted() === "desc" ? (
                  <ChevronDown className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronsUpDown className="ml-1 h-3 w-3" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={clsx(
                      "h-6 w-6 relative cursor-pointer",
                      hasFilter && "text-blue-500"
                    )}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <Input
                    placeholder="Filtrar orden..."
                    value={(column.getFilterValue() as string) ?? ""}
                    onChange={(event) => column.setFilterValue(event.target.value)}
                    className="h-8"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        filterFn: fuzzyFilter,
      },
      {
        accessorKey: 'proveedor.nombre',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-semibold h-8 px-2 cursor-pointer"
              >
                Proveedor
                {column.getIsSorted() === "asc" ? (
                  <ChevronUp className="ml-1 h-3 w-3" />
                ) : column.getIsSorted() === "desc" ? (
                  <ChevronDown className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronsUpDown className="ml-1 h-3 w-3" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={clsx(
                      "h-6 w-6 relative cursor-pointer",
                      hasFilter && "text-blue-500"
                    )}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <Input
                    placeholder="Filtrar proveedor..."
                    value={(column.getFilterValue() as string) ?? ""}
                    onChange={(event) => column.setFilterValue(event.target.value)}
                    className="h-8"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        filterFn: fuzzyFilter,
      },
      {
        accessorKey: 'fecha',
        header: ({ column }) => {
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-semibold h-8 px-2 cursor-pointer"
              >
                Fecha Estimada
                {column.getIsSorted() === "asc" ? (
                  <ChevronUp className="ml-1 h-3 w-3" />
                ) : column.getIsSorted() === "desc" ? (
                  <ChevronDown className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronsUpDown className="ml-1 h-3 w-3" />
                )}
              </Button>
            </div>
          );
        },
        cell: ({ row }) => {
          const fecha = new Date(row.original.fechaEstimada);
          return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        },
      },
      {
        accessorKey: 'estado',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <div className="font-semibold">Estado</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={clsx(
                      "h-6 w-6 relative cursor-pointer",
                      hasFilter && "text-blue-500"
                    )}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  <Select
                    value={filterValue ?? "all"}
                    onValueChange={(value) => column.setFilterValue(value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="Filtrar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Recibida">Recibida</SelectItem>
                      <SelectItem value="Cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        cell: ({ row }) => {
          const estado = row.original.estado;
          return (
            <Badge
              variant="secondary"
              className={
                estado === ESTADO_ORDEN.PENDIENTE ? 'bg-black text-white hover:bg-black/90' :
                estado === ESTADO_ORDEN.PROCESANDO ? 'bg-blue-500 text-white hover:bg-blue-600' :
                estado === ESTADO_ORDEN.RECIBIDA ? 'bg-green-500 text-white hover:bg-green-600' :
                'bg-red-500 text-white hover:bg-red-600'
              }
            >
              {estado}
            </Badge>
          );
        },
        filterFn: (row, _id, value) => {
          if (!value || value === "all") return true;
          return row.original.estado === value;
        },
      },
      {
        id: 'detalle',
        header: 'Detalle',
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/ordenes-entrada/${row.original.codigo}`)}
          >
            Ver Detalle
          </Button>
        ),
      },
      {
        id: 'acciones',
        header: 'Acciones',
        cell: ({ row }) => {
          const estado = row.original.estado;
          return (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(row.original.codigo!)}
                      disabled={estado !== ESTADO_ORDEN.PENDIENTE}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{estado !== ESTADO_ORDEN.PENDIENTE ? 'Solo se pueden editar órdenes en estado Pendiente' : 'Editar orden'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {estado === ESTADO_ORDEN.CANCELADA ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOrdenAReactivar(row.original.codigo!)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reactivar orden</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : estado === ESTADO_ORDEN.PENDIENTE ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setOrdenACancelar(row.original.codigo!)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cancelar orden</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
            </div>
          );
        },
      },
    ],
    [navigate, onEdit, onDelete, onReactivate]
  );

  const table = useReactTable({
    data: ordenes,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar órdenes..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto cursor-pointer">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      className="capitalize"
                      onSelect={(e: Event) => {
                        e.preventDefault();
                        column.toggleVisibility(!column.getIsVisible());
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        {column.id === 'codigo' ? 'Orden' :
                         column.id === 'proveedor.nombre' ? 'Proveedor' :
                         column.id === 'fecha' ? 'Fecha de Recepción' :
                         column.id === 'estado' ? 'Estado' :
                         column.id === 'detalle' ? 'Detalle' :
                         column.id === 'acciones' ? 'Acciones' :
                         column.id}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No hay órdenes de entrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
                className={clsx(
                  "h-8 w-8 p-0 cursor-pointer",
                  "hidden lg:flex"
                )}
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
                className={clsx(
                  "h-8 w-8 p-0 cursor-pointer",
                  "hidden lg:flex"
                )}
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

      <AlertDialog open={!!ordenACancelar} onOpenChange={() => setOrdenACancelar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de cancelar esta orden?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cambiará el estado de la orden a "Cancelada". Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener orden</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (ordenACancelar) {
                onDelete(ordenACancelar);
                setOrdenACancelar(null);
              }
            }}>
              Sí, cancelar orden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!ordenAReactivar} onOpenChange={() => setOrdenAReactivar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de reactivar esta orden?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cambiará el estado de la orden a "Pendiente" y permitirá continuar con el pesaje.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener cancelada</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (ordenAReactivar) {
                onReactivate(ordenAReactivar);
                setOrdenAReactivar(null);
              }
            }}>
              Sí, reactivar orden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default OrdenesEntradaTable; 