import api from '@/api/axios';
import type { 
  ProveedorCompletoDto, 
  CrearProveedorDto, 
  ActualizarProveedorDto 
} from '@/types/Proveedores/proveedores.types';
import { AxiosError } from 'axios';

export class ProveedorServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'ProveedorServiceError';
  }
}

export const ProveedoresService = {
  async obtenerProveedores(): Promise<ProveedorCompletoDto[]> {
    try {
      const response = await api.get<ProveedorCompletoDto[]>('/Proveedores/completos');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ProveedorServiceError(
          `Error al obtener proveedores: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProveedorServiceError('Error desconocido al obtener proveedores', error);
    }
  },

  async obtenerProveedor(id: number): Promise<ProveedorCompletoDto> {
    try {
      const response = await api.get<ProveedorCompletoDto>(`/Proveedores/completo/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ProveedorServiceError(
          `Error al obtener proveedor: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProveedorServiceError('Error desconocido al obtener proveedor', error);
    }
  },

  async crearProveedor(data: CrearProveedorDto): Promise<ProveedorCompletoDto> {
    try {
      const formData = new FormData();
      formData.append('nombre', data.nombre);
      if (data.rfc) formData.append('rfc', data.rfc);
      if (data.activo !== undefined) formData.append('activo', String(data.activo));
      if (data.telefono) formData.append('telefono', data.telefono);
      if (data.correo) formData.append('correo', data.correo);
      if (data.direccionFiscal) formData.append('direccionFiscal', data.direccionFiscal);
      if (data.situacionFiscal) formData.append('situacionFiscal', data.situacionFiscal);
      formData.append('fechaRegistro', data.fechaRegistro);

      const response = await api.post<ProveedorCompletoDto>('/Proveedores', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ProveedorServiceError(
          `Error al crear proveedor: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProveedorServiceError('Error desconocido al crear proveedor', error);
    }
  },

  async actualizarProveedor(id: number, data: ActualizarProveedorDto): Promise<ProveedorCompletoDto> {
    try {
      const formData = new FormData();
      if (data.nombre) formData.append('nombre', data.nombre);
      if (data.rfc) formData.append('rfc', data.rfc);
      if (data.activo !== undefined) formData.append('activo', String(data.activo));
      if (data.telefono) formData.append('telefono', data.telefono);
      if (data.correo) formData.append('correo', data.correo);
      if (data.direccionFiscal) formData.append('direccionFiscal', data.direccionFiscal);
      if (data.situacionFiscal) formData.append('situacionFiscal', data.situacionFiscal);

      const response = await api.put<ProveedorCompletoDto>(`/Proveedores/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ProveedorServiceError(
          `Error al actualizar proveedor: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProveedorServiceError('Error desconocido al actualizar proveedor', error);
    }
  },

  async eliminarProveedor(id: number): Promise<void> {
    try {
      await api.delete(`/Proveedores/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ProveedorServiceError(
          `Error al eliminar proveedor: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProveedorServiceError('Error desconocido al eliminar proveedor', error);
    }
  }
}; 