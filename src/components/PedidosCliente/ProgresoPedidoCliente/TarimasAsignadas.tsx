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
  Tag
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
      'Disponible': { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      'En Uso': { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' },
      'Asignada': { variant: 'outline' as const, className: 'bg-orange-100 text-orange-800' },
      'Completada': { variant: 'destructive' as const, className: 'bg-purple-100 text-purple-800' },
    };

    const config = estatusConfig[estatus as keyof typeof estatusConfig] || estatusConfig['Disponible'];

    return (
      <Badge variant={config.variant} className={config.className}>
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

  if (tarimas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Tarimas Asignadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No hay tarimas asignadas a este pedido
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Tarimas Asignadas ({tarimas.length})
          </CardTitle>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total Cantidad:</span>
              <span className="font-semibold text-blue-600">{totalCantidad.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total Peso:</span>
              <span className="font-semibold text-green-600">{totalPeso.toFixed(2)}kg</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Barcode className="h-4 w-4" />
                  Código
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Barcode className="h-4 w-4" />
                  UPC
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Producto
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Estatus
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Package className="h-4 w-4" />
                  Tipo
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Package className="h-4 w-4" />
                  Cantidad
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Package className="h-4 w-4" />
                  Peso
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tarimas.flatMap((tarima) => 
              tarima.tarimasClasificaciones.length > 0 
                ? tarima.tarimasClasificaciones.map((clasificacion, index) => (
                    <TableRow key={`${tarima.id}-${index}`}>
                      <TableCell>
                        <span className="font-mono text-sm">{tarima.codigo}</span>
                      </TableCell>
                      <TableCell>
                        {tarima.upc ? (
                          <span className="font-mono text-sm">{tarima.upc}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {clasificacion.producto ? (
                          <div className="flex flex-col space-y-1">
                            <span className="font-medium">{clasificacion.producto.nombre}</span>
                            <div className="flex flex-col text-xs text-muted-foreground space-y-0.5">
                              <span>Código: {clasificacion.producto.codigo}</span>
                              <span>Variedad: {clasificacion.producto.variedad}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sin producto</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getEstatusBadge(tarima.estatus)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getTipoBadge(clasificacion.tipo)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium text-blue-600">{clasificacion.cantidad || 0}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium text-green-600">
                          {clasificacion.peso ? `${clasificacion.peso.toFixed(2)}kg` : '-'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                : [
                    <TableRow key={`${tarima.id}-empty`}>
                      <TableCell>
                        <span className="font-mono text-sm">{tarima.codigo}</span>
                      </TableCell>
                      <TableCell>
                        {tarima.upc ? (
                          <span className="font-mono text-sm">{tarima.upc}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">Sin producto</span>
                      </TableCell>
                      <TableCell>
                        {getEstatusBadge(tarima.estatus)}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">-</TableCell>
                      <TableCell className="text-center text-muted-foreground">-</TableCell>
                      <TableCell className="text-center text-muted-foreground">-</TableCell>
                    </TableRow>
                                     ]
             )}
           </TableBody>
         </Table>
      </CardContent>
    </Card>
  );
}; 