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
  Hash, 
  Package, 
  Scale, 
  FileText,
  CheckCircle
} from 'lucide-react';
import type { OrdenPedidoClienteResponseDTO } from '@/types/PedidoCliente/ordenPedidoCliente.types';
import type { TarimaProgresoDTO } from '@/types/PedidoCliente/pedidoCliente.types';

interface OrdenesProgresoProps {
  ordenes: OrdenPedidoClienteResponseDTO[];
  tarimas: TarimaProgresoDTO[];
}

export const OrdenesProgreso: React.FC<OrdenesProgresoProps> = ({ ordenes, tarimas }) => {
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

  // Calcular cajas surtidas por orden
  const calcularCajasSurtidas = (orden: OrdenPedidoClienteResponseDTO) => {
    let cajasSurtidas = 0;
    
    // Sumar todas las cantidades de las tarimas que coincidan con el tipo y producto de la orden
    tarimas.forEach(tarima => {
      tarima.tarimasClasificaciones.forEach(clasificacion => {
        if (clasificacion.tipo === orden.tipo && 
            clasificacion.producto && 
            orden.producto && 
            clasificacion.producto.id === orden.producto.id) {
          cajasSurtidas += clasificacion.cantidad || 0;
        }
      });
    });
    
    return cajasSurtidas;
  };

  if (ordenes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Órdenes del Pedido
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Órdenes del Pedido ({ordenes.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <div className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  ID
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Tipo
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Scale className="h-4 w-4" />
                  Cantidad
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Cajas Surtidas
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Producto
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenes.map((orden) => {
              const cajasSurtidas = calcularCajasSurtidas(orden);
              const porcentajeSurtido = orden.cantidad && orden.cantidad > 0 
                ? Math.round((cajasSurtidas / orden.cantidad) * 100)
                : 0;
              
              return (
                <TableRow key={orden.id}>
                  <TableCell className="font-medium">
                    #{orden.id}
                  </TableCell>
                  <TableCell>
                    {getTipoBadge(orden.tipo)}
                  </TableCell>
                  <TableCell>
                    {orden.cantidad ? orden.cantidad.toLocaleString() : '-'}
                  </TableCell>
                  <TableCell>
                    {cajasSurtidas > 0 ? (
                      <span className="font-medium text-green-600">
                        {cajasSurtidas.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {orden.producto ? (
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium">{orden.producto.nombre}</span>
                        <div className="flex flex-col text-xs text-muted-foreground space-y-0.5">
                          <span>Código: {orden.producto.codigo}</span>
                          <span>Variedad: {orden.producto.variedad}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sin producto</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}; 