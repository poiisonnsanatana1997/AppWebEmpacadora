import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, X, Filter, Search, Loader2, AlertCircle, Package, Calendar, Scale, MapPin, Building2, ChevronRight } from 'lucide-react';
import { useTarimasParciales } from '../../hooks/Clasificacion/useTarimasParciales';
import { useDisponibilidadCajas } from '../../hooks/Clasificacion/useDisponibilidadCajas';
import { TarimaParcialCompletaDTO } from '../../types/Tarimas/tarima.types';
import { AgregarCantidadForm } from './AgregarCantidadForm';
import { toast } from 'sonner';

interface TarimasParcialesModalProps {
  open: boolean;
  onClose: () => void;
  clasificacionId: number;
  clasificaciones: any[];
  onValidate: (cantidad: number) => { isValid: boolean; message: string };
  onSuccess?: () => void;
}

const TIPO_OPTIONS = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'XL', label: 'XL' },
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'S', label: 'S' },
];

export const TarimasParcialesModal: React.FC<TarimasParcialesModalProps> = ({ open, onClose, clasificacionId, clasificaciones, onValidate, onSuccess }) => {
  const {
    tarimasParciales,
    tarimasFiltradas,
    tarimaSeleccionada,
    loading,
    saving,
    searchTerm,
    filterTipo,
    setSearchTerm,
    setFilterTipo,
    seleccionarTarima,
    limpiarSeleccion,
    cargarTarimasParciales,
    limpiarFiltros,
  } = useTarimasParciales();

  const [view, setView] = useState<'list' | 'detail'>('list');

  // Verificar si la tarima tiene pedido asociado
  const tarimaTienePedido = tarimaSeleccionada?.pedidoTarimas?.length > 0;

  // Hook para obtener disponibilidad de cajas (solo si tiene pedido asociado)
  const { disponibilidad, loading: loadingDisponibilidad } = useDisponibilidadCajas({
    idPedido: tarimaTienePedido ? tarimaSeleccionada?.pedidoTarimas?.[0]?.idPedidoCliente : undefined,
    tipo: tarimaSeleccionada?.tarimasClasificaciones?.[0]?.tipo,
    idProducto: clasificaciones?.[0]?.idProducto,
    enabled: !!tarimaSeleccionada && view === 'detail' && tarimaTienePedido
  });

  // Funciones de cálculo para cantidad y peso total desde las relaciones
  const calcularCantidadTotal = useCallback((tarima: TarimaParcialCompletaDTO): number => {
    // Sumamos las cantidades de todas las clasificaciones
    return tarima.tarimasClasificaciones?.reduce((total, tc) => {
      return total + (tc.cantidad || 0);
    }, 0) || 0;
  }, []);

  const calcularPesoTotal = useCallback((tarima: TarimaParcialCompletaDTO): number => {
    // Sumamos los pesos de todas las clasificaciones
    return tarima.tarimasClasificaciones?.reduce((total, tc) => {
      return total + (tc.peso || 0);
    }, 0) || 0;
  }, []);

  // Cargar tarimas parciales cuando el modal se abre
  useEffect(() => {
    if (open) {
      cargarTarimasParciales();
      limpiarFiltros();
    }
  }, [open]); // Solo depende de 'open' para evitar múltiples ejecuciones

  const handleClose = () => {
    setView('list');
    limpiarSeleccion();
    onClose();
  };

  const handleSelectTarima = (tarima: TarimaParcialCompletaDTO) => {
    seleccionarTarima(tarima);
    setView('detail');
  };

  const handleBackToList = () => {
    setView('list');
    limpiarSeleccion();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatWeight = (weight: number) => `${weight.toFixed(2)} kg`;

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'XL': return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white';
      case 'L': return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white';
      case 'M': return 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white';
      case 'S': return 'bg-gradient-to-br from-red-500 to-red-600 text-white';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600 text-white';
    }
  };

  // Suma de cantidades ya gestionadas
  const cantidadYaGestionada = tarimasParciales.reduce((acc, t) => acc + calcularCantidadTotal(t), 0);

  // Función de validación de disponibilidad de cajas
  const validarCantidadDisponible = (cantidad: number) => {
    if (!disponibilidad) return { isValid: true, message: '' };
    
    if (cantidad > disponibilidad.cantidad) {
      return {
        isValid: false,
        message: `La cantidad (${cantidad}) excede las cajas disponibles del pedido (${disponibilidad.cantidad} cajas)`
      };
    }
    
    return { isValid: true, message: '' };
  };

  // Función de validación combinada
  const onValidateCantidadTarimaParcial = (cantidadAAgregar: number) => {
    // 1. Validación de clasificación (siempre se aplica)
    const validationClasificacion = onValidate(cantidadAAgregar);
    if (!validationClasificacion.isValid) return validationClasificacion;
    
    // 2. Validación de pedido (solo si tiene pedido asociado)
    if (tarimaTienePedido && disponibilidad) {
      const validationDisponibilidad = validarCantidadDisponible(cantidadAAgregar);
      if (!validationDisponibilidad.isValid) return validationDisponibilidad;
    }
    
    return { isValid: true, message: '' };
  };

  const handleSuccess = () => {
    // Recargar tarimas parciales y cerrar modal
    cargarTarimasParciales();
    // Llamar al callback para actualizar los datos de la clasificación principal
    onSuccess?.();
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] p-0 bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
        {/* Header moderno */}
        <DialogHeader className="px-8 py-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Gestionar Tarimas Parciales
                </DialogTitle>
                <p className="text-slate-300 mt-1">Selecciona una tarima para gestionar su contenido</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                {tarimasFiltradas.length} tarimas
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-10 w-10 rounded-full hover:bg-white/10 text-white"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                     {/* Barra de búsqueda compacta */}
           {view === 'list' && (
             <div className="px-8 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
               <div className="flex items-center gap-4">
                 <div className="relative flex-1 max-w-md">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                   <Input
                     placeholder="Buscar por código, lote, cliente..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-10 h-10 rounded-lg border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     aria-label="Buscar tarima parcial"
                   />
                 </div>
                 <div className="flex items-center gap-2">
                   <Filter className="h-4 w-4 text-gray-500" />
                   <Select value={filterTipo} onValueChange={setFilterTipo}>
                     <SelectTrigger className="w-40 h-10 rounded-lg border-gray-200">
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       {TIPO_OPTIONS.map((option) => (
                         <SelectItem key={option.value} value={option.value} className="text-sm">
                           {option.label}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
                   <Package className="h-4 w-4 text-blue-600" />
                   <span className="text-sm font-medium text-blue-700">
                     {tarimasFiltradas.length} tarimas
                   </span>
                 </div>
               </div>
             </div>
           )}

                     {/* Contenido principal */}
           <div className="p-6">
            {/* Vista de lista con tarjetas */}
            {view === 'list' && (
              <div className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                    <span className="text-gray-500 font-medium">Cargando tarimas parciales...</span>
                  </div>
                ) : tarimasFiltradas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Package className="h-16 w-16 text-gray-300 mb-4" />
                    <span className="text-gray-400 font-medium">No se encontraron tarimas parciales</span>
                  </div>
                ) : (
                                     <div className="space-y-3">
                     {tarimasFiltradas.map((tarima) => {
                       const tarimaCompleta = tarimasParciales.find(t => t.id === tarima.id);
                       return (
                         <div
                           key={tarima.id}
                           className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                           onClick={() => {
                             if (tarimaCompleta) {
                               handleSelectTarima(tarimaCompleta);
                             }
                           }}
                         >
                           <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4 flex-1 min-w-0">
                               <div className="flex items-center gap-2">
                                 <Badge className={`${getTipoColor(tarima.tipo)} text-xs px-2 py-1 font-bold shadow-sm`}>
                                   {tarima.tipo}
                                 </Badge>
                                 <div className="text-lg font-bold text-gray-900">
                                   {tarimaCompleta ? calcularCantidadTotal(tarimaCompleta) : tarima.cantidad}
                                 </div>
                               </div>
                               
                               <div className="flex items-center gap-6 flex-1 min-w-0">
                                 <div className="flex items-center gap-2 min-w-0 flex-1">
                                   <Package className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                   <span className="font-medium text-gray-900 truncate" title={tarima.codigo}>
                                     {tarima.codigo}
                                   </span>
                                 </div>
                                 
                                 <div className="flex items-center gap-2 min-w-0 flex-1">
                                   <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                   <span className="text-gray-700 truncate" title={tarima.cliente}>
                                     {tarima.cliente}
                                   </span>
                                 </div>
                                 
                                 <div className="flex items-center gap-2 min-w-0 flex-1">
                                   <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                   <span className="text-gray-700 truncate" title={tarima.sucursal}>
                                     {tarima.sucursal}
                                   </span>
                                 </div>
                                 
                                 <div className="flex items-center gap-2 min-w-0 flex-1">
                                   <Package className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                   <span className="text-gray-700 truncate" title={tarima.lote}>
                                     {tarima.lote}
                                   </span>
                                 </div>
                                 
                                 <div className="flex items-center gap-2">
                                   <Scale className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                   <span className="font-semibold text-gray-900 whitespace-nowrap">
                                     {formatWeight(tarimaCompleta ? calcularPesoTotal(tarimaCompleta) : tarima.peso)}
                                   </span>
                                 </div>
                                 
                                 <div className="flex items-center gap-2">
                                   <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                   <span className="text-gray-700 whitespace-nowrap">{formatDate(tarima.fechaRegistro)}</span>
                                 </div>
                               </div>
                             </div>
                             
                             <div className="flex items-center gap-2 ml-4">
                               <Button
                                 className="opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md transition-all duration-200"
                                 size="sm"
                               >
                                 <Plus className="h-4 w-4 mr-1" />
                                 Gestionar
                               </Button>
                               <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                             </div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                )}
              </div>
            )}

                         {/* Vista de detalle compacta */}
             {view === 'detail' && tarimaSeleccionada && (
               <div className="space-y-4">
                 <Button
                   variant="ghost"
                   onClick={handleBackToList}
                   className="mb-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm"
                 >
                   ← Volver a la lista
                 </Button>

                 {/* Información de la tarima compacta */}
                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
                       <Package className="h-5 w-5 text-white" />
                     </div>
                     <div>
                       <h2 className="text-xl font-bold text-gray-900">{tarimaSeleccionada.codigo}</h2>
                       <p className="text-sm text-gray-600">Detalles de la tarima parcial</p>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                     <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-sm">
                       <div className="flex items-center gap-2 mb-1">
                         <div className="p-1 bg-blue-500 rounded">
                           <Package className="h-3 w-3 text-white" />
                         </div>
                         <span className="text-xs font-medium text-blue-700">Lote</span>
                       </div>
                       <div className="font-semibold text-sm text-gray-900">{tarimaSeleccionada.tarimasClasificaciones[0]?.lote || '-'}</div>
                     </div>
                     
                     <div className="bg-white rounded-lg p-3 border border-emerald-100 shadow-sm">
                       <div className="flex items-center gap-2 mb-1">
                         <Badge className={`${getTipoColor(tarimaSeleccionada.tarimasClasificaciones[0]?.tipo)} text-xs px-1 py-0.5`}>
                           {tarimaSeleccionada.tarimasClasificaciones[0]?.tipo}
                         </Badge>
                         <span className="text-xs font-medium text-emerald-700">Tipo</span>
                       </div>
                       <div className="font-semibold text-sm text-gray-900">{tarimaSeleccionada.tarimasClasificaciones[0]?.tipo}</div>
                     </div>
                     
                     <div className="bg-white rounded-lg p-3 border border-purple-100 shadow-sm">
                       <div className="flex items-center gap-2 mb-1">
                         <div className="p-1 bg-purple-500 rounded">
                           <Building2 className="h-3 w-3 text-white" />
                         </div>
                         <span className="text-xs font-medium text-purple-700">Cliente</span>
                       </div>
                       <div className="font-semibold text-sm text-gray-900 truncate" title={tarimaSeleccionada.pedidoTarimas[0]?.nombreCliente || '-'}>
                         {tarimaSeleccionada.pedidoTarimas[0]?.nombreCliente || '-'}
                       </div>
                     </div>
                     
                     <div className="bg-white rounded-lg p-3 border border-orange-100 shadow-sm">
                       <div className="flex items-center gap-2 mb-1">
                         <div className="p-1 bg-orange-500 rounded">
                           <MapPin className="h-3 w-3 text-white" />
                         </div>
                         <span className="text-xs font-medium text-orange-700">Sucursal</span>
                       </div>
                       <div className="font-semibold text-sm text-gray-900 truncate" title={tarimaSeleccionada.pedidoTarimas[0]?.nombreSucursal || '-'}>
                         {tarimaSeleccionada.pedidoTarimas[0]?.nombreSucursal || '-'}
                       </div>
                     </div>
                   </div>
                 </div>

                                 {/* Información de disponibilidad compacta */}
                 {tarimaTienePedido ? (
                   loadingDisponibilidad ? (
                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                       <div className="flex items-center gap-2">
                         <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                         <span className="text-sm text-blue-700 font-medium">Verificando disponibilidad del pedido...</span>
                       </div>
                     </div>
                   ) : disponibilidad ? (
                     <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                       <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2 text-sm">
                         <div className="p-1 bg-green-500 rounded">
                           <Package className="h-3 w-3 text-white" />
                         </div>
                         Disponibilidad del Pedido
                       </h4>
                       <div className="grid grid-cols-2 gap-3 text-sm">
                         <div className="bg-white rounded-lg p-3 border border-green-100">
                           <span className="text-green-600 font-medium text-xs">Cajas por surtir:</span>
                           <div className="font-bold text-green-700 text-base">{disponibilidad.cantidad}</div>
                         </div>
                         <div className="bg-white rounded-lg p-3 border border-green-100">
                           <span className="text-green-600 font-medium text-xs">Peso por Caja:</span>
                           <div className="font-bold text-green-700 text-base">{disponibilidad.pesoCajaCliente} kg</div>
                         </div>
                       </div>
                       <div className="mt-4 pt-3 border-t border-green-200 text-xs text-green-700 space-y-1">
                         <div><strong>Producto:</strong> {disponibilidad.producto.nombre}</div>
                         <div><strong>Código:</strong> {disponibilidad.producto.codigo || 'N/A'}</div>
                         <div><strong>Variedad:</strong> {disponibilidad.producto.variedad || 'N/A'}</div>
                       </div>
                     </div>
                   ) : (
                     <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
                       <div className="flex items-center gap-2">
                         <AlertCircle className="h-4 w-4 text-yellow-600" />
                         <span className="text-sm text-yellow-700 font-medium">No se pudo obtener la disponibilidad del pedido</span>
                       </div>
                     </div>
                   )
                 ) : (
                   <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
                     <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                       <div className="p-1 bg-gray-500 rounded">
                         <Package className="h-3 w-3 text-white" />
                       </div>
                       Tarima Sin Pedido Asociado
                     </h4>
                     <div className="text-sm text-gray-600">
                       Esta tarima no está asociada a ningún pedido de cliente
                     </div>
                   </div>
                 )}

                <AgregarCantidadForm
                  onSuccess={handleSuccess}
                  onCancel={handleBackToList}
                  tarimaActual={tarimaSeleccionada as any}
                  clasificacionId={clasificacionId}
                  onValidate={onValidateCantidadTarimaParcial}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 