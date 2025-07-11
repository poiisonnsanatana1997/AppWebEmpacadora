import type { RetornoDto, CreateRetornoDto, UpdateRetornoDto } from '@/types/Retornos/retornos.types';
import api from '@/api/axios';
import { AxiosError } from 'axios';

export class RetornoServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'RetornoServiceError';
  }
}

export const RetornosService = {
  async getAll(): Promise<RetornoDto[]> {
    try {
      const response = await api.get<RetornoDto[]>('/Retorno');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new RetornoServiceError(
          `Error al obtener retornos: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new RetornoServiceError('Error desconocido al obtener retornos', error);
    }
  },

  async getById(id: number): Promise<RetornoDto> {
    try {
      const response = await api.get<RetornoDto>(`/Retorno/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new RetornoServiceError(`Retorno con ID ${id} no encontrado`, error);
        }
        throw new RetornoServiceError(
          `Error al obtener el retorno: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new RetornoServiceError('Error desconocido al obtener el retorno', error);
    }
  },

  async create(data: CreateRetornoDto): Promise<RetornoDto> {
    try {
      const response = await api.post<RetornoDto>('/Retorno', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new RetornoServiceError(
          `Error al crear el retorno: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new RetornoServiceError('Error desconocido al crear el retorno', error);
    }
  },

  async update(id: number, data: UpdateRetornoDto): Promise<RetornoDto> {
    try {
      const response = await api.put<RetornoDto>(`/Retorno/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new RetornoServiceError(`Retorno con ID ${id} no encontrado`, error);
        }
        throw new RetornoServiceError(
          `Error al actualizar el retorno: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new RetornoServiceError('Error desconocido al actualizar el retorno', error);
    }
  },

  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/Retorno/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new RetornoServiceError(`Retorno con ID ${id} no encontrado`, error);
        }
        throw new RetornoServiceError(
          `Error al eliminar el retorno: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new RetornoServiceError('Error desconocido al eliminar el retorno', error);
    }
  }
}; 