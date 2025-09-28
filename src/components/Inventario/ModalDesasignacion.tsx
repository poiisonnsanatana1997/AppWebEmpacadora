import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Unlink, AlertTriangle, Package, Scale, Hash } from 'lucide-react';
import type { InventarioTipoDTO } from '@/types/Inventario/inventario.types';
import type { DesasignarTarimaDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { PedidosClienteService } from '@/services/pedidosCliente.service';

interface ModalDesasignacionProps {
  tarimasSeleccionadas: InventarioTipoDTO[];
  isOpen: boolean;
  onClose: () => void;
  onDesasignacionExitosa: (tarimasDesasignadas: InventarioTipoDTO[]) => void;
}

export function ModalDesasignacion({ 
  tarimasSeleccionadas, 
  isOpen, 
  onClose, 
  onDesasignacionExitosa 
}: ModalDesasignacionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDesasignar = async () => {
    if (tarimasSeleccionadas.length === 0) {
      toast.error('No hay tarimas seleccionadas');
      return;
    }

    setIsLoading(true);
    try {
      // Transformar datos para el servicio
      const datosDesasignacion = tarimasSeleccionadas.flatMap(tarima => {
        const pedidos = tarima.tarimaOriginal.pedidoTarimas || [];
        return pedidos.map(pedido => ({
          idPedido: pedido.idPedidoCliente,
          idTarima: tarima.tarimaOriginal.id
        }));
      });

      if (datosDesasignacion.length === 0) {
        toast.error('No se encontraron pedidos asignados para desasignar');
        return;
      }

      // Llamar al servicio de desasignación
      await PedidosClienteService.desasignarTarimasPedidoCliente(datosDesasignacion);
      
      // Notificar éxito
      toast.success(`${tarimasSeleccionadas.length} tarima(s) desasignada(s) exitosamente`);
      
      // Llamar callback de éxito
      onDesasignacionExitosa(tarimasSeleccionadas);
      
      // Cerrar modal
      onClose();
    } catch (error) {
      console.error('Error al desasignar tarimas:', error);
      toast.error('Error al desasignar las tarimas. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-red-100 rounded-lg">
              <Unlink className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="font-semibold">Confirmar Desasignación</div>
              <div className="text-sm font-normal text-gray-500 mt-1">
                Desasignar tarimas de pedidos actuales
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Warning Alert */}
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="font-medium mb-1">
                ¿Estás seguro de que quieres desasignar estas tarimas?
              </div>
              <div className="text-sm">
                Esta acción desasignará {tarimasSeleccionadas.length} tarima(s) de sus pedidos actuales.
                Las tarimas quedarán disponibles para nuevas asignaciones.
              </div>
            </AlertDescription>
          </Alert>

          {/* Tarimas a desasignar */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">Tarimas a Desasignar</h4>
              <Badge variant="secondary" className="text-xs">
                {tarimasSeleccionadas.length} tarima{tarimasSeleccionadas.length !== 1 ? 's' : ''}
              </Badge>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {tarimasSeleccionadas.map((tarima) => (
                <div key={tarima.codigo} className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-red-100 rounded-md">
                      <Hash className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">
                        {tarima.codigo}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600 font-medium">{tarima.tipo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Scale className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {tarima.pesoTotalPorTipo.toLocaleString('es-MX', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })} kg
                          </span>
                        </div>
                      </div>
                      {tarima.tarimaOriginal.pedidoTarimas?.[0] && (
                        <div className="text-xs text-gray-500 mt-1">
                          Asignada a: {tarima.tarimaOriginal.pedidoTarimas[0].nombreCliente}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDesasignar}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Desasignando...
                </>
              ) : (
                <>
                  <Unlink className="w-4 h-4 mr-2" />
                  Desasignar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
