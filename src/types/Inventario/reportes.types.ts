/**
 * Tipos para el sistema de reportes y analytics del inventario
 */

import type { InventarioTipoDTO } from './inventario.types';

/**
 * Interface para datos de tendencias temporales
 */
export interface TendenciaData {
  fecha: string;
  pesoTotal: number;
  tarimasAsignadas: number;
  tarimasNoAsignadas: number;
}

/**
 * Interface para distribución por cliente
 */
export interface DistribucionCliente {
  cliente: string;
  cantidad: number;
  pesoTotal: number;
  porcentaje: number;
}

/**
 * Interface para ocupación por tipo
 */
export interface OcupacionTipo {
  tipo: string;
  cantidad: number;
  pesoTotal: number;
  ocupacion: number; // porcentaje
}

/**
 * Interface para configuración de reportes
 */
export interface ConfiguracionReporte {
  nombre: string;
  formato: 'excel' | 'pdf' | 'csv';
  filtros: {
    fechaInicio?: string;
    fechaFin?: string;
    clientes?: string[];
    tipos?: string[];
    estatus?: string[];
  };
  columnas: string[];
  agruparPor?: string;
  ordenarPor?: string;
  orden?: 'asc' | 'desc';
}

/**
 * Interface para plantillas de reportes
 */
export interface PlantillaReporte {
  id: string;
  nombre: string;
  descripcion: string;
  configuracion: ConfiguracionReporte;
  esPredeterminada: boolean;
}

/**
 * Interface para datos de analytics
 */
export interface AnalyticsData {
  tendencias: TendenciaData[];
  distribucionClientes: DistribucionCliente[];
  ocupacionTipos: OcupacionTipo[];
  kpis: {
    rotacionInventario: number;
    tiempoPromedioAsignacion: number;
    eficienciaOcupacion: number;
    satisfaccionClientes: number;
  };
}

/**
 * Interface para respuesta de generación de reporte
 */
export interface ReporteGenerado {
  id: string;
  nombre: string;
  url: string;
  fechaGeneracion: string;
  tamano: number;
  formato: string;
}

/**
 * Interface para estado de generación de reporte
 */
export interface EstadoGeneracionReporte {
  isGenerating: boolean;
  progreso: number;
  error: string | null;
  reporteGenerado: ReporteGenerado | null;
}

/**
 * Interface para filtros de analytics
 */
export interface AnalyticsFilters {
  periodo: '7d' | '30d' | '90d' | '1y';
  cliente?: string;
  tipo?: string;
  agruparPor: 'dia' | 'semana' | 'mes';
}

/**
 * Interface para configuración de exportación
 */
export interface ExportConfig {
  incluirGraficos: boolean;
  incluirResumen: boolean;
  formatoNumeros: 'es-MX' | 'en-US';
  zonaHoraria: string;
  comprimir: boolean;
}
