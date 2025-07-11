import React from 'react';
import { TarimaClasificacionDTO } from '@/types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { CreateTarimaDTO } from '@/types/Tarimas/tarima.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NumericFormat } from 'react-number-format';
import { Package, Save, X, Info, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import styled from 'styled-components';
import { usePedidosCliente } from '@/hooks/Clasificacion/usePedidosCliente';
import { TarimasService } from '@/services/tarimas.service';
import { toast } from 'sonner';

// Schema de validación simplificado
const tarimaFormSchema = z.object({
  tipo: z.string().min(1, "El tipo es requerido"),
  cantidad: z.number().min(1, "La cantidad debe ser mayor a 0").max(1000, "Máximo 1000 cajas"),
  peso: z.number().min(0.01, "El peso debe ser mayor a 0").max(100, "Máximo 100 kg por caja"),
  cantidadTarimas: z.number().min(1, "Debe generar al menos 1 tarima").max(20, "Máximo 20 tarimas"),
  idPedidoCliente: z.number().optional(),
  upc: z.string().max(50, "Máximo 50 caracteres").optional(),
  observaciones: z.string().max(200, "Máximo 200 caracteres").optional(),
});

// El tipo PedidoClienteOption ya no es necesario ya que usamos PedidoClienteConDetallesDTO del servicio

type TarimaFormData = z.infer<typeof tarimaFormSchema>;



const FormSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #f9fafb;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const InfoBox = styled.div`
  background-color: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 1rem;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface TarimaFormProps {
  open: boolean;
  onClose: () => void;
  tarima?: TarimaClasificacionDTO;
  clasificacionId: number;
  onSuccess?: () => void;
  clasificaciones?: any[];
  onValidate?: (peso: number) => { isValid: boolean; message: string };
}

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

export const TarimaForm: React.FC<TarimaFormProps> = ({ 
  open, 
  onClose, 
  tarima, 
  clasificacionId,
  onSuccess,
  clasificaciones = [],
  onValidate
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { pedidosCliente, isLoading: isLoadingPedidos, error: errorPedidos } = usePedidosCliente();
  const form = useForm<TarimaFormData>({
    resolver: zodResolver(tarimaFormSchema),
    defaultValues: {
      tipo: '',
      cantidad: tarima?.tarima.cantidad || 0,
      peso: tarima?.peso || 0,
      cantidadTarimas: 1,
      idPedidoCliente: undefined,
      upc: tarima?.tarima.upc || '',
      observaciones: tarima?.tarima.observaciones || '',
    },
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        tipo: '',
        cantidad: tarima?.tarima.cantidad || 0,
        peso: tarima?.peso || 0,
        cantidadTarimas: 1,
        idPedidoCliente: undefined,
        upc: tarima?.tarima.upc || '',
        observaciones: tarima?.tarima.observaciones || '',
      });
    }
  }, [open, tarima, form]);

  const handleSubmitCompleta = async (data: TarimaFormData) => {
    // Validar límite de clasificación
    if (onValidate) {
      console.log('Validando tarima - pesoTotal:', pesoTotal);
      const validation = onValidate(pesoTotal);
      console.log('Resultado validación:', validation);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
      if (validation.message) {
        toast.warning(validation.message);
      }
    }

    try {
      setIsSubmitting(true);
      const tarimasData: CreateTarimaDTO = {
        estatus: 'COMPLETA',
        fechaRegistro: new Date().toISOString(),
        tipo: data.tipo,
        cantidad: data.cantidad,
        peso: data.peso,
        upc: data.upc || undefined,
        observaciones: data.observaciones || undefined,
        idClasificacion: clasificacionId,
        idPedidoCliente: data.idPedidoCliente || undefined,
        cantidadTarimas: data.cantidadTarimas,
      };
      await TarimasService.crearTarima(tarimasData);
      toast.success('Tarima(s) guardada(s) correctamente');
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error('Error al guardar la(s) tarima(s)');
      console.error('Error al guardar las tarimas completas:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitParcial = async (data: TarimaFormData) => {
    // Validar límite de clasificación
    if (onValidate) {
      console.log('Validando tarima - pesoTotal:', pesoTotal);
      const validation = onValidate(pesoTotal);
      console.log('Resultado validación:', validation);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
      if (validation.message) {
        toast.warning(validation.message);
      }
    }

    try {
      setIsSubmitting(true);
      const tarimasData: CreateTarimaDTO = {
        estatus: 'PARCIAL',
        fechaRegistro: new Date().toISOString(),
        tipo: data.tipo,
        cantidad: data.cantidad,
        peso: data.peso,
        upc: data.upc || undefined,
        observaciones: data.observaciones || undefined,
        idClasificacion: clasificacionId,
        idPedidoCliente: data.idPedidoCliente || undefined,
        cantidadTarimas: data.cantidadTarimas,
      };
      await TarimasService.crearTarima(tarimasData);
      toast.success('Tarima(s) guardada(s) correctamente');
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error('Error al guardar la(s) tarima(s)');
      console.error('Error al guardar las tarimas parciales:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const pesoTotal = form.watch('cantidad') * form.watch('peso') * form.watch('cantidadTarimas');

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-y-auto">
        <div className="p-6">
          <DialogHeader className="space-y-4">
            <HeaderContainer>
              <TitleContainer>
                <Package className="h-5 w-5 text-blue-600" />
                <DialogTitle>{tarima ? 'Editar Tarima' : 'Nueva Tarima'}</DialogTitle>
              </TitleContainer>
            </HeaderContainer>
            <DialogDescription>
              {tarima 
                ? 'Modifica la información de la tarima.'
                : 'Registra una nueva tarima en la clasificación.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form className="space-y-4">
              {/* Información básica */}
              <FormSection>
                <SectionTitle>
                  <Package className="h-4 w-4" />
                  Información Básica
                </SectionTitle>
                <FormGrid>
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Tarima</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                    name="cantidadTarimas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad de Tarimas</FormLabel>
                        <FormControl>
                          <StyledIntegerInput
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 1);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder="1"
                            disabled={!!tarima}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="upc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPC (opcional)</FormLabel>
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
              </FormSection>

              {/* Asignación a pedido (opcional) */}
              <FormSection>
                <SectionTitle>
                  <ShoppingCart className="h-4 w-4" />
                  Asignar a Pedido (Opcional)
                </SectionTitle>
                
                {isLoadingPedidos && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-blue-700">Cargando pedidos cliente...</span>
                  </div>
                )}
                
                {errorPedidos && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-700">Error al cargar pedidos: {errorPedidos}</span>
                  </div>
                )}
                
                {!isLoadingPedidos && !errorPedidos && pedidosCliente.length > 0 && (
                  <FormField
                    control={form.control}
                    name="idPedidoCliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pedido del Cliente</FormLabel>
                        <Select
                          onValueChange={value => {
                            if (!value || value === "0") {
                              field.onChange(undefined);
                              // Limpiar el peso cuando se desasigna
                              form.setValue('peso', 0);
                              return;
                            }
                            field.onChange(Number(value));
                            const pedido = pedidosCliente.find(p => p.id === Number(value));
                            if (pedido) {
                              form.setValue('peso', pedido.pesoCajaCliente);
                            }
                          }}
                          value={field.value ? field.value.toString() : "0"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un pedido cliente (opcional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Sin asignar</SelectItem>
                            {pedidosCliente.map(pedido => (
                              <SelectItem key={pedido.id} value={pedido.id.toString()}>
                                {pedido.razonSocialCliente} - ID: {pedido.id} - Peso: {pedido.pesoCajaCliente}kg
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          Al seleccionar un pedido, el peso por caja se llenará automáticamente. 
                          Selecciona "Sin asignar" para desasignar el pedido.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {!isLoadingPedidos && !errorPedidos && pedidosCliente.length === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <Info className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700">No hay pedidos cliente disponibles</span>
                  </div>
                )}
              </FormSection>

              {/* Detalles del contenido */}
              <FormSection>
                <SectionTitle>
                  <Package className="h-4 w-4" />
                  Contenido de la Tarima
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
                  
                  <FormField
                    control={form.control}
                    name="peso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso por Caja (kg)</FormLabel>
                        <FormControl>
                          <StyledNumericInput
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder="0.00"
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
                    Resumen: {form.watch('cantidad')} cajas × {form.watch('peso')} kg × {form.watch('cantidadTarimas')} tarimas = {pesoTotal.toFixed(2)} kg total
                  </div>
                </div>
              </FormSection>

              {/* Observaciones */}
              <FormSection>
                <SectionTitle>
                  <Info className="h-4 w-4" />
                  Observaciones (Opcional)
                </SectionTitle>
                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
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
              
              <DialogFooter className="mt-6 flex gap-2">
                <Button 
                  type="button"
                  className="bg-green-600 text-white hover:bg-green-700" 
                  disabled={isSubmitting}
                  onClick={form.handleSubmit(handleSubmitCompleta)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Guardando...' : 'Guardar Completa'}
                </Button>
                <Button 
                  type="button"
                  className="bg-orange-600 text-white hover:bg-orange-700" 
                  disabled={isSubmitting}
                  onClick={form.handleSubmit(handleSubmitParcial)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Guardando...' : 'Guardar Parcial'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 