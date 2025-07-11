import { z } from 'zod';

export const mermaFormSchema = z.object({
  tipo: z.string({ required_error: 'El tipo de merma es requerido' }).min(1, 'El tipo de merma es requerido'),
  peso: z.number({ required_error: 'El peso es requerido' }).min(0.01, 'El peso debe ser mayor a 0'),
  observaciones: z.string().optional(),
  idClasificacion: z.number({ required_error: 'La clasificación es requerida' }).min(1, 'La clasificación es requerida'),
});

export type MermaFormData = z.infer<typeof mermaFormSchema>; 