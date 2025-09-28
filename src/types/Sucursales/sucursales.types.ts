export interface SucursalDTO {
  id: number;
  nombre: string;
  direccion: string;
  encargadoAlmacen?: string;
  telefono: string;
  correo?: string;
  activo: boolean;
  fechaRegistro: string; // ISO string
  usuarioRegistro: string;
  idCliente: number;
}

export interface SucursalSummaryDTO {
  id: number;
  nombre: string;
  direccion: string;
  encargadoAlmacen?: string;
}

export interface CreateSucursalDTO {
  nombre: string; // Required, max 150 characters
  direccion: string; // Required, max 200 characters
  encargadoAlmacen?: string; // Optional, max 50 characters
  telefono: string; // Required, max 20 characters
  correo?: string; // Optional, max 100 characters
  activo?: boolean; // Defaults to true
  idCliente: number; // Required
}

export interface UpdateSucursalDTO {
  nombre?: string; // Optional, max 150 characters
  direccion?: string; // Optional, max 200 characters
  encargadoAlmacen?: string; // Optional, max 50 characters
  telefono?: string; // Optional, max 20 characters
  correo?: string; // Optional, max 100 characters
  activo?: boolean; // Optional
  idCliente?: number; // Optional
} 