import { z } from 'zod';

export const retornoFormSchema = z.object({
  numero: z.string({ required_error: 'El número de retorno es requerido' }).min(1, 'El número de retorno es requerido'),
  peso: z.number({ required_error: 'El peso es requerido' }).min(0.01, 'El peso debe ser mayor a 0'),
  observaciones: z.string().optional(),
  idClasificacion: z.number({ required_error: 'La clasificación es requerida' }).min(1, 'La clasificación es requerida'),
});

export type RetornoFormData = z.infer<typeof retornoFormSchema>; 