import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { 
  Package, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Hash
} from 'lucide-react';
import type { PedidoClienteProgresoDTO } from '@/types/PedidoCliente/pedidoCliente.types';

interface ResumenProgresoProps {
  progreso: PedidoClienteProgresoDTO;
}

export const ResumenProgreso: React.FC<ResumenProgresoProps> = ({ progreso }) => {
  const getProgressIcon = (porcentaje: number) => {
    if (porcentaje >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (porcentaje >= 70) return <TrendingUp className="h-5 w-5 text-blue-600" />;
    if (porcentaje >= 50) return <Clock className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  // Calcular estadísticas básicas
  const totalCantidadRequerida = progreso.ordenes.reduce((sum, orden) => sum + (orden.cantidad || 0), 0);
  const totalCantidadAsignada = progreso.tarimas.reduce((sum, tarima) => {
    return sum + tarima.tarimasClasificaciones.reduce((sumClas, clas) => sumClas + (clas.cantidad || 0), 0);
  }, 0);
  const totalCantidadFaltante = Math.max(0, totalCantidadRequerida - totalCantidadAsignada);
  
  // Usar el porcentaje que viene del backend, o calcularlo como fallback
  const porcentajeCumplimiento = progreso.porcentajeSurtido ?? (
    totalCantidadRequerida > 0 
      ? Math.round((totalCantidadAsignada / totalCantidadRequerida) * 100) 
      : 100
  );





  return (
    <div className="space-y-6">
      

      {/* Grid de métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Porcentaje de Surtido */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Porcentaje de Surtido</CardTitle>
          {getProgressIcon(porcentajeCumplimiento)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progreso.porcentajeSurtido ?? porcentajeCumplimiento}%</div>
          <Progress 
            value={typeof porcentajeCumplimiento === 'number' ? porcentajeCumplimiento : parseFloat(porcentajeCumplimiento)} 
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Cajas por Surtir */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cajas por Surtir</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{totalCantidadFaltante.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Pendientes de asignar
          </p>
        </CardContent>
      </Card>

      {/* Cajas Surtidas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cajas Surtidas</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalCantidadAsignada.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Ya asignadas
          </p>
        </CardContent>
      </Card>

      {/* Tarimas Asignadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tarimas Asignadas</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{progreso.tarimas.length}</div>
          <p className="text-xs text-muted-foreground">
            Tarimas en el pedido
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}; 