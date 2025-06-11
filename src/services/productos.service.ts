import { ProductoApi } from '@/types/product';
import api from '@/api/axios';

/**
 * Servicio para gestionar los productos del sistema
 * @namespace ProductosService
 */
export const ProductosService = {
  /**
   * Obtiene todos los productos desde la API externa
   * @returns {Promise<ProductoApi[]>} Lista de productos
   */
  async obtenerProductos(): Promise<ProductoApi[]> {
    try {
      const response = await api.get<ProductoApi[]>('/productos/detalle');
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        throw {
          message: data.message || 'Error al obtener los productos',
          code: data.code || 'UNKNOWN_ERROR',
          status
        };
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  },

  /**
   * Obtiene un producto por su ID desde la API externa
   * @param {number} id - ID del producto
   * @returns {Promise<ProductoApi | undefined>} Producto encontrado
   */
  async obtenerProducto(id: number): Promise<ProductoApi | undefined> {
    try {
      const response = await api.get<ProductoApi>(`/productos/${id}/detalle`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 404) {
          throw {
            message: 'Producto no encontrado',
            code: 'NOT_FOUND',
            status
          };
        } else {
          throw {
            message: data.message || 'Error al obtener el producto',
            code: data.code || 'UNKNOWN_ERROR',
            status
          };
        }
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  },

  /**
   * Crea un nuevo producto según la especificación de la API externa
   * @param {FormData} formData - Datos del producto
   * @returns {Promise<ProductoApi>} Producto creado
   */
  async crearProducto(formData: FormData): Promise<ProductoApi> {
    try {
      const response = await api.post<ProductoApi>('/productos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) {
          throw {
            message: data.message || 'Datos inválidos. Por favor, verifica la información proporcionada',
            code: 'INVALID_DATA',
            status
          };
        } else if (status >= 500) {
          throw {
            message: 'Error en el servidor. Por favor, intenta más tarde',
            code: 'SERVER_ERROR',
            status
          };
        } else {
          throw {
            message: data.message || 'Error al crear el producto',
            code: data.code || 'UNKNOWN_ERROR',
            status
          };
        }
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  },

  /**
   * Actualiza un producto existente usando la API externa
   * @param {number} id - ID del producto
   * @param {FormData} formData - Datos a actualizar
   * @returns {Promise<ProductoApi>} Producto actualizado
   */
  async actualizarProducto(id: number, formData: FormData): Promise<ProductoApi> {
    try {
      const response = await api.put<ProductoApi>(`/productos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) {
          throw {
            message: data.message || 'Datos inválidos. Por favor, verifica la información proporcionada',
            code: 'INVALID_DATA',
            status
          };
        } else if (status === 404) {
          throw {
            message: 'Producto no encontrado',
            code: 'NOT_FOUND',
            status
          };
        } else if (status >= 500) {
          throw {
            message: 'Error en el servidor. Por favor, intenta más tarde',
            code: 'SERVER_ERROR',
            status
          };
        } else {
          throw {
            message: data.message || 'Error al actualizar el producto',
            code: data.code || 'UNKNOWN_ERROR',
            status
          };
        }
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  },

  /**
   * Elimina un producto usando la API externa
   * @param {number} id - ID del producto
   * @returns {Promise<void>}
   */
  async eliminarProducto(id: number): Promise<void> {
    try {
      await api.delete(`/productos/${id}`);
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 404) {
          throw {
            message: 'Producto no encontrado',
            code: 'NOT_FOUND',
            status
          };
        } else {
          throw {
            message: data.message || 'Error al eliminar el producto',
            code: data.code || 'UNKNOWN_ERROR',
            status
          };
        }
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  },

  /**
   * Importa productos desde un archivo usando la API externa
   * @param {File} archivo - Archivo a importar (formato soportado: Excel, CSV)
   * @returns {Promise<ProductoApi[]>} Lista de productos importados
   */
  async importarProductos(archivo: File): Promise<ProductoApi[]> {
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      const response = await api.post<ProductoApi[]>('/productos/importar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        throw {
          message: data.message || 'Error al importar los productos',
          code: data.code || 'UNKNOWN_ERROR',
          status
        };
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  }
}; 