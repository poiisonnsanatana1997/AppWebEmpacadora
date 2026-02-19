import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Package,
  FileText,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { type InformacionBasicaData, type OrdenData } from '@/schemas/pedidoClienteWizardSchema';
import { ClienteDTO } from '@/types/Cliente/cliente.types';
import { ProductoDto } from '@/types/Productos/productos.types';
import { motion } from 'motion/react';

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
    <motion.div
      className="space-y-3 sm:space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Información del Cliente y Sucursal */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-4 w-4 text-gray-600 flex-shrink-0" strokeWidth={2} />
          <h3 className="text-sm font-semibold text-gray-900 truncate">Información del Cliente</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <h4 className="font-medium text-xs text-gray-500 mb-1">Cliente</h4>
            <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
              {cliente?.razonSocial || 'Cliente no encontrado'}
            </p>
            {cliente?.nombre && (
              <p className="text-xs sm:text-sm text-gray-500 break-words">{cliente.nombre}</p>
            )}
          </div>
          <div>
            <h4 className="font-medium text-xs text-gray-500 mb-1">Sucursal</h4>
            <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
              {sucursal?.nombre || 'Sucursal no encontrada'}
            </p>
            {sucursal?.direccion && (
              <p className="text-xs sm:text-sm text-gray-500 break-words">{sucursal.direccion}</p>
            )}
          </div>
        </div>
      </div>

      {/* Detalles del Pedido */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-gray-600 flex-shrink-0" strokeWidth={2} />
          <h3 className="text-sm font-semibold text-gray-900">Detalles del Pedido</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <h4 className="font-medium text-xs text-gray-500 mb-1">Estatus</h4>
              <Badge className={getEstatusColor(informacion.estatus)}>
                {informacion.estatus}
              </Badge>
            </div>

            {informacion.fechaEmbarque && (
              <div>
                <h4 className="font-medium text-xs text-gray-500 mb-1">Fecha de Embarque</h4>
                <p className="text-sm sm:text-base text-gray-900 break-words">
                  {format(new Date(informacion.fechaEmbarque), "d 'de' MMMM 'de' yyyy")}
                </p>
              </div>
            )}
          </div>

          {informacion.observaciones && (
            <div>
              <h4 className="font-medium text-xs text-gray-500 mb-1">Observaciones</h4>
              <p className="text-sm sm:text-base text-gray-900 break-words leading-relaxed">
                {informacion.observaciones}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resumen de Órdenes */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="h-4 w-4 text-gray-600 flex-shrink-0" strokeWidth={2} />
          <h3 className="text-sm font-semibold text-gray-900">Resumen de Órdenes</h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {/* Totales */}
          <div className="grid grid-cols-3 sm:gap-3 gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <h4 className="font-medium text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 leading-tight">
                Total<br className="sm:hidden" /> Órdenes
              </h4>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900" aria-live="polite">
                {ordenes.length}
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 leading-tight">
                Total<br className="sm:hidden" /> Cajas
              </h4>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900" aria-live="polite">
                {totales.cantidad}
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 leading-tight">
                Total<br className="sm:hidden" /> Peso
              </h4>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900" aria-live="polite">
                {totales.peso.toFixed(2)}<span className="text-xs sm:text-sm font-normal ml-0.5">kg</span>
              </p>
            </div>
          </div>

          {/* Lista de órdenes */}
          <div className="space-y-2">
            <h4 className="font-medium text-xs sm:text-sm text-gray-900">
              Órdenes Agregadas ({ordenes.length}):
            </h4>
            {ordenes.map((orden, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-2.5 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Badge className={getTipoColor(orden.tipo)} aria-label={`Tipo ${orden.tipo}`}>
                    {orden.tipo}
                  </Badge>
                  <span className="font-medium text-xs sm:text-sm text-gray-900 break-words flex-1">
                    {getProductoNombre(orden.idProducto)}
                  </span>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-500 ml-1">
                  {orden.cantidad && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Cajas:</span>
                      <span>{orden.cantidad}</span>
                    </span>
                  )}
                  {orden.peso && (
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Peso:</span>
                      <span>{orden.peso} kg</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmación */}
      <div className="bg-white border border-gray-200 border-l-4 border-l-green-500 rounded-lg p-3 sm:p-4">
        <div className="flex items-start sm:items-center gap-2 sm:gap-3">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" strokeWidth={2} />
          <div className="flex-1">
            <h4 className="font-semibold text-xs sm:text-sm text-gray-900">Pedido Listo para Crear</h4>
            <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 leading-relaxed">
              Revisa la información anterior y confirma para crear el pedido del cliente.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 