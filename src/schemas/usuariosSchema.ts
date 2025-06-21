import { z } from 'zod';

// Esquema para crear usuario
export const crearUsuarioSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  username: z.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  email: z.string()
    .email('El email debe tener un formato válido')
    .max(100, 'El email no puede tener más de 100 caracteres'),
  phoneNumber: z.string()
    .regex(/^\+?[0-9]{10,15}$/, 'El número de teléfono debe tener entre 10 y 15 dígitos'),
  isActive: z.boolean(),
  roleId: z.number()
    .int('El ID del rol debe ser un número entero')
    .positive('El ID del rol debe ser un número positivo')
});

// Esquema para actualizar usuario
export const actualizarUsuarioSchema = z.object({
  name: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .optional(),
  phoneNumber: z.string()
    .regex(/^\+?[0-9]{10,15}$/, 'El número de teléfono debe tener entre 10 y 15 dígitos')
    .optional(),
  isActive: z.boolean().optional()
});

// Tipo inferido para crear usuario
export type CrearUsuarioSchema = z.infer<typeof crearUsuarioSchema>;

// Tipo inferido para actualizar usuario
export type ActualizarUsuarioSchema = z.infer<typeof actualizarUsuarioSchema>;
