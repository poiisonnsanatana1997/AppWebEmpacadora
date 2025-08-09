export interface CajaDto {
  id: number;
  tipo: string;
  cantidad: number | null;
  peso: number | null;
  fechaRegistro: string;
  usuarioRegistro: string;
  idClasificacion: number | null;
}

export interface AjustarCantidadCajaDto {
  tipo: string;
  cantidadAjuste: number;
  pesoAjuste: number | null;
  idClasificacion: number | null;
}

// DTOs para CajaCliente siguiendo las buenas prácticas
export interface CajaClienteDto {
  id: number;
  nombre: string;
  peso: number;
  precio: number;
  idCliente: number;
  nombreCliente: string;
  fechaRegistro: string;
  usuarioRegistro: string;
}

export interface CrearCajaClienteDto {
  nombre: string;
  peso: number;
  precio: number;
  idCliente: number;
}

export interface ActualizarCajaClienteDto {
  nombre?: string;
  peso?: number;
  precio?: number;
  idCliente?: number;
}

 