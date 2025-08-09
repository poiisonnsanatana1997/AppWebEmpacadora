// DTOs para CajaCliente

// DTO completo para CajaCliente
export interface CajaClienteDTO {
  id: number;
  nombre: string;
  peso: number;
  precio: number;
  idCliente: number;
  nombreCliente: string;
}

// DTO para crear una nueva CajaCliente
export interface CreateCajaClienteDTO {
  nombre: string;
  peso: number;
  precio: number;
  idCliente: number;
}

// DTO para actualizar una CajaCliente existente
export interface UpdateCajaClienteDTO {
  nombre?: string;
  peso?: number;
  precio?: number;
  idCliente?: number;
} 