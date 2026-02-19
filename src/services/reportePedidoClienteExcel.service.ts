import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PedidoClienteResponseDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { ConfiguracionReporte } from '@/types/PedidoCliente/reportes.types';

/**
 * Servicio para generar reportes en Excel de pedidos cliente
 */
export class ReportePedidoClienteExcelService {
  /**
   * Genera y descarga un reporte Excel del pedido cliente
   */
  static async generarReporteExcel(
    pedido: PedidoClienteResponseDTO,
    configuracion: ConfiguracionReporte
  ): Promise<void> {
    if (!pedido) {
      throw new Error('No se proporcionó información del pedido');
    }

    const workbook = new ExcelJS.Workbook();

    // Metadata del documento
    workbook.creator = 'AppWebEmpacadora';
    workbook.created = new Date();
    workbook.modified = new Date();

    // Crear hojas del reporte
    this.crearHojaResumen(workbook, pedido, configuracion);
    this.crearHojaDetalleOrdenes(workbook, pedido);

    // Generar y descargar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `PedidoCliente_${pedido.id}_${fecha}.xlsx`;

    saveAs(new Blob([buffer]), nombreArchivo);
  }

  /**
   * Crea la hoja de resumen del pedido
   */
  private static crearHojaResumen(
    workbook: ExcelJS.Workbook,
    pedido: PedidoClienteResponseDTO,
    configuracion: ConfiguracionReporte
  ): void {
    const sheet = workbook.addWorksheet('Resumen del Pedido');

    // Estilos
    const tituloStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, size: 16, color: { argb: 'FF2563EB' } },
      alignment: { vertical: 'middle', horizontal: 'center' }
    };

    const encabezadoStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, size: 11 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } },
      alignment: { vertical: 'middle', horizontal: 'left' }
    };

    const valorStyle: Partial<ExcelJS.Style> = {
      font: { size: 10 },
      alignment: { vertical: 'middle', horizontal: 'left' }
    };

    const borderStyle: Partial<ExcelJS.Border> = { style: 'thin', color: { argb: 'FFD1D5DB' } };

    // Título
    sheet.mergeCells('A1:F1');
    const tituloCell = sheet.getCell('A1');
    tituloCell.value = `${configuracion.nombreEmpresa} - Reporte de Pedido Cliente`;
    tituloCell.style = tituloStyle;
    sheet.getRow(1).height = 25;

    // Fecha de generación
    sheet.mergeCells('A2:F2');
    const fechaCell = sheet.getCell('A2');
    fechaCell.value = `Generado el: ${new Date().toLocaleString('es-MX')}`;
    fechaCell.style = { alignment: { horizontal: 'center' }, font: { size: 9, color: { argb: 'FF6B7280' } } };
    sheet.getRow(2).height = 18;

    sheet.addRow([]); // Espaciado

    // Información General
    let currentRow = 4;
    const agregarSeccion = (titulo: string, datos: Array<[string, string | number]>) => {
      // Título de sección
      sheet.mergeCells(`A${currentRow}:B${currentRow}`);
      const seccionCell = sheet.getCell(`A${currentRow}`);
      seccionCell.value = titulo;
      seccionCell.style = {
        font: { bold: true, size: 12, color: { argb: 'FF1F2937' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } },
        border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
      };
      sheet.getRow(currentRow).height = 22;
      currentRow++;

      // Datos
      datos.forEach(([campo, valor]) => {
        const campoCell = sheet.getCell(`A${currentRow}`);
        campoCell.value = campo;
        campoCell.style = { ...encabezadoStyle, border: { left: borderStyle, right: borderStyle, bottom: borderStyle } };

        const valorCell = sheet.getCell(`B${currentRow}`);
        valorCell.value = valor;
        valorCell.style = { ...valorStyle, border: { left: borderStyle, right: borderStyle, bottom: borderStyle } };

        currentRow++;
      });

      currentRow++; // Espaciado entre secciones
    };

    // Sección: Información del Pedido
    agregarSeccion('INFORMACIÓN DEL PEDIDO', [
      ['ID del Pedido', `#${pedido.id}`],
      ['Estatus', pedido.estatus],
      ['Fecha de Registro', this.formatearFecha(pedido.fechaRegistro)],
      ['Fecha de Embarque', pedido.fechaEmbarque ? this.formatearFecha(pedido.fechaEmbarque) : 'No definida'],
      ['Usuario Registro', pedido.usuarioRegistro],
      ['Porcentaje Surtido', `${(pedido.porcentajeSurtido || 0).toFixed(2)}%`]
    ]);

    // Sección: Cliente y Sucursal
    agregarSeccion('CLIENTE Y SUCURSAL', [
      ['Cliente', pedido.cliente],
      ['Sucursal', pedido.sucursal]
    ]);

    // Sección: Resumen de Órdenes
    const totalOrdenes = pedido.ordenes.length;
    const totalCajas = pedido.ordenes.reduce((sum, ord) => sum + (ord.cantidad || 0), 0);
    const pesoTotal = pedido.ordenes.reduce((sum, ord) => sum + (ord.peso || 0), 0);

    agregarSeccion('RESUMEN DE ÓRDENES', [
      ['Total de Órdenes', totalOrdenes],
      ['Total de Cajas', totalCajas],
      ['Peso Total', `${(pesoTotal || 0).toFixed(2)} kg`]
    ]);

    // Desglose por tipo
    const desglosePorTipo = this.calcularDesglosePorTipo(pedido);
    if (desglosePorTipo.length > 0) {
      agregarSeccion('DESGLOSE POR TIPO',
        desglosePorTipo.map(item => [
          `Tipo ${item.tipo}`,
          `${item.cantidad} cajas (${(item.peso || 0).toFixed(2)} kg)`
        ])
      );
    }

    // Observaciones
    if (pedido.observaciones) {
      sheet.mergeCells(`A${currentRow}:B${currentRow}`);
      const obsTitle = sheet.getCell(`A${currentRow}`);
      obsTitle.value = 'OBSERVACIONES';
      obsTitle.style = {
        font: { bold: true, size: 12, color: { argb: 'FF1F2937' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } },
        border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
      };
      currentRow++;

      sheet.mergeCells(`A${currentRow}:B${currentRow}`);
      const obsValue = sheet.getCell(`A${currentRow}`);
      obsValue.value = pedido.observaciones;
      obsValue.style = {
        ...valorStyle,
        alignment: { vertical: 'top', horizontal: 'left', wrapText: true },
        border: { left: borderStyle, right: borderStyle, bottom: borderStyle }
      };
      sheet.getRow(currentRow).height = 50;
    }

    // Ajustar ancho de columnas
    sheet.getColumn('A').width = 25;
    sheet.getColumn('B').width = 40;
  }

  /**
   * Crea la hoja de detalle de órdenes
   */
  private static crearHojaDetalleOrdenes(
    workbook: ExcelJS.Workbook,
    pedido: PedidoClienteResponseDTO
  ): void {
    const sheet = workbook.addWorksheet('Detalle de Órdenes');

    const headerStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    const cellStyle: Partial<ExcelJS.Style> = {
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      }
    };

    // Título
    sheet.mergeCells('A1:H1');
    const titulo = sheet.getCell('A1');
    titulo.value = `Órdenes del Pedido #${pedido.id}`;
    titulo.style = {
      font: { bold: true, size: 14, color: { argb: 'FF2563EB' } },
      alignment: { vertical: 'middle', horizontal: 'center' }
    };
    sheet.getRow(1).height = 25;

    sheet.addRow([]); // Espaciado

    // Encabezados
    const headerRow = sheet.addRow([
      'ID',
      'Tipo',
      'Producto',
      'Código',
      'Variedad',
      'Cantidad (cajas)',
      'Peso (kg)',
      'Usuario Registro'
    ]);

    headerRow.eachCell((cell) => {
      cell.style = headerStyle;
    });
    sheet.getRow(3).height = 22;

    // Datos de órdenes
    pedido.ordenes.forEach((orden, index) => {
      const row = sheet.addRow([
        orden.id,
        orden.tipo,
        orden.producto?.nombre || 'Sin producto',
        orden.producto?.codigo || '-',
        orden.producto?.variedad || '-',
        orden.cantidad || 0,
        orden.peso ? orden.peso.toFixed(2) : '0.00',
        orden.usuarioRegistro
      ]);

      row.eachCell((cell) => {
        cell.style = {
          ...cellStyle,
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB' }
          }
        };
      });
    });

    // Fila de totales
    const totalRow = sheet.addRow([
      '', '', '', '', 'TOTALES:',
      pedido.ordenes.reduce((sum, ord) => sum + (ord.cantidad || 0), 0),
      (pedido.ordenes.reduce((sum, ord) => sum + (ord.peso || 0), 0) || 0).toFixed(2),
      ''
    ]);

    totalRow.eachCell((cell, colNumber) => {
      cell.style = {
        font: { bold: true, size: 11 },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } },
        alignment: { vertical: 'middle', horizontal: 'center' },
        border: {
          top: { style: 'medium' },
          left: { style: 'thin' },
          bottom: { style: 'medium' },
          right: { style: 'thin' }
        }
      };
    });

    // Ajustar anchos de columnas
    sheet.getColumn('A').width = 8;
    sheet.getColumn('B').width = 8;
    sheet.getColumn('C').width = 25;
    sheet.getColumn('D').width = 12;
    sheet.getColumn('E').width = 15;
    sheet.getColumn('F').width = 16;
    sheet.getColumn('G').width = 12;
    sheet.getColumn('H').width = 18;
  }

  /**
   * Calcula el desglose de cajas y peso por tipo
   */
  private static calcularDesglosePorTipo(pedido: PedidoClienteResponseDTO): Array<{ tipo: string; cantidad: number; peso: number }> {
    const desglose = new Map<string, { cantidad: number; peso: number }>();

    pedido.ordenes.forEach(orden => {
      const tipo = orden.tipo;
      if (!desglose.has(tipo)) {
        desglose.set(tipo, { cantidad: 0, peso: 0 });
      }

      const actual = desglose.get(tipo)!;
      actual.cantidad += orden.cantidad || 0;
      actual.peso += orden.peso || 0;
    });

    return Array.from(desglose.entries())
      .map(([tipo, valores]) => ({ tipo, ...valores }))
      .sort((a, b) => {
        const orden = ['XL', 'L', 'M', 'S', 'XS'];
        return orden.indexOf(a.tipo) - orden.indexOf(b.tipo);
      });
  }

  /**
   * Formatea una fecha para mostrarla en el reporte
   */
  private static formatearFecha(fecha: Date | string): string {
    try {
      const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
      return fechaObj.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  }
}
