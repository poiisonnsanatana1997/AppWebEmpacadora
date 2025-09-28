import { ProductoSimpleDto } from "../Productos/productos.types";

export interface TarimaDTO {
  id: number;
  codigo: string;
  estatus: string;
  fechaRegistro: string; // ISO string
  fechaActualizacion: string; // ISO string
  usuarioRegistro: string;
  usuarioModificacion: string;
  observaciones?: string;
  cantidad: number;
  upc?: string;
  peso: number;
}

export interface CreateTarimaDTO {
  estatus: string;
  fechaRegistro: string; // ISO string
  tipo: string;
  cantidad: number;
  observaciones?: string;
  upc?: string;
  peso: number;
  idClasificacion: number;
  idPedidoCliente: number;
  cantidadTarimas: number;
}

export interface UpdateTarimaDTO {
  codigo: string;
  estatus: string;
  fechaActualizacion: string; // ISO string
  cantidad: number;
  observaciones?: string;
  upc?: string;
  peso: number;
} 

export interface PedidoClienteConDetallesDTO {
  id: number;
  razonSocialCliente: string;
  pesoCajaCliente: number;
}

export interface PedidoTarimaDTO {
  idPedidoCliente: number;
  observaciones?: string;
  estatus: string;
  fechaEmbarque: string; // ISO string
  fechaRegistro: string; // ISO string
  usuarioRegistro: string;
  nombreCliente: string;
  nombreSucursal: string;
}

export interface TarimaClasificacionParcialDTO {
  idClasificacion: number;
  lote: string;
  peso: number;
  tipo: string;
  cantidad: number;
  pesoTotal: number;
  fechaRegistro: string;
  usuarioRegistro: string;
  productos: ProductoSimpleDto[];
}

export interface TarimaParcialCompletaDTO {
  id: number;
  codigo: string;
  estatus: string;
  fechaRegistro: string; // ISO string
  fechaActualizacion: string; // ISO string
  usuarioRegistro: string;
  usuarioModificacion: string;
  observaciones?: string;
  upc?: string;
  peso: number;
  tarimasClasificaciones: TarimaClasificacionParcialDTO[];
  pedidoTarimas: PedidoTarimaDTO[];
}