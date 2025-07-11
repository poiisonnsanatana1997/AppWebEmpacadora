import { z } from 'zod';

export const ajustePesosFormSchema = z.object({
  xl: z.number().optional(),
  l: z.number().optional(),
  m: z.number().optional(),
  s: z.number().optional(),
});

export type AjustePesosFormData = z.infer<typeof ajustePesosFormSchema>; 