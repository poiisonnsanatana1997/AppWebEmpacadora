import React from 'react';
import { PedidoClientePorAsignarDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react';
import { usePedidosClienteDisponibles } from '@/hooks/Clasificacion/usePedidosClienteDisponibles';
import { Badge } from '../ui/badge';

interface SelectorPedidosProps {
  tipo?: string;
  idProducto?: number;
  value?: number;
  onValueChange: (value: number) => void;
  onPedidoSelect?: (pedido: PedidoClientePorAsignarDTO | null) => void;
  disabled?: boolean;
  className?: string;
}

export const SelectorPedidos: React.FC<SelectorPedidosProps> = ({
  tipo,
  idProducto,
  value,
  onValueChange,
  onPedidoSelect,
  disabled = false,
  className = ''
}) => {
  const {
    pedidosCliente,
    loading,
    error
  } = usePedidosClienteDisponibles({
    tipo,
    idProducto,
    enabled: !!tipo && !disabled
  });

  const handleValueChange = (newValue: string) => {
    const pedidoId = parseInt(newValue);
    if (!isNaN(pedidoId)) {
      onValueChange(pedidoId);
      
      // Notificar al componente padre sobre el pedido seleccionado
      if (onPedidoSelect) {
        if (pedidoId === 0) {
          onPedidoSelect(null);
        } else {
          const pedidoSeleccionado = pedidosCliente.find(p => p.id === pedidoId);
          onPedidoSelect(pedidoSeleccionado || null);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Pedido Cliente
        </Label>
        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Cargando pedidos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Pedido Cliente
        </Label>
        <div className="flex items-center gap-2 p-3 border rounded-md bg-destructive/10 border-destructive/20">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">Error al cargar pedidos</span>
        </div>
      </div>
    );
  }

  if (!tipo) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Pedido Cliente
        </Label>
        <div className="p-3 border rounded-md bg-muted">
          <span className="text-sm text-muted-foreground">Seleccione un tipo primero</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        Pedido Cliente
        {pedidosCliente.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {pedidosCliente.length} disponible{pedidosCliente.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </Label>
      
             <Select
         value={value && value > 0 ? value.toString() : '0'}
         onValueChange={handleValueChange}
         disabled={disabled || pedidosCliente.length === 0}
       >
         <SelectTrigger className="w-full">
           <SelectValue>
             {(() => {
               if (value && value > 0) {
                 const pedidoSeleccionado = pedidosCliente.find(p => p.id === value);
                 if (pedidoSeleccionado) {
                   return (
                     <div className="flex flex-col items-start">
                       <span className="font-medium">Pedido #{pedidoSeleccionado.id}</span>
                       <span className="text-xs text-muted-foreground">
                         {pedidoSeleccionado.cliente.razonSocial} • {pedidoSeleccionado.producto.nombre}
                       </span>
                     </div>
                   );
                 }
               }
               return pedidosCliente.length === 0 
                 ? "No hay pedidos disponibles" 
                 : "Seleccionar pedido cliente";
             })()}
           </SelectValue>
         </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">
            <div className="flex flex-col">
              <span className="font-medium text-sm">Sin asignar</span>
              <span className="text-xs text-muted-foreground">No asignar a ningún pedido</span>
            </div>
          </SelectItem>
          {pedidosCliente.map((pedido) => (
            <SelectItem 
              key={pedido.id} 
              value={pedido.id.toString()}
              className="flex flex-col items-start"
            >
                             <div className="flex flex-col w-full">
                 <div className="flex items-center justify-between w-full">
                   <span className="font-medium text-sm">Pedido #{pedido.id}</span>
                   <span className="text-xs text-muted-foreground">
                     {pedido.cantidad} cajas • {pedido.pesoCajaCliente} kg/caja
                   </span>
                 </div>
                 <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                   <div><strong>Cliente:</strong> {pedido.cliente.razonSocial}</div>
                   <div><strong>Sucursal:</strong> {pedido.sucursal.nombre}</div>
                   <div><strong>Producto:</strong> {pedido.producto.nombre}</div>
                   <div><strong>Código:</strong> {pedido.producto.codigo} • <strong>Variedad:</strong> {pedido.producto.variedad}</div>
                 </div>
               </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {pedidosCliente.length === 0 && tipo && (
        <p className="text-xs text-muted-foreground">
          No se encontraron pedidos disponibles para el tipo "{tipo}" 
          {idProducto && ` y producto seleccionado`}
        </p>
      )}
    </div>
  );
}; 