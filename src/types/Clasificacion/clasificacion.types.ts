export interface ClasificacionDto {
  id: number;
  lote: string;
  pesoTotal: number;
  fechaRegistro: string;
  usuarioRegistro: string;
  idPedidoProveedor: number;
  xl: number;
  l: number;
  m: number;
  s: number;
  retornos: number;
}

export interface CreateClasificacionDto {
  idPedidoProveedor: number;
}

export interface UpdateClasificacionDto {
  lote?: string;
  pesoTotal?: number;
  idPedidoProveedor?: number;
  xl?: number;
  l?: number;
  m?: number;
  s?: number;
  retornos?: number;
}

export interface AjustePesoClasificacionDto {
  xl?: number;
  l?: number;
  m?: number;
  s?: number;
}

export interface AjustePesoClasificacionResponseDto {
  idClasificacion: number;
  lote: string;
  ajusteRealizado: boolean;
  mensaje: string;
} 