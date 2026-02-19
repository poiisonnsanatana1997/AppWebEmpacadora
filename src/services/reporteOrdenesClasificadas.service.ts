import api from '@/api/axios';
import { AxiosError } from 'axios';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';
import { 
  ReporteOrdenesClasificadasResponseDTO, 
  ParametrosReporteDTO,
  OrdenClasificadaReporteDTO 
} from '@/types/Reportes/reporteOrdenesClasificadas.types';
import { ReporteOrdenesClasificadasPDF } from '@/components/PDF/ReporteOrdenesClasificadasPDF';
import { ReporteOrdenesClasificadasExcelService } from './reporteOrdenesClasificadasExcel.service';

/**
 * Custom error class for report service errors
 */
export class ReporteServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'ReporteServiceError';
  }
}

/**
 * Servicio para generar reportes de órdenes de entrada clasificadas
 */
export class ReporteOrdenesClasificadasService {
  /**
   * Obtiene los datos de las órdenes clasificadas para el reporte
   * @param ordenIds Array de IDs de órdenes a incluir en el reporte
   * @returns Promise con los datos de las órdenes clasificadas
   */
  static async obtenerDatosReporte(ordenIds: number[]): Promise<OrdenClasificadaReporteDTO[]> {
    try {
      if (!ordenIds || ordenIds.length === 0) {
        throw new ReporteServiceError('No se han seleccionado órdenes para el reporte');
      }

      const response = await api.post<OrdenClasificadaReporteDTO[]>('/reportes/ordenes-clasificadas', ordenIds);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ReporteServiceError(
          `Error al obtener datos del reporte: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ReporteServiceError('Error desconocido al obtener datos del reporte', error);
    }
  }

  /**
   * Genera y descarga un reporte PDF de órdenes clasificadas
   * @param ordenes Datos de las órdenes clasificadas
   * @param parametros Parámetros del reporte
   * @param usuarioGeneracion Nombre del usuario que genera el reporte
   */
  static async generarReportePDF(
    ordenes: OrdenClasificadaReporteDTO | OrdenClasificadaReporteDTO[], 
    parametros: ParametrosReporteDTO,
    usuarioGeneracion: string
  ): Promise<void> {
    try {
      // Normalizar a array
      const ordenesArray = Array.isArray(ordenes) ? ordenes : [ordenes];
      
      if (!ordenesArray || ordenesArray.length === 0) {
        throw new ReporteServiceError('No hay datos para generar el reporte');
      }

      // Generar el nombre del archivo
      const fecha = new Date().toISOString().split('T')[0];
      const cantidadOrdenes = ordenesArray.length;
      const fileName = `ReporteOrdenesClasificadas_${cantidadOrdenes}ordenes_${fecha}.pdf`;

      // Generar PDF usando @react-pdf/renderer
      const blob = await pdf(ReporteOrdenesClasificadasPDF({ 
        ordenes: ordenesArray, 
        parametros,
        fechaGeneracion: new Date().toISOString(),
        usuarioGeneracion
      })).toBlob();
      
      // Descargar el archivo
      saveAs(blob, fileName);
      
    } catch (error) {
      console.error('Error al generar PDF de reporte:', error);
      throw new ReporteServiceError('Error al generar el reporte PDF. Por favor, inténtalo de nuevo.');
    }
  }

  /**
   * Genera y descarga un reporte Excel de órdenes clasificadas
   * @param ordenes Datos de las órdenes clasificadas
   * @param parametros Parámetros del reporte
   */
  static async generarReporteExcel(
    ordenes: OrdenClasificadaReporteDTO | OrdenClasificadaReporteDTO[], 
    parametros: ParametrosReporteDTO
  ): Promise<void> {
    try {
      // Normalizar a array
      const ordenesArray = Array.isArray(ordenes) ? ordenes : [ordenes];
      
      if (!ordenesArray || ordenesArray.length === 0) {
        throw new ReporteServiceError('No hay datos para generar el reporte');
      }

      // Usar el servicio de exportación Excel del lado del cliente
      await ReporteOrdenesClasificadasExcelService.exportReporte(ordenesArray, parametros);
      
    } catch (error) {
      if (error instanceof Error) {
        throw new ReporteServiceError(error.message, error);
      }
      throw new ReporteServiceError('Error al generar el reporte Excel. Por favor, inténtalo de nuevo.');
    }
  }


  /**
   * Valida que las órdenes seleccionadas sean válidas para el reporte
   * @param ordenIds Array de IDs de órdenes
   * @returns Promise con la validación
   */
  static async validarOrdenesSeleccionadas(ordenIds: number[]): Promise<{
    validas: boolean;
    mensaje?: string;
    ordenesValidas: number[];
  }> {
    try {
      const response = await api.post('/reportes/ordenes-clasificadas/validar', ordenIds);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ReporteServiceError(
          `Error al validar órdenes: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new ReporteServiceError('Error al validar las órdenes seleccionadas', error);
    }
  }
}
