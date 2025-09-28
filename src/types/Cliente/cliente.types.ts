// Importaciones de tipos existentes
import { SucursalDTO } from '../Sucursales/sucursales.types';
import { CajaClienteDTO } from '../Cajas/cajaCliente.types';

// DTOs para Cliente

// DTO completo para Cliente
export interface ClienteDTO {
  id: number;
  nombre: string;
  razonSocial: string;
  rfc: string;
  constanciaFiscal?: string;
  representanteComercial?: string;
  tipoCliente?: string;
  telefono: string;
  correo?: string;
  activo: boolean;
  fechaRegistro: string; // DateTime en C# se convierte a string en TypeScript
  usuarioRegistro: string;
  sucursales: SucursalDTO[];
  cajasCliente: CajaClienteDTO[];
}

// DTO resumido para Cliente (vista de lista)
export interface ClienteSummaryDTO {
  id: number;
  nombre: string;
  razonSocial: string;
  rfc: string;
  telefono: string;
  correo?: string;
  activo: boolean;
  fechaRegistro: string;
}

// DTO para crear un nuevo Cliente
export interface CreateClienteDTO {
  nombre: string;
  razonSocial: string;
  rfc: string;
  constanciaFiscal?: File; // IFormFile en C# se convierte a File en TypeScript
  representanteComercial?: string;
  tipoCliente?: string;
  telefono: string;
  correo?: string;
  activo: boolean;
  fechaRegistro: string;
}

// DTO para actualizar un Cliente existente
export interface UpdateClienteDTO {
  nombre?: string;
  razonSocial?: string;
  rfc?: string;
  constanciaFiscal?: File;
  representanteComercial?: string;
  tipoCliente?: string;
  telefono?: string;
  correo?: string;
  activo?: boolean;
} 