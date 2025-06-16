import { ProductoApi } from '@/types/product';
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
   * @returns {Promise<ProductoApi[]>} Lista de productos
   * @throws {ProductoServiceError} Si hay un error al obtener los productos
   */
  async obtenerProductos(): Promise<ProductoApi[]> {
    try {
      const response = await api.get<ProductoApi[]>('/productos');
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
   * @returns {Promise<ProductoApi>} Producto encontrado
   * @throws {ProductoServiceError} Si hay un error al obtener el producto o si no se encuentra
   */
  async obtenerProducto(id: number): Promise<ProductoApi> {
    try {
      const response = await api.get<ProductoApi>(`/productos/${id}`);
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
   * @returns {Promise<ProductoApi>} Producto creado
   * @throws {ProductoServiceError} Si hay un error al crear el producto
   */
  async crearProducto(formData: FormData): Promise<ProductoApi> {
    try {
      const response = await api.post<ProductoApi>('/productos', formData, {
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
   * @param {FormData} formData - Datos a actualizar
   * @returns {Promise<ProductoApi>} Producto actualizado
   * @throws {ProductoServiceError} Si hay un error al actualizar el producto
   */
  async actualizarProducto(id: number, formData: FormData): Promise<ProductoApi> {
    try {
      const response = await api.put<ProductoApi>(`/productos/${id}`, formData, {
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
   * Importa productos desde un archivo usando la API externa
   * @param {File} archivo - Archivo a importar (formato soportado: Excel, CSV)
   * @throws {ProductoServiceError} Si hay un error al importar los productos
   */
  async importarProductos(archivo: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      await api.post('/productos/importar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ProductoServiceError(
          `Error al importar productos: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ProductoServiceError('Error desconocido al importar productos', error);
    }
  },

  /**
   * Reactiva un producto usando la API externa
   * @param {number} id - ID del producto
   * @returns {Promise<ProductoApi>} Producto reactivado
   * @throws {ProductoServiceError} Si hay un error al reactivar el producto
   */
  async reactivarProducto(id: number): Promise<ProductoApi> {
    try {
      const response = await api.post<ProductoApi>(`/productos/${id}/reactivar`);
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