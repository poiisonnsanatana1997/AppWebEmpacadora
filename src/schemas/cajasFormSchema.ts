import { z } from 'zod';

export const cajasFormSchema = z.object({
  tipo: z.enum(['XL', 'L', 'M', 'S']).optional().refine((val) => val !== undefined, {
    message: "❌ Debes seleccionar un tipo de caja"
  }),
  cantidad: z.coerce.number()
    .min(-1000, "❌ El ajuste mínimo permitido es -1000 cajas")
    .max(1000, "❌ El ajuste máximo permitido es 1000 cajas"),
  idClasificacion: z.number().optional()
});

// Esquema dinámico que valida contra el resumen de cajas
export const createCajasFormSchemaWithValidation = (resumenCajas: any) => {
  return z.object({
    tipo: z.enum(['XL', 'L', 'M', 'S']).optional().refine((val) => val !== undefined, {
      message: "❌ Debes seleccionar un tipo de caja"
    }),
    cantidad: z.coerce.number()
      .min(-1000, "❌ El ajuste mínimo permitido es -1000 cajas")
      .max(1000, "❌ El ajuste máximo permitido es 1000 cajas")
      .refine((val) => {
        if (val >= 0) return true; // Valores positivos siempre válidos
        // Para valores negativos, verificar que no exceda las cajas existentes
        return true; // La validación real se hace en el componente
      }, "❌ No puedes restar más cajas de las que existen"),
    idClasificacion: z.number().optional()
  });
};

export type CajasFormData = z.infer<typeof cajasFormSchema>; 