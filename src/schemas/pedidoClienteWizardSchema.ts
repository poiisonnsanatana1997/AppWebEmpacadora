import { z } from 'zod';

// Schema para el paso de información básica
export const informacionBasicaSchema = z.object({
  idCliente: z.number({
    required_error: 'Debe seleccionar un cliente',
  }).min(1, 'Debe seleccionar un cliente'),
  
  idSucursal: z.number({
    required_error: 'Debe seleccionar una sucursal',
  }).min(1, 'Debe seleccionar una sucursal'),
  
  observaciones: z.string()
    .max(500, 'Las observaciones no pueden exceder 500 caracteres')
    .optional(),
  
  estatus: z.enum(['Pendiente', 'En Proceso', 'Completado', 'Cancelado'], {
    required_error: 'Debe seleccionar un estatus',
  }),
  
  fechaEmbarque: z.date().optional(),
  
  activo: z.boolean().default(true),
});

// Schema para una orden individual (con id temporal para el frontend)
export const ordenSchema = z.object({
  id: z.number(), // ID temporal para el frontend
  tipo: z.string().min(1, 'El tipo es requerido'),
  cantidad: z.number().min(0, 'La cantidad no puede ser negativa').optional(),
  peso: z.number().min(0, 'El peso no puede ser negativo').optional(),
  idProducto: z.number().min(1, 'Debe seleccionar un producto'),
});

// Schema para el paso de órdenes
export const ordenesSchema = z.object({
  ordenes: z.array(ordenSchema).min(1, 'Debe agregar al menos una orden'),
});

// Schema completo del wizard
export const pedidoClienteWizardSchema = z.object({
  // Paso 1: Información básica
  ...informacionBasicaSchema.shape,
  
  // Paso 2: Órdenes
  ...ordenesSchema.shape,
});

// Tipos inferidos
export type InformacionBasicaData = z.infer<typeof informacionBasicaSchema>;
export type OrdenData = z.infer<typeof ordenSchema>;
export type OrdenesData = z.infer<typeof ordenesSchema>;
export type PedidoClienteWizardData = z.infer<typeof pedidoClienteWizardSchema>;

// Tipos para el estado del wizard
export type WizardStep = 'informacion' | 'ordenes' | 'resumen';

export interface WizardState {
  currentStep: WizardStep;
  steps: {
    informacion: boolean;
    ordenes: boolean;
    resumen: boolean;
  };
  data: Partial<PedidoClienteWizardData>;
} 