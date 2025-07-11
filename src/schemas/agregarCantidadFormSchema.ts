import { z } from 'zod';

export const agregarCantidadFormSchema = z.object({
  cantidad: z.preprocess(
    (val) => val === '' || val === undefined ? undefined : Number(val),
    z.number()
      .min(1, "❌ La cantidad debe ser mayor a 0")
      .max(1000, "❌ La cantidad máxima permitida es 1000 cajas")
      .refine((val) => val > 0, {
        message: "❌ Debes ingresar una cantidad válida"
      })
  ),
  observaciones: z.string()
    .max(200, "❌ Las observaciones no pueden exceder 200 caracteres")
    .optional(),
  upc: z.string()
    .max(50, "❌ El código UPC no puede exceder 50 caracteres")
    .optional(),
  estadoTarima: z.enum(['parcial', 'completo'], {
    required_error: "❌ Debes seleccionar el estado de la tarima",
    invalid_type_error: "❌ Estado de tarima inválido"
  })
});

export type AgregarCantidadFormData = z.infer<typeof agregarCantidadFormSchema>; 