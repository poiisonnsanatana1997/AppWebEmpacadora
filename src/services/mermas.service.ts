import type { MermaDto, CreateMermaDto, UpdateMermaDto } from '@/types/Mermas/mermas.types';
import api from '@/api/axios';
import { AxiosError } from 'axios';

export class MermaServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'MermaServiceError';
  }
}

export const MermasService = {
  async getAll(): Promise<MermaDto[]> {
    try {
      const response = await api.get<MermaDto[]>('/Merma');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new MermaServiceError(
          `Error al obtener mermas: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new MermaServiceError('Error desconocido al obtener mermas', error);
    }
  },

  async getById(id: number): Promise<MermaDto> {
    try {
      const response = await api.get<MermaDto>(`/Merma/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new MermaServiceError(`Merma con ID ${id} no encontrada`, error);
        }
        throw new MermaServiceError(
          `Error al obtener la merma: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new MermaServiceError('Error desconocido al obtener la merma', error);
    }
  },

  async create(data: CreateMermaDto): Promise<MermaDto> {
    try {
      const response = await api.post<MermaDto>('/Merma', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new MermaServiceError(
          `Error al crear la merma: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new MermaServiceError('Error desconocido al crear la merma', error);
    }
  },

  async update(id: number, data: UpdateMermaDto): Promise<MermaDto> {
    try {
      const response = await api.put<MermaDto>(`/Merma/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new MermaServiceError(`Merma con ID ${id} no encontrada`, error);
        }
        throw new MermaServiceError(
          `Error al actualizar la merma: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new MermaServiceError('Error desconocido al actualizar la merma', error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/Merma/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new MermaServiceError(`Merma con ID ${id} no encontrada`, error);
        }
        throw new MermaServiceError(
          `Error al eliminar la merma: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new MermaServiceError('Error desconocido al eliminar la merma', error);
    }
  }
}; 