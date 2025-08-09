// DTOs para PedidoCliente

import { CrearOrdenSimpleDTO, OrdenPedidoClienteResponseDTO } from "./ordenPedidoCliente.types";
import { ProductoSimpleDto } from "../Productos/productos.types";
import { ClienteSummaryDTO } from "../Cliente/cliente.types";
import { SucursalSummaryDTO } from "../Sucursales/sucursales.types";

// DTO para crear un nuevo pedido de cliente
export interface CreatePedidoClienteDTO {
  observaciones?: string;
  estatus: string;
  fechaEmbarque?: Date;
  idSucursal: number;
  idCliente: number;
  fechaRegistro: Date;
  activo: boolean;
  ordenes: CrearOrdenSimpleDTO[];
}

// DTO para actualizar un pedido de cliente existente
export interface UpdatePedidoClienteDTO {
  observaciones?: string;
  estatus?: string;
  fechaEmbarque?: Date;
  fechaModificacion?: Date;
  activo?: boolean;
}

// DTO para respuesta de pedido de cliente
export interface PedidoClienteResponseDTO {
  id: number;
  observaciones?: string;
  estatus: string;
  fechaEmbarque?: Date;
  fechaModificacion?: Date;
  fechaRegistro: Date;
  usuarioRegistro: string;
  activo: boolean;
  sucursal: string;
  cliente: string;
  porcentajeSurtido: number;
  ordenes: OrdenPedidoClienteResponseDTO[];
}

// DTO para pedido de cliente con detalles simplificados
export interface PedidoClienteConDetalleDTO {
  id: number;
  razonSocialCliente: string;
  pesoCajaCliente: number;
}

// Tipo para el estado del pedido
export type PedidoClienteEstatus = 
  | 'Pendiente'
  | 'Surtiendo'
  | 'Surtido'
  | 'Embarcado'
  | 'Entregado'
  | 'Cancelado';

// Interfaz para filtros de búsqueda
export interface PedidoClienteFilters {
  estatus?: PedidoClienteEstatus | 'all';
  idCliente?: number;
  idSucursal?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
  activo?: boolean;
}

// Interfaz para paginación de pedidos de cliente
export interface PedidoClientePagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Interfaz para respuesta paginada
export interface PedidoClientePagedResponse {
  items: PedidoClienteResponseDTO[];
  pagination: PedidoClientePagination;
}

// DTO para pedidos de cliente por asignar
export interface PedidoClientePorAsignarDTO {
  id: number;
  tipo: string;
  cantidad: number;
  peso: number;
  pesoCajaCliente: number;
  producto: ProductoSimpleDto;
  cliente: ClienteSummaryDTO;
  sucursal: SucursalSummaryDTO;
}

// DTO para el progreso de clasificación de tarimas
export interface TarimaClasificacionProgresoDTO {
  tipo: string;
  peso?: number;
  cantidad?: number;
  producto?: ProductoSimpleDto;
}

// DTO para el progreso de tarimas
export interface TarimaProgresoDTO {
  id: number;
  codigo: string;
  estatus: string;
  observaciones?: string;
  upc?: string;
  peso?: number;
  tarimasClasificaciones: TarimaClasificacionProgresoDTO[];
}

// DTO para el progreso de pedidos de cliente
export interface PedidoClienteProgresoDTO {
  id: number;
  estatus: string;
  porcentajeSurtido: number;
  observaciones?: string;
  ordenes: OrdenPedidoClienteResponseDTO[];
  tarimas: TarimaProgresoDTO[];
}
