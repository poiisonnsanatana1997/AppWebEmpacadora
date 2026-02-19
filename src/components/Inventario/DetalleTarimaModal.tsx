import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Scale, 
  Calendar, 
  User, 
  Building, 
  Hash,
  Truck,
  ClipboardList
} from 'lucide-react';
import { format } from 'date-fns';
import type { TarimaParcialCompletaDTO } from '@/types/Tarimas/tarima.types';
import { ESTATUS_COLORS } from '@/types/Inventario/inventario.types';

interface DetalleTarimaModalProps {
  tarima: TarimaParcialCompletaDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para mostrar los detalles completos de una tarima
 * Solo vista visual, sin funcionalidades de edición
 */
export function DetalleTarimaModal({ tarima, isOpen, onClose }: DetalleTarimaModalProps) {
  if (!tarima) return null;

  /**
   * Formatea fechas al formato español
   */
  const formatearFecha = (fecha: string): string => {
    try {
      return format(new Date(fecha), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Fecha inválida';
    }
  };

    /**
   * Formatea peso con separadores de miles
   */
  const formatearPeso = (peso: number): string => {
    return `${peso.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} kg`;
  };

  /**
   * Calcula el peso total de la tarima
   */
  const pesoTotalTarima = tarima.tarimasClasificaciones.reduce(
    (total, clasificacion) => total + clasificacion.pesoTotal, 
    0
  );

  /**
   * Obtiene el badge de estatus con colores apropiados
   */
  const getBadgeEstatus = (estatus: string) => {
    const colorClass = ESTATUS_COLORS[estatus] || 'bg-gray-100 text-gray-800';
    return (
      <Badge variant="secondary" className={colorClass}>
        {estatus}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalle de Tarima: {tarima.codigo}
          </DialogTitle>
          <DialogDescription>
            Información completa de la tarima incluyendo clasificaciones, orden de entrada y pedidos asignados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Código</label>
                <p className="text-sm font-semibold">{tarima.codigo}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Estatus</label>
                <div>{getBadgeEstatus(tarima.estatus)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Peso Total</label>
                <p className="text-sm font-semibold flex items-center gap-1">
                  <Scale className="h-4 w-4" />
                  {formatearPeso(pesoTotalTarima)}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">UPC</label>
                <p className="text-sm">{tarima.upc || 'No asignado'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Fecha Registro</label>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatearFecha(tarima.fechaRegistro)}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Fecha Actualización</label>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatearFecha(tarima.fechaActualizacion)}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Usuario Registro</label>
                <p className="text-sm flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {tarima.usuarioRegistro}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Usuario Modificación</label>
                <p className="text-sm flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {tarima.usuarioModificacion}
                </p>
              </div>
              {tarima.observaciones && (
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <label className="text-sm font-medium text-gray-500">Observaciones</label>
                  <p className="text-sm bg-gray-50 p-2 rounded">{tarima.observaciones}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clasificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Clasificaciones ({tarima.tarimasClasificaciones.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tarima.tarimasClasificaciones.map((clasificacion, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">ID Clasificación</label>
                        <p className="text-sm font-semibold">#{clasificacion.idClasificacion}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Tipo</label>
                        <p className="text-sm">{clasificacion.tipo}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Lote</label>
                        <p className="text-sm font-mono bg-white px-2 py-1 rounded text-xs">
                          {clasificacion.lote}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Cantidad</label>
                        <p className="text-sm">{clasificacion.cantidad.toLocaleString('es-ES')} unidades</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Peso Unitario</label>
                        <p className="text-sm">{formatearPeso(clasificacion.peso)}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Peso Total</label>
                        <p className="text-sm font-semibold">{formatearPeso(clasificacion.pesoTotal)}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Fecha Registro</label>
                        <p className="text-sm">{formatearFecha(clasificacion.fechaRegistro)}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500">Usuario</label>
                        <p className="text-sm">{clasificacion.usuarioRegistro}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pedidos Asociados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Pedidos Asociados ({tarima.pedidoTarimas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tarima.pedidoTarimas.length > 0 ? (
                <div className="space-y-4">
                  {tarima.pedidoTarimas.map((pedido, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-blue-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">ID Pedido</label>
                          <p className="text-sm font-semibold">#{pedido.idPedidoCliente}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Cliente</label>
                          <p className="text-sm flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {pedido.nombreCliente}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Sucursal</label>
                          <p className="text-sm flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {pedido.nombreSucursal}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Estatus</label>
                          <div>{getBadgeEstatus(pedido.estatus)}</div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Fecha Embarque</label>
                          <p className="text-sm">{formatearFecha(pedido.fechaEmbarque)}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500">Fecha Registro</label>
                          <p className="text-sm">{formatearFecha(pedido.fechaRegistro)}</p>
                        </div>
                        {pedido.observaciones && (
                          <div className="space-y-2 md:col-span-2 lg:col-span-3">
                            <label className="text-sm font-medium text-gray-500">Observaciones</label>
                            <p className="text-sm bg-white p-2 rounded">{pedido.observaciones}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sin pedidos asociados
                  </h3>
                  <p className="text-sm text-gray-500">
                    Esta tarima no tiene pedidos de cliente asociados.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
