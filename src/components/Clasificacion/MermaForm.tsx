import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Save, X } from 'lucide-react';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';

interface MermaFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  clasificaciones?: any[];
  onValidate?: (peso: number) => { isValid: boolean; message: string };
}

export const MermaForm: React.FC<MermaFormProps> = ({ onSubmit, onCancel, isSubmitting, clasificaciones = [], onValidate }) => {
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
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Merma *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de merma" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                </SelectContent>
              </Select>
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
                placeholder="Observaciones adicionales sobre la merma..."
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
        <Button type="submit" disabled={isSubmitting} className="bg-purple-600 text-white hover:bg-purple-700">
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Guardando...' : 'Guardar Merma'}
        </Button>
      </div>
    </form>
  );
}; 