export interface ProductoDto {
  id: number;
  codigo: string;
  nombre: string;
  variedad: string;
  unidadMedida: string;
  precio: number;
  fechaRegistro: string;
  usuarioRegistro: string;
  imagen: string;
  activo: boolean;
}

export interface BaseProductoDto {
  codigo: string;
  nombre: string;
  variedad: string;
  unidadMedida: string;
  precio: number;
  fecha: string;
  activo: boolean;
  imagen: string;
}

export interface ActualizarProductoDto extends BaseProductoDto {
  id: number;
}