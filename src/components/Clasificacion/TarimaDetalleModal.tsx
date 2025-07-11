import React from 'react';
import { TarimaClasificacionDTO } from '@/types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { X, Package, Calendar, User, FileText, Hash, Scale, Tag } from 'lucide-react';

interface TarimaDetalleModalProps {
  open: boolean;
  onClose: () => void;
  tarima: TarimaClasificacionDTO | null;
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

// Función para formatear el peso
const formatWeight = (weight: number): string => {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(weight) + ' kg';
};

export const TarimaDetalleModal: React.FC<TarimaDetalleModalProps> = ({ 
  open, 
  onClose, 
  tarima 
}) => {
  if (!tarima) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Detalle de Tarima
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Básica */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Información Básica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Código de Tarima</label>
                <p className="text-lg font-semibold text-gray-900">{tarima.tarima.codigo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Tipo</label>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    tarima.tipo === 'XL' ? 'bg-purple-100 text-purple-800' :
                    tarima.tipo === 'L' ? 'bg-blue-100 text-blue-800' :
                    tarima.tipo === 'M' ? 'bg-green-100 text-green-800' :
                    tarima.tipo === 'S' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tarima.tipo}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estatus</label>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    tarima.tarima.estatus === 'COMPLETA' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tarima.tarima.estatus}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Cantidad de Cajas</label>
                <p className="text-lg font-semibold text-gray-900">{tarima.tarima.cantidad}</p>
              </div>
            </div>
          </div>

          {/* Información de Peso */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Información de Peso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Peso Total</label>
                <p className="text-lg font-semibold text-blue-900">{formatWeight(tarima.peso)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Peso por Caja</label>
                <p className="text-lg font-semibold text-blue-900">
                  {tarima.tarima.cantidad > 0 
                    ? formatWeight(tarima.peso / tarima.tarima.cantidad)
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Información de Fechas */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Información de Fechas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                <p className="text-sm text-gray-900">{formatDate(tarima.tarima.fechaRegistro)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Última Actualización</label>
                <p className="text-sm text-gray-900">{formatDate(tarima.tarima.fechaActualizacion)}</p>
              </div>
            </div>
          </div>

          {/* Información de Usuarios */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Información de Usuarios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Usuario de Registro</label>
                <p className="text-sm text-gray-900">{tarima.tarima.usuarioRegistro}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Usuario de Modificación</label>
                <p className="text-sm text-gray-900">{tarima.tarima.usuarioModificacion}</p>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          {(tarima.tarima.upc || tarima.tarima.observaciones) && (
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Información Adicional
              </h3>
              <div className="space-y-4">
                {tarima.tarima.upc && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">UPC</label>
                    <p className="text-sm text-gray-900">{tarima.tarima.upc}</p>
                  </div>
                )}
                {tarima.tarima.observaciones && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Observaciones</label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{tarima.tarima.observaciones}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Información de Relación */}
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Información de Relación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">ID de Tarima</label>
                <p className="text-sm text-gray-900">{tarima.idTarima}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">ID de Clasificación</label>
                <p className="text-sm text-gray-900">{tarima.idClasificacion}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 