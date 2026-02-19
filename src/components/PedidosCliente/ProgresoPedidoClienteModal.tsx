import React, { useEffect, useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart3,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Package,
  Clock,
  FileDown,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { usePedidoClienteProgreso } from '@/hooks/PedidosCliente/usePedidoClienteProgreso';
import { ResumenProgreso } from './ProgresoPedidoCliente/ResumenProgreso';
import { OrdenesProgreso } from './ProgresoPedidoCliente/OrdenesProgreso';
import { TarimasAsignadas } from './ProgresoPedidoCliente/TarimasAsignadas';
import { CalculoDiferencias } from './ProgresoPedidoCliente/CalculoDiferencias';
import { ReporteProgresoPedidoClientePDF } from '../PDF/ReporteProgresoPedidoClientePDF';
import { ReporteProgresoPedidoClienteExcelService } from '@/services/reporteProgresoPedidoClienteExcel.service';

interface ProgresoPedidoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedidoId: number | null;
}

export const ProgresoPedidoClienteModal: React.FC<ProgresoPedidoClienteModalProps> = ({
  isOpen,
  onClose,
  pedidoId,
}) => {
  const {
    progreso,
    loading,
    error,
    obtenerProgresoPedidoCliente,
    calcularDiferencias,
    calcularCajasSurtidasPorOrden,
    limpiarProgreso,
  } = usePedidoClienteProgreso();

  const [modalJustOpened, setModalJustOpened] = useState(false);
  const [incluirTarimas, setIncluirTarimas] = useState(false);
  const [exportando, setExportando] = useState(false);

  // Memoizar cálculos para optimizar rendimiento
  const diferencias = useMemo(() => calcularDiferencias(), [calcularDiferencias]);
  const cajasSurtidasPorOrden = useMemo(() => calcularCajasSurtidasPorOrden(), [calcularCajasSurtidasPorOrden]);

  // Efecto para cargar el progreso cuando se abre el modal
  useEffect(() => {
    if (isOpen && pedidoId) {
      setModalJustOpened(true);
      obtenerProgresoPedidoCliente(pedidoId);

      const timer = setTimeout(() => setModalJustOpened(false), 100);
      return () => clearTimeout(timer);
    } else if (!isOpen) {
      limpiarProgreso();
      setModalJustOpened(false);
    }
  }, [isOpen, pedidoId, obtenerProgresoPedidoCliente, limpiarProgreso]);

  const handleRefresh = () => {
    if (pedidoId) {
      obtenerProgresoPedidoCliente(pedidoId);
    }
  };

  const handleExportPDF = async () => {
    if (!progreso) {
      toast.error('No hay datos disponibles para exportar');
      return;
    }

    try {
      setExportando(true);
      toast.loading('Generando PDF...', { id: 'export-pdf' });

      const configuracion = {
        nombreEmpresa: 'AgroSmart - Sistema de Empacadora',
        mostrarFechaGeneracion: true,
        pie: 'Generado con AgroSmart',
      };

      // Convertir diferencias de array a formato esperado
      const diferenciasArray = diferencias.map(d => ({
        tipo: d.tipo,
        cantidadRequerida: d.cantidadRequerida,
        cantidadAsignada: d.cantidadAsignada,
        cantidadFaltante: d.cantidadFaltante,
        pesoRequerido: d.pesoRequerido,
        pesoAsignado: d.pesoAsignado,
        pesoFaltante: d.pesoFaltante,
        porcentajeCumplimiento: d.porcentajeCumplimiento,
      }));

      const blob = await pdf(
        <ReporteProgresoPedidoClientePDF
          progreso={progreso}
          diferencias={diferenciasArray}
          cajasSurtidasPorOrden={cajasSurtidasPorOrden}
          incluirTarimas={incluirTarimas}
          configuracion={configuracion}
        />
      ).toBlob();

      const fecha = new Date().toISOString().split('T')[0];
      saveAs(blob, `Reporte_Progreso_Pedido_${progreso.id}_${fecha}.pdf`);

      toast.success('PDF generado exitosamente', { id: 'export-pdf' });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF', { id: 'export-pdf' });
    } finally {
      setExportando(false);
    }
  };

  const handleExportExcel = async () => {
    if (!progreso) {
      toast.error('No hay datos disponibles para exportar');
      return;
    }

    try {
      setExportando(true);
      toast.loading('Generando Excel...', { id: 'export-excel' });

      const configuracion = {
        nombreEmpresa: 'AgroSmart - Sistema de Empacadora',
        mostrarFechaGeneracion: true,
        pie: 'Generado con AgroSmart',
      };

      // Convertir diferencias de array a formato esperado
      const diferenciasArray = diferencias.map(d => ({
        tipo: d.tipo,
        cantidadRequerida: d.cantidadRequerida,
        cantidadAsignada: d.cantidadAsignada,
        cantidadFaltante: d.cantidadFaltante,
        pesoRequerido: d.pesoRequerido,
        pesoAsignado: d.pesoAsignado,
        pesoFaltante: d.pesoFaltante,
        porcentajeCumplimiento: d.porcentajeCumplimiento,
      }));

      await ReporteProgresoPedidoClienteExcelService.generarReporte(
        progreso,
        diferenciasArray,
        cajasSurtidasPorOrden,
        incluirTarimas,
        configuracion
      );

      toast.success('Excel generado exitosamente', { id: 'export-excel' });
    } catch (error) {
      console.error('Error al generar Excel:', error);
      toast.error('Error al generar el Excel', { id: 'export-excel' });
    } finally {
      setExportando(false);
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Fecha inválida';
    }
  };

  const renderSkeletonLoader = () => (
    <div className="space-y-4 sm:space-y-6">
      {/* Skeleton para Resumen */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton para Órdenes */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skeleton para Tarimas */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex space-x-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderErrorMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Error al cargar el progreso</h3>
        <p className="text-sm text-gray-600 max-w-md">{error}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          Reintentar
        </Button>
        <Button onClick={onClose} variant="secondary">
          Cerrar
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (!progreso) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="bg-gray-50 rounded-full p-4">
            <BarChart3 className="h-12 w-12 text-gray-400" aria-hidden="true" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-700">No hay datos de progreso disponibles</h3>
            <p className="text-sm text-gray-500 max-w-md">
              No se encontró información de progreso para este pedido. Intente actualizar o verifique más tarde.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Reintentar
            </Button>
            <Button onClick={onClose} variant="secondary">
              Cerrar
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6 px-1">
        {/* Resumen */}
        <section aria-labelledby="resumen-heading">
          <h3 id="resumen-heading" className="sr-only">Resumen del progreso del pedido</h3>
          <ResumenProgreso progreso={progreso} />
        </section>

        {/* Diferencias por Tipo */}
        <section aria-labelledby="diferencias-heading">
          <h3 id="diferencias-heading" className="sr-only">Diferencias de surtido por tipo</h3>
          <CalculoDiferencias diferencias={diferencias} />
        </section>

        {/* Órdenes */}
        <section aria-labelledby="ordenes-heading">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" aria-hidden="true" />
                Órdenes del Pedido
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Estado de surtido de cada orden solicitada
              </p>
            </CardHeader>
            <CardContent>
              <OrdenesProgreso ordenes={progreso.ordenes} cajasSurtidasPorOrden={cajasSurtidasPorOrden} />
            </CardContent>
          </Card>
        </section>

        {/* Tarimas */}
        <section aria-labelledby="tarimas-heading">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                Tarimas Asignadas
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Detalle de las tarimas asignadas al pedido
              </p>
            </CardHeader>
            <CardContent>
              <TarimasAsignadas tarimas={progreso.tarimas} />
            </CardContent>
          </Card>
        </section>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto pb-0">
        <div className="pb-6">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" aria-hidden="true" />
                  {progreso ? `Progreso del Pedido Cliente #${progreso.id}` : 'Cargando progreso...'}
                </DialogTitle>
                <DialogDescription>
                  Seguimiento del surtido y asignación de tarimas para este pedido.
                </DialogDescription>
              </div>

              {/* Botones de acción solo cuando hay datos */}
              {progreso && !loading && !error && (
                <div className="flex items-center gap-2">
                  {/* Botón de refresh */}
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    aria-label={`Actualizar progreso del pedido ${progreso.id}`}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                      aria-hidden="true"
                    />
                    Actualizar
                  </Button>

                  {/* Dropdown de exportación */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={exportando}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <FileDown className="h-4 w-4 mr-2" aria-hidden="true" />
                        Exportar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Opciones de Exportación</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Checkbox para incluir tarimas */}
                      <div className="px-2 py-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="incluir-tarimas"
                            checked={incluirTarimas}
                            onChange={(e) => setIncluirTarimas(e.target.checked)}
                          />
                          <label
                            htmlFor="incluir-tarimas"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Incluir tarimas asignadas
                          </label>
                        </div>
                      </div>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={handleExportPDF} disabled={exportando}>
                        <FileText className="h-4 w-4 mr-2" />
                        Exportar como PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportExcel} disabled={exportando}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Exportar como Excel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </DialogHeader>

          {(loading || modalJustOpened) && renderSkeletonLoader()}

          {error && !loading && renderErrorMessage()}

          {!loading && !error && renderContent()}

          {/* Timestamp de última actualización */}
          {progreso && !loading && !error && (
            <div className="text-xs text-muted-foreground text-right px-2 pb-2 pt-2 mt-4 border-t">
              <Clock className="h-3 w-3 inline mr-1" aria-hidden="true" />
              Última actualización: {formatDate(new Date())}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 