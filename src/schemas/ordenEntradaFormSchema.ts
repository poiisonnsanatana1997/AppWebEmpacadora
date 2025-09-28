import { z } from 'zod';

export const ordenEntradaFormSchema = z.object({
  proveedor: z.object({
    id: z.string().min(1, 'Debe seleccionar un proveedor'),
    nombre: z.string()
  }),
  fecha: z.string().min(1, 'Debe seleccionar una fecha'),
  estado: z.enum(['Pendiente', 'Procesando', 'Recibida', 'Cancelada'] as const),
  observaciones: z.string(),
  productos: z.object({
    id: z.string().min(1, 'Debe seleccionar un producto'),
    nombre: z.string(),
    codigo: z.string(),
    variedad: z.string()
  })
});

export type OrdenEntradaFormSchema = z.infer<typeof ordenEntradaFormSchema>;
