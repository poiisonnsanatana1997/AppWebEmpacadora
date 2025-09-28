import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ReporteClasificacionPDF } from '../components/PDF/ReporteClasificacionPDF';
import type { PedidoCompletoDTO, ClasificacionCompletaDTO } from '../types/OrdenesEntrada/ordenesEntradaCompleto.types';

export class PDFExportService {
  static async exportClasificacion(orden: PedidoCompletoDTO, clasificaciones: ClasificacionCompletaDTO[]) {
    try {
      // Validar que tenemos los datos necesarios
      if (!orden || !clasificaciones || clasificaciones.length === 0) {
        throw new Error('No hay datos suficientes para generar el reporte');
      }

      // Generar el nombre del archivo
      const clasificacion = clasificaciones[0];
      const noRemision = orden?.codigo || 'SinCodigo';
      const noProd = clasificacion?.id?.toString() || 'SinId';
      const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      const fileName = `ReporteClasificacion_Lote${noRemision}_Clasificacion${noProd}_${fecha}.pdf`;

      // Generar PDF usando @react-pdf/renderer
      const blob = await pdf(ReporteClasificacionPDF({ orden, clasificaciones })).toBlob();
      
      // Descargar el archivo
      saveAs(blob, fileName);
      
    } catch (error) {
      console.error('Error al generar PDF de clasificación:', error);
      throw new Error('Error al generar el reporte PDF. Por favor, inténtalo de nuevo.');
    }
  }
}
