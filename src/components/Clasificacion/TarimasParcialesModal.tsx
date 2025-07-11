import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Plus, X, Filter, Search } from 'lucide-react';
import { useTarimasParciales } from '../../hooks/Clasificacion/useTarimasParciales';
import { TarimaParcialSeleccionadaDTO } from '../../types/Tarimas/tarimaParcial.types';
import { AgregarCantidadForm } from './AgregarCantidadForm';
import { toast } from 'sonner';

interface TarimasParcialesModalProps {
  open: boolean;
  onClose: () => void;
  clasificacionId: number;
  clasificaciones: any[];
  onValidate: (cantidad: number) => { isValid: boolean; message: string };
}

const TIPO_OPTIONS = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'XL', label: 'XL' },
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'S', label: 'S' },
];

export const TarimasParcialesModal: React.FC<TarimasParcialesModalProps> = ({ open, onClose, clasificacionId, clasificaciones, onValidate }) => {
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

  const handleSelectTarima = (tarima: TarimaParcialSeleccionadaDTO) => {
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
  const cantidadYaGestionada = tarimasParciales.reduce((acc, t) => acc + t.cantidad, 0);

  // Función de validación
  const onValidateCantidadTarimaParcial = (cantidadAAgregar: number) => {
    return onValidate(cantidadAAgregar);
  };

  const handleSuccess = () => {
    // Recargar tarimas parciales y cerrar modal
    cargarTarimasParciales();
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Gestionar Tarimas Parciales
            <Badge variant="outline" className="text-xs px-2 py-0.5">{tarimasFiltradas.length} tarimas</Badge>
          </DialogTitle>
        </DialogHeader>
        {/* Barra de búsqueda y filtro */}
        {view === 'list' && (
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 mt-2">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por código, lote, cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-xs h-8 rounded-md border-gray-200"
                aria-label="Buscar tarima parcial"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-36 h-8 text-xs rounded-md border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {/* Tabla de tarimas */}
        {view === 'list' && (
          <div className="w-full overflow-x-auto rounded-md border border-gray-100 bg-white">
            <table className="w-full text-xs border-separate border-spacing-0 min-w-[700px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 font-semibold text-gray-700 text-center whitespace-nowrap">Acciones</th>
                  <th className="px-2 py-2 font-semibold text-gray-700 text-center whitespace-nowrap">Cantidad</th>
                  <th className="px-2 py-2 font-semibold text-gray-700 text-left whitespace-nowrap">Código</th>
                  <th className="px-2 py-2 font-semibold text-gray-700 text-left whitespace-nowrap">Tipo</th>
                  <th className="px-2 py-2 font-semibold text-gray-700 text-left whitespace-nowrap">Lote</th>
                  <th className="px-2 py-2 font-semibold text-gray-700 text-left whitespace-nowrap">Cliente</th>
                  <th className="px-2 py-2 font-semibold text-gray-700 text-left whitespace-nowrap">Sucursal</th>
                  <th className="px-2 py-2 font-semibold text-gray-700 text-center whitespace-nowrap">Peso</th>
                  <th className="px-2 py-2 font-semibold text-gray-700 text-center whitespace-nowrap">Fecha</th>
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
                  tarimasFiltradas.map((tarima) => (
                    <tr key={tarima.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-2 py-1 text-center whitespace-nowrap">
                        <Button
                          onClick={() => {
                            const tarimaCompleta = tarimasParciales.find(t => t.id === tarima.id);
                            if (tarimaCompleta) {
                              handleSelectTarima(tarimaCompleta);
                            }
                          }}
                          className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md transition duration-150 ease-in-out rounded-full w-8 h-8 flex items-center justify-center active:scale-95"
                          aria-label="Gestionar tarima"
                          tabIndex={0}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="px-2 py-1 text-center whitespace-nowrap">{tarima.cantidad}</td>
                      <td className="px-2 py-1 font-medium whitespace-nowrap max-w-[120px] truncate" title={tarima.codigo}>{tarima.codigo}</td>
                      <td className="px-2 py-1 whitespace-nowrap">
                        <Badge className={getTipoColor(tarima.tipo)}>{tarima.tipo}</Badge>
                      </td>
                      <td className="px-2 py-1 whitespace-nowrap max-w-[120px] truncate" title={tarima.lote}>{tarima.lote}</td>
                      <td className="px-2 py-1 whitespace-nowrap max-w-[140px] truncate" title={tarima.cliente}>{tarima.cliente}</td>
                      <td className="px-2 py-1 whitespace-nowrap max-w-[120px] truncate" title={tarima.sucursal}>{tarima.sucursal}</td>
                      <td className="px-2 py-1 text-center whitespace-nowrap">{formatWeight(tarima.peso)}</td>
                      <td className="px-2 py-1 text-center whitespace-nowrap">{formatDate(tarima.fechaRegistro)}</td>
                    </tr>
                  ))
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
              className="mb-2 text-xs text-blue-600 hover:underline"
              aria-label="Volver a la lista"
              tabIndex={0}
            >
              ← Volver a la lista
            </Button>
            <div className="mb-4">
              <div className="text-base font-semibold text-gray-800 mb-1">{tarimaSeleccionada.codigo}</div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                <span>Lote: <span className="font-medium text-gray-700">{tarimaSeleccionada.tarimasClasificaciones[0]?.lote}</span></span>
                <span>Tipo: <Badge className={getTipoColor(tarimaSeleccionada.tarimasClasificaciones[0]?.tipo)}>{tarimaSeleccionada.tarimasClasificaciones[0]?.tipo}</Badge></span>
                <span>Cliente: <span className="font-medium text-gray-700">{tarimaSeleccionada.pedidoTarimas[0]?.nombreCliente}</span></span>
                <span>Sucursal: <span className="font-medium text-gray-700">{tarimaSeleccionada.pedidoTarimas[0]?.nombreSucursal}</span></span>
              </div>
            </div>
            <AgregarCantidadForm
              onSuccess={handleSuccess}
              onCancel={handleBackToList}
              tarimaActual={tarimaSeleccionada}
              clasificacionId={clasificacionId}
              onValidate={onValidateCantidadTarimaParcial}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 