import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import type { PedidoClienteProgresoDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import type { ConfiguracionReporte } from '@/types/PedidoCliente/reportes.types';

interface DiferenciasPorTipo {
  tipo: string;
  cantidadRequerida: number;
  cantidadAsignada: number;
  cantidadFaltante: number;
  pesoRequerido: number;
  pesoAsignado: number;
  pesoFaltante: number;
  porcentajeCumplimiento: number;
}

export class ReporteProgresoPedidoClienteExcelService {
  static async generarReporte(
    progreso: PedidoClienteProgresoDTO,
    diferencias: DiferenciasPorTipo[],
    cajasSurtidasPorOrden: Map<number, number>,
    incluirTarimas: boolean,
    configuracion?: ConfiguracionReporte
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();

    // Metadatos
    workbook.creator = configuracion?.nombreEmpresa || 'AgroSmart';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Calcular totales
    const totalCantidadRequerida = progreso.ordenes.reduce((sum, orden) => sum + (orden.cantidad || 0), 0);
    const totalCantidadAsignada = progreso.tarimas.reduce((sum, tarima) => {
      return sum + tarima.tarimasClasificaciones.reduce((sumClas, clas) => sumClas + (clas.cantidad || 0), 0);
    }, 0);
    const totalCantidadFaltante = Math.max(0, totalCantidadRequerida - totalCantidadAsignada);
    const porcentajeCumplimiento = progreso.porcentajeSurtido ?? (
      totalCantidadRequerida > 0
        ? Math.round((totalCantidadAsignada / totalCantidadRequerida) * 100)
        : 100
    );

    // ========== HOJA 1: Resumen y Progreso ==========
    const sheetResumen = workbook.addWorksheet('Resumen y Progreso');

    // Estilos
    const headerStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, size: 11, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    const titleStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, size: 14, color: { argb: 'FF1F2937' } },
      alignment: { vertical: 'middle', horizontal: 'left' }
    };

    const sectionTitleStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, size: 12, color: { argb: 'FF1F2937' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } },
      alignment: { vertical: 'middle', horizontal: 'left' }
    };

    const cellStyle: Partial<ExcelJS.Style> = {
      font: { size: 10 },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      }
    };

    let currentRow = 1;

    // Título principal
    sheetResumen.mergeCells(`A${currentRow}:G${currentRow}`);
    const titleCell = sheetResumen.getCell(`A${currentRow}`);
    titleCell.value = `Reporte de Progreso - Pedido #${progreso.id}`;
    titleCell.style = titleStyle;
    currentRow += 2;

    // Sección: Información del Pedido
    sheetResumen.mergeCells(`A${currentRow}:G${currentRow}`);
    const infoTitleCell = sheetResumen.getCell(`A${currentRow}`);
    infoTitleCell.value = 'Información del Pedido';
    infoTitleCell.style = sectionTitleStyle;
    currentRow++;

    const infoPedido = [
      ['ID del Pedido:', `#${progreso.id}`],
      ['Estatus:', progreso.estatus],
      ['Fecha de Generación:', new Date().toLocaleDateString('es-MX')],
    ];

    if (progreso.observaciones) {
      infoPedido.push(['Observaciones:', progreso.observaciones]);
    }

    infoPedido.forEach(([label, value]) => {
      const row = sheetResumen.getRow(currentRow);
      row.getCell(1).value = label;
      row.getCell(1).font = { bold: true, size: 10 };
      row.getCell(2).value = value;
      row.getCell(2).font = { size: 10 };
      sheetResumen.mergeCells(`B${currentRow}:G${currentRow}`);
      currentRow++;
    });

    currentRow += 1;

    // Sección: Métricas Principales
    sheetResumen.mergeCells(`A${currentRow}:G${currentRow}`);
    const metricasTitleCell = sheetResumen.getCell(`A${currentRow}`);
    metricasTitleCell.value = 'Métricas Principales';
    metricasTitleCell.style = sectionTitleStyle;
    currentRow++;

    const metricas = [
      ['Porcentaje de Surtido', `${porcentajeCumplimiento}%`],
      ['Cajas Surtidas', totalCantidadAsignada.toLocaleString('es-MX')],
      ['Cajas por Surtir', totalCantidadFaltante.toLocaleString('es-MX')],
      ['Tarimas Asignadas', progreso.tarimas.length],
    ];

    metricas.forEach(([label, value]) => {
      const row = sheetResumen.getRow(currentRow);
      row.getCell(1).value = label;
      row.getCell(1).font = { bold: true, size: 10 };
      row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
      row.getCell(2).value = value;
      row.getCell(2).font = { size: 11, bold: true };
      row.getCell(2).alignment = { horizontal: 'right' };
      sheetResumen.mergeCells(`B${currentRow}:G${currentRow}`);
      currentRow++;
    });

    currentRow += 1;

    // Sección: Órdenes y Progreso de Surtido (fusionada - elimina redundancia)
    sheetResumen.mergeCells(`A${currentRow}:I${currentRow}`);
    const ordenesTitleCell = sheetResumen.getCell(`A${currentRow}`);
    ordenesTitleCell.value = 'Órdenes y Progreso de Surtido';
    ordenesTitleCell.style = sectionTitleStyle;
    currentRow++;

    // Headers de la tabla de órdenes con progreso
    const ordenesHeaders = ['ID', 'Tipo', 'Producto', 'Variedad', 'Requeridas', 'Surtidas', 'Faltantes', 'Progreso', 'Estado'];
    const ordenesHeaderRow = sheetResumen.getRow(currentRow);
    ordenesHeaders.forEach((header, index) => {
      const cell = ordenesHeaderRow.getCell(index + 1);
      cell.value = header;
      cell.style = headerStyle;
    });
    currentRow++;

    // Datos de órdenes con progreso
    progreso.ordenes.forEach((orden, index) => {
      const cajasSurtidas = cajasSurtidasPorOrden.get(orden.id) || 0;
      const cantidadRequerida = orden.cantidad || 0;
      const cajasFaltantes = Math.max(0, cantidadRequerida - cajasSurtidas);
      const porcentajeSurtido = cantidadRequerida > 0
        ? Math.round((cajasSurtidas / cantidadRequerida) * 100)
        : 0;

      // Determinar estado
      let estado = 'Pendiente';
      if (cajasSurtidas >= cantidadRequerida) {
        estado = 'Completo';
      } else if (cajasSurtidas > 0) {
        estado = 'En Proceso';
      }

      const row = sheetResumen.getRow(currentRow);
      row.getCell(1).value = `#${orden.id}`;
      row.getCell(2).value = orden.tipo;
      row.getCell(3).value = orden.producto?.nombre || 'Sin producto';
      row.getCell(4).value = orden.producto?.variedad || 'N/A';
      row.getCell(5).value = cantidadRequerida;
      row.getCell(6).value = cajasSurtidas;
      row.getCell(7).value = cajasFaltantes;
      row.getCell(8).value = `${porcentajeSurtido}%`;
      row.getCell(9).value = estado;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber <= 9) {
          cell.style = {
            ...cellStyle,
            fill: {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB' }
            }
          };
          if (colNumber === 2) {
            cell.font = { bold: true, size: 10 };
          }
          if (colNumber >= 5 && colNumber <= 7) {
            cell.numFmt = '#,##0';
          }
          // Colores para cantidades
          if (colNumber === 6) {
            cell.font = { ...cell.font, color: { argb: 'FF059669' }, bold: true }; // Verde para surtidas
          }
          if (colNumber === 7 && cajasFaltantes > 0) {
            cell.font = { ...cell.font, color: { argb: 'FFDC2626' }, bold: true }; // Rojo para faltantes
          }
          // Color y estilo para estado
          if (colNumber === 9) {
            cell.font = { bold: true, size: 10 };
            if (estado === 'Completo') {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
              cell.font = { ...cell.font, color: { argb: 'FF059669' } };
            } else if (estado === 'En Proceso') {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
              cell.font = { ...cell.font, color: { argb: 'FFD97706' } };
            } else {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
              cell.font = { ...cell.font, color: { argb: 'FFDC2626' } };
            }
          }
        }
      });
      currentRow++;
    });

    // Ajustar anchos de columnas
    sheetResumen.columns = [
      { width: 10 },  // ID
      { width: 10 },  // Tipo
      { width: 30 },  // Producto
      { width: 18 },  // Variedad
      { width: 12 },  // Requeridas
      { width: 12 },  // Surtidas
      { width: 12 },  // Faltantes
      { width: 12 },  // Progreso
      { width: 14 },  // Estado
    ];

    // ========== HOJA 2: Tarimas Asignadas (CONDICIONAL) ==========
    if (incluirTarimas) {
      const sheetTarimas = workbook.addWorksheet('Tarimas Asignadas');

      currentRow = 1;

      // Título
      sheetTarimas.mergeCells(`A${currentRow}:H${currentRow}`);
      const tarimaTitleCell = sheetTarimas.getCell(`A${currentRow}`);
      tarimaTitleCell.value = `Tarimas Asignadas al Pedido #${progreso.id}`;
      tarimaTitleCell.style = titleStyle;
      currentRow += 2;

      // Headers
      const tarimasHeaders = ['Código', 'UPC', 'Producto', 'Variedad', 'Estatus', 'Tipo', 'Cantidad', 'Peso (kg)'];
      const tarimasHeaderRow = sheetTarimas.getRow(currentRow);
      tarimasHeaders.forEach((header, index) => {
        const cell = tarimasHeaderRow.getCell(index + 1);
        cell.value = header;
        cell.style = headerStyle;
      });
      currentRow++;

      // Datos de tarimas
      let rowIndex = 0;
      progreso.tarimas.forEach((tarima) => {
        if (tarima.tarimasClasificaciones.length > 0) {
          tarima.tarimasClasificaciones.forEach((clas) => {
            const row = sheetTarimas.getRow(currentRow);
            row.getCell(1).value = tarima.codigo;
            row.getCell(2).value = tarima.upc || '-';
            row.getCell(3).value = clas.producto?.nombre || 'Sin producto';
            row.getCell(4).value = clas.producto?.variedad || 'N/A';
            row.getCell(5).value = tarima.estatus;
            row.getCell(6).value = clas.tipo;
            row.getCell(7).value = clas.cantidad || 0;
            row.getCell(8).value = parseFloat((clas.peso || 0).toFixed(2));

            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
              if (colNumber <= 8) {
                cell.style = {
                  ...cellStyle,
                  fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: rowIndex % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB' }
                  }
                };
                if (colNumber === 6) {
                  cell.font = { bold: true, size: 10 };
                }
                if (colNumber === 7 || colNumber === 8) {
                  cell.numFmt = '#,##0.00';
                }
              }
            });
            currentRow++;
            rowIndex++;
          });
        } else {
          const row = sheetTarimas.getRow(currentRow);
          row.getCell(1).value = tarima.codigo;
          row.getCell(2).value = tarima.upc || '-';
          row.getCell(3).value = 'Sin producto';
          row.getCell(4).value = '-';
          row.getCell(5).value = tarima.estatus;
          row.getCell(6).value = '-';
          row.getCell(7).value = '-';
          row.getCell(8).value = '-';

          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber <= 8) {
              cell.style = {
                ...cellStyle,
                fill: {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: rowIndex % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB' }
                }
              };
            }
          });
          currentRow++;
          rowIndex++;
        }
      });

      // Ajustar anchos de columnas
      sheetTarimas.columns = [
        { width: 15 },
        { width: 15 },
        { width: 30 },
        { width: 18 },
        { width: 15 },
        { width: 10 },
        { width: 12 },
        { width: 12 },
      ];
    }

    // Generar y descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fecha = new Date().toISOString().split('T')[0];
    const filename = `Reporte_Progreso_Pedido_${progreso.id}_${fecha}.xlsx`;
    saveAs(new Blob([buffer]), filename);
  }
}
