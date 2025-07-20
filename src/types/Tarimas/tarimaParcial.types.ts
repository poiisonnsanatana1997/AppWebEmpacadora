export interface TarimaParcialSeleccionadaDTO {
  id: number;
  codigo: string;
  estatus: string;
  fechaRegistro: string;
  fechaActualizacion: string;
  usuarioRegistro: string;
  usuarioModificacion: string;
  observaciones?: string;
  upc?: string;
  peso: number;
  tarimasClasificaciones: TarimaClasificacionParcialDTO[];
  pedidoTarimas: PedidoTarimaDTO[];
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
}

export interface PedidoTarimaDTO {
  idPedidoCliente: number;
  observaciones?: string;
  estatus: string;
  fechaEmbarque: string;
  fechaRegistro: string;
  usuarioRegistro: string;
  nombreCliente: string;
  nombreSucursal: string;
}



export interface TarimaParcialFiltradaDTO {
  id: number;
  codigo: string;
  estatus: string;
  cantidad: number;
  peso: number;
  tipo: string;
  lote: string;
  cliente: string;
  sucursal: string;
  fechaRegistro: string;
}

// DTO para la actualización de tarima parcial
export interface TarimaUpdateParcialDTO {
  estatus: string;
  cantidad: number;
  idTarima: number;
  idClasificacion: number;
  tipo: string;
} 