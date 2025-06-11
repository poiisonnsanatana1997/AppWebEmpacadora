import { z } from "zod";

export const productSchema = z.object({
  codigo: z.string()
    .min(1, "El código es requerido")
    .max(50, "El código no puede tener más de 50 caracteres"),
  
  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  
  variedad: z.string()
    .min(1, "La variedad es requerida")
    .max(100, "La variedad no puede tener más de 100 caracteres"),
  
  unidadMedida: z.string()
    .min(1, "La unidad de medida es requerida")
    .max(20, "La unidad de medida no puede tener más de 20 caracteres"),
  
  precio: z.string()
    .min(1, "El precio es requerido")
    .regex(/^\d+(\.\d{1,2})?$/, "El precio debe ser un número válido con hasta 2 decimales"),
  
  imagen: z.string()
    .max(1000000, "La imagen es demasiado grande")
    .optional(),
  
  estatus: z.string()
    .default("Activo"),
});

export type ProductFormData = z.infer<typeof productSchema>; 