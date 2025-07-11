import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mermaFormSchema, type MermaFormData } from '@/schemas/mermaFormSchema';
import { MermasService } from '@/services/mermas.service';
import { toast } from 'sonner';

export const useMermaForm = (clasificacionId: number, onSuccess?: () => void) => {
  const form = useForm<MermaFormData>({
    resolver: zodResolver(mermaFormSchema),
    defaultValues: {
      tipo: 'GENERAL',
      peso: 0,
      observaciones: '',
      idClasificacion: clasificacionId,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: MermaFormData) => {
    try {
      const mermaData = {
        tipo: data.tipo,
        peso: data.peso,
        observaciones: data.observaciones,
        fechaRegistro: new Date().toISOString(),
        idClasificacion: clasificacionId,
      };
      
      await MermasService.create(mermaData);
      toast.success('Merma creada correctamente');
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || 'Error al crear la merma');
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
}; 