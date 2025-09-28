import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PedidoCompletoDTO, ClasificacionCompletaDTO } from '../types/OrdenesEntrada/ordenesEntradaCompleto.types';

export class ExcelExportService {
  static async exportClasificacion(orden: PedidoCompletoDTO, clasificaciones: ClasificacionCompletaDTO[]) {
    if (!orden || !clasificaciones.length) return;
    
    const clasificacion = clasificaciones[0];
    const proveedor = orden?.proveedor?.nombre || '/';
    const producto = orden?.producto?.nombre || '/';
    let fechaRaw = orden?.fechaRecepcion || orden?.fechaRegistro;
    let fecha: string = '/';
    if (fechaRaw) {
      const d = new Date(fechaRaw);
      if (!isNaN(d.getTime())) {
        fecha = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
    }
    const noRemision = orden?.codigo || '/';
    const noProd = clasificacion?.id?.toString() || '/';
    const pesoNetoRecibido = (clasificacion?.pesoTotal || 0).toFixed(2);
    
    const pesosPorTipo = { XL: 0, L: 0, M: 0, S: 0 };
    clasificacion?.tarimasClasificaciones?.forEach(tarima => {
      if (pesosPorTipo[tarima.tipo] !== undefined) {
        pesosPorTipo[tarima.tipo] += tarima.peso || 0;
      }
    });
    
    const preciosPorTipo = {
      XL: clasificacion?.xl || 0,
      L: clasificacion?.l || 0,
      M: clasificacion?.m || 0,
      S: clasificacion?.s || 0,
    };
    
    const totalesPorTipo = {
      XL: pesosPorTipo.XL * preciosPorTipo.XL,
      L: pesosPorTipo.L * preciosPorTipo.L,
      M: pesosPorTipo.M * preciosPorTipo.M,
      S: pesosPorTipo.S * preciosPorTipo.S,
    };
    
    const sumaTotal = Object.values(totalesPorTipo).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);
    const mermas = clasificacion?.mermas && clasificacion.mermas.length > 0
      ? clasificacion.mermas.map(m => [m.tipo || '/', (m.peso || 0).toFixed(2), m.observaciones || '/'])
      : [['/', '0.00', '/']];
    const totalMermas = (clasificacion?.mermas?.reduce((acc, m) => acc + (m.peso || 0), 0) || 0).toFixed(2);
    const retornos = clasificacion?.retornosDetalle && clasificacion.retornosDetalle.length > 0
      ? clasificacion.retornosDetalle.map(r => [r.numero || '/', (r.peso || 0).toFixed(2), r.observaciones || '/'])
      : [['/', '0.00', '/']];
    const totalRetornos = (clasificacion?.retornosDetalle?.reduce((acc, r) => acc + (r.peso || 0), 0) || 0).toFixed(2);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reporte Clasificación');
    
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
    const boldCell: Partial<ExcelJS.Style> = { font: { bold: true }, alignment: { vertical: 'middle', horizontal: 'center' } };
    
    const formatNumberAsText = (num: number): string => num.toFixed(2);
    const formatCurrencyAsText = (num: number): string => `$${num.toFixed(2)}`;
    
    // Información básica
    sheet.addRow(['Proveedor', proveedor]);
    sheet.addRow(['Producto', producto]);
    sheet.addRow(['Fecha de Recepción', fecha]);
    sheet.addRow(['No. de Remisión', noRemision]);
    sheet.addRow(['No. de Productor', noProd]);
    sheet.addRow([]);
    
    // Headers
    const headerRow1 = [
      'FECHA DE RECEPCIÓN', 'NO DE REMISIÓN', 'PRODUCTOR', 'PESO NETO RECIBIDO', 'MERMA',
      'XL (Kg)', 'L (Kg)', 'M (Kg)', 'S (Kg)',
      '$ XL', '$ L', '$ M', '$ S',
      '$ SUMA',
      'Precio de Embarque', '', '', ''
    ];
    const headerRow2 = [
      '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'XL', 'L', 'M', 'S'
    ];
    
    const rowHeader1 = sheet.addRow(headerRow1);
    rowHeader1.eachCell((cell, colNumber) => {
      cell.style = headerStyle;
      if (colNumber === 14) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC288' } };
        cell.font = { bold: true, italic: true, color: { argb: 'FF2563EB' } };
      }
    });
    sheet.getRow(sheet.lastRow.number).height = 28;
    
