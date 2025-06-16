import { z } from "zod";
import { UnidadMedida, ProductoEstatus } from "@/types/product";

/**
 * Esquema de validación para un producto
 */
export const productSchema = z.object({
  codigo: z.string()
    .min(1, "El código es requerido")
    .max(50, "El código no puede tener más de 50 caracteres")
    .regex(/^[A-Za-z0-9-_]+$/, "El código solo puede contener letras, números, guiones y guiones bajos"),
  
  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .regex(/^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s-_]+$/, "El nombre solo puede contener letras, números, espacios, guiones y guiones bajos"),
  
  descripcion: z.string()
    .max(500, "La descripción no puede tener más de 500 caracteres")
    .optional(),
  
  variedad: z.string()
    .min(1, "La variedad es requerida")
    .max(100, "La variedad no puede tener más de 100 caracteres")
    .regex(/^[A-Za-záéíóúÁÉÍÓÚñÑ0-9\s-_]+$/, "La variedad solo puede contener letras, números, espacios, guiones y guiones bajos"),
  
  unidadMedida: z.enum(['kg', 'g', 'l', 'ml', 'unidad', 'caja', 'paquete'] as const, {
    errorMap: () => ({ message: "La unidad de medida debe ser una de las opciones válidas" })
  }),
  
  precio: z.string()
    .min(1, "El precio es requerido")
    .regex(/^\d+(\.\d{1,2})?$/, "El precio debe ser un número válido con hasta 2 decimales")
    .transform((val) => parseFloat(val))
    .refine((val) => val >= 0, "El precio no puede ser negativo"),
  
  imagen: z.instanceof(File, { message: "La imagen debe ser un archivo válido" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "La imagen no puede ser mayor a 5MB"
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      "La imagen debe ser en formato JPEG, PNG o WebP"
    )
    .optional(),
  
  estatus: z.enum(['Activo', 'Inactivo', 'Pendiente'] as const, {
    errorMap: () => ({ message: "El estatus debe ser uno de los valores válidos" })
  }).default("Activo"),
});

/**
 * Esquema de validación para actualizar un producto
 */
export const updateProductSchema = productSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Debe proporcionar al menos un campo para actualizar"
);

/**
 * Esquema de validación para los filtros de búsqueda
 */
export const productFilterSchema = z.object({
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  variedad: z.string().optional(),
  estatus: z.enum(['Activo', 'Inactivo', 'Pendiente'] as const).optional(),
  activo: z.boolean().optional(),
});

/**
 * Esquema de validación para las opciones de paginación
 */
export const paginationSchema = z.object({
  pagina: z.number().int().min(1).default(1),
  porPagina: z.number().int().min(1).max(100).default(10),
  ordenarPor: z.enum(['id', 'codigo', 'nombre', 'variedad', 'precio', 'estatus', 'createdAt', 'updatedAt'] as const).optional(),
  orden: z.enum(['asc', 'desc'] as const).default('asc'),
});

export type ProductFormData = z.infer<typeof productSchema>; 