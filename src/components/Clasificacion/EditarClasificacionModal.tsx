import React from 'react';
import { ClasificacionCompletaDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Edit3, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clasificacionFormSchema } from '../../schemas/clasificacionFormSchema';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';
import styled from 'styled-components';

const StyledNumericInput = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  const { onValueChange, value, ...rest } = props;
  
  return (
    <NumericFormat
      {...rest}
      getInputRef={ref}
      thousandSeparator
      prefix="$ "
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

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ModalContent = styled.div`
  padding: 1rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 1.5rem;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

interface EditarClasificacionModalProps {
  open: boolean;
  clasificacion: ClasificacionCompletaDTO;
  onClose: () => void;
  onSave: (clasificacion: ClasificacionCompletaDTO) => Promise<void>;
}

export const EditarClasificacionModal: React.FC<EditarClasificacionModalProps> = ({ 
  open, 
  clasificacion, 
  onClose, 
  onSave 
}) => {
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
    try {
      await onSave({ ...clasificacion, ...data });
      onClose();
      toast.success('Precios actualizados correctamente');
    } catch (error) {
      toast.error('Error al actualizar los precios. Por favor, inténtalo de nuevo.');
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
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <ModalContent>
            <DialogHeader className="space-y-4">
              <HeaderContainer>
                <TitleContainer>
                  <Edit3 className="h-5 w-5 text-blue-600" />
                  <DialogTitle>Editar Precios de Clasificación</DialogTitle>
                </TitleContainer>
                <BadgeContainer>
                  <Badge variant="outline">
                    <Edit3 className="h-4 w-4" />
                    {clasificacion.lote}
                  </Badge>
                </BadgeContainer>
              </HeaderContainer>
              <DialogDescription>
                Modifica los precios de la clasificación seleccionada. Los cambios se aplicarán inmediatamente.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormContainer>
                  <FormField
                    control={form.control}
                    name="xl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>XL</FormLabel>
                        <FormControl>
                          <StyledNumericInput
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
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
                        <FormLabel>L</FormLabel>
                        <FormControl>
                          <StyledNumericInput
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
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
                        <FormLabel>M</FormLabel>
                        <FormControl>
                          <StyledNumericInput
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
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
                        <FormLabel>S</FormLabel>
                        <FormControl>
                          <StyledNumericInput
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
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
                      <FormItem>
                        <FormLabel>Retornos</FormLabel>
                        <FormControl>
                          <StyledNumericInput
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.floatValue ?? 0);
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormContainer>
                <DialogFooter className="mt-6">
                  <Button 
                    type="submit" 
                    className="bg-blue-600 text-white" 
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Save className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </ModalContent>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}; 