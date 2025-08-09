import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { 
  Eye, 
  Calendar, 
  User, 
  Building, 
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  List,
  Hash,
  Calculator,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { usePedidoClienteDetalle } from '@/hooks/PedidosCliente/usePedidoClienteDetalle';

interface DetallePedidoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedidoId: number | null;
  onProgreso?: (pedidoId: number) => void;
}

export const DetallePedidoClienteModal: React.FC<DetallePedidoClienteModalProps> = ({
  isOpen,
  onClose,
  pedidoId,
  onProgreso,
}) => {
  const {
    pedidoDetalle,
    loading,
    error,
    obtenerPedidoClienteDetalle,
    limpiarDetalle,
  } = usePedidoClienteDetalle();

  // Efecto para cargar el detalle cuando se abre el modal
  useEffect(() => {
    if (isOpen && pedidoId) {
      obtenerPedidoClienteDetalle(pedidoId);
    } else if (!isOpen) {
      limpiarDetalle();
    }
  }, [isOpen, pedidoId, obtenerPedidoClienteDetalle, limpiarDetalle]);

  const getStatusBadge = (estatus: string) => {
    const statusConfig = {
      'Pendiente': { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'En Proceso': { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' },
      'Completado': { variant: 'secondary' as const, className: 'bg-green-100 text-green-800' },
      'Cancelado': { variant: 'secondary' as const, className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[estatus as keyof typeof statusConfig] || statusConfig['Pendiente'];

    return (
      <Badge variant={config.variant} className={config.className}>
        {estatus}
      </Badge>
    );
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Fecha inválida';
    }
  };

  // Configuración de la tabla de órdenes
  const columns = React.useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'id',
      header: () => (
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          <span className="font-semibold">ID</span>
        </div>
      ),
      cell: ({ row }) => (
        <span className="text-slate-700">#{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'tipo',
      header: () => <span className="font-semibold">Tipo</span>,
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
    },
    {
      accessorKey: 'producto',
      header: () => <span className="font-semibold">Producto</span>,
      cell: ({ row }) => {
        const producto = row.original.producto;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">
              {producto ? producto.nombre : 'Sin producto'}
            </span>
            {producto && (
              <span className="text-xs text-slate-500">
                {producto.codigo} - {producto.variedad}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'cantidad',
      header: () => <span className="font-semibold">Cajas</span>,
      cell: ({ row }) => (
        <span className="text-slate-700">
          {row.original.cantidad && row.original.cantidad > 0 ? row.original.cantidad : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'peso',
      header: () => <span className="font-semibold">Peso</span>,
      cell: ({ row }) => (
        <span className="text-slate-700">
          {row.original.peso && row.original.peso > 0 ? `${row.original.peso} kg` : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'fechaRegistro',
      header: () => <span className="font-semibold">Fecha Registro</span>,
      cell: ({ row }) => (
        <span className="text-slate-700 text-sm">
          {formatDate(row.original.fechaRegistro)}
        </span>
      ),
    },
    {
      accessorKey: 'usuarioRegistro',
      header: () => <span className="font-semibold">Usuario</span>,
      cell: ({ row }) => (
        <span className="text-slate-700 text-sm">
          {row.original.usuarioRegistro}
        </span>
      ),
    },
  ], []);

  const table = useReactTable({
    data: pedidoDetalle?.ordenes || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  // Calcular total de cajas
  const calcularTotalCajas = () => {
    if (!pedidoDetalle?.ordenes) return 0;
    return pedidoDetalle.ordenes.reduce((total, orden) => {
      const cantidad = orden.cantidad && orden.cantidad > 0 ? orden.cantidad : 0;
      return total + cantidad;
    }, 0);
  };

  // Renderizar skeleton loader mientras carga
  const renderSkeletonLoader = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-36" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-52" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex space-x-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Renderizar mensaje de error
  const renderErrorMessage = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Error al cargar el detalle</h3>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {pedidoDetalle ? `Detalles del Pedido Cliente #${pedidoDetalle.id}` : 'Cargando detalle...'}
              </DialogTitle>
              <DialogDescription>
                Información completa del pedido de cliente seleccionado.
              </DialogDescription>
            </div>
            {onProgreso && pedidoDetalle && (
              <button
                onClick={() => onProgreso(pedidoDetalle.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                Ver Progreso
              </button>
            )}
          </div>
        </DialogHeader>

        {loading && renderSkeletonLoader()}
        
        {error && !loading && renderErrorMessage()}
        
        {pedidoDetalle && !loading && !error && (
          <div className="space-y-6">
            {/* Información General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">ID del Pedido</label>
                    <p className="text-lg font-semibold">#{pedidoDetalle.id}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Estatus</label>
                    <div>{getStatusBadge(pedidoDetalle.estatus)}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Usuario Registro</label>
                    <p className="text-sm">{pedidoDetalle.usuarioRegistro}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <p className="text-sm">{formatDate(pedidoDetalle.fechaRegistro)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Fecha de Embarque</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {pedidoDetalle.fechaEmbarque ? (
                        <p className="text-sm">{formatDate(pedidoDetalle.fechaEmbarque)}</p>
                      ) : (
                        <p className="text-sm text-gray-400">No definida</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Observaciones</label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{pedidoDetalle.observaciones}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cliente y Sucursal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Cliente y Sucursal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Cliente</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">{pedidoDetalle.cliente}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Sucursal</label>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">{pedidoDetalle.sucursal}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>



            {/* Órdenes del Pedido */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <List className="h-5 w-5 text-gray-600" />
                    <div>
                      <CardTitle className="text-lg">Órdenes del Pedido</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Gestiona las órdenes de productos para este pedido
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Órdenes</p>
                      <p className="text-xl font-semibold text-gray-900">{pedidoDetalle.ordenes.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calculator className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Cajas</p>
                      <p className="text-xl font-semibold text-gray-900">{calcularTotalCajas()}</p>
                    </div>
                  </div>
                                </div>
                
                {pedidoDetalle.ordenes.length > 0 ? (
                  <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
                    <div className="w-full min-w-0">
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
                                    <h3 className="text-lg font-semibold text-gray-700">No se encontraron órdenes</h3>
                                    <p className="text-sm text-gray-500 max-w-md">
                                      No hay órdenes registradas para este pedido.
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
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay órdenes registradas para este pedido</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 