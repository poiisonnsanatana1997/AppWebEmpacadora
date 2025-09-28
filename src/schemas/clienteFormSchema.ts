import { z } from "zod";

export const clienteFormSchema = z.object({
  nombre: z.string()
    .min(1, "El nombre es requerido")
    .max(150, "El nombre no puede exceder 150 caracteres"),
  razonSocial: z.string()
    .min(1, "La razón social es requerida")
    .max(200, "La razón social no puede exceder 200 caracteres"),
  rfc: z.string()
    .min(1, "El RFC es requerido")
    .max(13, "El RFC no puede exceder 13 caracteres"),
  telefono: z.string()
    .min(1, "El teléfono es requerido")
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .regex(
      /^(\+52\s?)?(\(?[0-9]{2,3}\)?[\s-]?[0-9]{3,4}[\s-]?[0-9]{4}|[0-9]{10})$/,
      "Formato de teléfono inválido. Use: 10 dígitos, (55) 1234-5678, +52 55 1234 5678"
    ),
  correo: z.string()
    .email("Formato de correo electrónico inválido")
    .max(100, "El correo no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
  representanteComercial: z.string()
    .max(100, "El representante comercial no puede exceder 100 caracteres")
    .optional()
    .or(z.literal("")),
  tipoCliente: z.string()
    .min(1, "El tipo de cliente es requerido")
    .max(50, "El tipo de cliente no puede exceder 50 caracteres"),
  activo: z.boolean().default(true),
  constanciaFiscal: z.any().optional(),
});

export type ClienteFormData = z.infer<typeof clienteFormSchema>;
