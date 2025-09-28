/**
 * Tipos para los reportes específicos del inventario
 */

import type { InventarioTipoDTO } from './inventario.types';

/**
 * Tipos de reportes disponibles
 */
export type TipoReporte = 'periodo' | 'cliente' | 'diario';

/**
 * Configuración para reporte de inventario por período
 */
export interface ConfiguracionReportePeriodo {
  nombre: string;
  tipo: 'periodo';
  filtros: {
    fechaInicio: string;
    fechaFin: string;
    agruparPor: 'dia' | 'semana' | 'mes';
  };
  columnas: string[];
  formato: 'excel' | 'pdf';
}

/**
 * Configuración para reporte de tarimas por cliente
 */
export interface ConfiguracionReporteCliente {
  nombre: string;
  tipo: 'cliente';
  filtros: {
    clienteId?: string; // Opcional, si no se especifica = todos
    incluirSinAsignar: boolean;
  };
  columnas: string[];
  formato: 'excel' | 'pdf';
}

/**
 * Configuración para resumen diario
 */
export interface ConfiguracionReporteDiario {
  nombre: string;
  tipo: 'diario';
  filtros: {
    fecha: string;
  };
  columnas: string[];
  formato: 'excel' | 'pdf';
}

/**
 * Unión de todas las configuraciones de reportes
 */
export type ConfiguracionReporteEspecifico = 
  | ConfiguracionReportePeriodo 
  | ConfiguracionReporteCliente 
  | ConfiguracionReporteDiario;

/**
 * Datos procesados para reporte por período
 */
export interface DatosReportePeriodo {
  fecha: string;
  codigo: string;
  tipo: string;
  pesoTotal: number;
  cliente: string;
  fechaRegistro: string;
}

/**
 * Datos procesados para reporte por cliente
 */
export interface DatosReporteCliente {
  cliente: string;
  tipo: string;
  cantidad: number;
  pesoTotal: number;
  porcentaje: number;
  fecha: string;
}

/**
 * Datos procesados para resumen diario
 */
export interface DatosReporteDiario {
  tipo: string;
  cantidad: number;
  pesoTotal: number;
  estatus: string;
  cliente: string;
  fecha: string;
  porcentaje: number;
}

/**
 * Estado del modal de configuración
 */
export interface EstadoModalReporte {
  isOpen: boolean;
  tipoReporte: TipoReporte | null;
  configuracion: ConfiguracionReporteEspecifico | null;
}

/**
 * Opciones de filtros disponibles
 */
export interface OpcionesFiltrosReportes {
  clientes: Array<{ id: string; nombre: string }>;
  fechasDisponibles: string[];
}

/**
 * Resultado de generación de reporte
 */
export interface ResultadoReporte {
  success: boolean;
  nombreArchivo: string;
  tamano: number;
  fechaGeneracion: string;
  tipo: TipoReporte;
}
