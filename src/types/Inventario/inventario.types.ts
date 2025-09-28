import type { TarimaParcialCompletaDTO } from '../Tarimas/tarima.types';

/**
 * Interface para los filtros de inventario
 */
export interface InventarioFilters {
  busqueda: string;
  estatus: string;
  cliente: string;
}

/**
 * Interface para el estado de la tabla de inventario
 */
export interface InventarioTableState {
  page: number;
  pageSize: number;
  sortBy: keyof InventarioTipoDTO;
  sortOrder: 'asc' | 'desc';
}

/**
 * Interface para los datos procesados de inventario por tipo
 */
export interface InventarioTipoDTO {
  codigo: string;
  tipo: string;
  pesoTotalPorTipo: number;
  cliente: string;
  sucursal: string;
  lote: string;
  fechaRegistro: string;
  estatus: string;
  tarimaOriginal: TarimaParcialCompletaDTO;
}

/**
 * Interface para los indicadores de inventario
 */
export interface IndicadoresInventarioDTO {
  pesoTotalInventario: number;
  tarimasAsignadas: number;
  tarimasNoAsignadas: number;
  pesoTotalSinAsignar: number;
}

/**
 * Interface para las opciones de filtros disponibles
 */
export interface OpcionesFiltrosInventario {
  estatuses: string[];
  clientes: string[];
}

/**
 * Interface para el estado completo del módulo de inventario
 */
export interface InventarioState {
  datos: InventarioTipoDTO[];
  indicadores: IndicadoresInventarioDTO | null;
  filtros: InventarioFilters;
  opcionesFiltros: OpcionesFiltrosInventario;
  tabla: InventarioTableState;
  isLoading: boolean;
  error: string | null;
  selectedTarima: TarimaParcialCompletaDTO | null;
  isDetailModalOpen: boolean;
}

/**
 * Tipos para las columnas de la tabla
 */
export type InventarioTableColumn = 
  | 'codigo'
  | 'tipo'
  | 'pesoTotalPorTipo'
  | 'cliente'
  | 'sucursal'
  | 'lote'
  | 'fechaRegistro'
  | 'estatus';

/**
 * Interface para la configuración de columnas de la tabla
 */
export interface InventarioColumnConfig {
  key: InventarioTableColumn;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Constante con la configuración de columnas
 */
export const INVENTARIO_COLUMNS: InventarioColumnConfig[] = [
  { key: 'codigo', label: 'Código', sortable: true, width: '12%' },
  { key: 'tipo', label: 'Tipo', sortable: true, width: '15%' },
  { key: 'pesoTotalPorTipo', label: 'Peso Total por Tipo', sortable: true, width: '15%', align: 'right' },
  { key: 'cliente', label: 'Cliente', sortable: true, width: '15%' },
  { key: 'sucursal', label: 'Sucursal', sortable: true, width: '12%' },
  { key: 'lote', label: 'Lote', sortable: true, width: '10%' },
  { key: 'fechaRegistro', label: 'Fecha Registro', sortable: true, width: '12%' },
  { key: 'estatus', label: 'Estatus', sortable: true, width: '9%' }
];

/**
 * Tipos para los diferentes estados de tarimas
 */
export type TarimaEstatus = 
  | 'Pendiente'
  | 'En Proceso'
  | 'Completada'
  | 'Asignada'
  | 'Sin Asignar';

/**
 * Interface para asignar tarima a pedido
 */
export interface AsignarTarimaDTO {
  idTarima: number;
  idPedidoCliente: number;
  observaciones?: string;
}

/**
 * Interface para respuesta de asignación de tarima
 */
export interface AsignarTarimaResponseDTO {
  success: boolean;
  message: string;
  tarimaAsignada?: {
    id: number;
    codigo: string;
    estatus: string;
    idPedidoCliente: number;
  };
}

/**
 * Interface para pedido cliente disponible para asignación
 */
export interface PedidoClienteDisponibleDTO {
  id: number;
  estatus: string;
  cliente: string;
  sucursal: string;
  fechaRegistro: string;
  porcentajeSurtido: number;
  observaciones?: string;
}

/**
 * Interface para solicitud de asignación de tarima
 */
export interface TarimaAsignacionRequestDTO {
  idTarima: number;
  idProducto: number;
  tipo: string;
  cantidad: number;
}

/**
 * Colores para los diferentes estados
 */
export const ESTATUS_COLORS: Record<string, string> = {
  'Pendiente': 'bg-yellow-100 text-yellow-800',
  'En Proceso': 'bg-blue-100 text-blue-800',
  'Completada': 'bg-green-100 text-green-800',
  'Asignada': 'bg-purple-100 text-purple-800',
  'Sin Asignar': 'bg-gray-100 text-gray-800'
};
