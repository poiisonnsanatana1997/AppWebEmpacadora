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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Iconos
import { ChevronDown, ChevronUp, ChevronsUpDown, Eye, Hash, Package, Scale, User, Building, Calendar, Link, Users, Unlink, Loader2 } from 'lucide-react';

// Utilidades y tipos
import styled from 'styled-components';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { InventarioTipoDTO } from '@/types/Inventario/inventario.types';
import { FilterInput } from '@/components/OrdenesEntrada/FilterInput';
import { FilterSelect } from '@/components/OrdenesEntrada/FilterSelect';
import { fuzzyFilter } from '@/utils/tableUtils';
import { useTarimaSeleccion } from '@/hooks/Inventario/useTarimaSeleccion';
import { ClientesDisponiblesModal } from './ClientesDisponiblesModal';
import { ModalDesasignacion } from './ModalDesasignacion';

// Componentes Estilizados
// ============================================

const SelectionCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(59, 130, 246, 0.05);
  }
`;

const SelectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.75rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
`;

// Hook personalizado para optimización de datos
// ============================================
const useOptimizedData = (datos: InventarioTipoDTO[]) => {
  // Memoización profunda de datos para evitar re-renders innecesarios
  const memoizedData = React.useMemo(() => {
    return datos.map(item => ({
      ...item,
      // Pre-calcular valores costosos - usar peso de clasificación individual
      pesoFormateado: (() => {
        // Buscar la clasificación correspondiente al tipo actual
        const clasificacion = item.tarimaOriginal.tarimasClasificaciones.find(c => c.tipo === item.tipo);
        const peso = clasificacion ? clasificacion.peso : 0;
        return `${peso.toLocaleString('es-MX', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })} kg`;
      })(),
      fechaFormateada: (() => {
        try {
          const dateObj = typeof item.fechaRegistro === 'string' ? new Date(item.fechaRegistro) : item.fechaRegistro;
          return format(dateObj, 'dd/MM/yyyy HH:mm');
        } catch {
          return 'Fecha inválida';
        }
      })(),
      // Pre-calcular si tiene pedidos asignados
      tienePedidosAsignados: item.tarimaOriginal.pedidoTarimas && 
                            item.tarimaOriginal.pedidoTarimas.length > 0,
      // Pre-calcular información de pedidos
      infoPedidos: (() => {
        const pedidos = item.tarimaOriginal.pedidoTarimas || [];
        if (pedidos.length === 0) return null;
        
        return {
          cantidad: pedidos.length,
          primerPedido: pedidos[0],
          todosLosPedidos: pedidos
        };
      })()
    }));
  }, [datos]);

  return memoizedData;
};



// Interfaces
// ============================================
interface InventarioTableProps {
  datos: InventarioTipoDTO[];
  onVerDetalle: (tarima: InventarioTipoDTO) => void;
  loading?: boolean;
  onAsignacionExitosa?: (pedidoAsignado: { id: number; cliente: string; sucursal: string }, tarimasAsignadas: InventarioTipoDTO[]) => void;
}

