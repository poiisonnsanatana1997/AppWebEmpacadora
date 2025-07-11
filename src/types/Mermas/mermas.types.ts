export interface MermaDto {
  id: number;
  tipo: string;
  peso: number;
  observaciones?: string;
  fechaRegistro: string; // ISO string
  usuarioRegistro: string;
  idClasificacion: number;
}

export interface CreateMermaDto {
  tipo: string;
  peso: number;
  observaciones?: string;
  fechaRegistro: string; // ISO string
  idClasificacion: number;
}

export interface UpdateMermaDto {
  tipo?: string;
  peso?: number;
  observaciones?: string;
} 