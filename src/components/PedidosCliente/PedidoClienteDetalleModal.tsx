import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart3 } from 'lucide-react';
import { InformacionGeneral } from './DetalleModal/InformacionGeneral';
import { ProgresoSurtido } from './DetalleModal/ProgresoSurtido';
import { usePedidoClienteDetalle } from '@/hooks/PedidosCliente/usePedidoClienteDetalle';
import { usePedidoClienteProgreso } from '@/hooks/PedidosCliente/usePedidoClienteProgreso';

interface PedidoClienteDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedidoId: number | null;
}

export const PedidoClienteDetalleModal: React.FC<PedidoClienteDetalleModalProps> = ({
  isOpen,
  onClose,
  pedidoId,
}) => {
  const [activeTab, setActiveTab] = useState<string>('informacion');
  const [progresoLoaded, setProgresoLoaded] = useState(false);

  // Hook para datos de detalle (Tab 1)
  const {
    pedidoDetalle,
    loading: loadingDetalle,
    error: errorDetalle,
    obtenerPedidoClienteDetalle,
    limpiarDetalle,
  } = usePedidoClienteDetalle();

  // Hook para datos de progreso (Tab 2)
  const {
    progreso,
    loading: loadingProgreso,
    error: errorProgreso,
    obtenerProgresoPedidoCliente,
    calcularDiferencias,
    calcularCajasSurtidasPorOrden,
    limpiarProgreso,
  } = usePedidoClienteProgreso();

  // Memoizar cálculos de progreso
  const diferencias = useMemo(() => calcularDiferencias(), [calcularDiferencias]);
  const cajasSurtidasPorOrden = useMemo(() => calcularCajasSurtidasPorOrden(), [calcularCajasSurtidasPorOrden]);

  // Cargar datos de detalle cuando se abre el modal
  useEffect(() => {
    if (isOpen && pedidoId) {
      obtenerPedidoClienteDetalle(pedidoId);
      setProgresoLoaded(false); // Reset para permitir nueva carga
    } else if (!isOpen) {
      limpiarDetalle();
      limpiarProgreso();
      setActiveTab('informacion'); // Reset a tab por defecto
      setProgresoLoaded(false);
    }
  }, [isOpen, pedidoId, obtenerPedidoClienteDetalle, limpiarDetalle, limpiarProgreso]);

  // Carga lazy del progreso solo cuando se accede a esa tab
  useEffect(() => {
    if (activeTab === 'progreso' && pedidoId && !progresoLoaded && !progreso) {
      obtenerProgresoPedidoCliente(pedidoId);
      setProgresoLoaded(true);
    }
  }, [activeTab, pedidoId, progresoLoaded, progreso, obtenerProgresoPedidoCliente]);

  // Handler para refrescar progreso
  const handleRefreshProgreso = () => {
    if (pedidoId) {
      obtenerProgresoPedidoCliente(pedidoId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] sm:w-full max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {pedidoDetalle
              ? `Detalles del Pedido Cliente #${pedidoDetalle.id}`
              : 'Cargando...'
            }
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="informacion" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Información General
            </TabsTrigger>
            <TabsTrigger value="progreso" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Progreso de Surtido
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4 px-1">
            <TabsContent value="informacion" className="m-0">
              {pedidoDetalle && !loadingDetalle && !errorDetalle ? (
                <InformacionGeneral pedidoDetalle={pedidoDetalle} />
              ) : (
                <div className="text-center py-8">
                  {loadingDetalle ? 'Cargando...' : errorDetalle || 'No hay datos disponibles'}
                </div>
              )}
            </TabsContent>

            <TabsContent value="progreso" className="m-0">
              {progreso && !loadingProgreso && !errorProgreso ? (
                <ProgresoSurtido
                  progreso={progreso}
                  diferencias={diferencias}
                  cajasSurtidasPorOrden={cajasSurtidasPorOrden}
                />
              ) : (
                <div className="text-center py-8">
                  {loadingProgreso ? 'Cargando progreso...' : errorProgreso || 'No hay datos de progreso disponibles'}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
