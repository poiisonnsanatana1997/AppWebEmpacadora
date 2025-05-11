import { Product } from '@/types/product';
import api from './axios';

const productsService = {
  /**
   * Crea un nuevo producto
   * @param formData FormData con los datos del producto
   * @returns Promesa con el producto creado
   */
  createProduct: async (formData: FormData): Promise<Product> => {
    try {
      const response = await api.post<Product>('/products', formData, {
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
   * Obtiene todos los productos
   * @returns Promesa con la lista de productos
   */
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>('/products');
      console.log(response.data);
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
   * Obtiene un producto por ID
   * @param id ID del producto
   * @returns Promesa con el producto
   */
  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await api.get<Product>(`/products/${id}`);
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
   * Actualiza un producto existente
   * @param id ID del producto
   * @param formData FormData con los datos a actualizar
   * @returns Promesa con el producto actualizado
   */
  updateProduct: async (id: number, formData: FormData): Promise<Product> => {
    try {
      const response = await api.put<Product>(`/products/${id}`, formData, {
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
   * Elimina un producto por ID
   * @param id ID del producto
   * @returns Promesa void
   */
  deleteProduct: async (id: number): Promise<void> => {
    try {
      await api.delete(`/products/${id}`);
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
};

export default productsService; 