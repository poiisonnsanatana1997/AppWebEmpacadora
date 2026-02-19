/**
 * Tipos para el proceso de importación de órdenes de entrada desde archivos Excel
 */

/**
 * Resultado del procesamiento de una fila individual del archivo
 */
export interface ResultadoImportacionFila {
  fila: number;
  codigo?: string;
  estado: 'creada' | 'error';
  error?: string;
}

/**
 * Resultado completo de la importación
 */
export interface ResultadoImportacion {
  ordenesCreadas: number;
  errores: ErrorImportacion[];
  detalles: ResultadoImportacionFila[];
}

/**
 * Error encontrado durante la importación
 */
export interface ErrorImportacion {
  fila: number;
  error: string;
}

/**
 * DTO para una orden que viene del archivo de importación
 */
export interface OrdenImportacionDto {
  proveedor: string;
  producto: string;
  fechaEstimada: string;
  observaciones?: string;
}
