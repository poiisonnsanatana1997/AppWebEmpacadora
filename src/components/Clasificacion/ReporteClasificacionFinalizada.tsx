import React from 'react';
import { ClasificacionCompletaDTO, PedidoCompletoDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Tipos de props
interface ReporteClasificacionFinalizadaProps {
  clasificaciones: ClasificacionCompletaDTO[];
  orden: PedidoCompletoDTO;
}

const tipos = [
  { key: 'XL', label: 'XL' },
  { key: 'L', label: 'L' },
  { key: 'M', label: 'M' },
  { key: 'S', label: 'S' },
];

const getOrDefault = (value: any, defaultValue: any = '/') => {
  if (value === undefined || value === null || value === '') return defaultValue;
  return value;
};

const ReporteClasificacionFinalizada: React.FC<ReporteClasificacionFinalizadaProps> = ({ clasificaciones, orden }) => {
  // Tomar la primera clasificación como referencia para datos de la tabla
  const clasificacion = clasificaciones[0];

  // Encabezado de la orden
  const proveedor = getOrDefault(orden?.proveedor?.nombre, '/');
  const producto = getOrDefault(orden?.producto?.nombre, '/');
  // Convertir fecha a objeto Date si es posible
  let fechaRaw = orden?.fechaRecepcion || orden?.fechaRegistro;
  let fechaDate: Date | string = '/';
  if (fechaRaw) {
    const d = new Date(fechaRaw);
    if (!isNaN(d.getTime())) fechaDate = d;
  }
  const fecha = fechaDate;
  const noRemision = getOrDefault(orden?.codigo, '/');
  const noProd = getOrDefault(clasificacion?.id, '/');
  const pesoNetoRecibido = getOrDefault(clasificacion?.pesoTotal, 0);

  // Calcular pesos por tipo a partir de las tarimas
  const pesosPorTipo: Record<string, number> = { XL: 0, L: 0, M: 0, S: 0 };
  clasificacion?.tarimasClasificaciones?.forEach(tarima => {
    if (pesosPorTipo[tarima.tipo] !== undefined) {
      pesosPorTipo[tarima.tipo] += tarima.peso || 0;
    }
  });

  // Precios por tipo (estos campos son precios por kg)
  const preciosPorTipo: Record<string, number> = {
    XL: getOrDefault(clasificacion?.xl, 0),
    L: getOrDefault(clasificacion?.l, 0),
    M: getOrDefault(clasificacion?.m, 0),
    S: getOrDefault(clasificacion?.s, 0),
  };

  // Totales por tipo
  const totalesPorTipo: Record<string, number> = {
    XL: pesosPorTipo.XL * preciosPorTipo.XL,
    L: pesosPorTipo.L * preciosPorTipo.L,
    M: pesosPorTipo.M * preciosPorTipo.M,
    S: pesosPorTipo.S * preciosPorTipo.S,
  };

  const sumaTotal = Object.values(totalesPorTipo).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);

  // Mermas y retornos
  const mermas = clasificacion?.mermas && clasificacion.mermas.length > 0
    ? clasificacion.mermas.map(m => [getOrDefault(m.tipo), getOrDefault(m.peso, 0), getOrDefault(m.observaciones, '/')])
    : [['/', 0, '/']];
  const totalMermas = clasificacion?.mermas?.reduce((acc, m) => acc + (m.peso || 0), 0) || 0;

  const retornos = clasificacion?.retornosDetalle && clasificacion.retornosDetalle.length > 0
    ? clasificacion.retornosDetalle.map(r => [getOrDefault(r.numero), getOrDefault(r.peso, 0), getOrDefault(r.observaciones, '/')])
    : [['/', 0, '/']];
  const totalRetornos = clasificacion?.retornosDetalle?.reduce((acc, r) => acc + (r.peso || 0), 0) || 0;

  // Precios de embarque (simulados, puedes ajustar la lógica si tienes los datos)
  const preciosEmbarque = tipos.map(() => '/');

  // Handler para exportar a Excel
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reporte Clasificación');

    // Estilos
    const borderStyle = { style: 'thin' as ExcelJS.BorderStyle };
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } } as ExcelJS.FillPattern,
      alignment: { vertical: 'middle' as const, horizontal: 'center' as const },
      border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
    };
    const subHeaderStyle = {
      font: { bold: true },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } } as ExcelJS.FillPattern,
      alignment: { vertical: 'middle' as const, horizontal: 'center' as const },
      border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
    };
    const cellStyle = {
      alignment: { vertical: 'middle' as const, horizontal: 'center' as const },
      border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
    };
    const boldCell = { font: { bold: true }, alignment: { vertical: 'middle' as const, horizontal: 'center' as const } };

    // Encabezado de la orden
    sheet.addRow(['Proveedor', proveedor]);
    sheet.addRow(['Producto', producto]);
    // Fecha de recepción como objeto Date y formato de fecha
    const rowFecha = sheet.addRow(['Fecha de Recepción', fecha instanceof Date ? fecha : '']);
    if (fecha instanceof Date) {
      rowFecha.getCell(2).numFmt = 'dd/mm/yyyy';
    }
    sheet.addRow(['No. de Remisión', noRemision]);
    sheet.addRow(['No. de Productor', noProd]);
    sheet.addRow([]);

    // Encabezado horizontal con celda fusionada para Precio de Embarque
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
    // Fila 1 de encabezado
    const rowHeader1 = sheet.addRow(headerRow1);
    rowHeader1.eachCell((cell, colNumber) => {
      cell.style = headerStyle;
      // Fondo especial para $ SUMA
      if (colNumber === 14) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC288' } };
        cell.font = { bold: true, italic: true, color: { argb: 'FF2563EB' } };
      }
    });
    sheet.getRow(sheet.lastRow.number).height = 28;
    // Fila 2 de encabezado
    const rowHeader2 = sheet.addRow(headerRow2);
    rowHeader2.eachCell((cell, colNumber) => {
      // Solo las celdas bajo 'Precio de Embarque' deben tener fondo azul
      if (colNumber >= 15 && colNumber <= 18) {
        cell.style = headerStyle;
      } else {
        cell.style = { ...headerStyle, fill: undefined, font: { bold: true, color: { argb: 'FFFFFFFF' } } };
      }
    });
    sheet.getRow(sheet.lastRow.number).height = 22;
    // Fusionar celdas para el encabezado "Precio de Embarque"
    // La fila de encabezado es la 7 (después de 6 filas de info y 1 vacía)
    sheet.mergeCells(7, 15, 7, 18);
    // Centrar vertical y horizontalmente el texto de la celda fusionada
    sheet.getCell('O7').alignment = { vertical: 'middle', horizontal: 'center' };

    // Fila de datos
    const dataRow = [
      fecha instanceof Date ? fecha : '',
      noRemision,
      proveedor,
      pesoNetoRecibido,
      totalMermas,
      pesosPorTipo.XL, pesosPorTipo.L, pesosPorTipo.M, pesosPorTipo.S,
      totalesPorTipo.XL, totalesPorTipo.L, totalesPorTipo.M, totalesPorTipo.S,
      sumaTotal,
      preciosPorTipo.XL, preciosPorTipo.L, preciosPorTipo.M, preciosPorTipo.S
    ];
    const rowData = sheet.addRow(dataRow);
    rowData.eachCell((cell, colNumber) => {
      cell.style = cellStyle;
      // Formato numérico con dos decimales para pesos (columnas 4 a 9) solo si es número
      if (colNumber >= 4 && colNumber <= 9 && typeof cell.value === 'number') {
        cell.numFmt = '#,##0.00';
      }
      // Formato de moneda SOLO en columnas 10 a 18 y solo si es número
      if (colNumber >= 10 && colNumber <= 18 && typeof cell.value === 'number') {
        cell.numFmt = '[$$-C0A] #,##0.00';
      }
    });
    // Asegurar formato de fecha en la columna 1 de la fila de datos
    if (rowData.getCell(1).value instanceof Date) {
      rowData.getCell(1).numFmt = 'dd/mm/yyyy';
    }
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

    // Ajustar ancho de columnas
    sheet.columns.forEach(col => {
      let max = 10;
      col.eachCell({ includeEmpty: true }, cell => {
        max = Math.max(max, (cell.value ? cell.value.toString().length : 0) + 2);
      });
      col.width = max;
    });

    // Descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `ReporteClasificacion_Lote${noRemision}_Clasificacion${noProd}.xlsx`;
    saveAs(new Blob([buffer]), fileName);
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Reporte de Clasificación Finalizada</CardTitle>
        <Button onClick={handleExportExcel} className="bg-green-600 text-white hover:bg-green-700" aria-label="Descargar Excel">
          Descargar Excel
        </Button>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-gray-700">
          <span>Haz clic en "Descargar Excel" para obtener el reporte con formato visual.</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReporteClasificacionFinalizada; 