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
import { Checkbox } from '@/components/ui/checkbox';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Iconos
import { Edit2, ChevronDown, ChevronUp, ChevronsUpDown, X, Clock, ClipboardX, Eye, ListChecks, CheckCircle, MoreHorizontal, Loader2, ClipboardList, CheckSquare, Square } from 'lucide-react';

// Utilidades y tipos
import clsx from 'clsx';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ESTADO_ORDEN, OrdenEntradaDto, estadoOrdenUtils } from '@/types/OrdenesEntrada/ordenesEntrada.types';
import { OrdenesEntradaTableProps } from '@/types/OrdenesEntrada/ordenesEntradaTable.types';
import { OrdenesEntradaTableReporteProps } from '@/types/Reportes/reporteOrdenesClasificadas.types';
import { useOrdenesEntradaTable } from '@/hooks/OrdenesEntrada/useOrdenesEntradaTable';
import { FilterInput } from './FilterInput';
import { FilterSelect } from './FilterSelect';
import { fuzzyFilter } from '@/utils/tableUtils';

// Componentes Estilizados
// ============================================
/**
 * Icono de reloj estilizado para indicar órdenes del día actual
 */
const TodayIcon = ({ className, ...props }: React.ComponentProps<typeof Clock>) => (
  <Clock
    {...props}
    className={`w-4 h-4 text-amber-500 mr-1 ${className || ''}`}
  />
);

/**
 * Badge de estado estilizado con mejor presentación
 */
