import type { ProductoDto, ActualizarProductoDto } from '@/types/Productos/productos.types';
import api from '@/api/axios';
import { AxiosError } from 'axios';

/**
 * Custom error class for product service errors
 */
export class ProductoServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'ProductoServiceError';
  }
}

/**
 * Servicio para gestionar los productos del sistema
 * @namespace ProductosService
 */
export const ProductosService = {
  /**
   * Obtiene todos los productos desde la API externa
   * @returns {Promise<ProductoDto[]>} Lista de productos
   * @throws {ProductoServiceError} Si hay un error al obtener los productos
   */
  async obtenerProductos(): Promise<ProductoDto[]> {
    try {
      const response = await api.get<ProductoDto[]>('/productos/detalle');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ProductoServiceError(
          `Error al obtener productos: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProductoServiceError('Error desconocido al obtener productos', error);
    }
  },

  /**
   * Obtiene un producto por su ID desde la API externa
   * @param {number} id - ID del producto
   * @returns {Promise<ProductoDto>} Producto encontrado
   * @throws {ProductoServiceError} Si hay un error al obtener el producto o si no se encuentra
   */
  async obtenerProducto(id: number): Promise<ProductoDto> {
    try {
      const response = await api.get<ProductoDto>(`/productos/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new ProductoServiceError(`Producto con ID ${id} no encontrado`, error);
        }
        throw new ProductoServiceError(
          `Error al obtener el producto: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProductoServiceError('Error desconocido al obtener el producto', error);
    }
  },

  /**
   * Crea un nuevo producto según la especificación de la API externa
   * @param {FormData} formData - Datos del producto
   * @returns {Promise<ActualizarProductoDto>} Producto creado
   * @throws {ProductoServiceError} Si hay un error al crear el producto
   */
  async crearProducto(formData: FormData): Promise<ActualizarProductoDto> {
    try {
      // Convertir la imagen base64 a blob
      const imagenBase64 = formData.get('imagen') as string;
      if (imagenBase64) {
        const response = await fetch(imagenBase64);
        const blob = await response.blob();
        formData.set('imagen', blob, 'imagen.jpg');
      }

      const response = await api.post<ActualizarProductoDto>('/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ProductoServiceError(
          `Error al crear el producto: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProductoServiceError('Error desconocido al crear el producto', error);
    }
  },

  /**
   * Actualiza un producto existente usando la API externa
   * @param {number} id - ID del producto
   * @param {FormData} data - Datos a actualizar
   * @returns {Promise<ActualizarProductoDto>} Producto actualizado
   * @throws {ProductoServiceError} Si hay un error al actualizar el producto
   */
  async actualizarProducto(id: number, data: FormData): Promise<ActualizarProductoDto> {
    try {
      // Convertir la imagen base64 a blob solo si hay una nueva imagen
      const imagenBase64 = data.get('imagen') as string;
      if (imagenBase64 && imagenBase64.startsWith('data:')) {
        try {
          const response = await fetch(imagenBase64);
          const blob = await response.blob();
          data.set('imagen', blob, 'imagen.jpg');
        } catch (error) {
          console.error('Error al convertir la imagen:', error);
          // Si hay error al convertir, dejamos la imagen como está
        }
      } else if (!imagenBase64) {
        // Si no hay imagen nueva, eliminamos el campo para mantener la existente
        data.delete('imagen');
      }

      const response = await api.put<ActualizarProductoDto>(`/productos/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new ProductoServiceError(`Producto con ID ${id} no encontrado`, error);
        }
        throw new ProductoServiceError(
          `Error al actualizar el producto: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProductoServiceError('Error desconocido al actualizar el producto', error);
    }
  },

  /**
   * Elimina un producto usando la API externa
   * @param {number} id - ID del producto
   * @throws {ProductoServiceError} Si hay un error al eliminar el producto
   */
  async eliminarProducto(id: number): Promise<void> {
    try {
      await api.delete(`/productos/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new ProductoServiceError(`Producto con ID ${id} no encontrado`, error);
        }
        throw new ProductoServiceError(
          `Error al eliminar el producto: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProductoServiceError('Error desconocido al eliminar el producto', error);
    }
  },

  /**
   * Reactiva un producto usando la API externa
   * @param {number} id - ID del producto
   * @returns {Promise<ActualizarProductoDto>} Producto reactivado
   * @throws {ProductoServiceError} Si hay un error al reactivar el producto
   */
  async reactivarProducto(id: number): Promise<ActualizarProductoDto> {
    try {
      const response = await api.post<ActualizarProductoDto>(`/productos/${id}/reactivar`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new ProductoServiceError(`Producto con ID ${id} no encontrado`, error);
        }
        throw new ProductoServiceError(
          `Error al reactivar el producto: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProductoServiceError('Error desconocido al reactivar el producto', error);
    }
  }
}; 