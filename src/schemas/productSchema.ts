import { z } from "zod";

export const productSchema = z.object({
  code: z.string()
    .min(1, "El código es requerido")
    .max(50, "El código no puede tener más de 50 caracteres"),
  
  name: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  
  variety: z.string()
    .min(1, "La variedad es requerida")
    .max(100, "La variedad no puede tener más de 100 caracteres"),
  
  isActive: z.boolean(),
  
  size: z.string()
    .max(50, "El tamaño no puede tener más de 50 caracteres")
    .optional(),
  
  packagingType: z.string()
    .max(50, "El tipo de empaque no puede tener más de 50 caracteres")
    .optional(),
  
  unit: z.string()
    .max(20, "La unidad no puede tener más de 20 caracteres")
    .optional(),
  
  imageBase64: z.string()
    .max(1000000, "La imagen es demasiado grande")
    .optional(),
  
  data1: z.string()
    .max(100, "El dato adicional 1 no puede tener más de 100 caracteres")
    .optional(),
  
  data2: z.string()
    .max(100, "El dato adicional 2 no puede tener más de 100 caracteres")
    .optional(),
});

export type ProductFormData = z.infer<typeof productSchema>; 