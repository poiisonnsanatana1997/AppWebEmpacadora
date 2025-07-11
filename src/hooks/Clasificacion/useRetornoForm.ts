import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { retornoFormSchema, type RetornoFormData } from '@/schemas/retornoFormSchema';
import { RetornosService } from '@/services/retornos.service';
import { toast } from 'sonner';

export const useRetornoForm = (clasificacionId: number, onSuccess?: () => void) => {
  const form = useForm<RetornoFormData>({
    resolver: zodResolver(retornoFormSchema),
    defaultValues: {
      numero: '',
      peso: 0,
      observaciones: '',
      idClasificacion: clasificacionId,
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: RetornoFormData) => {
    try {
      const retornoData = {
        numero: data.numero,
        peso: data.peso,
        observaciones: data.observaciones,
        fechaRegistro: new Date().toISOString(),
        idClasificacion: clasificacionId,
      };
      
      await RetornosService.create(retornoData);
      toast.success('Retorno creado correctamente');
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || 'Error al crear el retorno');
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
}; 