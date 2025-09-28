import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { TarimaClasificacionDTO } from '@/types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Button } from '../ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { FilterInput } from '../OrdenesEntrada/FilterInput';
import { FilterSelect } from '../OrdenesEntrada/FilterSelect';
import { TarimasService } from '@/services/tarimas.service';
import { ConsistentAlertDialog } from '../ui/consistent-dialogs';
import { toast } from 'sonner';

interface TarimasTableProps {
  tarimas: TarimaClasificacionDTO[];
  onShowDetail: (tarima: TarimaClasificacionDTO) => void;
  onDeleteClasificacion?: (idTarima: number, idClasificacion: number) => Promise<void>;
  onTarimasChange?: (updatedTarimas: TarimaClasificacionDTO[]) => void;
  clasificacionFinalizada?: boolean;
}

// Función para formatear la fecha
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para formatear el peso en formato moneda
const formatCurrency = (weight: number): string => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(weight) + ' kg';
};

const ESTATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'COMPLETA', label: 'Completa' },
  { value: 'PARCIAL', label: 'Parcial' },
];

const TIPO_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'XL', label: 'XL' },
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'S', label: 'S' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

export const TarimasTable: React.FC<TarimasTableProps> = ({ tarimas, onShowDetail, onDeleteClasificacion, onTarimasChange, clasificacionFinalizada = false }) => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState<any[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  // Estado local para las tarimas
  const [localTarimas, setLocalTarimas] = React.useState<TarimaClasificacionDTO[]>(tarimas);
  
  // Sincronizar estado local con props cuando cambien
  React.useEffect(() => {
    setLocalTarimas(tarimas);
  }, [tarimas]);

  const handleDeleteClasificacion = async (idTarima: number, idClasificacion: number) => {
    // Verificar si la clasificación está finalizada
    if (clasificacionFinalizada) {
      toast.error('No se puede eliminar', {
        description: 'No se pueden eliminar clasificaciones cuando la clasificación está finalizada.',
        duration: 5000,
      });
      return;
    }

    try {
      setIsDeleting(true);
      
      // 1. Eliminar de la API
      await TarimasService.eliminarClasificacionTarima(idTarima, idClasificacion);
      
      // 2. Actualizar estado local inmediatamente (feedback visual)
      const updatedTarimas = localTarimas.filter(
        tarima => !(tarima.idTarima === idTarima && tarima.idClasificacion === idClasificacion)
      );
      setLocalTarimas(updatedTarimas);
      
      // 3. Notificar al componente padre sobre el cambio
      if (onTarimasChange) {
        onTarimasChange(updatedTarimas);
      }
      
      // 4. Callback personalizado si se proporciona
      if (onDeleteClasificacion) {
        await onDeleteClasificacion(idTarima, idClasificacion);
      }
      
      // 5. Toast de confirmación
      toast.success('Clasificación eliminada exitosamente', {
        description: 'La clasificación ha sido removida de la tarima',
        duration: 4000,
      });
      
    } catch (error) {
      console.error('Error al eliminar la clasificación:', error);
      toast.error('Error al eliminar la clasificación', {
        description: 'No se pudo eliminar la clasificación. Intenta nuevamente.',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Paginación manual
  const paginatedTarimas = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return localTarimas.slice(start, start + pageSize);
  }, [localTarimas, currentPage, pageSize]);

  const columns = React.useMemo<ColumnDef<TarimaClasificacionDTO>[]>(() => [
    {
      accessorKey: 'tarima.codigo',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <span className="font-semibold">Código</span>
            <div className="mt-2">
              <FilterInput
                value={filterValue ?? ''}
                onChange={value => column.setFilterValue(value)}
                placeholder="Filtrar por código..."
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => (
        <span className="font-medium text-slate-800">{row.original.tarima.codigo}</span>
      ),
      filterFn: (row, columnId, value) =>
        row.original.tarima.codigo.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      accessorKey: 'tarima.estatus',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <span className="font-semibold">Estatus</span>
            <div className="mt-2">
              <FilterSelect
                value={filterValue ?? 'all'}
                onChange={value => column.setFilterValue(value === 'all' ? undefined : value)}
                options={ESTATUS_OPTIONS}
                placeholder="Filtrar por estatus"
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.original.tarima.estatus === 'COMPLETA'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.original.tarima.estatus}
        </span>
      ),
      filterFn: (row, columnId, value) =>
        value === 'all' ? true : row.original.tarima.estatus === value,
    },
    {
      accessorKey: 'tipo',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <span className="font-semibold">Tipo</span>
            <div className="mt-2">
              <FilterSelect
                value={filterValue ?? 'all'}
                onChange={value => column.setFilterValue(value === 'all' ? undefined : value)}
                options={TIPO_OPTIONS}
                placeholder="Filtrar por tipo"
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
      filterFn: (row, columnId, value) =>
        value === 'all' ? true : row.original.tipo === value,
    },
    {
      accessorKey: 'tarima.fechaRegistro',
      header: () => <span className="font-semibold">Fecha de Registro</span>,
      cell: ({ row }) => (
        <span className="text-gray-600">{formatDate(row.original.tarima.fechaRegistro)}</span>
      ),
    },
    {
      accessorKey: 'cantidad',
      header: () => <span className="font-semibold">Cantidad de Cajas</span>,
      cell: ({ row }) => <span className="text-slate-700">{row.original.cantidad}</span>,
    },
    {
      accessorKey: 'peso',
      header: () => <span className="font-semibold">Peso Total</span>,
      cell: ({ row }) => <span className="font-medium text-slate-800">{formatCurrency(row.original.peso)}</span>,
    },
    {
      id: 'acciones',
      header: () => <span className="font-semibold">Acciones</span>,
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowDetail(row.original)}
            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors duration-200"
            title="Ver detalle"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {clasificacionFinalizada ? (
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="h-8 w-8 p-0 text-gray-400 border border-gray-200 rounded-md cursor-not-allowed"
              title="No se puede eliminar - Clasificación finalizada"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <ConsistentAlertDialog
              title="¿Estás seguro?"
              description={`Esta acción no se puede deshacer. Se eliminará permanentemente la clasificación ${row.original.tipo} de la tarima ${row.original.tarima.codigo}.\n\n• Cantidad: ${row.original.cantidad} cajas\n• Peso: ${formatCurrency(row.original.peso)}`}
              onConfirm={() => handleDeleteClasificacion(row.original.idTarima, row.original.idClasificacion)}
              confirmText="Eliminar"
              isLoading={isDeleting}
              variant="destructive"
            >
              <Button
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-md transition-colors duration-200 disabled:opacity-50"
                title="Eliminar clasificación"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </ConsistentAlertDialog>
          )}
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ], [onShowDetail, handleDeleteClasificacion, isDeleting]);

  const table = useReactTable({
    data: paginatedTarimas,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  const totalPages = Math.ceil(localTarimas.length / pageSize) || 1;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <div className="w-full min-w-[900px]">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-3 py-2 align-top text-left font-semibold text-slate-700 border-b border-gray-200">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 py-8">
                      <div className="bg-gray-50 rounded-full p-4">
                        <span className="text-4xl">📦</span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700">No se encontraron tarimas</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                          No hay tarimas que coincidan con los criterios de búsqueda actuales.
                          Intenta ajustar los filtros o agregar una nueva tarima.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-3 py-2 align-middle text-slate-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Controles de paginación y selector de filas por página */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Filas por página</p>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Página {currentPage} de {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 cursor-pointer hidden lg:flex"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir a primera página</span>
            <span className="inline-block rotate-90"><svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M8 17l4-4-4-4m8 8V7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Ir a página anterior</span>
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Ir a página siguiente</span>
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 cursor-pointer hidden lg:flex"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="sr-only">Ir a última página</span>
            <span className="inline-block -rotate-90"><svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M16 7l-4 4 4 4M8 7v10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          </Button>
        </div>
      </div>
    </div>
  );
}; 