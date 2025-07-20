import React from 'react';
import { ClasificacionCompletaDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Edit3, Save, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clasificacionFormSchema } from '../../schemas/clasificacionFormSchema';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';

interface EditarPreciosClasificacionModalProps {
  open: boolean;
  clasificacion: ClasificacionCompletaDTO;
  onClose: () => void;
  onSave: (clasificacion: ClasificacionCompletaDTO) => Promise<void>;
}

export const EditarPreciosClasificacionModal: React.FC<EditarPreciosClasificacionModalProps> = ({ 
  open, 
  clasificacion, 
  onClose, 
  onSave 
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(clasificacionFormSchema),
    defaultValues: {
      xl: clasificacion.xl,
      l: clasificacion.l,
      m: clasificacion.m,
      s: clasificacion.s,
      retornos: clasificacion.retornos,
    },
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        xl: clasificacion.xl,
        l: clasificacion.l,
        m: clasificacion.m,
        s: clasificacion.s,
        retornos: clasificacion.retornos,
      });
    }
  }, [open, clasificacion, form]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSave({ ...clasificacion, ...data });
      onClose();
      toast.success('Precios actualizados correctamente');
    } catch (error) {
      toast.error('Error al actualizar los precios. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = form.formState.isDirty;
    
    if (hasChanges) {
      toast.warning('Los cambios realizados no se han guardado');
    }
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-0 sm:p-0">
        <div className="p-4 sm:p-6">
          <DialogHeader className="mb-4 sm:mb-6">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              Editar Precios de Clasificación
            </DialogTitle>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Modifica los precios por kilogramo de cada tipo de clasificación. Los cambios se aplicarán inmediatamente.
            </p>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {/* Información importante */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Información Importante</h3>
                </div>
                <p className="text-xs sm:text-sm text-blue-800">
                  Los precios se aplican por kilogramo de producto clasificado. 
                  Asegúrate de que los valores sean correctos antes de guardar.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-700">
                  <Badge variant="outline" className="text-xs">
                    <Edit3 className="h-3 w-3 mr-1" />
                    Lote: {clasificacion.lote}
                  </Badge>
                </div>
              </div>

              {/* Sección de formulario con mejor diseño */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 sm:h-6 bg-blue-500 rounded-full"></div>
                  Precios por Tipo de Clasificación
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="xl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          Precio XL ($/kg)
                        </FormLabel>
                        <FormControl>
                          <NumericFormat
                            customInput={Input}
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder="0.00"
                            decimalScale={2}
                            allowNegative={false}
                            className="bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="l"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Precio L ($/kg)
                        </FormLabel>
                        <FormControl>
                          <NumericFormat
                            customInput={Input}
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder="0.00"
                            decimalScale={2}
                            allowNegative={false}
                            className="bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="m"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Precio M ($/kg)
                        </FormLabel>
                        <FormControl>
                          <NumericFormat
                            customInput={Input}
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder="0.00"
                            decimalScale={2}
                            allowNegative={false}
                            className="bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="s"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          Precio S ($/kg)
                        </FormLabel>
                        <FormControl>
                          <NumericFormat
                            customInput={Input}
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder="0.00"
                            decimalScale={2}
                            allowNegative={false}
                            className="bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="retornos"
                    render={({ field }) => (
                      <FormItem className="col-span-1 sm:col-span-2">
                        <FormLabel className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          Precio Retornos ($/kg)
                        </FormLabel>
                        <FormControl>
                          <NumericFormat
                            customInput={Input}
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder="0.00"
                            decimalScale={2}
                            allowNegative={false}
                            className="bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Sección de acciones */}
              <div className="bg-white rounded-lg border p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Acciones</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-200"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelar
                      </span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-200"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                            Guardar Precios
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 