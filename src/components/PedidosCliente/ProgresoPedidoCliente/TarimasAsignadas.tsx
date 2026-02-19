import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Package,
  Barcode,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { TarimaProgresoDTO } from '@/types/PedidoCliente/pedidoCliente.types';

interface TarimasAsignadasProps {
  tarimas: TarimaProgresoDTO[];
}

export const TarimasAsignadas: React.FC<TarimasAsignadasProps> = ({ tarimas }) => {
  // Calcular totales de cantidad y peso
  const calcularTotales = () => {
    let totalCantidad = 0;
    let totalPeso = 0;

    tarimas.forEach(tarima => {
      tarima.tarimasClasificaciones.forEach(clasificacion => {
        totalCantidad += clasificacion.cantidad || 0;
        totalPeso += clasificacion.peso || 0;
      });
    });

    return { totalCantidad, totalPeso };
  };

  const { totalCantidad, totalPeso } = calcularTotales();

  const getEstatusBadge = (estatus: string) => {
    const estatusConfig = {
      'Disponible': 'bg-green-50 text-green-700 border-green-200',
      'En Uso': 'bg-blue-50 text-blue-700 border-blue-200',
      'Asignada': 'bg-orange-50 text-orange-700 border-orange-200',
      'Completada': 'bg-purple-50 text-purple-700 border-purple-200',
    };

    const className = estatusConfig[estatus as keyof typeof estatusConfig] || estatusConfig['Disponible'];

    return (
      <Badge variant="outline" className={className}>
        {estatus}
      </Badge>
    );
  };

  const getTipoBadge = (tipo: string) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        tipo === 'XL' ? 'bg-purple-100 text-purple-800' :
        tipo === 'L' ? 'bg-blue-100 text-blue-800' :
        tipo === 'M' ? 'bg-green-100 text-green-800' :
        tipo === 'S' ? 'bg-orange-100 text-orange-800' :
        'bg-red-100 text-red-800'
      }`}>
        {tipo}
      </span>
    );
  };

  const getEstatusIcon = (estatus: string) => {
    if (estatus === 'Completada') return <CheckCircle className="h-4 w-4 text-purple-600" />;
    if (estatus === 'Asignada') return <AlertCircle className="h-4 w-4 text-orange-600" />;
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  if (tarimas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay tarimas asignadas a este pedido
      </div>
    );
  }

  return (
    <>
      {/* Versión Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>UPC</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead className="text-center">Tipo</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Peso (kg)</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tarimas.flatMap((tarima) =>
              tarima.tarimasClasificaciones.length > 0
                ? tarima.tarimasClasificaciones.map((clasificacion, index) => (
                    <TableRow key={`${tarima.id}-${index}`}>
                      <TableCell className="font-medium font-mono">
                        {tarima.codigo}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {tarima.upc || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        {clasificacion.producto ? (
                          <div className="flex flex-col">
                            <span className="font-medium">{clasificacion.producto.nombre}</span>
                            <span className="text-xs text-muted-foreground">
                              {clasificacion.producto.codigo} - {clasificacion.producto.variedad}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sin producto</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {getTipoBadge(clasificacion.tipo)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-600">
                        {(clasificacion.cantidad || 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {clasificacion.peso ? clasificacion.peso.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getEstatusIcon(tarima.estatus)}
                          {getEstatusBadge(tarima.estatus)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : [
                    <TableRow key={`${tarima.id}-empty`}>
                      <TableCell className="font-medium font-mono">
                        {tarima.codigo}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {tarima.upc || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">Sin producto</span>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">-</TableCell>
                      <TableCell className="text-center text-muted-foreground">-</TableCell>
                      <TableCell className="text-center text-muted-foreground">-</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getEstatusIcon(tarima.estatus)}
                          {getEstatusBadge(tarima.estatus)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ]
            )}
          </TableBody>
        </Table>

        {/* Totales */}
        <div className="mt-4 pt-4 border-t flex items-center justify-end gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Cajas:</span>
            <span className="font-semibold text-blue-600">{totalCantidad.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Peso:</span>
            <span className="font-semibold text-green-600">{totalPeso.toFixed(2)} kg</span>
          </div>
        </div>
      </div>

      {/* Versión Móvil */}
      <div className="md:hidden space-y-3">
        {tarimas.flatMap((tarima) =>
          tarima.tarimasClasificaciones.length > 0
            ? tarima.tarimasClasificaciones.map((clasificacion, index) => (
                <Card key={`${tarima.id}-${index}`} className="p-4">
                  <div className="space-y-3">
                    {/* Header: Código y Estado */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">Código Tarima</div>
                        <div className="font-semibold font-mono text-slate-700">{tarima.codigo}</div>
                        {tarima.upc && (
                          <div className="text-xs font-mono text-slate-500">UPC: {tarima.upc}</div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getTipoBadge(clasificacion.tipo)}
                        <div className="flex items-center gap-1">
                          {getEstatusIcon(tarima.estatus)}
                          {getEstatusBadge(tarima.estatus)}
                        </div>
                      </div>
                    </div>

                    {/* Producto */}
                    <div>
                      <div className="text-xs text-gray-600">Producto</div>
                      <div className="font-medium text-slate-800">
                        {clasificacion.producto ? clasificacion.producto.nombre : 'Sin producto'}
                      </div>
                      {clasificacion.producto && (
                        <div className="text-xs text-slate-500">
                          {clasificacion.producto.codigo} - {clasificacion.producto.variedad}
                        </div>
                      )}
                    </div>

                    {/* Cantidades */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                      <div>
                        <div className="text-xs text-gray-600">Cantidad</div>
                        <div className="text-sm font-medium text-blue-600">
                          {(clasificacion.cantidad || 0).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Peso</div>
                        <div className="text-sm font-medium text-green-600">
                          {clasificacion.peso ? `${clasificacion.peso.toFixed(2)} kg` : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            : [
                <Card key={`${tarima.id}-empty`} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">Código Tarima</div>
                        <div className="font-semibold font-mono text-slate-700">{tarima.codigo}</div>
                        {tarima.upc && (
                          <div className="text-xs font-mono text-slate-500">UPC: {tarima.upc}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {getEstatusIcon(tarima.estatus)}
                        {getEstatusBadge(tarima.estatus)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">Sin producto asignado</div>
                  </div>
                </Card>
              ]
        )}

        {/* Totales Móvil */}
        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600">Total Cajas</div>
            <div className="text-lg font-semibold text-blue-700">{totalCantidad.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-600">Total Peso</div>
            <div className="text-lg font-semibold text-green-700">{totalPeso.toFixed(2)} kg</div>
          </div>
        </div>
      </div>
    </>
  );
};
