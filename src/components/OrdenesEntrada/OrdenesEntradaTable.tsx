// Importaciones
// ============================================
// React y enrutamiento
import React from 'react';

// Importaciones relacionadas con la tabla
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

// Componentes de UI
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

// Iconos
import { Edit2, ChevronDown, ChevronUp, ChevronsUpDown, X, RefreshCw, Clock } from 'lucide-react';

// Utilidades y tipos
import clsx from 'clsx';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ESTADO_ORDEN, OrdenEntradaDto } from '../../types/ordenesEntrada';
import { OrdenesEntradaTableProps } from './types/ordenesEntradaTable.types';
import { useOrdenesEntradaTable } from './hooks/useOrdenesEntradaTable';
import { FilterInput } from './components/FilterInput';
import { FilterSelect } from './components/FilterSelect';
import { fuzzyFilter } from './utils/tableUtils';

// Componentes Estilizados
// ============================================
/**
 * Icono de reloj estilizado para indicar órdenes del día actual
 */
const TodayIcon = styled(Clock)`
  width: 1rem;
  height: 1rem;
  color: #f59e0b;
  margin-right: 0.25rem;
`;

// Componente Principal: OrdenesEntradaTable
// ============================================
/**
 * Componente principal de tabla para mostrar y gestionar órdenes de entrada
 * Características:
 * - Ordenamiento: Click en encabezados de columna para ordenar
 * - Filtrado: Búsqueda y filtrado por múltiples criterios
 * - Paginación: Navegación entre páginas de resultados
 * - Selección de filas: Selección múltiple para acciones en lote
 * - Diseño responsivo: Se adapta a diferentes tamaños de pantalla
 * - Acciones: Editar, eliminar y reactivar órdenes
 * - Indicadores de estado: Badges visuales para el estado de la orden
 * - Filtrado por fecha: Filtrar por hoy, próximos 7 días, etc.
 * - Diálogos de confirmación: Para acciones destructivas
 */
export function OrdenesEntradaTable({ ordenes, onEdit, onDelete, onReactivate }: OrdenesEntradaTableProps) {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    ordenACancelar,
    ordenAReactivar,
    handleCancelarOrden,
    handleReactivarOrden,
    handleConfirmarCancelacion,
    handleConfirmarReactivacion,
    navigate
  } = useOrdenesEntradaTable({ ordenes, onEdit, onDelete, onReactivate });

  // Definición de columnas con ordenamiento, filtrado y renderizado personalizado
  const columns = React.useMemo<ColumnDef<OrdenEntradaDto>[]>(() => [
    {
      accessorKey: 'codigo',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Código
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
                placeholder="Filtrar por código..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const fecha = new Date(row.original.fechaEstimada);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const esHoy = fecha.toDateString() === hoy.toDateString();

        return (
          <div className="flex items-center gap-2">
            <span>{row.original.codigo}</span>
            {esHoy && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="destructive" className="h-5 px-1.5 text-xs bg-orange-200 text-orange-800 hover:bg-orange-300 font-semibold">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TodayIcon />
                        Hoy
                      </div>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Orden pendiente para hoy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: 'proveedor.nombre',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
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
            <div className="mt-2">
              <FilterInput
                value={(filterValue as string) ?? ""}
                onChange={(value) => column.setFilterValue(value)}
                placeholder="Filtrar por proveedor..."
              />
            </div>
          </div>
        );
      },
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: 'fecha',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
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
            <div className="mt-2">
              <FilterSelect
                value={filterValue ?? "all"}
                onChange={(value) => {
                  if (value === "all") {
                    column.setFilterValue("");
                  } else if (value === "asc" || value === "desc") {
                    column.setFilterValue("");
                    column.toggleSorting(value === "desc");
                  } else {
                    column.setFilterValue(value);
                  }
                }}
                options={[
                  { value: "all", label: "Todas las fechas" },
                  { value: "asc", label: "Más antiguas primero" },
                  { value: "desc", label: "Más recientes primero" },
                  { value: "proximos", label: "Próximos 7 días" },
                  { value: "hoy", label: "Para hoy" },
                ]}
                placeholder="Seleccionar filtro de fecha"
              />
            </div>
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
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true;
        
        const fecha = new Date(row.original.fechaEstimada);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (value === "hoy") {
          return fecha.toDateString() === hoy.toDateString();
        }
        
        if (value === "proximos") {
          const sieteDiasDespues = new Date(hoy);
          sieteDiasDespues.setDate(hoy.getDate() + 7);
          return fecha >= hoy && fecha <= sieteDiasDespues;
        }
        
        return true;
      },
    },
    {
      accessorKey: 'fechaRegistro',
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
            >
              Fecha Registro
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
        const fecha = new Date(row.original.fechaRegistro);
        return fecha.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
    },
    {
      accessorKey: 'estado',
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
              <FilterSelect
                value={filterValue ?? "all"}
                onChange={(value) => column.setFilterValue(value === "all" ? "" : value)}
                options={[
                  { value: "all", label: "Todos los estados" },
                  { value: "Pendiente", label: "Pendiente" },
                  { value: "Recibida", label: "Recibida" },
                  { value: "Cancelada", label: "Cancelada" },
                ]}
                placeholder="Seleccionar estado"
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const estado = row.original.estado;
        return (
          <Badge
            variant="secondary"
            className={
              estado === ESTADO_ORDEN.PENDIENTE ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300 font-semibold' :
              estado === ESTADO_ORDEN.PROCESANDO ? 'bg-blue-200 text-blue-800 hover:bg-blue-300 font-semibold' :
              estado === ESTADO_ORDEN.RECIBIDA ? 'bg-green-200 text-green-800 hover:bg-green-300 font-semibold' :
              'bg-red-200 text-red-800 hover:bg-red-300 font-semibold'
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
                      onClick={() => handleReactivarOrden(row.original.codigo!)}
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
                      onClick={() => handleCancelarOrden(row.original.codigo!)}
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
  ], [navigate, onEdit]);

  // Instancia de tabla con todas las características habilitadas
  const table = useReactTable({
    data: ordenes,
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
  });

  return (
    <div className="space-y-4">
      {/* Tabla con encabezado y cuerpo */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="p-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
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
                      <TableCell key={cell.id} className="p-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No hay resultados.
                  </TableCell>
                </motion.tr>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Controles de paginación y conteo de filas */}
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

      {/* Diálogos de confirmación */}
      <AlertDialog 
        open={!!ordenACancelar} 
        onOpenChange={(open) => !open && handleCancelarOrden(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cancelará la orden y no se podrá deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarCancelacion}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog 
        open={!!ordenAReactivar} 
        onOpenChange={(open) => !open && handleReactivarOrden(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción reactivará la orden y volverá a su estado pendiente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarReactivacion}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 