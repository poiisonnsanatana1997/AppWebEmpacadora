import { z } from "zod";

export const productFormSchema = z.object({
  codigo: z.string()
    .min(1, "El código es requerido")
    .max(50, "El código no puede tener más de 50 caracteres")
    .regex(/^[A-Za-z0-9-_]+$/, "El código solo puede contener letras, números, guiones y guiones bajos"),

  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .regex(/^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s-_]+$/, "El nombre solo puede contener letras, números, espacios, guiones y guiones bajos"),

  variedad: z.string()
    .min(1, "La variedad es requerida")
    .max(100, "La variedad no puede tener más de 100 caracteres")
    .regex(/^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s-_]+$/, "La variedad solo puede contener letras, números, espacios, guiones y guiones bajos"),

  unidadMedida: z.string()
    .min(1, "La unidad de medida es requerida"),

  precio: z.number({
    required_error: "El precio es requerido"
  })
    .min(0, "El precio no puede ser negativo")
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), "El precio debe tener como máximo dos decimales"),

  fecha: z.string()
    .min(1, "La fecha es requerida"),

  activo: z.boolean({
    required_error: "El estado activo es requerido"
  }),

  imagen: z.string()
    .min(1, "La imagen es requerida")
});

export type ProductFormData = z.infer<typeof productFormSchema>; 