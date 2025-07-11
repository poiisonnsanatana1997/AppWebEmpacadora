import React from 'react';
import { MermaDetalleDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface MermasDetalleProps {
  mermas: MermaDetalleDTO[];
  lote: string;
}

export const MermasDetalle: React.FC<MermasDetalleProps> = ({ mermas, lote }) => {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pesoTotal = mermas.reduce((total, merma) => total + merma.peso, 0);

  if (mermas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Mermas - Lote {lote}</span>
            <Badge variant="outline">Sin mermas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No hay mermas registradas para este lote.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mermas - Lote {lote}</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{mermas.length} mermas</Badge>
            <Badge className="bg-red-100 text-red-800">
              {pesoTotal.toFixed(2)} kg total
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mermas.map((merma) => (
            <div key={merma.id} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{merma.tipo}</Badge>
                  <span className="font-semibold text-red-600">{merma.peso.toFixed(2)} kg</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatearFecha(merma.fechaRegistro)}
                </span>
              </div>
              {merma.observaciones && (
                <p className="text-sm text-gray-700">{merma.observaciones}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Registrado por: {merma.usuarioRegistro}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 