    const rowHeader2 = sheet.addRow(headerRow2);
    rowHeader2.eachCell((cell, colNumber) => {
      if (colNumber >= 15 && colNumber <= 18) {
        cell.style = headerStyle;
      } else {
        cell.style = { ...headerStyle, fill: undefined, font: { bold: true, color: { argb: 'FFFFFFFF' } }, alignment: { vertical: 'middle', horizontal: 'center' }, border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle } };
      }
    });
    sheet.getRow(sheet.lastRow.number).height = 22;
    sheet.mergeCells(7, 15, 7, 18);
    sheet.getCell('O7').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Datos
    const dataRow = [
      fecha,
      noRemision,
      proveedor,
      pesoNetoRecibido,
      totalMermas,
      formatNumberAsText(pesosPorTipo.XL),
      formatNumberAsText(pesosPorTipo.L),
      formatNumberAsText(pesosPorTipo.M),
      formatNumberAsText(pesosPorTipo.S),
      formatCurrencyAsText(totalesPorTipo.XL),
      formatCurrencyAsText(totalesPorTipo.L),
      formatCurrencyAsText(totalesPorTipo.M),
      formatCurrencyAsText(totalesPorTipo.S),
      formatCurrencyAsText(sumaTotal),
      formatCurrencyAsText(preciosPorTipo.XL),
      formatCurrencyAsText(preciosPorTipo.L),
      formatCurrencyAsText(preciosPorTipo.M),
      formatCurrencyAsText(preciosPorTipo.S)
    ];
    
    const rowData = sheet.addRow(dataRow);
    rowData.eachCell((cell) => {
      cell.style = cellStyle;
    });
    sheet.getRow(sheet.lastRow.number).height = 22;
    sheet.addRow([]);
    
    // Mermas
    const mermaHeader = sheet.addRow(['MERMA', 'TIPO', 'PESO (kg)', 'OBSERVACIONES']);
    mermaHeader.eachCell(cell => cell.style = subHeaderStyle);
    mermas.forEach(m => {
      const row = sheet.addRow(['', ...m]);
      row.eachCell(cell => cell.style = cellStyle);
    });
    const totalMermaRow = sheet.addRow(['', '', 'TOTAL MERMA', totalMermas]);
    totalMermaRow.eachCell(cell => cell.style = boldCell);
    sheet.addRow([]);
    
    // Retornos
    const retornoHeader = sheet.addRow(['RETORNOS', 'NÚMERO', 'PESO (kg)', 'OBSERVACIONES']);
    retornoHeader.eachCell(cell => cell.style = subHeaderStyle);
    retornos.forEach(r => {
      const row = sheet.addRow(['', ...r]);
      row.eachCell(cell => cell.style = cellStyle);
    });
    const totalRetornoRow = sheet.addRow(['', '', 'TOTAL RETORNOS', totalRetornos]);
    totalRetornoRow.eachCell(cell => cell.style = boldCell);
    
    // Ajustar columnas
    sheet.columns.forEach(col => {
      let max = 10;
      col.eachCell({ includeEmpty: true }, cell => {
        max = Math.max(max, (cell.value ? cell.value.toString().length : 0) + 2);
      });
      col.width = max;
    });
    
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `ReporteClasificacion_Lote${noRemision}_Clasificacion${noProd}.xlsx`;
    saveAs(new Blob([buffer]), fileName);
  }
}
