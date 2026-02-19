import { OrdenEntradaDto } from '../OrdenesEntrada/ordenesEntrada.types';

/**
 * Interface para los datos de una orden de entrada clasificada en el reporte
 */
export interface OrdenClasificadaReporteDTO {
  id: number;
  codigo: string;
  proveedor: {
    id: number;
    nombre: string;
  };
  totalMermas: number;
  totalRetornos: number;
  fechaRecepcion: string;
  pesoNetoRecibido: number;
  informacionTipos: InformacionTipoDTO[];
}

export interface InformacionTipoDTO{
  tipo: string;
  peso: number;
  precio: number;
}

/**
 * Interface para los datos de clasificación en el reporte
 */
export interface ClasificacionReporteDTO {
  id: number;
  lote: string;
  pesoTotal: number;
  fechaRegistro: string;
  usuarioRegistro: string;
  xl: number;
  l: number;
  m: number;
  s: number;
  retornos: number;
  mermas: MermaReporteDTO[];
  retornosDetalle: RetornoReporteDTO[];
  tarimasClasificaciones: TarimaReporteDTO[];
}

/**
 * Interface para mermas en el reporte
 */
export interface MermaReporteDTO {
  id: number;
  tipo: string;
  peso: number;
  observaciones?: string;
  fechaRegistro: string;
  usuarioRegistro: string;
}

/**
 * Interface para retornos en el reporte
 */
export interface RetornoReporteDTO {
  id: number;
  numero: string;
  peso: number;
  observaciones?: string;
  fechaRegistro: string;
  usuarioRegistro: string;
}

/**
 * Interface para tarimas en el reporte
 */
export interface TarimaReporteDTO {
  idTarima: number;
  idClasificacion: number;
  peso: number;
  tipo: string;
  cantidad: number;
}

/**
 * Interface para la respuesta del servicio de reporte
 */
export interface ReporteOrdenesClasificadasResponseDTO {
  ordenes: OrdenClasificadaReporteDTO[];
  totalOrdenes: number;
  fechaGeneracion: string;
  usuarioGeneracion: string;
}

/**
 * Interface para los parámetros de búsqueda del reporte
 */
export interface ParametrosReporteDTO {
  ordenIds: number[];
  formato: 'pdf' | 'excel';
  incluirDetalles: boolean;
  incluirMermas: boolean;
  incluirRetornos: boolean;
}

/**
 * Interface para el estado del modo reporte
 */
export interface ModoReporteState {
  activo: boolean;
  ordenesSeleccionadas: string[];
  limiteMaximo: number;
  cargando: boolean;
}

/**
 * Interface para las props del componente PanelReporte
 */
export interface PanelReporteProps {
  ordenesSeleccionadas: string[];
  limiteMaximo: number;
  onGenerarReporte: (formato: 'pdf' | 'excel') => void;
  onLimpiarSeleccion: () => void;
  cargando?: boolean;
  // Funciones de selección masiva
  onSeleccionarTodas?: (ordenes: OrdenEntradaDto[]) => void;
  onSeleccionarVisibles?: (ordenes: OrdenEntradaDto[]) => void;
  onSeleccionarPorProveedor?: (ordenes: OrdenEntradaDto[], proveedor: string) => void;
  onSeleccionarPorFecha?: (ordenes: OrdenEntradaDto[], dias: number) => void;
  // Datos para las funciones de selección
  ordenesDisponibles?: OrdenEntradaDto[];
  proveedoresDisponibles?: string[];
}

/**
 * Interface para las props del componente OrdenesEntradaTable con modo reporte
 */
export interface OrdenesEntradaTableReporteProps {
  ordenes: OrdenEntradaDto[];
  onEdit: (codigo: string) => void;
  onDelete: (codigo: string) => void;
  onRegistrarClasificacion: (orden: OrdenEntradaDto) => void;
  onFiltersChange?: (hasFilters: boolean, clearFiltersFunc?: () => void) => void;
  modoReporte: boolean;
  ordenesSeleccionadasReporte: string[];
  onToggleSeleccionReporte: (codigo: string, seleccionado: boolean) => void;
  onLimpiarSeleccionReporte: () => void;
}
