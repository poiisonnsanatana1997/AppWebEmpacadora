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
import { Skeleton } from '@/components/ui/skeleton';
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
import { ChevronDown, ChevronUp, ChevronsUpDown, Eye, MoreHorizontal, Package, Calendar, User, Building, Package2, Ban, BarChart3, Truck, CheckSquare } from 'lucide-react';

// Utilidades y tipos
import styled from 'styled-components';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { PedidoClienteResponseDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { FilterInput } from '../OrdenesEntrada/FilterInput';
import { FilterSelect } from '../OrdenesEntrada/FilterSelect';
import { fuzzyFilter } from '@/utils/tableUtils';

// Componentes Estilizados
// ============================================
const StatusBadge = styled(Badge)`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
`;

// Interfaces
// ============================================
interface PedidosClienteTableProps {
  pedidos: PedidoClienteResponseDTO[];
  onView: (pedido: PedidoClienteResponseDTO) => void;
  onProgreso?: (pedidoId: number) => void;
  onEstatusUpdate?: (id: number, newEstatus: string) => void;
  loading?: boolean;
}

// Componente Skeleton para la tabla
// ============================================
const TableSkeleton = () => {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-6 w-16" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-6 w-20" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-6 w-24" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-6 w-20" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-6 w-24" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-6 w-28" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-6 w-28" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-6 w-20" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: 8 }).map((_, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-12" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-6 w-16 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-2 flex-1" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componente Principal: PedidosClienteTable
// ============================================
/**
 * Componente principal de tabla para mostrar y gestionar pedidos de clientes
 * Características:
 * - Ordenamiento: Click en encabezados de columna para ordenar
 * - Filtrado: Búsqueda y filtrado por múltiples criterios
 * - Paginación: Navegación entre páginas de resultados
 * - Diseño responsivo: Se adapta a diferentes tamaños de pantalla
 * - Acciones: Ver, editar y eliminar pedidos
 * - Indicadores de estado: Badges visuales para el estatus del pedido
 * - Diálogos de confirmación: Para acciones destructivas
 */
export function PedidosClienteTable({ pedidos, onView, onProgreso, onEstatusUpdate, loading }: PedidosClienteTableProps) {
  // Estados de la tabla
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [pedidoACancelar, setPedidoACancelar] = React.useState<number | null>(null);
  const [pedidoAEmbarcar, setPedidoAEmbarcar] = React.useState<number | null>(null);
  const [pedidoAEntregar, setPedidoAEntregar] = React.useState<number | null>(null);



  // Función para obtener el color del badge según el estatus
  const getStatusBadge = (estatus: string) => {
    switch (estatus) {
      case 'Pendiente':
        return <StatusBadge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</StatusBadge>;
      case 'Surtiendo':
        return <StatusBadge variant="secondary" className="bg-blue-100 text-blue-800">Surtiendo</StatusBadge>;
      case 'Surtido':
        return <StatusBadge variant="secondary" className="bg-green-100 text-green-800">Surtido</StatusBadge>;
      case 'Embarcado':
        return <StatusBadge variant="secondary" className="bg-purple-100 text-purple-800">Embarcado</StatusBadge>;
      case 'Entregado':
        return <StatusBadge variant="secondary" className="bg-emerald-100 text-emerald-800">Entregado</StatusBadge>;
      case 'Cancelado':
        return <StatusBadge variant="secondary" className="bg-red-100 text-red-800">Cancelado</StatusBadge>;
      default:
        return <StatusBadge variant="secondary">{estatus}</StatusBadge>;
    }
  };

  // Función para formatear fechas
  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Fecha inválida';
    }
  };

  // Función para formatear solo la fecha sin hora
  const formatDateOnly = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy');
    } catch {
      return 'Fecha inválida';
    }
  };

  // Manejadores para cancelar
  const handleCancelar = (id: number) => {
    setPedidoACancelar(id);
  };

  const handleConfirmarCancelacion = async () => {
    if (pedidoACancelar) {
      await onEstatusUpdate?.(pedidoACancelar, 'Cancelado');
      setPedidoACancelar(null);
    }
  };

  const handleCambiarAEmbarcado = (id: number) => {
    setPedidoAEmbarcar(id);
  };

  const handleCambiarAEntregado = (id: number) => {
    setPedidoAEntregar(id);
  };

  const handleConfirmarEmbarcado = async () => {
    if (pedidoAEmbarcar && onEstatusUpdate) {
      await onEstatusUpdate(pedidoAEmbarcar, 'Embarcado');
      setPedidoAEmbarcar(null);
    }
  };

  const handleConfirmarEntregado = async () => {
    if (pedidoAEntregar && onEstatusUpdate) {
      await onEstatusUpdate(pedidoAEntregar, 'Entregado');
      setPedidoAEntregar(null);
    }
  };

  // Definición de columnas con ordenamiento, filtrado y renderizado personalizado
  const columns = React.useMemo<ColumnDef<PedidoClienteResponseDTO>[]>(() => [
    {
      accessorKey: 'id',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              <Package className="h-4 w-4 mr-2" />
              ID
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
                placeholder="Filtrar por ID..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">#{row.original.id}</span>
        </div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: 'cliente',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              <User className="h-4 w-4 mr-2" />
              Cliente
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
                placeholder="Filtrar por cliente..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.cliente ? row.original.cliente : (
            <span className="text-gray-400 italic">Cliente no asignado</span>
          )}</span>
        </div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: 'sucursal',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              <Building className="h-4 w-4 mr-2" />
              Sucursal
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
                placeholder="Filtrar por sucursal..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.sucursal ? row.original.sucursal : (
            <span className="text-gray-400 italic">Sucursal no asignada</span>
          )}</span>
        </div>
      ),
      filterFn: fuzzyFilter,
    },

    {
      accessorKey: 'estatus',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Estatus
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
                 value={(filterValue as string) ?? "all"}
                 onChange={(value) => column.setFilterValue(value)}
                 placeholder="Filtrar por estatus..."
                 options={[
                   { value: "all", label: "Todos" },
                   { value: "Pendiente", label: "Pendiente" },
                   { value: "Surtiendo", label: "Surtiendo" },
                   { value: "Surtido", label: "Surtido" },
                   { value: "Embarcado", label: "Embarcado" },
                   { value: "Entregado", label: "Entregado" },
                   { value: "Cancelado", label: "Cancelado" },
                 ]}
               />
            </div>
          </div>
        );
      },
      cell: ({ row }) => getStatusBadge(row.original.estatus),
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: 'porcentajeSurtido',
      header: ({ column }) => {
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              % Surtido
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
        const porcentaje = row.original.porcentajeSurtido;
        
        // Si el porcentaje es null, undefined o no existe, mostrar 0%
        if (porcentaje === null || porcentaje === undefined) {
          return (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-red-500" style={{ width: '0%' }} />
              </div>
              <span className="text-sm font-medium min-w-[3rem] text-right">0%</span>
            </div>
          );
        }
        
        // Convertir a número si viene como string
        const porcentajeNumerico = typeof porcentaje === 'number' ? porcentaje : parseFloat(porcentaje);
        
        const getProgressColor = (value: number) => {
          if (value >= 80) return 'bg-green-500';
          if (value >= 60) return 'bg-yellow-500';
          if (value >= 40) return 'bg-orange-500';
          return 'bg-red-500';
        };
        
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(porcentajeNumerico)}`}
                style={{ width: `${Math.min(porcentajeNumerico, 100)}%` }}
              />
            </div>
            <span className="text-sm font-medium min-w-[3rem] text-right">
              {porcentaje}%
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'fechaRegistro',
      header: ({ column }) => {
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              <Calendar className="h-4 w-4 mr-2" />
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{formatDate(row.original.fechaRegistro)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'fechaEmbarque',
      header: ({ column }) => {
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Fecha Embarque
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.fechaEmbarque ? formatDateOnly(row.original.fechaEmbarque) : (
            <span className="text-gray-400 italic">Fecha no asignada</span>
          )}</span>
        </div>
      ),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(row.original)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver detalles</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {onProgreso && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onProgreso(row.original.id)}
                    className="h-8 w-8 p-0"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver progreso</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Botones de cambio de estatus */}
          {row.original.estatus === 'Surtido' && onEstatusUpdate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCambiarAEmbarcado(row.original.id)}
                    className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-700"
                  >
                    <Truck className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cambiar a Embarcado</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {row.original.estatus === 'Embarcado' && onEstatusUpdate && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCambiarAEntregado(row.original.id)}
                    className="h-8 w-8 p-0 hover:bg-emerald-100 hover:text-emerald-700"
                  >
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cambiar a Entregado</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
              
              {onProgreso && (
                <DropdownMenuItem onClick={() => onProgreso(row.original.id)}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver progreso
                </DropdownMenuItem>
              )}
              
              {row.original.estatus !== 'Cancelado' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleCancelar(row.original.id)}
                    className="text-orange-600"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Cancelar
                  </DropdownMenuItem>
                </>
              )}
              
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
     ], [onView]);

  // Configuración de la tabla
  const table = useReactTable({
    data: pedidos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
  });

  return (
    <>
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="rounded-md border">
            <table className="w-full">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 text-left text-sm font-medium text-gray-900">
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
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm text-gray-900">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <img 
                            src="/images/LogoEmpacadora.jpg" 
                            alt="Logo Empacadora" 
                            className="h-10 w-10 object-contain rounded-full"
                            onError={(e) => {
                              // Fallback a emoji si la imagen no carga
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <span className="text-3xl hidden">📦</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No se encontraron pedidos
                        </h3>
                        <p className="text-sm text-gray-500 text-center max-w-md">
                          No hay pedidos que coincidan con los criterios de búsqueda actuales. 
                          Intenta ajustar los filtros o crear un nuevo pedido.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

          {/* Diálogo de confirmación para cancelar */}
          <AlertDialog open={!!pedidoACancelar} onOpenChange={() => setPedidoACancelar(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro de cancelar el pedido?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción cambiará el estatus del pedido a "Cancelado". 
                  Esta acción no se puede deshacer fácilmente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleConfirmarCancelacion} 
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Sí, cancelar pedido
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Diálogo de confirmación para embarcar */}
          <AlertDialog open={!!pedidoAEmbarcar} onOpenChange={() => setPedidoAEmbarcar(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Confirmar cambio a Embarcado?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción cambiará el estatus del pedido de "Surtido" a "Embarcado". 
                  Confirma que el pedido está listo para ser enviado al cliente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleConfirmarEmbarcado} 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Sí, cambiar a Embarcado
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Diálogo de confirmación para entregar */}
          <AlertDialog open={!!pedidoAEntregar} onOpenChange={() => setPedidoAEntregar(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Confirmar cambio a Entregado?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción cambiará el estatus del pedido de "Embarcado" a "Entregado". 
                  Confirma que el pedido ha sido recibido por el cliente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleConfirmarEntregado} 
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Sí, cambiar a Entregado
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
} 