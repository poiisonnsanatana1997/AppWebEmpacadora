export interface ProveedorCompletoDto {
  id: number;
  nombre: string;
  rfc: string;
  activo: boolean;
  telefono: string;
  correo: string;
  direccionFiscal: string;
  situacionFiscal: string;
  fechaRegistro: string; // ISO string
  usuarioRegistro: string;
}

export interface CrearProveedorDto {
  nombre: string;
  rfc?: string;
  activo?: boolean;
  telefono?: string;
  correo?: string;
  direccionFiscal?: string;
  situacionFiscal?: File | null;
  fechaRegistro: string;
}

export interface ActualizarProveedorDto {
  nombre?: string;
  rfc?: string;
  activo?: boolean;
  telefono?: string;
  correo?: string;
  direccionFiscal?: string;
  situacionFiscal?: File | null;
} 