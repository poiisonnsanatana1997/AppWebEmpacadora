import { z } from 'zod';

// Schema para crear sucursal
export const crearSucursalSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(150, 'El nombre no puede exceder 150 caracteres'),
  direccion: z
    .string()
    .min(1, 'La dirección es requerida')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  encargadoAlmacen: z
    .string()
    .max(50, 'El nombre del encargado no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),
  telefono: z
    .string()
    .min(1, 'El teléfono es requerido')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(
      /^(\+52\s?)?(\(?[0-9]{2,3}\)?[\s-]?[0-9]{3,4}[\s-]?[0-9]{4}|[0-9]{10})$/,
      'Formato de teléfono inválido. Use: 10 dígitos, (55) 1234-5678, +52 55 1234 5678'
    ),
  correo: z
    .string()
    .email('Correo electrónico inválido')
    .max(100, 'El correo no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  activo: z.boolean().default(true),
});

// Schema para actualizar sucursal
export const actualizarSucursalSchema = z.object({
  nombre: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(150, 'El nombre no puede exceder 150 caracteres'),
  direccion: z
    .string()
    .min(1, 'La dirección es requerida')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  encargadoAlmacen: z
    .string()
    .max(50, 'El nombre del encargado no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),
  telefono: z
    .string()
    .min(1, 'El teléfono es requerido')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(
      /^(\+52\s?)?(\(?[0-9]{2,3}\)?[\s-]?[0-9]{3,4}[\s-]?[0-9]{4}|[0-9]{10})$/,
      'Formato de teléfono inválido. Use: 10 dígitos, (55) 1234-5678, +52 55 1234 5678'
    ),
  correo: z
    .string()
    .email('Correo electrónico inválido')
    .max(100, 'El correo no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  activo: z.boolean().default(true),
});

// Tipos inferidos
export type CrearSucursalFormData = z.infer<typeof crearSucursalSchema>;
export type ActualizarSucursalFormData = z.infer<typeof actualizarSucursalSchema>;
