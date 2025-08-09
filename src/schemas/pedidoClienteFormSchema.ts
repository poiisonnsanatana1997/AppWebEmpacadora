import { z } from 'zod';

// Esquema para crear/actualizar pedido cliente
export const pedidoClienteFormSchema = z.object({
  observaciones: z.string()
    .min(1, 'Las observaciones son requeridas')
    .max(500, 'Las observaciones no pueden exceder 500 caracteres'),
  
  estatus: z.enum(['Pendiente', 'En Proceso', 'Completado', 'Cancelado'], {
    required_error: 'Debe seleccionar un estatus',
  }),
  
  fechaEmbarque: z.date().optional(),
  
  idSucursal: z.number({
    required_error: 'Debe seleccionar una sucursal',
  }).min(1, 'Debe seleccionar una sucursal'),
  
  idCliente: z.number({
    required_error: 'Debe seleccionar un cliente',
  }).min(1, 'Debe seleccionar un cliente'),
  
  activo: z.boolean().default(true),
});

// Esquema para filtros
export const pedidoClienteFiltersSchema = z.object({
  search: z.string().optional(),
  estatus: z.enum(['Pendiente', 'En Proceso', 'Completado', 'Cancelado']).optional(),
  idCliente: z.number().optional(),
  idSucursal: z.number().optional(),
  fechaDesde: z.date().optional(),
  fechaHasta: z.date().optional(),
  activo: z.boolean().optional(),
});

// Tipos inferidos de los esquemas
export type PedidoClienteFormData = z.infer<typeof pedidoClienteFormSchema>;
export type PedidoClienteFiltersData = z.infer<typeof pedidoClienteFiltersSchema>; 