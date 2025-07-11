import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clasificacionFormSchema } from '../../schemas/clasificacionFormSchema';
import { z } from 'zod';

export type ClasificacionFormValues = z.infer<typeof clasificacionFormSchema>;

export function useClasificacionForm(defaultValues?: Partial<ClasificacionFormValues>) {
  const form = useForm<ClasificacionFormValues>({
    resolver: zodResolver(clasificacionFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  return {
    ...form,
  };
} 