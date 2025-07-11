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
  };
  clasificaciones: any[];
}

export const ClasificacionHeader: React.FC<ClasificacionHeaderProps> = ({ orden }) => (
  <div className="flex items-center justify-between mb-6">
    {/* Botón regresar con mismo diseño que pesaje */}
    <Button
      onClick={() => window.history.back()}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      Regresar
    </Button>
    {/* Info principal */}
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-6 w-6 text-gray-700" />
        <span className="text-lg font-bold">Orden #{orden.codigo}</span>
        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ml-2 ${
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
      <span className="text-xs text-gray-500 mt-1">Proveedor: {orden.proveedor?.razonSocial || 'Sin proveedor'}</span>
    </div>
  </div>
); 