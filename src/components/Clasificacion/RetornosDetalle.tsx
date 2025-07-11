import React from 'react';
import { RetornoDetalleDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface RetornosDetalleProps {
  retornos: RetornoDetalleDTO[];
  lote: string;
}

export const RetornosDetalle: React.FC<RetornosDetalleProps> = ({ retornos, lote }) => {
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pesoTotal = retornos.reduce((total, retorno) => total + retorno.peso, 0);

  if (retornos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Retornos - Lote {lote}</span>
            <Badge variant="outline">Sin retornos</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No hay retornos registrados para este lote.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Retornos - Lote {lote}</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{retornos.length} retornos</Badge>
            <Badge className="bg-orange-100 text-orange-800">
              {pesoTotal.toFixed(2)} kg total
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {retornos.map((retorno) => (
            <div key={retorno.id} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{retorno.numero}</Badge>
                  <span className="font-semibold text-orange-600">{retorno.peso.toFixed(2)} kg</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatearFecha(retorno.fechaRegistro)}
                </span>
              </div>
              {retorno.observaciones && (
                <p className="text-sm text-gray-700">{retorno.observaciones}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Registrado por: {retorno.usuarioRegistro}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 