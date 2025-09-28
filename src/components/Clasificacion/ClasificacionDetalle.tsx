import React, { useState } from 'react';
import { toast } from 'sonner';
import { ClasificacionCompletaDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MermasDetalle } from './MermasDetalle';
import { RetornosDetalle } from './RetornosDetalle';
import { ChevronDown, ChevronUp, ClipboardList, Hash, Scale, Target, DollarSign } from 'lucide-react';
import { EditarPreciosClasificacionModal } from './EditarPreciosClasificacionModal';
import { useIndicadoresPesos, IndicadoresPesosData } from '../../hooks/Clasificacion/useIndicadoresPesos';
import PesosPorTipoBarChart from './PesosPorTipoBarChart';

interface ClasificacionDetalleProps {
  clasificacion: ClasificacionCompletaDTO;
  onUpdateClasificacion?: (clasificacion: ClasificacionCompletaDTO) => Promise<void>;
  onAjustarPesos?: (clasificacionId: number) => void;
  estaFinalizada?: boolean;
  onDeleteMerma?: (mermaId: number) => void;
  onDeleteRetorno?: (retornoId: number) => void;
  ordenEnClasificacion?: boolean;
}

export const ClasificacionDetalle: React.FC<ClasificacionDetalleProps> = ({ 
  clasificacion, 
  onUpdateClasificacion, 
  onAjustarPesos, 
  estaFinalizada = false,
  onDeleteMerma,
  onDeleteRetorno,
  ordenEnClasificacion = false
}) => {
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [clasificacionEdit, setClasificacionEdit] = useState<ClasificacionCompletaDTO | null>(null);

  const indicadores = useIndicadoresPesos([clasificacion]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formateador de moneda MXN
  const formatoMoneda = (valor: number) =>
    valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  // Formateador de peso en kg
  const formatoKg = (valor: number) => `${valor.toFixed(2)} kg`;

  // Función para obtener colores del progreso según el porcentaje
  const getProgressColors = (progreso: number) => {
    if (progreso >= 95) {
      return {
        barColor: 'bg-green-500',
        textColor: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    } else if (progreso >= 80) {
      return {
        barColor: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    } else if (progreso >= 60) {
      return {
        barColor: 'bg-yellow-500',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    } else if (progreso >= 40) {
      return {
        barColor: 'bg-orange-500',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-100'
      };
    } else {
      return {
        barColor: 'bg-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-100'
      };
    }
  };

  // Función para obtener tipos clasificados
  const obtenerTiposClasificados = (): string[] => {
    const tiposRequeridos = ['XL', 'L', 'M', 'S'];
    const tiposClasificados: string[] = [];
    
    tiposRequeridos.forEach(tipo => {
      const existeTipo = clasificacion.tarimasClasificaciones?.some(tarima => tarima.tipo === tipo);
      if (existeTipo) {
        tiposClasificados.push(tipo);
      }
    });
    
    return tiposClasificados;
  };

  const handleOpenModal = () => {
    if (estaFinalizada) {
      toast.error('No se pueden editar precios cuando la clasificación está finalizada');
      return;
    }
    setClasificacionEdit(clasificacion);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setClasificacionEdit(null);
  };

  const handleAjustarPesos = () => {
    if (estaFinalizada) {
      toast.error('No se pueden ajustar pesos cuando la clasificación está finalizada');
      return;
    }
    onAjustarPesos?.(clasificacion.id);
  };

  const handleSave = async (clasificacionActualizada: ClasificacionCompletaDTO) => {
    setModalOpen(false);
    setClasificacionEdit(null);
    if (onUpdateClasificacion) {
      await onUpdateClasificacion(clasificacionActualizada);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="h-6 w-6 text-gray-700" />
              <span className="text-lg font-bold">Clasificación</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Hash className="h-4 w-4" />
              Lote: {clasificacion.lote}
              <Badge variant="outline">#{clasificacion.id}</Badge>
              {estaFinalizada && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  Finalizada
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenModal}
              disabled={estaFinalizada}
              className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium text-sm transition-colors duration-200"
              title={estaFinalizada ? 'No se pueden editar precios cuando la clasificación está finalizada' : 'Editar precios'}
            >
              <DollarSign className="h-4 w-4" />
              Editar precios
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAjustarPesos}
              disabled={estaFinalizada}
              className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium text-sm transition-colors duration-200"
              title={estaFinalizada ? 'No se pueden ajustar pesos cuando la clasificación está finalizada' : 'Ajustar pesos'}
            >
              <Scale className="h-4 w-4" />
              Ajustar pesos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMostrarDetalle(!mostrarDetalle)}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-1 rounded-md transition-colors duration-200"
            >
              {mostrarDetalle ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Ocultar detalle
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Ver detalle
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Bloques de Pesos por Tipo y Resumen de Pesos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Pesos por Tipo */}
          <PesosPorTipoBarChart
            pesosPorTipo={{
              XL: indicadores.pesoXL || 0,
              L: indicadores.pesoL || 0,
              M: indicadores.pesoM || 0,
              S: indicadores.pesoS || 0,
            }}
            total={
              (indicadores.pesoXL || 0) +
              (indicadores.pesoL || 0) +
              (indicadores.pesoM || 0) +
              (indicadores.pesoS || 0)
            }
          />
          {/* Resumen de Pesos */}
          <div className="bg-gray-50 rounded-lg shadow p-4 border">
            <h4 className="text-md font-bold mb-2">Resumen de Pesos</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Clasificado:</span>
                <span className="font-bold text-blue-600">{formatoKg(indicadores.pesoTotalClasificado)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Retornos:</span>
                <span className="font-medium text-orange-600">{formatoKg(indicadores.pesoRetornos)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Mermas:</span>
                <span className="font-medium text-pink-600">{formatoKg(indicadores.pesoMermas)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peso Esperado:</span>
                <span className="font-medium text-gray-800">{formatoKg(indicadores.pesoTotalEsperado)}</span>
              </div>
              <div className="pt-2 border-t mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Progreso General:</span>
                  <span className={`font-bold ${getProgressColors(indicadores.progreso).textColor}`}>
                    {indicadores.progreso >= 99.95 && indicadores.progreso < 100 
                      ? indicadores.progreso.toFixed(2) 
                      : indicadores.progreso.toFixed(1)
                    }%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${getProgressColors(indicadores.progreso).barColor} h-2 rounded-full transition-all duration-500 ease-in-out`}
                    style={{ width: `${Math.min(indicadores.progreso, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Clasificado: {formatoKg(indicadores.pesoTotalClasificado)}</span>
                  <span>Esperado: {formatoKg(indicadores.pesoTotalEsperado)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tarjeta de Precios */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900">Precios por Kilogramo</h4>
              <p className="text-xs text-gray-500">Valores establecidos para cada tipo de clasificación</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* XL */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700">XL</span>
              </div>
              <div className="text-lg font-bold text-purple-600 mb-0.5">{formatoMoneda(clasificacion.xl)}</div>
              <div className="text-xs text-gray-500">por kg</div>
            </div>
            
            {/* L */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700">L</span>
              </div>
              <div className="text-lg font-bold text-blue-600 mb-0.5">{formatoMoneda(clasificacion.l)}</div>
              <div className="text-xs text-gray-500">por kg</div>
            </div>
            
            {/* M */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700">M</span>
              </div>
              <div className="text-lg font-bold text-green-600 mb-0.5">{formatoMoneda(clasificacion.m)}</div>
              <div className="text-xs text-gray-500">por kg</div>
            </div>
            
            {/* S */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700">S</span>
              </div>
              <div className="text-lg font-bold text-red-600 mb-0.5">{formatoMoneda(clasificacion.s)}</div>
              <div className="text-xs text-gray-500">por kg</div>
            </div>
            
            {/* Retornos */}
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 md:col-span-1 col-span-2">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-700">Retornos</span>
              </div>
              <div className="text-lg font-bold text-orange-600 mb-0.5">{formatoMoneda(clasificacion.retornos)}</div>
              <div className="text-xs text-gray-500">por kg</div>
            </div>
          </div>
        </div>

        {/* Información de registro */}
        <div className="text-sm text-gray-500 border-t pt-3">
          Registrado: {formatearFecha(clasificacion.fechaRegistro)} por {clasificacion.usuarioRegistro}
        </div>
        
        {/* Mensaje cuando está finalizada */}
        {estaFinalizada && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-700 font-medium flex items-center gap-2">
              <span>✓</span>
              <span>Clasificación finalizada - Los precios y pesos no se pueden modificar</span>
            </div>
          </div>
        )}
        {/* Detalle expandible */}
        {mostrarDetalle && (
          <div className="mt-6 space-y-4 border-t pt-4">
            <MermasDetalle 
              mermas={clasificacion.mermas} 
              lote={clasificacion.lote}
              onDeleteMerma={onDeleteMerma}
              disabled={!ordenEnClasificacion || estaFinalizada}
            />
            <RetornosDetalle 
              retornos={clasificacion.retornosDetalle} 
              lote={clasificacion.lote}
              onDeleteRetorno={onDeleteRetorno}
              disabled={!ordenEnClasificacion || estaFinalizada}
            />
          </div>
        )}
        {/* Modal de edición de precios */}
        {clasificacionEdit && (
          <EditarPreciosClasificacionModal
            open={modalOpen}
            clasificacion={clasificacionEdit}
            onClose={handleCloseModal}
            onSave={handleSave}
            tiposClasificados={obtenerTiposClasificados()}
          />
        )}
      </CardContent>
    </Card>
  );
}; 