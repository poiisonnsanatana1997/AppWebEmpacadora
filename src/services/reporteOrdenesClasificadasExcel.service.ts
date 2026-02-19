import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { 
  OrdenClasificadaReporteDTO, 
  ParametrosReporteDTO 
} from '@/types/Reportes/reporteOrdenesClasificadas.types';

/**
 * Servicio para generar reportes Excel de órdenes clasificadas
 * Genera el archivo del lado del cliente usando ExcelJS
 */
export class ReporteOrdenesClasificadasExcelService {
  /**
   * Genera y descarga un reporte Excel de órdenes clasificadas
   * @param ordenes Datos de las órdenes clasificadas
   * @param parametros Parámetros del reporte
   */
  static async exportReporte(
    ordenes: OrdenClasificadaReporteDTO[], 
    parametros: ParametrosReporteDTO
  ): Promise<void> {
    try {
      if (!ordenes || ordenes.length === 0) {
        throw new Error('No hay datos para generar el reporte');
      }

      // Generar el nombre del archivo
      const fecha = new Date().toISOString().split('T')[0];
      const cantidadOrdenes = ordenes.length;
      const fileName = `ReporteOrdenesClasificadas_${cantidadOrdenes}ordenes_${fecha}.xlsx`;

      // Crear workbook
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Reporte Órdenes Clasificadas');
      
      // Estilos
      const borderStyle: Partial<ExcelJS.Border> = { style: 'thin' };
      const headerStyle: Partial<ExcelJS.Style> = {
        font: { bold: true, color: { argb: 'FFFFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } },
        alignment: { vertical: 'middle', horizontal: 'center' },
        border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
      };
      const subHeaderStyle: Partial<ExcelJS.Style> = {
        font: { bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } },
        alignment: { vertical: 'middle', horizontal: 'center' },
        border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
      };
      const cellStyle: Partial<ExcelJS.Style> = {
        alignment: { vertical: 'middle', horizontal: 'center' },
        border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
      };
      const boldCell: Partial<ExcelJS.Style> = { 
        font: { bold: true }, 
        alignment: { vertical: 'middle', horizontal: 'center' } 
      };

      // Información del reporte
      sheet.addRow(['REPORTE DE ÓRDENES CLASIFICADAS']);
      sheet.addRow(['Sistema de Gestión Empacadora']);
      sheet.addRow([]);

      // Headers principales simplificados
      const headerRow1 = [
        'CÓDIGO ORDEN', 
        'PROVEEDOR', 
        'FECHA RECEPCIÓN', 
        'NETO RECIBIDO (kg)',
        'XL (kg)', 
        'L (kg)', 
        'M (kg)', 
        'S (kg)',
        'XL ($)', 
        'L ($)', 
        'M ($)', 
        'S ($)',
        'TOTAL XL ($)', 
        'TOTAL L ($)', 
        'TOTAL M ($)', 
        'TOTAL S ($)',
        'TOTAL GENERAL ($)', 
        'MERMAS (kg)', 
        'RETORNOS (kg)'
      ];
      
      const rowHeader1 = sheet.addRow(headerRow1);
      rowHeader1.eachCell((cell) => {
        cell.style = headerStyle;
      });
      sheet.getRow(sheet.lastRow.number).height = 25;

      // Función para procesar una orden y crear una fila consolidada
      const procesarOrden = (orden: OrdenClasificadaReporteDTO) => {
        // Inicializar valores por tipo
        const pesos = { XL: 0, L: 0, M: 0, S: 0 };
        const precios = { XL: 0, L: 0, M: 0, S: 0 };
        const totales = { XL: 0, L: 0, M: 0, S: 0 };
        
        // Procesar cada tipo de la orden
        if (orden.informacionTipos && orden.informacionTipos.length > 0) {
          orden.informacionTipos.forEach(infoTipo => {
            const tipo = infoTipo.tipo.toUpperCase();
            if (tipo in pesos) {
              pesos[tipo] = infoTipo.peso;
              precios[tipo] = infoTipo.precio;
              totales[tipo] = infoTipo.peso * infoTipo.precio;
            }
          });
        }
        
        // Calcular total general
        const totalGeneral = Object.values(totales).reduce((sum, val) => sum + val, 0);
        
        const fechaRecepcion = orden.fechaRecepcion || 'N/A';
        
        return [
          orden.codigo,
          orden.proveedor.nombre,
          fechaRecepcion,
          orden.pesoNetoRecibido.toFixed(2), // kg
          pesos.XL.toFixed(2), // kg
          pesos.L.toFixed(2),  // kg
          pesos.M.toFixed(2),  // kg
          pesos.S.toFixed(2),  // kg
          precios.XL.toFixed(2), // $
          precios.L.toFixed(2),  // $
          precios.M.toFixed(2),  // $
          precios.S.toFixed(2),  // $
          totales.XL.toFixed(2), // $
          totales.L.toFixed(2),  // $
          totales.M.toFixed(2),  // $
          totales.S.toFixed(2),  // $
          totalGeneral.toFixed(2), // $
          orden.totalMermas.toFixed(2), // kg
          orden.totalRetornos.toFixed(2) // kg
        ];
      };

      // Función para calcular totales consolidados
      const calcularTotales = (ordenes: OrdenClasificadaReporteDTO[]) => {
        const totales = {
          pesoNeto: 0, // kg
          pesos: { XL: 0, L: 0, M: 0, S: 0 }, // kg
          totales: { XL: 0, L: 0, M: 0, S: 0 }, // $
          totalGeneral: 0, // $
          mermas: 0, // kg
          retornos: 0 // kg
        };
        
        ordenes.forEach(orden => {
          totales.pesoNeto += orden.pesoNetoRecibido;
          totales.mermas += orden.totalMermas;
          totales.retornos += orden.totalRetornos;
          
          if (orden.informacionTipos && orden.informacionTipos.length > 0) {
            orden.informacionTipos.forEach(infoTipo => {
              const tipo = infoTipo.tipo.toUpperCase();
              if (tipo in totales.pesos) {
                totales.pesos[tipo] += infoTipo.peso;
                totales.totales[tipo] += infoTipo.peso * infoTipo.precio;
              }
            });
          }
        });
        
        totales.totalGeneral = Object.values(totales.totales).reduce((sum, val) => sum + val, 0);
        
        return [
          'TOTALES',
          '',
          '',
          totales.pesoNeto.toFixed(2), // kg
          totales.pesos.XL.toFixed(2), // kg
          totales.pesos.L.toFixed(2),  // kg
          totales.pesos.M.toFixed(2),  // kg
          totales.pesos.S.toFixed(2),  // kg
          '', // No hay totales de precios
          '',
          '',
          '',
          totales.totales.XL.toFixed(2), // $
          totales.totales.L.toFixed(2),  // $
          totales.totales.M.toFixed(2),  // $
          totales.totales.S.toFixed(2),  // $
          totales.totalGeneral.toFixed(2), // $
          totales.mermas.toFixed(2), // kg
          totales.retornos.toFixed(2) // kg
        ];
      };

      // Procesar cada orden y agregar una fila
      ordenes.forEach(orden => {
        const dataRow = procesarOrden(orden);
        const rowData = sheet.addRow(dataRow);
        rowData.eachCell((cell) => {
          cell.style = cellStyle;
        });
      });

      // Agregar fila de totales
      sheet.addRow([]);
      const totalRow = sheet.addRow(calcularTotales(ordenes));
      totalRow.eachCell((cell) => {
        cell.style = boldCell;
      });


      // Ajustar columnas
      sheet.columns.forEach(col => {
        let max = 10;
        col.eachCell({ includeEmpty: true }, cell => {
          max = Math.max(max, (cell.value ? cell.value.toString().length : 0) + 2);
        });
        col.width = max;
      });

      // Generar y descargar el archivo
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), fileName);
      
    } catch (error) {
      console.error('Error al generar Excel de reporte:', error);
      throw new Error('Error al generar el reporte Excel. Por favor, inténtalo de nuevo.');
    }
  }
}
