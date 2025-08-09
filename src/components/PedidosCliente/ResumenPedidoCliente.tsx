import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Building, 
  Package, 
  Calendar, 
  FileText, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { type InformacionBasicaData, type OrdenData } from '@/schemas/pedidoClienteWizardSchema';
import { ClienteDTO } from '@/types/Cliente/cliente.types';
import { ProductoDto } from '@/types/Productos/productos.types';

interface ResumenPedidoClienteProps {
  informacion: InformacionBasicaData;
  ordenes: OrdenData[];
  clientes: ClienteDTO[];
  productos: ProductoDto[];
}

export const ResumenPedidoCliente: React.FC<ResumenPedidoClienteProps> = ({
  informacion,
  ordenes,
  clientes,
  productos,
}) => {
  const cliente = clientes.find(c => c.id === informacion.idCliente);
  const sucursal = cliente?.sucursales?.find(s => s.id === informacion.idSucursal);

  const getProductoNombre = (idProducto: number) => {
    const producto = productos.find(p => p.id === idProducto);
    return producto?.nombre || 'Producto no encontrado';
  };

  const calcularTotales = () => {
    return ordenes.reduce((totales, orden) => {
      return {
        cantidad: totales.cantidad + (orden.cantidad || 0),
        peso: totales.peso + (orden.peso || 0),
      };
    }, { cantidad: 0, peso: 0 });
  };

  const totales = calcularTotales();

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En Proceso':
        return 'bg-blue-100 text-blue-800';
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'XL':
        return 'bg-purple-100 text-purple-800';
      case 'L':
        return 'bg-blue-100 text-blue-800';
      case 'M':
        return 'bg-green-100 text-green-800';
      case 'S':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Información del Cliente y Sucursal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Cliente</h4>
              <p className="text-lg font-semibold">{cliente?.razonSocial || 'Cliente no encontrado'}</p>
              <p className="text-sm text-muted-foreground">{cliente?.nombre}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Sucursal</h4>
              <p className="text-lg font-semibold">{sucursal?.nombre || 'Sucursal no encontrada'}</p>
              <p className="text-sm text-muted-foreground">{sucursal?.direccion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalles del Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalles del Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Estatus</h4>
              <Badge className={getEstatusColor(informacion.estatus)}>
                {informacion.estatus}
              </Badge>
            </div>
            
            {informacion.fechaEmbarque && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Fecha de Embarque</h4>
                <p className="text-lg">
                  {format(informacion.fechaEmbarque, "EEEE, d 'de' MMMM 'de' yyyy")}
                </p>
              </div>
            )}
          </div>
          
          {informacion.observaciones && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Observaciones</h4>
              <p className="text-lg">{informacion.observaciones}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de Órdenes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Resumen de Órdenes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Totales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <h4 className="font-medium text-sm text-muted-foreground">Total Órdenes</h4>
                <p className="text-2xl font-bold">{ordenes.length}</p>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-sm text-muted-foreground">Total Cantidad de Cajas</h4>
                <p className="text-2xl font-bold">{totales.cantidad}</p>
              </div>
              <div className="text-center">
                <h4 className="font-medium text-sm text-muted-foreground">Total Peso</h4>
                <p className="text-2xl font-bold">{totales.peso.toFixed(2)} kg</p>
              </div>
            </div>

            {/* Lista de órdenes */}
            <div className="space-y-2">
              <h4 className="font-medium">Órdenes Agregadas:</h4>
              {ordenes.map((orden, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getTipoColor(orden.tipo)}>{orden.tipo}</Badge>
                    <span className="font-medium">{getProductoNombre(orden.idProducto)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {orden.cantidad && <span>Cantidad de Cajas: {orden.cantidad}</span>}
                    {orden.peso && <span>Peso: {orden.peso} kg</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmación */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">Pedido Listo para Crear</h4>
              <p className="text-sm text-green-700">
                Revisa la información anterior y confirma para crear el pedido del cliente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 