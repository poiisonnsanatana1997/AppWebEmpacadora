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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


// Iconos
import { Edit2, ChevronDown, ChevronUp, ChevronsUpDown, X, Clock, ClipboardX, Eye, ListChecks, CheckCircle, MoreHorizontal } from 'lucide-react';

// Utilidades y tipos
import clsx from 'clsx';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ESTADO_ORDEN, OrdenEntradaDto, estadoOrdenUtils } from '@/types/OrdenesEntrada/ordenesEntrada.types';
import { OrdenesEntradaTableProps } from '@/types/OrdenesEntrada/ordenesEntradaTable.types';
import { useOrdenesEntradaTable } from '@/hooks/OrdenesEntrada/useOrdenesEntradaTable';
import { FilterInput } from './FilterInput';
import { FilterSelect } from './FilterSelect';
import { fuzzyFilter } from '@/utils/tableUtils';

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
export function OrdenesEntradaTable({ ordenes, onEdit, onDelete, onRegistrarClasificacion }: OrdenesEntradaTableProps) {
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
    handleCancelarOrden,
    handleConfirmarCancelacion,
    navigate
  } = useOrdenesEntradaTable({ onDelete });

  // Estado local para controlar el valor del select de fecha
  const [fechaFilterValue, setFechaFilterValue] = React.useState("all");

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
      accessorKey: 'fechaEstimada',
      header: ({ column }) => {
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
                value={fechaFilterValue}
                onChange={(value) => {
                  setFechaFilterValue(value);
                  
                  if (value === "all") {
                    column.setFilterValue("");
                    // Limpiar ordenamiento
                    setSorting([]);
                  } else if (value === "asc") {
                    column.setFilterValue("");
                    // Ordenar ascendente (más antiguas primero)
                    setSorting([{ id: 'fechaEstimada', desc: false }]);
                  } else if (value === "desc") {
                    column.setFilterValue("");
                    // Ordenar descendente (más recientes primero)
                    setSorting([{ id: 'fechaEstimada', desc: true }]);
                  } else {
                    // Para filtros de fecha (hoy, próximos)
                    column.setFilterValue(value);
                    // Limpiar ordenamiento
                    setSorting([]);
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
      filterFn: (row, _id, value) => {
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
                  { value: "Procesando", label: "Procesando" },
                  { value: "Recibida", label: "Recibida" },
                  { value: "Clasificando", label: "Clasificando" },
                  { value: "Clasificado", label: "Clasificado" },
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
              estado === ESTADO_ORDEN.CLASIFICANDO ? 'bg-purple-200 text-purple-800 hover:bg-purple-300 font-semibold' :
              estado === ESTADO_ORDEN.CLASIFICADO ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300 font-semibold' :
              estado === ESTADO_ORDEN.CANCELADA ? 'bg-red-200 text-red-800 hover:bg-red-300 font-semibold' :
              'bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold'
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
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const orden = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-gray-100"
                aria-label="Acciones de la orden"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* Ver Detalles/Pesaje - Siempre disponible excepto cancelado */}
              {estadoOrdenUtils.puedeVerPesaje(orden.estado) && (
                <DropdownMenuItem 
                  onClick={() => navigate(`/ordenes-entrada/${orden.codigo}`)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Ver detalles y pesaje</span>
                </DropdownMenuItem>
              )}

              {/* Editar - Solo para órdenes pendientes */}
              {estadoOrdenUtils.puedeEditar(orden.estado) && (
                <DropdownMenuItem 
                  onClick={() => onEdit(orden.codigo)}
                  className="cursor-pointer"
                >
                  <Edit2 className="mr-2 h-4 w-4 text-yellow-600" />
                  <span>Editar orden</span>
                </DropdownMenuItem>
              )}

              {/* Clasificar - Solo para órdenes recibidas */}
              {estadoOrdenUtils.puedeClasificar(orden.estado) && (
                <DropdownMenuItem 
                  onClick={() => onRegistrarClasificacion(orden)}
                  className="cursor-pointer"
                >
                  <ListChecks className="mr-2 h-4 w-4 text-green-600" />
                  <span>Iniciar clasificación</span>
                </DropdownMenuItem>
              )}

              {/* Ver Clasificación - Solo para órdenes clasificadas */}
              {estadoOrdenUtils.puedeVerClasificacion(orden.estado) && (
                <DropdownMenuItem 
                  onClick={() => navigate(`/clasificacion-orden/${orden.id}`)}
                  className="cursor-pointer"
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-purple-600" />
                  <span>Ver clasificación</span>
                </DropdownMenuItem>
              )}

              {/* Separador antes de acciones destructivas */}
              {estadoOrdenUtils.esCancelable(orden.estado) && (
                <DropdownMenuSeparator />
              )}

              {/* Cancelar - Solo para órdenes cancelables */}
              {estadoOrdenUtils.esCancelable(orden.estado) && (
                <DropdownMenuItem 
                  onClick={() => handleCancelarOrden(orden.codigo)}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <ClipboardX className="mr-2 h-4 w-4" />
                  <span>Cancelar orden</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
  ], [onEdit, onDelete, onRegistrarClasificacion, fechaFilterValue, setSorting, navigate]);

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
                      <ClipboardX className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-700">No se encontraron órdenes</h3>
                      <p className="text-sm text-gray-500 max-w-md">
                        No hay órdenes que coincidan con los criterios de búsqueda actuales.
                        Intenta ajustar los filtros o crear una nueva orden.
                      </p>
                    </div>
                  </div>
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>

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
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-gray-900">
              <ClipboardX className="w-5 h-5" />
              Confirmar Cancelación de Orden
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800 mb-2">
                  ⚠️ Esta acción no se puede deshacer
                </p>
                <p className="text-sm text-red-700">
                  La orden será marcada como cancelada y no podrá ser reactivada posteriormente.
                </p>
              </div>
              
              {ordenACancelar && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Orden a cancelar:
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Código:</span> {ordenACancelar}
                  </p>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  ¿Qué sucede al cancelar?
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• La orden cambiará a estado "Cancelada"</li>
                  <li>• No se podrá procesar ni clasificar</li>
                  <li>• Se mantendrá en el historial para auditoría</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700">
              Mantener Orden
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmarCancelacion}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Sí, Cancelar Orden
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  );
} 