import { ClipboardList, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import React from 'react';
import { PedidoCompletoDTO, ClasificacionCompletaDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ESTADO_ORDEN } from '../../types/OrdenesEntrada/ordenesEntrada.types';

interface ClasificacionHeaderProps {
  orden: {
    codigo: string;
    estatus: string;
    proveedor?: { razonSocial?: string };
    producto?: {
      nombre?: string;
      codigo?: string;
      variedad?: string;
    };
  };
  clasificaciones: any[];
}

export const ClasificacionHeader: React.FC<ClasificacionHeaderProps> = ({ orden }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
    {/* Botón regresar - solo visible en desktop */}
    <Button
      onClick={() => window.history.back()}
      variant="outline"
      size="sm"
      className="hidden sm:flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      Regresar
    </Button>
    
    {/* Info principal compacta */}
    <div className="flex flex-col sm:items-end gap-1">
      {/* Línea principal con orden y estatus */}
      <div className="flex flex-wrap items-center gap-2">
        <ClipboardList className="h-4 w-4 text-gray-700 flex-shrink-0" />
        <span className="text-sm sm:text-base font-bold">Orden #{orden.codigo}</span>
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
          orden.estatus === ESTADO_ORDEN.PENDIENTE ? 'bg-yellow-200 text-yellow-800' :
          orden.estatus === ESTADO_ORDEN.PROCESANDO ? 'bg-blue-200 text-blue-800' :
          orden.estatus === ESTADO_ORDEN.RECIBIDA ? 'bg-green-200 text-green-800' :
          orden.estatus === ESTADO_ORDEN.CLASIFICANDO ? 'bg-purple-200 text-purple-800' :
          orden.estatus === ESTADO_ORDEN.CLASIFICADO ? 'bg-indigo-200 text-indigo-800' :
          orden.estatus === ESTADO_ORDEN.CANCELADA ? 'bg-red-200 text-red-800' :
          'bg-gray-200 text-gray-800'
        }`}>
          {orden.estatus}
        </span>
      </div>
      
      {/* Información del producto y proveedor en línea */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {orden.producto && (
          <>
            <Badge variant="outline" className="text-xs py-0">
              Producto: {orden.producto.nombre}
            </Badge>
            {orden.producto.variedad && (
              <Badge variant="secondary" className="text-xs py-0">
                Var: {orden.producto.variedad}
              </Badge>
            )}
          </>
        )}
        <span className="text-gray-500">
          Proveedor: {orden.proveedor?.razonSocial || 'Sin proveedor'}
        </span>
      </div>
    </div>
  </div>
); 