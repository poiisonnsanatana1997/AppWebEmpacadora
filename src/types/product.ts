/**
 * Estado posible de un producto
 */
export type ProductoEstatus = 'Activo' | 'Inactivo' | 'Pendiente';

/**
 * Unidad de medida posible para un producto
 */
export type UnidadMedida = 'kg' | 'g' | 'l' | 'ml' | 'unidad' | 'caja' | 'paquete';

/**
 * Interfaz base para un producto
 */
export interface ProductoBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  variedad?: string;
  unidadMedida?: UnidadMedida;
  precio?: number;
  estatus?: ProductoEstatus;
  activo: boolean;
}

/**
 * Interfaz para un producto en la API
 */
export interface ProductoApi extends ProductoBase {
  id: number;
  imagen?: string;
  createdAt: string;
  updatedAt: string;
  usuarioCreacion: string;
  usuarioModificacion: string;
}

/**
 * Interfaz para los datos de un producto en un formulario
 */
export interface ProductoFormData {
  codigo: string;
  nombre: string;
  descripcion?: string;
  variedad?: string;
  unidadMedida?: UnidadMedida;
  precio?: number;
  imagen?: File;
}

/**
 * Interfaz para la respuesta de la API al crear/actualizar un producto
 */
export interface ProductoResponse {
  success: boolean;
  data: ProductoApi;
  message?: string;
}

/**
 * Interfaz para la respuesta de la API al obtener productos
 */
export interface ProductosResponse {
  success: boolean;
  data: ProductoApi[];
  total: number;
  message?: string;
}

/**
 * Interfaz para los filtros de búsqueda de productos
 */
export interface ProductoFiltros {
  codigo?: string;
  nombre?: string;
  variedad?: string;
  estatus?: ProductoEstatus;
  activo?: boolean;
}

/**
 * Interfaz para las opciones de paginación
 */
export interface PaginacionOptions {
  pagina: number;
  porPagina: number;
  ordenarPor?: keyof ProductoApi;
  orden?: 'asc' | 'desc';
} 