import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, X, Filter, Search, Loader2, AlertCircle } from 'lucide-react';
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
      case 'XL': return 'bg-purple-100 text-purple-800';
      case 'L': return 'bg-blue-100 text-blue-800';
      case 'M': return 'bg-green-100 text-green-800';
      case 'S': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <DialogContent className="sm:max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[1200px] h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            Gestionar Tarimas Parciales
            <Badge variant="outline" className="text-xs px-2 py-0.5">{tarimasFiltradas.length} tarimas</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
            {/* Barra de búsqueda y filtro */}
            {view === 'list' && (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 mt-2">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por código, lote, cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-sm h-9 rounded-md border-gray-200 w-full"
                      aria-label="Buscar tarima parcial"
                    />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={filterTipo} onValueChange={setFilterTipo}>
                      <SelectTrigger className="w-44 h-9 text-sm rounded-md border-gray-200">
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
                </div>
                <div className="text-sm text-gray-500">
                  Total de tarimas: <span className="font-medium text-gray-900">{tarimasFiltradas.length}</span>
                </div>
              </div>
            )}
            {/* Tabla de tarimas */}
            {view === 'list' && (
              <div className="w-full overflow-x-auto rounded-md border border-gray-100 bg-white">
                <table className="w-full text-sm border-separate border-spacing-0 min-w-[900px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center whitespace-nowrap">Acciones</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center whitespace-nowrap">Cantidad</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Código</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Tipo</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Lote</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Cliente</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-left whitespace-nowrap">Sucursal</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center whitespace-nowrap">Peso</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 text-center whitespace-nowrap">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-gray-500">Cargando tarimas parciales...</td>
                      </tr>
                    ) : tarimasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-gray-400">No se encontraron tarimas parciales</td>
                      </tr>
                    ) : (
                      tarimasFiltradas.map((tarima) => {
                        const tarimaCompleta = tarimasParciales.find(t => t.id === tarima.id);
                        return (
                          <tr key={tarima.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              <Button
                                onClick={() => {
                                  if (tarimaCompleta) {
                                    handleSelectTarima(tarimaCompleta);
                                  }
                                }}
                                className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-colors duration-200 rounded-md w-9 h-9 flex items-center justify-center"
                                aria-label="Gestionar tarima"
                                tabIndex={0}
                              >
                                <Plus className="h-5 w-5" />
                              </Button>
                            </td>
                            <td className="px-4 py-3 text-center whitespace-nowrap font-medium">{tarimaCompleta ? calcularCantidadTotal(tarimaCompleta) : tarima.cantidad}</td>
                            <td className="px-4 py-3 font-medium whitespace-nowrap max-w-[150px] truncate" title={tarima.codigo}>{tarima.codigo}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Badge className={`${getTipoColor(tarima.tipo)} text-sm px-3 py-1`}>{tarima.tipo}</Badge>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap max-w-[150px] truncate" title={tarima.lote}>{tarima.lote}</td>
                            <td className="px-4 py-3 whitespace-nowrap max-w-[180px] truncate" title={tarima.cliente}>{tarima.cliente}</td>
                            <td className="px-4 py-3 whitespace-nowrap max-w-[150px] truncate" title={tarima.sucursal}>{tarima.sucursal}</td>
                            <td className="px-4 py-3 text-center whitespace-nowrap font-medium">{formatWeight(tarimaCompleta ? calcularPesoTotal(tarimaCompleta) : tarima.peso)}</td>
                            <td className="px-4 py-3 text-center whitespace-nowrap">{formatDate(tarima.fechaRegistro)}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
            {/* Vista de detalle y gestión */}
            {view === 'detail' && tarimaSeleccionada && (
              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="mb-4 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md transition-colors duration-200"
                  aria-label="Volver a la lista"
                  tabIndex={0}
                >
                  ← Volver a la lista
                </Button>
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <div className="text-xl font-semibold text-gray-800 mb-4">{tarimaSeleccionada.codigo}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <span className="text-gray-500">Lote</span>
                      <div className="font-medium text-gray-900">{tarimaSeleccionada.tarimasClasificaciones[0]?.lote || '-'}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500">Tipo</span>
                      <div>
                        <Badge className={`${getTipoColor(tarimaSeleccionada.tarimasClasificaciones[0]?.tipo)} text-sm px-3 py-1`}>
                          {tarimaSeleccionada.tarimasClasificaciones[0]?.tipo}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500">Cliente</span>
                      <div className="font-medium text-gray-900">{tarimaSeleccionada.pedidoTarimas[0]?.nombreCliente || '-'}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500">Sucursal</span>
                      <div className="font-medium text-gray-900">{tarimaSeleccionada.pedidoTarimas[0]?.nombreSucursal || '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Información de disponibilidad del pedido */}
                {tarimaTienePedido ? (
                  loadingDisponibilidad ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-sm text-blue-700">Verificando disponibilidad del pedido...</span>
                      </div>
                    </div>
                  ) : disponibilidad ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h4 className="font-medium text-blue-900 mb-3">Disponibilidad del Pedido</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-600">Cajas Disponibles:</span>
                          <span className="font-medium ml-1 text-green-600">{disponibilidad.cantidad}</span>
                        </div>
                        <div>
                          <span className="text-blue-600">Peso por Caja:</span>
                          <span className="font-medium ml-1">{disponibilidad.pesoCajaCliente} kg</span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-blue-700 space-y-1">
                        <div><strong>Cliente:</strong> {disponibilidad.cliente.razonSocial}</div>
                        <div><strong>Sucursal:</strong> {disponibilidad.sucursal.nombre}</div>
                        <div><strong>Producto:</strong> {disponibilidad.producto.nombre}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-700">No se pudo obtener la disponibilidad del pedido</span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Tarima Sin Pedido Asociado</h4>
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
      </DialogContent>
    </Dialog>
  );
}; 