const StatusBadge = ({ className, ...props }: React.ComponentProps<typeof Badge>) => (
  <Badge
    {...props}
    className={`font-semibold transition-all duration-200 hover:scale-105 ${className || ''}`}
  />
);

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
export function OrdenesEntradaTable({ 
  ordenes, 
  onEdit, 
  onDelete, 
  onRegistrarClasificacion, 
  onFiltersChange,
  modoReporte = false,
  ordenesSeleccionadasReporte = [],
  onToggleSeleccionReporte,
  onLimpiarSeleccionReporte
}: OrdenesEntradaTableProps & Partial<OrdenesEntradaTableReporteProps>) {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    fechaFilterValue,
    setFechaFilterValue,
    ordenACancelar,
    handleCancelarOrden,
    handleConfirmarCancelacion,
    clearFilters,
    navigate
  } = useOrdenesEntradaTable({ onDelete });

  // Detectar si hay filtros activos
  React.useEffect(() => {
    const hasActiveFilters = columnFilters.length > 0 || fechaFilterValue !== "all";
    onFiltersChange?.(hasActiveFilters, clearFilters);
  }, [columnFilters, fechaFilterValue, onFiltersChange, clearFilters]);


  // Definición de columnas con ordenamiento, filtrado y renderizado personalizado
  const columns = React.useMemo<ColumnDef<OrdenEntradaDto>[]>(() => [
    // Columna de selección para reporte (solo visible en modo reporte)
    ...(modoReporte ? [{
      id: 'seleccionReporte',
      header: () => (
        <div className="text-center">
          <span className="text-xs font-medium text-gray-500">Reporte</span>
        </div>
      ),
      cell: ({ row }) => {
        const orden = row.original;
        // Solo incluir órdenes que estén en estado "Clasificado"
        const puedeIncluir = orden.estado === ESTADO_ORDEN.CLASIFICADO;
        const isSeleccionada = ordenesSeleccionadasReporte.includes(orden.codigo);
        
        if (!puedeIncluir) {
          return (
            <div className="flex justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-gray-400 cursor-not-allowed">
                      <Square className="w-4 h-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Solo órdenes clasificadas pueden incluirse en reportes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        }

        return (
          <div className="flex justify-center">
            {onToggleSeleccionReporte ? (
              <Checkbox
                checked={isSeleccionada}
                onChange={(e) => {
                  onToggleSeleccionReporte(orden.codigo, e.target.checked);
                }}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 border-2 border-blue-500 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
              />
            ) : (
              <div className="text-gray-400 cursor-not-allowed">
                <Square className="w-4 h-4" />
              </div>
            )}
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 80,
    }] : []),
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
            <span className="font-medium">{row.original.codigo}</span>
            {esHoy && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <StatusBadge variant="destructive" className="h-5 px-1.5 text-xs bg-orange-200 text-orange-800 hover:bg-orange-300">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TodayIcon />
                        Hoy
                      </div>
                    </StatusBadge>
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
      cell: ({ row }) => {
        const proveedor = row.original.proveedor;
        return (
          <div className="font-medium">
            {formatCellValue(proveedor?.nombre, 'Sin proveedor')}
          </div>
        );
      },
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: 'producto.nombre',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Producto
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
                placeholder="Filtrar por producto..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const producto = row.original.producto;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{producto.nombre}</span>
            <span className="text-sm text-gray-500">
              {producto.codigo} - {producto.variedad}
            </span>
          </div>
        );
      },
      filterFn: fuzzyFilter,
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
                value={!filterValue || filterValue === "" ? "all" : filterValue}
                onChange={(value) => {
                  column.setFilterValue(value === "all" ? "" : value);
                }}
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
          <StatusBadge
            variant="secondary"
            className={
              estado === ESTADO_ORDEN.PENDIENTE ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' :
              estado === ESTADO_ORDEN.PROCESANDO ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' :
              estado === ESTADO_ORDEN.RECIBIDA ? 'bg-green-200 text-green-800 hover:bg-green-300' :
              estado === ESTADO_ORDEN.CLASIFICANDO ? 'bg-purple-200 text-purple-800 hover:bg-purple-300' :
              estado === ESTADO_ORDEN.CLASIFICADO ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300' :
              estado === ESTADO_ORDEN.CANCELADA ? 'bg-red-200 text-red-800 hover:bg-red-300' :
              'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }
          >
            {estado}
          </StatusBadge>
        );
      },
      filterFn: (row, _id, value) => {
        if (!value || value === "all") return true;
        return row.original.estado === value;
      },
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
                value={fechaFilterValue || "all"}
                onChange={(value) => {
                  setFechaFilterValue(value);
                  
                  if (value === "all") {
                    column.setFilterValue("");
                    setSorting([]);
                  } else if (value === "asc") {
                    column.setFilterValue("");
                    setSorting([{ id: 'fechaEstimada', desc: false }]);
                  } else if (value === "desc") {
                    column.setFilterValue("");
                    setSorting([{ id: 'fechaEstimada', desc: true }]);
                  } else {
                    column.setFilterValue(value);
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
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const orden = row.original;
        
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate(`/ordenes-entrada/${orden.codigo}`)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-50 h-10 w-10"
                    disabled={!estadoOrdenUtils.puedeVerPesaje(orden.estado)}
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver detalles y pesaje</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                
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
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
  ], [onEdit, onDelete, onRegistrarClasificacion, fechaFilterValue, setSorting, navigate, modoReporte, ordenesSeleccionadasReporte, onToggleSeleccionReporte]);

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


  if (!ordenes.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center py-8"
      >
        <div className="text-gray-500 text-center">
          <div className="bg-gray-50 rounded-full p-4 w-fit mx-auto mb-4">
            <ClipboardList className="h-12 w-12 text-gray-400" />
          </div>
          <p className="font-semibold text-lg">No hay órdenes registradas</p>
          <p className="text-sm">Comienza agregando una nueva orden</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabla con encabezado y cuerpo */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full min-w-[600px] sm:min-w-[800px]">
          <thead className="bg-[#f1f5f9]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="hover:bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 font-semibold text-gray-700 border-b border-[#e2e8f0] min-w-[80px] sm:min-w-[120px]">
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
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  data-state={row.getIsSelected() && "selected"}
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
              <tr>
                <td colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="bg-gray-50 rounded-full p-4">
                      <ClipboardList className="h-12 w-12 text-gray-400" />
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
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación y conteo de filas */}
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