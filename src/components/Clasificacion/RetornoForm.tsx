import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Save, X } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';

interface RetornoFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  clasificaciones?: any[];
  onValidate?: (peso: number) => { isValid: boolean; message: string };
  loadingRetornos?: boolean;
}

export const RetornoForm: React.FC<RetornoFormProps> = ({ onSubmit, onCancel, isSubmitting, clasificaciones = [], onValidate, loadingRetornos = false }) => {
  const form = useFormContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const peso = form.getValues('peso');
    if (onValidate) {
      const validation = onValidate(peso);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
      if (validation.message) {
        toast.warning(validation.message);
      }
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Retorno *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder={loadingRetornos ? "Cargando..." : "Generando número..."}
                    {...field}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed pr-10"
                  />
                  {loadingRetornos && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="peso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso (kg) *</FormLabel>
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="observaciones"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Observaciones</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Observaciones adicionales sobre el retorno..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-green-600 text-white hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Guardando...' : 'Guardar Retorno'}
        </Button>
      </div>
    </form>
  );
}; 