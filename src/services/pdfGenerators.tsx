/**
 * Generadores de PDF usando @react-pdf/renderer
 */

import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import type {
  ConfiguracionReporteEspecifico,
  DatosReportePeriodo,
  DatosReporteCliente,
  DatosReporteDiario,
  ResultadoReporte
} from '@/types/Inventario/reportesEspecificos.types';

/**
 * Genera reporte PDF para período
 */
export const generarPDFPeriodo = async (
  datos: DatosReportePeriodo[],
  configuracion: ConfiguracionReporteEspecifico
): Promise<ResultadoReporte> => {
  if (datos.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // Importar dinámicamente el componente PDF
  const { ReportePeriodoPDF } = await import('@/components/PDF/ReportePeriodoPDF');
  
  // Generar PDF usando @react-pdf/renderer
  const blob = await pdf(<ReportePeriodoPDF datos={datos} configuracion={configuracion} />).toBlob();
  
  const nombreArchivo = `${configuracion.nombre}_${new Date().toISOString().split('T')[0]}.pdf`;
  saveAs(blob, nombreArchivo);
  
  return {
    success: true,
    nombreArchivo,
    tamano: blob.size,
    fechaGeneracion: new Date().toISOString(),
    tipo: 'periodo'
  };
};

/**
 * Genera reporte PDF para cliente
 */
export const generarPDFCliente = async (
  datos: DatosReporteCliente[],
  configuracion: ConfiguracionReporteEspecifico
): Promise<ResultadoReporte> => {
  if (datos.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // Importar dinámicamente el componente PDF
  const { ReporteClientePDF } = await import('@/components/PDF/ReporteClientePDF');
  
  // Generar PDF usando @react-pdf/renderer
  const blob = await pdf(<ReporteClientePDF datos={datos} configuracion={configuracion} />).toBlob();
  
  const nombreArchivo = `${configuracion.nombre}_${new Date().toISOString().split('T')[0]}.pdf`;
  saveAs(blob, nombreArchivo);
  
  return {
    success: true,
    nombreArchivo,
    tamano: blob.size,
    fechaGeneracion: new Date().toISOString(),
    tipo: 'cliente'
  };
};

/**
 * Genera reporte PDF para resumen diario
 */
export const generarPDFDiario = async (
  datos: DatosReporteDiario[],
  configuracion: ConfiguracionReporteEspecifico
): Promise<ResultadoReporte> => {
  if (datos.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // Importar dinámicamente el componente PDF
  const { ReporteDiarioPDF } = await import('@/components/PDF/ReporteDiarioPDF');
  
  // Generar PDF usando @react-pdf/renderer
  const blob = await pdf(<ReporteDiarioPDF datos={datos} configuracion={configuracion} />).toBlob();
  
  const nombreArchivo = `${configuracion.nombre}_${new Date().toISOString().split('T')[0]}.pdf`;
  saveAs(blob, nombreArchivo);
  
  return {
    success: true,
    nombreArchivo,
    tamano: blob.size,
    fechaGeneracion: new Date().toISOString(),
    tipo: 'diario'
  };
};
