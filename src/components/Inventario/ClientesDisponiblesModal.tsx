import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Package, Users, AlertCircle, Hash, Building, Calendar, Scale, Link } from 'lucide-react';
import { useTarimaAsignacion } from '@/hooks/Inventario/useTarimaAsignacion';
import { PedidosClienteService } from '@/services/pedidosCliente.service';
import { InventarioService } from '@/services/inventario.service';
import { toast } from 'sonner';
import type { InventarioTipoDTO } from '@/types/Inventario/inventario.types';
import type { PedidoClienteResponseDTO } from '@/types/PedidoCliente/pedidoCliente.types';

interface ClientesDisponiblesModalProps {
  tarimasSeleccionadas: InventarioTipoDTO[];
  isOpen: boolean;
  onClose: () => void;
  onAsignacionExitosa?: (pedidoAsignado: { id: number; cliente: string; sucursal: string }, tarimasAsignadas: InventarioTipoDTO[]) => void;
}

export const ClientesDisponiblesModal = ({ 
  tarimasSeleccionadas, 
  isOpen, 
  onClose,
  onAsignacionExitosa
}: ClientesDisponiblesModalProps) => {
  const { obtenerClientesDisponibles, clientesDisponibles, isLoading, error } = useTarimaAsignacion();
  const [clientesCargados, setClientesCargados] = useState(false);
  const [isAsignando, setIsAsignando] = useState(false);

  /**
   * Obtiene el ID del producto desde la tarima
   */
  const obtenerIdProducto = (tarima: InventarioTipoDTO): number => {
    const clasificaciones = tarima.tarimaOriginal.tarimasClasificaciones;
    const primeraClasificacion = clasificaciones[0];
    
    // Buscar el primer producto en la primera clasificación
    const primerProducto = primeraClasificacion?.productos?.[0];
    const idProducto = primerProducto?.id;
    
    return idProducto || 0;
  };

  /**
   * Convierte las tarimas seleccionadas al formato requerido por el servicio
   */
  const convertirTarimasParaServicio = (tarimas: InventarioTipoDTO[]) => {
    const resultado = tarimas.map(tarima => {
      const primeraClasificacion = tarima.tarimaOriginal.tarimasClasificaciones[0];
      const cantidad = primeraClasificacion?.cantidad || 0;
      
      return {
        idTarima: tarima.tarimaOriginal.id,
        idProducto: obtenerIdProducto(tarima),
        tipo: tarima.tipo,
        cantidad: cantidad
      };
    });
    
    // Debug temporal
    console.log('Request payload:', resultado);
    
    return resultado;
  };

  /**
   * Busca automáticamente los clientes disponibles cuando se abre el modal
   */
  const buscarClientesDisponibles = async () => {
    try {
      setClientesCargados(false);
      const tarimasRequest = convertirTarimasParaServicio(tarimasSeleccionadas);
      await obtenerClientesDisponibles(tarimasRequest);
      setClientesCargados(true);
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      setClientesCargados(false);
    }
  };

  /**
   * Efecto para buscar clientes automáticamente cuando se abre el modal
   */
  useEffect(() => {
    if (isOpen && tarimasSeleccionadas.length > 0) {
      buscarClientesDisponibles();
    }
  }, [isOpen, tarimasSeleccionadas]);

  /**
   * Maneja la asignación de tarimas a un pedido específico
   */
  const handleAsignarTarimas = async (idPedido: number) => {
    try {
      setIsAsignando(true);
      
      // Obtener los IDs de las tarimas seleccionadas
      const idsTarimas = tarimasSeleccionadas.map(tarima => tarima.tarimaOriginal.id);
      
      // Llamar al servicio para asignar las tarimas
      const resultado = await PedidosClienteService.asignarTarimasPedidoCliente(idPedido, idsTarimas);
      
      // Mostrar mensaje de éxito
      toast.success(`Tarimas asignadas correctamente al pedido #${idPedido}`);
      
      // Invalidar cache del inventario para que la próxima carga de datos sea fresca
      InventarioService.invalidarCache();
      
      // Notificar a la página padre con la información del pedido asignado
      if (onAsignacionExitosa) {
        const pedidoAsignado = {
          id: idPedido,
          cliente: resultado.cliente,
          sucursal: resultado.sucursal
        };
        onAsignacionExitosa(pedidoAsignado, tarimasSeleccionadas);
      }
      
      // Cerrar el modal
      onClose();
      
    } catch (error) {
      console.error('Error al asignar tarimas:', error);
      toast.error('Error al asignar las tarimas al pedido');
    } finally {
      setIsAsignando(false);
    }
  };

  /**
   * Obtiene el color del badge según el estatus
   */
  const getEstatusBadge = (estatus: string) => {
    const estatusColors: Record<string, string> = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'En Proceso': 'bg-blue-100 text-blue-800 border-blue-200',
      'Completada': 'bg-green-100 text-green-800 border-green-200',
      'Asignada': 'bg-purple-100 text-purple-800 border-purple-200',
      'Sin Asignar': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    const colorClass = estatusColors[estatus] || 'bg-gray-100 text-gray-800 border-gray-200';
    return <Badge variant="outline" className={`${colorClass} text-xs font-medium`}>{estatus}</Badge>;
  };

  /**
   * Obtiene el color del badge según el porcentaje de surtido
   */
  const getPorcentajeBadge = (porcentaje: number) => {
    let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
    if (porcentaje >= 80) colorClass = 'bg-green-100 text-green-800 border-green-200';
    else if (porcentaje >= 50) colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    else colorClass = 'bg-red-100 text-red-800 border-red-200';
    
    return <Badge variant="outline" className={`${colorClass} text-xs font-medium`}>{porcentaje}%</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold">Pedidos Disponibles para Asignación</div>
              <div className="text-sm font-normal text-gray-500 mt-1">
                Buscando pedidos que puedan recibir las tarimas seleccionadas...
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Resumen de tarimas seleccionadas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">Tarimas Seleccionadas</h4>
              <Badge variant="secondary" className="text-xs">
                {tarimasSeleccionadas.length} tarima{tarimasSeleccionadas.length !== 1 ? 's' : ''}
              </Badge>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tarimasSeleccionadas.map((tarima) => (
                <div key={tarima.codigo} className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-100 rounded-md">
                      <Hash className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">
                        {tarima.codigo}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600 font-medium">{tarima.tipo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Scale className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {tarima.pesoTotalPorTipo.toLocaleString('es-MX', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })} kg
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estado de carga inicial */}
          {isLoading && !clientesCargados && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <div className="text-center">
                                      <p className="text-sm font-medium text-gray-900">Buscando pedidos disponibles...</p>
                  <p className="text-xs text-gray-500 mt-1">Analizando tarimas y pedidos pendientes</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resultados de clientes */}
          {clientesCargados && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">Pedidos Disponibles</h4>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  {clientesDisponibles.length} encontrado{clientesDisponibles.length !== 1 ? 's' : ''}
                </Badge>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              
              {error ? (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">
                    Error al obtener clientes disponibles: {error}
                  </AlertDescription>
                </Alert>
              ) : clientesDisponibles.length === 0 ? (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    No se encontraron pedidos disponibles para las tarimas seleccionadas.
                    <br />
                    <span className="text-sm">Verifica que las tarimas contengan productos que coincidan con pedidos pendientes.</span>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-16 font-semibold text-gray-700">ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
                        <TableHead className="font-semibold text-gray-700">Sucursal</TableHead>
                        <TableHead className="font-semibold text-gray-700">Estatus</TableHead>
                                                 <TableHead className="text-center font-semibold text-gray-700">% Surtido</TableHead>
                         <TableHead className="text-center font-semibold text-gray-700">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientesDisponibles.map((cliente) => (
                        <TableRow key={cliente.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                          <TableCell className="font-semibold text-gray-900">
                            #{cliente.id}
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            {cliente.cliente}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            <div className="flex items-center gap-1">
                              <Building className="h-3 w-3 text-gray-500" />
                              {cliente.sucursal}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getEstatusBadge(cliente.estatus)}
                          </TableCell>
                                                     <TableCell className="text-center">
                             {getPorcentajeBadge(cliente.porcentajeSurtido)}
                           </TableCell>
                           <TableCell className="text-center">
                             <TooltipProvider>
                               <Tooltip>
                                 <TooltipTrigger asChild>
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => handleAsignarTarimas(cliente.id)}
                                     disabled={isAsignando}
                                     className="h-8 px-3 text-sm bg-blue-600 hover:bg-blue-700 text-white border-blue-600 disabled:opacity-50"
                                   >
                                     {isAsignando ? (
                                       <>
                                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                         Asignando...
                                       </>
                                     ) : (
                                       <>
                                         <Link className="mr-2 h-4 w-4" />
                                         Asignar
                                       </>
                                     )}
                                   </Button>
                                 </TooltipTrigger>
                                 <TooltipContent>
                                   <p>Asignar tarimas seleccionadas a este pedido</p>
                                 </TooltipContent>
                               </Tooltip>
                             </TooltipProvider>
                           </TableCell>
                         </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {/* Skeleton loading para la tabla durante recargas */}
          {isLoading && clientesCargados && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 space-y-3">
                                     {[...Array(5)].map((_, i) => (
                     <div key={i} className="flex items-center gap-4">
                       <Skeleton className="h-4 w-12" />
                       <Skeleton className="h-4 w-32" />
                       <Skeleton className="h-4 w-24" />
                       <Skeleton className="h-6 w-20" />
                       <Skeleton className="h-6 w-16" />
                       <Skeleton className="h-8 w-20" />
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
