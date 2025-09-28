// DTOs para CajaCliente

// DTO completo para CajaCliente
export interface CajaClienteDTO {
  id: number;
  nombre?: string;
  peso: number;
  precio?: number;
  idCliente: number;
  nombreCliente: string;
}

// DTO para crear una nueva CajaCliente
export interface CreateCajaClienteDTO {
  nombre?: string; // StringLength(50) - opcional
  peso: number; // Required
  precio?: number; // opcional
  idCliente: number; // Required
}

// DTO para actualizar una CajaCliente existente
export interface UpdateCajaClienteDTO {
  nombre?: string; // StringLength(50) - opcional
  peso?: number; // opcional
  precio?: number; // opcional
  idCliente?: number; // opcional
} 