// DTOs para OrdenPedidoCliente
import { ProductoSimpleDto } from '../Productos/productos.types';

// DTO para crear una nueva orden de pedido cliente
export interface CreateOrdenPedidoClienteDTO {
  tipo: string;
  cantidad?: number;
  peso?: number;
  fechaRegistro: Date;
  idProducto?: number;
  idPedidoCliente: number;
}

export interface CrearOrdenSimpleDTO {
  tipo: string;
  cantidad?: number;
  peso?: number;
  idProducto: number;
}

// DTO para respuestas de la API de órdenes de pedido cliente
export interface OrdenPedidoClienteResponseDTO {
  id: number;
  tipo: string;
  cantidad?: number;
  peso?: number;
  fechaRegistro: Date;
  usuarioRegistro: string;
  producto?: ProductoSimpleDto;
}