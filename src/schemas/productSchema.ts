import { z } from "zod";

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