import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart3, 
  RefreshCw, 
  X,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { usePedidoClienteProgreso } from '@/hooks/PedidosCliente/usePedidoClienteProgreso';
import { ResumenProgreso } from './ProgresoPedidoCliente/ResumenProgreso';
import { OrdenesProgreso } from './ProgresoPedidoCliente/OrdenesProgreso';
import { TarimasAsignadas } from './ProgresoPedidoCliente/TarimasAsignadas';

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
    limpiarProgreso,
    limpiarError,
  } = usePedidoClienteProgreso();

  // Efecto para cargar el progreso cuando se abre el modal
  useEffect(() => {
    if (isOpen && pedidoId) {
      obtenerProgresoPedidoCliente(pedidoId);
    } else if (!isOpen) {
      limpiarProgreso();
    }
  }, [isOpen, pedidoId, obtenerProgresoPedidoCliente, limpiarProgreso]);

  const handleRefresh = () => {
    if (pedidoId) {
      obtenerProgresoPedidoCliente(pedidoId);
    }
  };



  const renderSkeletonLoader = () => (
    <div className="space-y-6">
      {/* Skeleton para el resumen */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Skeleton para las tablas */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );

  const renderErrorMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Error al cargar el progreso</h3>
        <p className="text-sm text-gray-600 max-w-md">{error}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
        <Button onClick={onClose} variant="secondary">
          Cerrar
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return renderSkeletonLoader();
    }

    if (error) {
      return renderErrorMessage();
    }

    if (!progreso) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <TrendingUp className="h-12 w-12 text-gray-400" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">No hay datos de progreso</h3>
            <p className="text-sm text-gray-600">No se encontró información de progreso para este pedido</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Resumen */}
        <div>
          <h3 className="text-base font-medium mb-4 flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            Resumen del Progreso
          </h3>
          <ResumenProgreso 
            progreso={progreso} 
          />
        </div>

        {/* Órdenes */}
        <div>
          <h3 className="text-base font-medium mb-4 flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Órdenes del Pedido
          </h3>
          <OrdenesProgreso ordenes={progreso.ordenes} tarimas={progreso.tarimas} />
        </div>

        {/* Tarimas */}
        <div>
          <h3 className="text-base font-medium mb-4 flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            Tarimas Asignadas
          </h3>
          <TarimasAsignadas tarimas={progreso.tarimas} />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progreso del Pedido Cliente
            {pedidoId && <span className="text-muted-foreground">#{pedidoId}</span>}
          </DialogTitle>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
              className="mr-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 