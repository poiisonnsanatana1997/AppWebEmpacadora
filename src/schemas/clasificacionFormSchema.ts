import { z } from 'zod';

export const clasificacionFormSchema = z.object({
  xl: z.number({ required_error: 'El precio XL es requerido' }).min(0, 'Debe ser mayor o igual a 0'),
  l: z.number({ required_error: 'El precio L es requerido' }).min(0, 'Debe ser mayor o igual a 0'),
  m: z.number({ required_error: 'El precio M es requerido' }).min(0, 'Debe ser mayor o igual a 0'),
  s: z.number({ required_error: 'El precio S es requerido' }).min(0, 'Debe ser mayor o igual a 0'),
  retornos: z.number({ required_error: 'El precio de retornos es requerido' }).min(0, 'Debe ser mayor o igual a 0'),
}); 