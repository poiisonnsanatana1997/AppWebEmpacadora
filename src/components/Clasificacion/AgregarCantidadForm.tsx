import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { NumericFormat } from 'react-number-format';
import { Save, X, Package, Scale, Info, CheckCircle } from 'lucide-react';
import { TarimaParcialSeleccionadaDTO } from '../../types/Tarimas/tarimaParcial.types';
import styled from 'styled-components';
import { useAgregarCantidadForm } from '../../hooks/Clasificacion/useAgregarCantidadForm';

// Componente para input numérico con formato
const StyledNumericInput = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  const { onValueChange, value, ...rest } = props;
  return (
    <NumericFormat
      {...rest}
      getInputRef={ref}
      thousandSeparator
      decimalScale={2}
      fixedDecimalScale
      allowNegative={false}
      inputMode="decimal"
      autoComplete="off"
      value={value}
      onValueChange={onValueChange}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
});
StyledNumericInput.displayName = 'StyledNumericInput';

// Componente para input numérico entero
const StyledIntegerInput = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  const { onValueChange, value, ...rest } = props;
  return (
    <NumericFormat
      {...rest}
      getInputRef={ref}
      thousandSeparator
      decimalScale={0}
      allowNegative={false}
      inputMode="numeric"
      autoComplete="off"
      value={value}
      onValueChange={onValueChange}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
});
StyledIntegerInput.displayName = 'StyledIntegerInput';

// Estilos
const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const FormActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

interface AgregarCantidadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  tarimaActual: TarimaParcialSeleccionadaDTO;
  clasificacionId: number;
  onValidate?: (cantidad: number) => { isValid: boolean; message: string };
}

export const AgregarCantidadForm: React.FC<AgregarCantidadFormProps> = ({
  onSuccess,
  onCancel,
  tarimaActual,
  clasificacionId,
  onValidate,
}) => {
  const { form, onSubmit, isSubmitting } = useAgregarCantidadForm({
    tarimaActual,
    clasificacionId,
    onSuccess,
    onValidate,
  });

  const pesoTotal = (form.watch('cantidad') || 0) * (tarimaActual.peso || 0);
  const estadoSeleccionado = form.watch('estadoTarima');

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Información actual de la tarima */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Estado actual de la tarima
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Cantidad actual:</span>
              <span className="ml-1 font-medium">{tarimaActual.cantidad} cajas</span>
            </div>
            <div>
              <span className="text-gray-500">Peso por caja:</span>
              <span className="ml-1 font-medium">{tarimaActual.peso?.toFixed(2) ?? '0.00'} kg</span>
            </div>
            <div>
              <span className="text-gray-500">Peso actual:</span>
              <span className="ml-1 font-medium">{tarimaActual.tarimasClasificaciones[0]?.peso?.toFixed(2) ?? '0.00'} kg</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
            💡 <strong>Nota:</strong> Esta tarima está en estado parcial y puede recibir más cantidades hasta completarse.
          </div>
        </div>

        {/* Cantidad y peso a agregar */}
        <FormSection>
          <SectionTitle>
            <Package className="h-4 w-4" />
            Cantidad a Agregar
          </SectionTitle>
          <FormGrid>
            <FormField
              control={form.control}
              name="cantidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad de Cajas</FormLabel>
                  <FormControl>
                    <StyledIntegerInput
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue ?? 0);
                      }}
                      onBlur={field.onBlur}
                      name={field.name}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGrid>
          
          {/* Resumen calculado */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm font-medium text-blue-900">
              Resumen: {form.watch('cantidad')} cajas × {tarimaActual.peso?.toFixed(2) ?? '0.00'} kg = {pesoTotal.toFixed(2)} kg adicionales
            </div>
            <div className="text-xs text-blue-700 mt-1">
              Total después de agregar: {(tarimaActual.cantidad + (form.watch('cantidad') || 0))} cajas, {(tarimaActual.peso + pesoTotal).toFixed(2)} kg
            </div>
          </div>
        </FormSection>

        {/* Estado de la Tarima */}
        <FormSection>
          <SectionTitle>
            <Scale className="h-4 w-4" />
            Estado de la Tarima
          </SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={estadoSeleccionado === 'parcial' ? 'default' : 'outline'}
              onClick={() => form.setValue('estadoTarima', 'parcial')}
              className="h-12"
            >
              <Package className="h-4 w-4 mr-2" />
              Mantener Parcial
            </Button>
            <Button
              type="button"
              variant={estadoSeleccionado === 'completo' ? 'default' : 'outline'}
              onClick={() => form.setValue('estadoTarima', 'completo')}
              className="h-12"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completar Tarima
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            {estadoSeleccionado === 'parcial' 
              ? "🔄 La tarima mantendrá su estado parcial y podrá seguir agregando cantidades en el futuro."
              : "✅ La tarima cambiará a estado completo y no podrá agregar más cantidades después de esta operación."
            }
          </div>
          <div className="mt-1 text-xs text-orange-600 bg-orange-50 p-2 rounded">
            ⚠️ <strong>Importante:</strong> {estadoSeleccionado === 'completo' 
              ? "Una vez completada, la tarima no podrá recibir más cantidades."
              : "Puedes completar la tarima en cualquier momento posterior."
            }
          </div>
        </FormSection>

        {/* Información adicional */}
        <FormSection>
          <SectionTitle>
            <Info className="h-4 w-4" />
            Información Adicional (Opcional)
          </SectionTitle>
          <FormGrid>
            <FormField
              control={form.control}
              name="upc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPC</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Código UPC"
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGrid>
          
          <FormField
            control={form.control}
            name="observaciones"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observaciones</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Observaciones adicionales..."
                    className="resize-none"
                    rows={2}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Acciones */}
        <FormActions>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !estadoSeleccionado}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Guardando...' : 'Guardar Cantidad'}
          </Button>
        </FormActions>
      </form>
    </Form>
  );
}; 