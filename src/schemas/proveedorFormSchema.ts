import { z } from "zod";

export const proveedorFormSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  rfc: z.string().max(13, "Máximo 13 caracteres").nullable().transform(val => val ?? "").optional(),
  telefono: z.string().max(20, "Máximo 20 caracteres").nullable().transform(val => val ?? "").optional(),
  correo: z
    .union([
      z.string().email("Correo inválido").max(100, "Máximo 100 caracteres"),
      z.literal(""),
      z.null()
    ])
    .transform(val => val ?? ""),
  direccionFiscal: z.string().max(200, "Máximo 200 caracteres").nullable().transform(val => val ?? "").optional(),
  activo: z.boolean().optional(),
  fechaRegistro: z.string().min(1, "La fecha de registro es requerida"),
});

export type ProveedorFormData = z.infer<typeof proveedorFormSchema>; 