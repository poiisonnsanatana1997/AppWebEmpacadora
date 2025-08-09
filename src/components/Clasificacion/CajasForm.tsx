import React, { useRef } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Package, Save, Loader2, Info, Plus, TrendingUp } from 'lucide-react';
import { useCajasForm } from '../../hooks/Clasificacion/useCajasForm';
import { useCajasResumen } from '../../hooks/Clasificacion/useCajasResumen';
import { ResumenCajas } from './ResumenCajas';
import { CantidadControl } from './CantidadControl';

interface CajasFormProps {
  clasificacionId: number;
  onSuccess?: () => void;
  disabled?: boolean;
}

const tiposCaja = [
  { value: 'XL', label: 'XL', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { value: 'L', label: 'L', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { value: 'M', label: 'M', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { value: 'S', label: 'S', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
];

export const CajasForm: React.FC<CajasFormProps> = ({
  clasificacionId,
  onSuccess,
  disabled = false
}) => {
  const { resumen, loading: loadingResumen, refetch: refetchResumen, actualizarResumenLocal } = useCajasResumen(clasificacionId);
  const cantidadInputRef = useRef<HTMLInputElement>(null);

  const handleSuccess = (tipo: string, cantidad: number) => {
    actualizarResumenLocal(tipo, cantidad);
    onSuccess?.();
  };

  const { form, onSubmit, isSubmitting } = useCajasForm(clasificacionId, handleSuccess, resumen);

  const handleTipoSelection = (tipo: 'XL' | 'L' | 'M' | 'S') => {
    form.setValue('tipo', tipo);
    setTimeout(() => {
      cantidadInputRef.current?.focus();
    }, 100);
  };

  if (disabled) {
    return (
      <div className="mb-4 md:mb-6 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg md:rounded-xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 md:mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200 rounded-lg">
              <Package className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-700">Registro de Cajas</h3>
              <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Sistema de clasificación</p>
            </div>
          </div>
          <div className="sm:ml-auto">
            <div className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
              Deshabilitado
            </div>
          </div>
        </div>
        <div className="bg-white/50 border border-gray-200 rounded-lg p-3 md:p-4">
          <div className="flex items-start sm:items-center gap-2 text-gray-600">
            <Info className="h-4 w-4 mt-0.5 sm:mt-0 flex-shrink-0" />
            <span className="text-xs md:text-sm">Clasificación finalizada - No se pueden registrar más cajas</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 md:mb-6">
      {/* Header responsivo */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg p-3 md:p-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1.5 md:p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold">Registro de Cajas</h3>
            </div>
          </div>
          <div className="hidden lg:block">
            <ResumenCajas resumen={resumen} loading={loadingResumen} />
          </div>
        </div>
      </div>

      {/* Contenido del formulario responsivo */}
      <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm">
        <div className="p-3 md:p-4">
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-3 md:space-y-4">
              {/* Selección de tipo responsiva */}
              <div>
                <FormLabel className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wide">
                  Tipo de Caja
                </FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {tiposCaja.map((tipo) => (
                    <FormField
                      key={tipo.value}
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <button
                              type="button"
                              className={`relative p-2 md:p-3 rounded-lg border transition-all duration-200 w-full ${
                                field.value === tipo.value
                                  ? `bg-gradient-to-r ${tipo.color} border-gray-300 shadow-md scale-105`
                                  : `${tipo.bgColor} ${tipo.borderColor} hover:shadow-sm hover:scale-102`
                              }`}
                              onClick={() => handleTipoSelection(tipo.value as 'XL' | 'L' | 'M' | 'S')}
                            >
                              <div className="text-center">
                                <div className={`text-base md:text-lg font-bold ${
                                  field.value === tipo.value ? 'text-white' : 'text-gray-700'
                                }`}>
                                  {tipo.label}
                                </div>
                              </div>
                              {field.value === tipo.value && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full"></div>
                              )}
                            </button>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
              
              {/* Control de cantidad responsivo */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <FormLabel className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Cantidad
                  </FormLabel>
                  <TrendingUp className="h-3 w-3 text-gray-500" />
                </div>
                <div className="flex justify-center">
                  <div className="w-full max-w-xs">
                    <CantidadControl
                      ref={cantidadInputRef}
                      value={form.watch('cantidad') || 0}
                      onChange={(value) => form.setValue('cantidad', value)}
                      min={-1000}
                      max={1000}
                      step={1}
                      tipoSeleccionado={form.watch('tipo')}
                      resumenCajas={resumen}
                    />
                  </div>
                </div>
              </div>

              {/* Botón de envío responsivo */}
              <Button
                type="submit"
                disabled={isSubmitting || !form.watch('tipo') || form.watch('cantidad') === undefined}
                className="w-full h-10 md:h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm md:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Procesando...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Registrar Cajas</span>
                    <span className="sm:hidden">Registrar</span>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Resumen móvil/tablet */}
      <div className="lg:hidden mt-3">
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-3 border border-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-gray-600" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Resumen</span>
          </div>
          <ResumenCajas resumen={resumen} loading={loadingResumen} />
        </div>
      </div>
    </div>
  );
}; 