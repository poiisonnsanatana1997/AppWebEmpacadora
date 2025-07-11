import { TarimaDTO } from '../Tarimas/tarima.types';
import { ProductoDto, ProveedorDto } from './ordenesEntrada.types';

// DTO principal para la página de clasificación en órdenes de entrada

export interface PedidoCompletoDTO {
  id: number;
  codigo: string;
  estado: string;
  fechaRegistro: string; // ISO string
  fechaEstimada: string; // ISO string
  fechaRecepcion?: string; // ISO string | undefined
  usuarioRegistro: string;
  usuarioRecepcion?: string;
  observaciones?: string;
  proveedor: ProveedorDto;
  producto: ProductoDto;
  clasificaciones: ClasificacionCompletaDTO[];
}

export interface ClasificacionCompletaDTO {
  id: number;
  lote: string;
  pesoTotal: number;
  fechaRegistro: string; // ISO string
  usuarioRegistro: string;
  xl: number;
  l: number;
  m: number;
  s: number;
  retornos: number;
  mermas: MermaDetalleDTO[];
  retornosDetalle: RetornoDetalleDTO[];
  tarimasClasificaciones: TarimaClasificacionDTO[];
}

export interface MermaDetalleDTO {
  id: number;
  tipo: string;
  peso: number;
  observaciones?: string;
  fechaRegistro: string; // ISO string
  usuarioRegistro: string;
}

export interface RetornoDetalleDTO {
  id: number;
  numero: string;
  peso: number;
  observaciones?: string;
  fechaRegistro: string; // ISO string
  usuarioRegistro: string;
}

export interface TarimaClasificacionDTO {
  idTarima: number;
  idClasificacion: number;
  peso: number;
  tipo: string;
  tarima: TarimaDTO;
} 