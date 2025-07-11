export interface RetornoDto {
  id: number;
  numero: string;
  peso: number;
  observaciones?: string;
  fechaRegistro: string; // ISO string
  usuarioRegistro: string;
  idClasificacion: number;
}

export interface CreateRetornoDto {
  numero: string;
  peso: number;
  observaciones?: string;
  fechaRegistro: string; // ISO string
  idClasificacion: number;
}

export interface UpdateRetornoDto {
  numero?: string;
  peso?: number;
  observaciones?: string;
} 