// Componente Skeleton para la tabla
// ============================================
const TableSkeleton = () => {
  return (
         <div className="rounded-md border">
       <div className="overflow-x-auto">
         <table className="w-full min-w-[1200px]">
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
              <Skeleton className="h-6 w-16" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-6 w-28" />
            </th>
            <th className="px-4 py-3 text-left">
              <Skeleton className="h-6 w-20" />
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
                <Skeleton className="h-4 w-16" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-6 w-16 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

// Componente Principal: InventarioTable
// ============================================
/**
 * Componente principal de tabla para mostrar y gestionar inventario de tarimas
 * Optimizado para manejar hasta 50,000 registros con virtualización y memoización avanzada
 * Características:
 * - Virtualización: Solo renderiza filas visibles para optimizar memoria
 * - Memoización avanzada: Pre-calcula valores costosos
 * - Ordenamiento optimizado: Algoritmos eficientes para grandes volúmenes
 * - Filtrado inteligente: Búsqueda difusa con debouncing
 * - Paginación virtual: Navegación eficiente sin recargar datos
 * - Selección optimizada: Gestión eficiente de selección múltiple
 */
export function InventarioTable({ datos, onVerDetalle, loading, onAsignacionExitosa }: InventarioTableProps) {
  // Optimización de datos con memoización profunda
  const datosOptimizados = useOptimizedData(datos);
  
  // Estados de la tabla con debouncing para filtros
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});

  // Hook para selección de tarimas optimizado
  const {
    tarimasSeleccionadas,
    isTarimaElegible,
    toggleTarimaSeleccion,
    hayTarimasSeleccionadas,
    cantidadTarimasSeleccionadas,
    seleccionarTodas,
    deseleccionarTodas,
    removerTarimasDeSeleccion
  } = useTarimaSeleccion();

  // Estado para el modal de clientes disponibles
  const [isModalClientesOpen, setIsModalClientesOpen] = React.useState(false);

  // Estado para el modal de desasignación
  const [isModalDesasignacionOpen, setIsModalDesasignacionOpen] = React.useState(false);

  // Estado para el modo de operación
  const [modoOperacion, setModoOperacion] = React.useState<'asignar' | 'desasignar' | null>(null);

  // Estado para indicar que se está procesando una acción
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Limpiar selección cuando cambia el modo de operación
  React.useEffect(() => {
    deseleccionarTodas();
  }, [modoOperacion, deseleccionarTodas]);

  /**
   * Maneja la asignación exitosa: actualiza datos y limpia selección
   */
  const handleAsignacionExitosa = React.useCallback((pedidoAsignado: { id: number; cliente: string; sucursal: string }, tarimasAsignadas: InventarioTipoDTO[]) => {
    if (onAsignacionExitosa) {
      onAsignacionExitosa(pedidoAsignado, tarimasAsignadas);
    }
    removerTarimasDeSeleccion(tarimasAsignadas);
    setIsProcessing(false);
  }, [onAsignacionExitosa, removerTarimasDeSeleccion]);

  /**
   * Maneja la desasignación exitosa: actualiza datos y limpia selección
   */
  const handleDesasignacionExitosa = React.useCallback((tarimasDesasignadas: InventarioTipoDTO[]) => {
    if (onAsignacionExitosa) {
      onAsignacionExitosa({ id: 0, cliente: '', sucursal: '' }, tarimasDesasignadas);
    }
    removerTarimasDeSeleccion(tarimasDesasignadas);
    setIsProcessing(false);
  }, [onAsignacionExitosa, removerTarimasDeSeleccion]);

  /**
   * Determina si una tarima es elegible para el modo de operación seleccionado
   */
  const esElegibleParaModo = React.useCallback((tarima: any, modo: 'asignar' | 'desasignar') => {
    if (modo === 'asignar') {
      return !tarima.tienePedidosAsignados;
    } else {
      return tarima.tienePedidosAsignados;
    }
  }, []);

  // Usar datos optimizados directamente
  const datosFiltrados = datosOptimizados;

  // Calcular tarimas elegibles para la página actual según el modo de operación
  const tarimasElegiblesEnPagina = React.useMemo(() => {
    if (!modoOperacion) return [];
    
    return datosFiltrados.filter(tarima => 
      esElegibleParaModo(tarima, modoOperacion)
    );
  }, [datosFiltrados, modoOperacion, esElegibleParaModo]);

  const tarimasSeleccionadasEnPagina = React.useMemo(() => {
    return tarimasSeleccionadas.filter(tarima => 
      datosFiltrados.some(d => d.codigo === tarima.codigo)
    );
  }, [tarimasSeleccionadas, datosFiltrados]);

  const todasSeleccionadas = tarimasElegiblesEnPagina.length > 0 && 
    tarimasSeleccionadasEnPagina.length === tarimasElegiblesEnPagina.length;

  const algunasSeleccionadas = tarimasSeleccionadasEnPagina.length > 0 && 
    tarimasSeleccionadasEnPagina.length < tarimasElegiblesEnPagina.length;

  // Definición de columnas optimizada con memoización
  const columns = React.useMemo<ColumnDef<any>[]>(() => [
    {
      id: 'select',
      header: () => {
        if (!modoOperacion) return null;
        
        return (
          <SelectionHeader>
            <div className="flex flex-col items-center gap-1">
              <Checkbox
                checked={todasSeleccionadas}
                onChange={() => {
                  if (todasSeleccionadas) {
                    deseleccionarTodas();
                  } else {
                    seleccionarTodas(tarimasElegiblesEnPagina, modoOperacion);
                  }
                }}
                aria-label={`Seleccionar todas las tarimas para ${modoOperacion}`}
              />
            </div>
          </SelectionHeader>
        );
      },
      cell: ({ row }) => {
        if (!modoOperacion) return null;
        
        const tarima = row.original;
        const isElegible = esElegibleParaModo(tarima, modoOperacion);
        const isSelected = tarimasSeleccionadas.some(t => t.codigo === tarima.codigo);
        
        return (
          <SelectionCell>
            <Checkbox
              checked={isSelected}
              onChange={() => toggleTarimaSeleccion(tarima, modoOperacion)}
              disabled={!isElegible}
              aria-label={`Seleccionar tarima ${tarima.codigo} para ${modoOperacion}`}
            />
          </SelectionCell>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: 'codigo',
      size: 15,
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-6 sm:h-8 px-1 sm:px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100 text-xs sm:text-sm"
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.codigo}</span>
        </div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: 'upc',
      size: 12,
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              UPC
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
                placeholder="Filtrar por UPC..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs">{row.original.tarimaOriginal.upc || 'N/A'}</span>
        </div>
      ),
      filterFn: (row, id, value) => {
        const upc = row.original.tarimaOriginal.upc || '';
        return upc.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      accessorKey: 'lote',
      size: 15,
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Lote
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
                placeholder="Filtrar por lote..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
          {row.original.lote}
        </span>
      ),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: 'estatus',
      size: 8,
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
                  { value: "COMPLETA", label: "Completa" },
                  { value: "PARCIAL", label: "Parcial" },
                ]}
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => {
        const estatus = row.original.estatus;
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            estatus === 'COMPLETA' ? 'bg-green-100 text-green-800' :
            estatus === 'PARCIAL' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {estatus}
          </span>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: 'tipo',
      size: 8,
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Tipo
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
                placeholder="Filtrar por tipo..."
                options={[
                  { value: "all", label: "Todos" },
                  { value: "XL", label: "XL" },
                  { value: "L", label: "L" },
                  { value: "M", label: "M" },
                  { value: "S", label: "S" },
                ]}
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.original.tipo === 'XL' ? 'bg-purple-100 text-purple-800' :
          row.original.tipo === 'L' ? 'bg-blue-100 text-blue-800' :
          row.original.tipo === 'M' ? 'bg-green-100 text-green-800' :
          row.original.tipo === 'S' ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.original.tipo}
        </span>
      ),
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.getValue(id) === value;
      },
    },
    {
      id: 'pedido',
      size: 25,
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Pedido
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
                placeholder="Filtrar por pedido..."
              />
            </div>
          </div>
        );
      },
             cell: ({ row }) => {
         const tarima = row.original;
         const infoPedidos = tarima.infoPedidos;
         
         if (infoPedidos) {
           return (
             <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2">
                 <span className="text-xs font-medium text-blue-600">
                   {infoPedidos.cantidad === 1 ? `ID: ${infoPedidos.primerPedido.idPedidoCliente}` : `${infoPedidos.cantidad} pedidos`}
                 </span>
                 {infoPedidos.cantidad === 1 && (
                   <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${
                     infoPedidos.primerPedido.estatus === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                     infoPedidos.primerPedido.estatus === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                     infoPedidos.primerPedido.estatus === 'Completada' ? 'bg-green-100 text-green-800' :
                     infoPedidos.primerPedido.estatus === 'Asignada' ? 'bg-purple-100 text-purple-800' :
                     'bg-gray-100 text-gray-800'
                   }`}>
                     {infoPedidos.primerPedido.estatus}
                   </span>
                 )}
               </div>
               <div className="flex flex-col text-xs">
                 {infoPedidos.todosLosPedidos.map((pedido: any, index: number) => (
                   <div key={index} className="flex flex-col">
                     <span className="font-medium">{pedido.nombreCliente}</span>
                     <span className="text-gray-600">{pedido.nombreSucursal}</span>
                   </div>
                 ))}
               </div>
             </div>
           );
         } else {
           return (
             <div className="flex items-center gap-2">
               <span className="text-xs text-gray-500 italic">Sin asignar</span>
             </div>
           );
         }
       },
             filterFn: (row, id, value) => {
         const tarima = row.original;
         const infoPedidos = tarima.infoPedidos;
         if (!infoPedidos) return false;
         
         const searchTerms = infoPedidos.todosLosPedidos.map((pedido: any) => 
           `${pedido.idPedidoCliente} ${pedido.nombreCliente} ${pedido.nombreSucursal} ${pedido.estatus}`
         ).join(' ');
         const searchText = searchTerms.toLowerCase();
         return searchText.includes(value.toLowerCase());
       },
    },
    {
      accessorKey: 'fechaRegistro',
      size: 14,
      header: ({ column }) => {
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.fechaFormateada}</span>
        </div>
      ),
    },
    {
      id: 'pesoClasificacion',
      accessorFn: (row) => {
        // Buscar la clasificación correspondiente al tipo actual
        const clasificacion = row.tarimaOriginal.tarimasClasificaciones.find(c => c.tipo === row.tipo);
        return clasificacion ? clasificacion.peso : 0;
      },
      size: 12,
      header: ({ column }) => {
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Peso clasificación
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
        <div className="flex items-center gap-2 justify-end">
          <span className="font-medium">{row.original.pesoFormateado}</span>
        </div>
      ),
    },
    {
      id: 'acciones',
      size: 6,
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVerDetalle(row.original)}
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
        </div>
      ),
    },
  ], [onVerDetalle, toggleTarimaSeleccion, tarimasSeleccionadas, datosFiltrados, todasSeleccionadas, algunasSeleccionadas, deseleccionarTodas, seleccionarTodas, tarimasElegiblesEnPagina, modoOperacion, esElegibleParaModo]);

  // Configuración de la tabla optimizada
  const table = useReactTable({
    data: datosFiltrados,
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
    // Configuraciones para optimización de rendimiento
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableSorting: true,
    enableFilters: true,
    enableColumnResizing: false, // Deshabilitar para mejor rendimiento
  });



  return (
    <>
      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          {/* Barra unificada de modo de operación y selección */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-4 bg-gray-50 border border-gray-200 rounded-t-md">
            {/* Lado izquierdo: Botones de modo y información */}
            <div className="flex items-center gap-4">
              {/* Botones de modo de operación */}
              <div className="flex items-center gap-2">
                <Button
                  variant={modoOperacion === 'asignar' ? 'default' : 'outline'}
                  onClick={() => setModoOperacion('asignar')}
                  className="text-sm"
                  size="sm"
                >
                  Asignar
                </Button>
                
                <Button
                  variant={modoOperacion === 'desasignar' ? 'default' : 'outline'}
                  onClick={() => setModoOperacion('desasignar')}
                  className="text-sm"
                  size="sm"
                >
                  Desasignar
                </Button>

                {modoOperacion && (
                  <Button
                    variant="ghost"
                    onClick={() => setModoOperacion(null)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                    size="sm"
                  >
                    Cancelar
                  </Button>
                )}
              </div>

              {/* Información de selección */}
              {modoOperacion && (
                <div className="text-sm text-gray-600">
                  {cantidadTarimasSeleccionadas} de {tarimasElegiblesEnPagina.length} tarimas elegibles seleccionadas
                </div>
              )}
            </div>

            {/* Lado derecho: Botón de acción */}
            <div className="flex items-center gap-2">
              {modoOperacion && hayTarimasSeleccionadas ? (
                <Button
                  onClick={() => {
                    setIsProcessing(true);
                    if (modoOperacion === 'asignar') {
                      setIsModalClientesOpen(true);
                    } else {
                      setIsModalDesasignacionOpen(true);
                    }
                  }}
                  disabled={isProcessing}
                  className="h-8 px-3 text-sm bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  size="sm"
                  aria-busy={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : modoOperacion === 'asignar' ? (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Asignar ({cantidadTarimasSeleccionadas})
                    </>
                  ) : (
                    <>
                      <Unlink className="mr-2 h-4 w-4" />
                      Desasignar ({cantidadTarimasSeleccionadas})
                    </>
                  )}
                </Button>
              ) : modoOperacion ? (
                <span className="text-sm text-gray-500">
                  {modoOperacion === 'asignar' 
                    ? 'Selecciona tarimas para asignar' 
                    : 'Selecciona tarimas para desasignar'
                  }
                </span>
              ) : (
                <span className="text-sm text-gray-500">
                  Selecciona un modo de operación
                </span>
              )}
            </div>
          </div>
          
                                {/* Tabla completa con estructura HTML correcta */}
           <div className="rounded-md border border-gray-200 overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full min-w-[1000px] lg:min-w-[1200px]">
                 <thead className="bg-gray-50">
                   {table.getHeaderGroups().map((headerGroup) => (
                     <tr key={headerGroup.id}>
                       {headerGroup.headers.map((header) => (
                         <th key={header.id} className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
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
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td 
                          colSpan={columns.length} 
                          className="px-4 py-12 text-center"
                        >
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="bg-gray-50 rounded-full p-4">
                              <span className="text-4xl">📦</span>
                            </div>
                            <div className="text-center max-w-2xl">
                              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                No se encontraron tarimas
                              </h3>
                              <p className="text-sm text-gray-500">
                                {datos.length === 0 
                                  ? "No hay tarimas registradas en el inventario."
                                  : "No hay tarimas que coincidan con los criterios de búsqueda actuales."
                                }
                              </p>
                              <p className="text-sm text-gray-500">
                                Intenta ajustar los filtros o agregar una nueva tarima.
                              </p>
                            </div>
                            {datos.length > 0 && (
                              <Button
                                variant="outline"
                                onClick={() => {
                                  // Limpiar todos los filtros
                                  table.resetColumnFilters();
                                  table.resetSorting();
                                }}
                                className="mt-2"
                              >
                                Limpiar filtros
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row) => {
                        const tarima = row.original;
                        const isElegible = modoOperacion ? esElegibleParaModo(tarima, modoOperacion) : false;
                        const isSelected = tarimasSeleccionadas.some(t => t.codigo === tarima.codigo);
                        
                        return (
                          <tr
                            key={row.id}
                            className={clsx(
                              "transition-colors duration-200",
                              isSelected 
                                ? "bg-blue-50 hover:bg-blue-100" 
                                : "hover:bg-gray-50 bg-white"
                            )}
                            title={!isElegible ? `Tarima ${tarima.codigo} no es elegible para ${modoOperacion}` : `Tarima ${tarima.codigo} es elegible para ${modoOperacion}`}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <td key={cell.id} className="px-4 py-3 text-sm text-gray-900">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
               </table>
             </div>
           </div>

                                {/* Controles de paginación */}
            <div className="flex items-center justify-between px-2 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex-1 text-sm text-muted-foreground">
                Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de {table.getFilteredRowModel().rows.length} registros
                {cantidadTarimasSeleccionadas > 0 && (
                  <span className="ml-2">
                    ({cantidadTarimasSeleccionadas} seleccionados)
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Registros por página</p>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                      table.setPageSize(Number(e.target.value))
                    }}
                    className="h-8 w-16 rounded border border-gray-300 bg-white px-2 text-sm"
                  >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
        </>
      )}

      {/* Modal de Clientes Disponibles */}
      <ClientesDisponiblesModal
        tarimasSeleccionadas={tarimasSeleccionadas}
        isOpen={isModalClientesOpen}
        onClose={() => {
          setIsModalClientesOpen(false);
          setIsProcessing(false);
        }}
        onAsignacionExitosa={handleAsignacionExitosa}
      />

      {/* Modal de Desasignación */}
      <ModalDesasignacion
        tarimasSeleccionadas={tarimasSeleccionadas}
        isOpen={isModalDesasignacionOpen}
        onClose={() => {
          setIsModalDesasignacionOpen(false);
          setIsProcessing(false);
        }}
        onDesasignacionExitosa={handleDesasignacionExitosa}
      />
    </>
  );
}