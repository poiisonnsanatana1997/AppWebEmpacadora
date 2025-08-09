export interface SucursalDTO {
  id: number;
  nombre: string;
  codigo: string;
  direccion: string;
  telefono: string;
  correo: string;
  encargado: string;
  activo: boolean;
  fechaRegistro: string; // ISO string
  usuarioRegistro: string;
}

export interface CrearSucursalDto {
  nombre: string;
  codigo: string;
  direccion: string;
  telefono?: string;
  correo?: string;
  encargado?: string;
  activo?: boolean;
  fechaRegistro: string;
}

export interface ActualizarSucursalDto {
  nombre?: string;
  codigo?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  encargado?: string;
  activo?: boolean;
}

// DTO resumido para Sucursal
export interface SucursalSummaryDTO {
  id: number;
  nombre: string;
  codigo: string;
  activo: boolean;
} 