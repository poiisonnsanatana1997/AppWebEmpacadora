import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { NumericFormat } from 'react-number-format';
import { AjustePesosFormData } from '../../schemas/ajustePesosFormSchema';

interface AjustarPesosFormProps {
  onCancel: () => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  tiposHabilitados: {
    tieneXL: boolean;
    tieneL: boolean;
    tieneM: boolean;
    tieneS: boolean;
  };
  onValidate?: (data: any) => {
    isValid: boolean;
    message: string;
    remainingWeight: number;
    currentProgress: number;
  };
}

export const AjustarPesosForm: React.FC<AjustarPesosFormProps> = ({ onCancel, isSubmitting, onSubmit, tiposHabilitados, onValidate }) => {
  const form = useFormContext<AjustePesosFormData>();

  // Calcular validación en tiempo real
  const formData = form.watch();
  const validation = onValidate ? onValidate(formData) : null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Información sobre tipos disponibles */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="font-semibold text-blue-900">Información Importante</h3>
        </div>
        <p className="text-sm text-blue-800">
          Solo se pueden ajustar los pesos de los tipos que tienen tarimas clasificadas. 
          Los campos deshabilitados indican tipos sin tarimas disponibles.
        </p>
      </div>

      {/* Información de validación en tiempo real */}
      {validation && (
        <div className={`p-4 border-2 rounded-lg shadow-sm ${
          validation.isValid 
            ? validation.message.includes('Advertencia') 
              ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
            : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
              validation.isValid 
                ? validation.message.includes('Advertencia') 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
                : 'bg-red-500'
            }`}></div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                validation.isValid 
                  ? validation.message.includes('Advertencia') 
                    ? 'text-yellow-800' 
                    : 'text-green-800'
                  : 'text-red-800'
              }`}>
                {validation.message}
              </p>
              {validation.isValid && (
                <div className="mt-2 flex gap-4 text-xs">
                  <span className="text-gray-600 bg-white px-2 py-1 rounded">
                    📊 Peso disponible: <strong>{validation.remainingWeight.toFixed(2)} kg</strong>
                  </span>
                  <span className="text-gray-600 bg-white px-2 py-1 rounded">
                    📈 Progreso actual: <strong>{validation.currentProgress.toFixed(1)}%</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sección de formulario con mejor diseño */}
      <div className="bg-gray-50 rounded-lg p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          Pesos por Tipo de Clasificación
        </h3>
        
                <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="xl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={`flex items-center gap-2 ${!tiposHabilitados.tieneXL ? 'text-gray-400' : 'text-gray-700'}`}>
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Peso XL (kg) {!tiposHabilitados.tieneXL && '(Sin tarimas)'}
                </FormLabel>
                <FormControl>
                  <NumericFormat
                    customInput={Input}
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ?? undefined);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    placeholder="0.00"
                    decimalScale={2}
                    allowNegative={false}
                    disabled={!tiposHabilitados.tieneXL}
                    className={`${!tiposHabilitados.tieneXL ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} transition-colors`}
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
                <FormLabel className={`flex items-center gap-2 ${!tiposHabilitados.tieneL ? 'text-gray-400' : 'text-gray-700'}`}>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Peso L (kg) {!tiposHabilitados.tieneL && '(Sin tarimas)'}
                </FormLabel>
                <FormControl>
                  <NumericFormat
                    customInput={Input}
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ?? undefined);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    placeholder="0.00"
                    decimalScale={2}
                    allowNegative={false}
                    disabled={!tiposHabilitados.tieneL}
                    className={`${!tiposHabilitados.tieneL ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} transition-colors`}
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
                <FormLabel className={`flex items-center gap-2 ${!tiposHabilitados.tieneM ? 'text-gray-400' : 'text-gray-700'}`}>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Peso M (kg) {!tiposHabilitados.tieneM && '(Sin tarimas)'}
                </FormLabel>
                <FormControl>
                  <NumericFormat
                    customInput={Input}
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ?? undefined);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    placeholder="0.00"
                    decimalScale={2}
                    allowNegative={false}
                    disabled={!tiposHabilitados.tieneM}
                    className={`${!tiposHabilitados.tieneM ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} transition-colors`}
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
                <FormLabel className={`flex items-center gap-2 ${!tiposHabilitados.tieneS ? 'text-gray-400' : 'text-gray-700'}`}>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Peso S (kg) {!tiposHabilitados.tieneS && '(Sin tarimas)'}
                </FormLabel>
                <FormControl>
                  <NumericFormat
                    customInput={Input}
                    value={field.value}
                    onValueChange={(values) => {
                      field.onChange(values.floatValue ?? undefined);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    placeholder="0.00"
                    decimalScale={2}
                    allowNegative={false}
                    disabled={!tiposHabilitados.tieneS}
                    className={`${!tiposHabilitados.tieneS ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} transition-colors`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Sección de acciones */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>Acciones</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancelar
              </span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Ajustando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Ajustar Pesos
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}; 