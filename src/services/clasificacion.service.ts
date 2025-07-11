import type { ClasificacionDto, CreateClasificacionDto, UpdateClasificacionDto, AjustePesoClasificacionDto, AjustePesoClasificacionResponseDto } from '@/types/Clasificacion/clasificacion.types';
import api from '@/api/axios';
import { AxiosError } from 'axios';

export class ClasificacionServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'ClasificacionServiceError';
  }
}

export const ClasificacionService = {
  async getAll(): Promise<ClasificacionDto[]> {
    try {
      const response = await api.get<ClasificacionDto[]>('/Clasificaciones');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ClasificacionServiceError(
          `Error al obtener clasificaciones: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ClasificacionServiceError('Error desconocido al obtener clasificaciones', error);
    }
  },

  async getById(id: number): Promise<ClasificacionDto> {
    try {
      const response = await api.get<ClasificacionDto>(`/Clasificaciones/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new ClasificacionServiceError(`Clasificación con ID ${id} no encontrada`, error);
        }
        throw new ClasificacionServiceError(
          `Error al obtener la clasificación: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ClasificacionServiceError('Error desconocido al obtener la clasificación', error);
    }
  },

  async create(data: CreateClasificacionDto): Promise<ClasificacionDto> {
    try {
      const response = await api.post<ClasificacionDto>('/Clasificaciones', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ClasificacionServiceError(
          `Error al crear la clasificación: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ClasificacionServiceError('Error desconocido al crear la clasificación', error);
    }
  },

  async update(id: number, data: UpdateClasificacionDto): Promise<ClasificacionDto> {
    try {
      const response = await api.put<ClasificacionDto>(`/Clasificaciones/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new ClasificacionServiceError(`Clasificación con ID ${id} no encontrada`, error);
        }
        throw new ClasificacionServiceError(
          `Error al actualizar la clasificación: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ClasificacionServiceError('Error desconocido al actualizar la clasificación', error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/Clasificaciones/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new ClasificacionServiceError(`Clasificación con ID ${id} no encontrada`, error);
        }
        throw new ClasificacionServiceError(
          `Error al eliminar la clasificación: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ClasificacionServiceError('Error desconocido al eliminar la clasificación', error);
    }
  },

  async ajustarPesoClasificacion(
    id: number,
    ajuste: AjustePesoClasificacionDto
  ): Promise<AjustePesoClasificacionResponseDto> {
    try {
      const response = await api.post<AjustePesoClasificacionResponseDto>(
        `/Clasificaciones/${id}/ajustar-peso`,
        ajuste
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ClasificacionServiceError(
          `Error al ajustar el peso de la clasificación: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ClasificacionServiceError('Error desconocido al ajustar el peso de la clasificación', error);
    }
  }
}; 