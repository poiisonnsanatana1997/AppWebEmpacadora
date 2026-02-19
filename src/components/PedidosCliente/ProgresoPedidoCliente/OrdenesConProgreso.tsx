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
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package,
} from 'lucide-react';
import type { OrdenPedidoClienteResponseDTO } from '@/types/PedidoCliente/ordenPedidoCliente.types';

interface OrdenesConProgresoProps {
  ordenes: OrdenPedidoClienteResponseDTO[];
  cajasSurtidasPorOrden: Map<number, number>;
}

export const OrdenesConProgreso: React.FC<OrdenesConProgresoProps> = ({ ordenes, cajasSurtidasPorOrden }) => {
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

  const getCumplimientoIcon = (porcentaje: number) => {
    if (porcentaje >= 100) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (porcentaje >= 70) return <TrendingUp className="h-4 w-4 text-blue-600" />;
    if (porcentaje >= 50) return <Clock className="h-4 w-4 text-yellow-600" />;
    if (porcentaje > 0) return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const getEstadoBadge = (cajasSurtidas: number, cantidadRequerida: number) => {
    if (cajasSurtidas >= cantidadRequerida) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completo</Badge>;
    }
    if (cajasSurtidas > 0) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En Proceso</Badge>;
    }
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Pendiente</Badge>;
  };

  if (ordenes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Órdenes y Progreso de Surtido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No hay órdenes registradas para este pedido
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" aria-hidden="true" />
          Órdenes y Progreso de Surtido
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Detalle de cada orden solicitada con su avance de surtido
        </p>
      </CardHeader>
      <CardContent>
        {/* Versión Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Requeridas</TableHead>
                <TableHead className="text-right">Surtidas</TableHead>
                <TableHead className="text-right">Faltantes</TableHead>
                <TableHead className="text-center">Progreso</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenes.map((orden) => {
                const cajasSurtidas = cajasSurtidasPorOrden.get(orden.id) || 0;
                const cantidadRequerida = orden.cantidad || 0;
                const cajasFaltantes = Math.max(0, cantidadRequerida - cajasSurtidas);
                const porcentajeSurtido = cantidadRequerida > 0
                  ? Math.round((cajasSurtidas / cantidadRequerida) * 100)
                  : 0;

                return (
                  <TableRow key={orden.id}>
                    <TableCell className="font-medium">#{orden.id}</TableCell>
                    <TableCell>{getTipoBadge(orden.tipo)}</TableCell>
                    <TableCell>
                      {orden.producto ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{orden.producto.nombre}</span>
                          <span className="text-xs text-muted-foreground">
                            {orden.producto.codigo} - {orden.producto.variedad}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin producto</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {cantidadRequerida.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {cajasSurtidas.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {cajasFaltantes.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {getCumplimientoIcon(porcentajeSurtido)}
                        <span className="text-sm font-medium">{porcentajeSurtido}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getEstadoBadge(cajasSurtidas, cantidadRequerida)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Versión Móvil */}
        <div className="md:hidden space-y-3">
          {ordenes.map((orden) => {
            const cajasSurtidas = cajasSurtidasPorOrden.get(orden.id) || 0;
            const cantidadRequerida = orden.cantidad || 0;
            const cajasFaltantes = Math.max(0, cantidadRequerida - cajasSurtidas);
            const porcentajeSurtido = cantidadRequerida > 0
              ? Math.round((cajasSurtidas / cantidadRequerida) * 100)
              : 0;

            return (
              <Card key={orden.id} className="p-4">
                <div className="space-y-3">
                  {/* Header: ID, Tipo y Estado */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">ID</div>
                      <div className="font-semibold text-slate-700">#{orden.id}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getTipoBadge(orden.tipo)}
                      {getEstadoBadge(cajasSurtidas, cantidadRequerida)}
                    </div>
                  </div>

                  {/* Producto */}
                  <div>
                    <div className="text-xs text-gray-600">Producto</div>
                    <div className="font-medium text-slate-800">
                      {orden.producto ? orden.producto.nombre : 'Sin producto'}
                    </div>
                    {orden.producto && (
                      <div className="text-xs text-slate-500">
                        {orden.producto.codigo} - {orden.producto.variedad}
                      </div>
                    )}
                  </div>

                  {/* Progreso */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Progreso de Surtido</span>
                      <div className="flex items-center gap-1">
                        {getCumplimientoIcon(porcentajeSurtido)}
                        <span className="font-medium">{porcentajeSurtido}%</span>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          porcentajeSurtido >= 100 ? 'bg-green-600' :
                          porcentajeSurtido >= 70 ? 'bg-blue-600' :
                          porcentajeSurtido >= 50 ? 'bg-yellow-600' :
                          porcentajeSurtido > 0 ? 'bg-orange-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(porcentajeSurtido, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Cantidades */}
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                    <div>
                      <div className="text-xs text-gray-600">Requeridas</div>
                      <div className="text-sm font-medium text-slate-700">
                        {cantidadRequerida.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Surtidas</div>
                      <div className="text-sm font-medium text-green-600">
                        {cajasSurtidas.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Faltantes</div>
                      <div className="text-sm font-medium text-red-600">
                        {cajasFaltantes.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
