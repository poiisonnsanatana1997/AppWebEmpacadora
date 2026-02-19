import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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
  BarChart3,
  FileDown,
  FileText,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { usePedidoClienteDetalle } from '@/hooks/PedidosCliente/usePedidoClienteDetalle';
import { ReportePedidoClientePDF } from '@/components/PDF/ReportePedidoClientePDF';
import { ReportePedidoClienteExcelService } from '@/services/reportePedidoClienteExcel.service';
import type { ConfiguracionReporte } from '@/types/PedidoCliente/reportes.types';

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

  const [generandoReporte, setGenerandoReporte] = useState<'pdf' | 'excel' | null>(null);
  const [modalJustOpened, setModalJustOpened] = useState(false);

  // Configuración de reportes
  const configuracionReporte: ConfiguracionReporte = {
    nombreEmpresa: 'AppWebEmpacadora',
    mostrarFechaGeneracion: true,
    pie: 'Sistema de Gestión de Empacadora'
  };

  // Efecto para cargar el detalle cuando se abre el modal
  useEffect(() => {
    if (isOpen && pedidoId) {
      setModalJustOpened(true);
      obtenerPedidoClienteDetalle(pedidoId);

      // Resetear después de un pequeño delay
      const timer = setTimeout(() => setModalJustOpened(false), 100);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      limpiarDetalle();
      setModalJustOpened(false);
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

  // Calcular total de cajas
  const calcularTotalCajas = () => {
    if (!pedidoDetalle?.ordenes) return 0;
    return pedidoDetalle.ordenes.reduce((total, orden) => {
      const cantidad = orden.cantidad && orden.cantidad > 0 ? orden.cantidad : 0;
      return total + cantidad;
    }, 0);
  };

  // Función para generar reporte PDF
  const handleGenerarPDF = async () => {
    if (!pedidoDetalle || generandoReporte) {
      if (!pedidoDetalle) {
        toast.error('No hay información del pedido para generar el reporte');
      }
      return;
    }

    try {
      setGenerandoReporte('pdf');
      toast.info('Generando reporte PDF...');

      const documento = (
        <ReportePedidoClientePDF
          pedido={pedidoDetalle}
          configuracion={configuracionReporte}
        />
      );

      const blob = await pdf(documento).toBlob();
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `PedidoCliente_${pedidoDetalle.id}_${fecha}.pdf`;

      saveAs(blob, nombreArchivo);
      toast.success(
        `Reporte PDF del pedido #${pedidoDetalle.id} generado correctamente`,
        {
          description: `Archivo: ${nombreArchivo}`,
          duration: 4000,
        }
      );
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error(
        `Error al generar el reporte PDF del pedido #${pedidoDetalle.id}`,
        {
          description: error instanceof Error ? error.message : 'Error desconocido',
          duration: 5000,
        }
      );
    } finally {
      setGenerandoReporte(null);
    }
  };

  // Función para generar reporte Excel
  const handleGenerarExcel = async () => {
    if (!pedidoDetalle || generandoReporte) {
      if (!pedidoDetalle) {
        toast.error('No hay información del pedido para generar el reporte');
      }
      return;
    }

    try {
      setGenerandoReporte('excel');
      toast.info('Generando reporte Excel...');

      await ReportePedidoClienteExcelService.generarReporteExcel(
        pedidoDetalle,
        configuracionReporte
      );

      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `PedidoCliente_${pedidoDetalle.id}_${fecha}.xlsx`;

      toast.success(
        `Reporte Excel del pedido #${pedidoDetalle.id} generado correctamente`,
        {
          description: `Archivo: ${nombreArchivo}`,
          duration: 4000,
        }
      );
    } catch (error) {
      console.error('Error al generar Excel:', error);
      toast.error(
        `Error al generar el reporte Excel del pedido #${pedidoDetalle.id}`,
        {
          description: error instanceof Error ? error.message : 'Error desconocido',
          duration: 5000,
        }
      );
    } finally {
      setGenerandoReporte(null);
    }
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
      <DialogContent className="max-w-3xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto pb-0">
        <div className="pb-6">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" aria-hidden="true" />
                  {pedidoDetalle ? `Detalles del Pedido Cliente #${pedidoDetalle.id}` : 'Cargando detalle...'}
                </DialogTitle>
                <DialogDescription>
                  Información completa del pedido de cliente seleccionado.
                </DialogDescription>
              </div>

              {/* Solo botón Progreso en el header si está disponible */}
              {pedidoDetalle && !loading && !error && onProgreso && (
                <Button
                  onClick={() => onProgreso(pedidoDetalle.id)}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  aria-label={`Ver progreso de surtido del pedido ${pedidoDetalle.id}`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" aria-hidden="true" />
                  Progreso
                </Button>
              )}
            </div>
          </DialogHeader>

        {(loading || modalJustOpened) && renderSkeletonLoader()}
        
        {error && !loading && renderErrorMessage()}

        {pedidoDetalle && !loading && !error && (
          <div className="space-y-4 sm:space-y-6 px-1">
            {/* Información General */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Cliente y Sucursal */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                  Cliente y Sucursal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Cliente</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      <p className="font-medium">{pedidoDetalle.cliente}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Sucursal</label>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" aria-hidden="true" />
                      <p className="font-medium">{pedidoDetalle.sucursal}</p>
                    </div>
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
                        Gestiona las órdenes de productos para este pedido
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
        )}

        {/* Timestamp de última actualización */}
        {pedidoDetalle && !loading && !error && (
          <div className="text-xs text-muted-foreground text-right px-2 pb-2 pt-2 mt-4 border-t">
            <Clock className="h-3 w-3 inline mr-1" aria-hidden="true" />
            Actualizado: {formatDate(new Date())}
          </div>
        )}

        {/* Botones de exportación en el footer */}
        {pedidoDetalle && !loading && !error && (
          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 pb-2">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleGenerarPDF}
                disabled={generandoReporte !== null}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
                aria-label={`Generar reporte PDF del pedido ${pedidoDetalle.id}`}
                aria-busy={generandoReporte === 'pdf'}
              >
                {generandoReporte === 'pdf' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    Generando...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                    Exportar PDF
                  </>
                )}
              </Button>

              <Button
                onClick={handleGenerarExcel}
                disabled={generandoReporte !== null}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial text-green-600 border-green-200 hover:bg-green-50 disabled:opacity-50"
                aria-label={`Generar reporte Excel del pedido ${pedidoDetalle.id}`}
                aria-busy={generandoReporte === 'excel'}
              >
                {generandoReporte === 'excel' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                    Generando...
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4 mr-2" aria-hidden="true" />
                    Exportar Excel
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 