import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Building,
  Package,
  Clock,
  Calendar,
  AlertCircle,
  List,
  Hash,
  Calculator,
} from 'lucide-react';
import { format } from 'date-fns';
import type { PedidoClienteResponseDTO } from '@/types/PedidoCliente/pedidoCliente.types';

interface InformacionGeneralProps {
  pedidoDetalle: PedidoClienteResponseDTO;
}

export const InformacionGeneral: React.FC<InformacionGeneralProps> = ({ pedidoDetalle }) => {
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

  // Calcular total de cajas
  const calcularTotalCajas = () => {
    if (!pedidoDetalle?.ordenes) return 0;
    return pedidoDetalle.ordenes.reduce((total, orden) => {
      const cantidad = orden.cantidad && orden.cantidad > 0 ? orden.cantidad : 0;
      return total + cantidad;
    }, 0);
  };

  // Configuración de la tabla de órdenes
  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'id',
      header: () => (
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" aria-hidden="true" />
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Información General del Pedido, Cliente y Sucursal consolidados */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" aria-hidden="true" />
            Información del Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información básica del pedido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">ID del Pedido</label>
              <p className="text-lg font-semibold">#{pedidoDetalle.id}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Estatus</label>
              <div>{getStatusBadge(pedidoDetalle.estatus)}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Usuario Registro</label>
              <p className="text-sm">{pedidoDetalle.usuarioRegistro}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                <p className="text-sm">{formatDate(pedidoDetalle.fechaRegistro)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Fecha de Embarque</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
                {pedidoDetalle.fechaEmbarque ? (
                  <p className="text-sm">{formatDate(pedidoDetalle.fechaEmbarque)}</p>
                ) : (
                  <p className="text-sm text-gray-400 italic flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    No definida
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cliente y Sucursal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                Cliente
              </label>
              <p className="font-medium">{pedidoDetalle.cliente}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Building className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                Sucursal
              </label>
              <p className="font-medium">{pedidoDetalle.sucursal}</p>
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Observaciones</label>
            <div className="p-4 bg-gray-50 rounded-lg min-h-[80px]">
              {pedidoDetalle.observaciones && pedidoDetalle.observaciones.trim() ? (
                <p className="text-sm whitespace-pre-wrap">{pedidoDetalle.observaciones}</p>
              ) : (
                <p className="text-sm text-gray-400 italic flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  Sin observaciones registradas
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Órdenes del Pedido */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <List className="h-5 w-5 text-purple-600" aria-hidden="true" />
              <div>
                <CardTitle className="text-lg">Órdenes del Pedido</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Detalle de las órdenes de productos para este pedido
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2.5 bg-blue-100 rounded-lg flex-shrink-0">
                <Package className="h-5 w-5 text-blue-600" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-600 truncate">Total Órdenes</p>
                <p className="text-2xl font-semibold text-gray-900">{pedidoDetalle.ordenes.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2.5 bg-green-100 rounded-lg flex-shrink-0">
                <Calculator className="h-5 w-5 text-green-600" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-600 truncate">Total Cajas</p>
                <p className="text-2xl font-semibold text-gray-900">{calcularTotalCajas()}</p>
              </div>
            </div>
          </div>

          {pedidoDetalle.ordenes.length > 0 ? (
            <div className="hidden md:block bg-white rounded-lg shadow p-4 overflow-x-auto">
              <div className="w-full min-w-0">
                <table className="w-full border-separate border-spacing-0 text-sm">
                  <caption className="sr-only">
                    Tabla de órdenes del pedido cliente #{pedidoDetalle.id}.
                    Contiene {pedidoDetalle.ordenes.length} órden(es) con información de ID, tipo, producto, cajas, peso, fecha de registro y usuario.
                  </caption>
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th
                            key={header.id}
                            scope="col"
                            className="px-3 py-2 align-top text-left font-semibold text-slate-700 border-b border-gray-200"
                          >
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
          ) : null}

          {/* Versión móvil - cards apiladas */}
          {pedidoDetalle.ordenes.length > 0 ? (
            <div className="md:hidden space-y-3">
              {pedidoDetalle.ordenes.map((orden) => (
                <Card key={orden.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-gray-600">ID</div>
                        <div className="font-semibold text-slate-700">#{orden.id}</div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        orden.tipo === 'XL' ? 'bg-purple-100 text-purple-800' :
                        orden.tipo === 'L' ? 'bg-blue-100 text-blue-800' :
                        orden.tipo === 'M' ? 'bg-green-100 text-green-800' :
                        orden.tipo === 'S' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {orden.tipo}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">Producto</div>
                      <div className="font-medium text-slate-800">
                        {orden.producto ? orden.producto.nombre : 'Sin producto'}
                      </div>
                      {orden.producto && (
                        <div className="text-xs text-slate-500">
                          {orden.producto.codigo} - {orden.producto.variedad}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-600">Cajas</div>
                        <div className="text-sm text-slate-700">
                          {orden.cantidad && orden.cantidad > 0 ? orden.cantidad : '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Peso</div>
                        <div className="text-sm text-slate-700">
                          {orden.peso && orden.peso > 0 ? `${orden.peso} kg` : '-'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">Fecha Registro</div>
                      <div className="text-sm text-slate-700">{formatDate(orden.fechaRegistro)}</div>
                    </div>

                    <div>
                      <div className="text-xs text-gray-600">Usuario</div>
                      <div className="text-sm text-slate-700">{orden.usuarioRegistro}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-600 font-medium text-lg">No hay órdenes registradas</p>
              <p className="text-gray-500 text-sm mt-2">Este pedido aún no tiene órdenes asignadas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
