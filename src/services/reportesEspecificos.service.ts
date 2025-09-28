/**
 * Servicio para generar reportes específicos del inventario
 */

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { generarPDFPeriodo, generarPDFCliente, generarPDFDiario } from './pdfGenerators.tsx';
import type { InventarioTipoDTO } from '@/types/Inventario/inventario.types';
import type {
  ConfiguracionReporteEspecifico,
  DatosReportePeriodo,
  DatosReporteCliente,
  DatosReporteDiario,
  ResultadoReporte
} from '@/types/Inventario/reportesEspecificos.types';

/**
 * Servicio para reportes específicos
 */
export class ReportesEspecificosService {
  /**
   * Procesa datos para reporte por período
   */
  static procesarDatosPeriodo(
    datos: InventarioTipoDTO[],
    configuracion: ConfiguracionReporteEspecifico
  ): DatosReportePeriodo[] {
    if (configuracion.tipo !== 'periodo') return [];

    const { fechaInicio, fechaFin } = configuracion.filtros;
    
    return datos
      .filter(item => {
        const fechaItem = new Date(item.fechaRegistro);
        const fechaIni = new Date(fechaInicio);
        const fechaFinDate = new Date(fechaFin);
        return fechaItem >= fechaIni && fechaItem <= fechaFinDate;
      })
      .map(item => ({
        fecha: item.fechaRegistro,
        codigo: item.codigo,
        tipo: item.tipo,
        pesoTotal: item.pesoTotalPorTipo,
        cliente: item.cliente,
        fechaRegistro: item.fechaRegistro
      }));
  }

  /**
   * Procesa datos para reporte por cliente
   */
  static procesarDatosCliente(
    datos: InventarioTipoDTO[],
    configuracion: ConfiguracionReporteEspecifico
  ): DatosReporteCliente[] {
    if (configuracion.tipo !== 'cliente') return [];

    const { clienteId, incluirSinAsignar } = configuracion.filtros;
    
    let datosFiltrados = datos;
    
    // PRIMERO: Aplicar filtro de incluir sin asignar
    if (!incluirSinAsignar) {
      datosFiltrados = datosFiltrados.filter(item => item.cliente !== 'Sin asignar');
    }
    
    // SEGUNDO: Aplicar filtro de cliente específico
    if (clienteId && clienteId !== 'todos') {
      datosFiltrados = datosFiltrados.filter(item => item.cliente === clienteId);
    }

    // Agrupar por cliente y tipo para generar filas separadas
    const agrupadoPorClienteTipo = datosFiltrados.reduce((acc, item) => {
      const cliente = item.cliente || 'Sin asignar';
      const tipo = item.tipo;
      const key = `${cliente}-${tipo}`;
      
      if (!acc[key]) {
        acc[key] = {
          cliente,
          tipo,
          cantidad: 0,
          pesoTotal: 0,
          porcentaje: 0,
          fecha: item.fechaRegistro
        };
      }
      
      acc[key].cantidad += 1;
      acc[key].pesoTotal += item.pesoTotalPorTipo;
      
      return acc;
    }, {} as Record<string, DatosReporteCliente>);

    // Calcular porcentajes globales
    const totalPesoGlobal = Object.values(agrupadoPorClienteTipo).reduce((sum, item) => sum + item.pesoTotal, 0);
    
    // Generar filas con porcentajes
    const resultado = Object.values(agrupadoPorClienteTipo).map(item => ({
      ...item,
      porcentaje: totalPesoGlobal > 0 ? Math.round((item.pesoTotal / totalPesoGlobal) * 100) : 0
    }));
    
    return resultado;
  }

  /**
   * Procesa datos para resumen diario
   */
  static procesarDatosDiario(
    datos: InventarioTipoDTO[],
    configuracion: ConfiguracionReporteEspecifico
  ): DatosReporteDiario[] {
    if (configuracion.tipo !== 'diario') return [];

    const { fecha } = configuracion.filtros;
    
    const datosDelDia = datos.filter(item => {
      const fechaItem = new Date(item.fechaRegistro).toISOString().split('T')[0];
      return fechaItem === fecha;
    });

    // Agrupar por tipo
    const agrupadoPorTipo = datosDelDia.reduce((acc, item) => {
      if (!acc[item.tipo]) {
        acc[item.tipo] = {
          tipo: item.tipo,
          cantidad: 0,
          pesoTotal: 0,
          estatus: 'Activo',
          porcentaje: 0,
          cliente: item.cliente,
          fecha: item.fechaRegistro
        };
      }
      
      acc[item.tipo].cantidad += 1;
      acc[item.tipo].pesoTotal += item.pesoTotalPorTipo;
      
      return acc;
    }, {} as Record<string, DatosReporteDiario>);

    const totalPeso = Object.values(agrupadoPorTipo).reduce((sum, item) => sum + item.pesoTotal, 0);
    
    return Object.values(agrupadoPorTipo).map(item => ({
      ...item,
      porcentaje: totalPeso > 0 ? Math.round((item.pesoTotal / totalPeso) * 100) : 0
    }));
  }

  /**
   * Genera reporte Excel para período
   */
  static async generarExcelPeriodo(
    datos: DatosReportePeriodo[],
    configuracion: ConfiguracionReporteEspecifico
  ): Promise<ResultadoReporte> {
    if (datos.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte por Período');

    // Configurar columnas
    worksheet.columns = [
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Código', key: 'codigo', width: 20 },
      { header: 'Tipo', key: 'tipo', width: 10 },
      { header: 'Peso Total (kg)', key: 'pesoTotal', width: 15 },
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Fecha Registro', key: 'fechaRegistro', width: 15 }
    ];

    // Agregar datos
    datos.forEach(item => {
      worksheet.addRow({
        fecha: new Date(item.fecha).toLocaleDateString('es-ES'),
        codigo: item.codigo,
        tipo: item.tipo,
        pesoTotal: item.pesoTotal,
        cliente: item.cliente,
        fechaRegistro: new Date(item.fechaRegistro).toLocaleDateString('es-ES')
      });
    });

    // Estilizar encabezados
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2980B9' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const nombreArchivo = `${configuracion.nombre}_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, nombreArchivo);

    return {
      success: true,
      nombreArchivo,
      tamano: blob.size,
      fechaGeneracion: new Date().toISOString(),
      tipo: 'periodo'
    };
  }

  /**
   * Genera reporte Excel para cliente
   */
  static async generarExcelCliente(
    datos: DatosReporteCliente[],
    configuracion: ConfiguracionReporteEspecifico
  ): Promise<ResultadoReporte> {
    if (datos.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte por Cliente');

    // Configurar columnas
    worksheet.columns = [
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Tipo', key: 'tipo', width: 10 },
      { header: 'Cantidad Tarimas', key: 'cantidad', width: 15 },
      { header: 'Peso Total (kg)', key: 'pesoTotal', width: 15 },
      { header: '% Peso Global', key: 'porcentaje', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 15 }
    ];

    // Agregar datos
    datos.forEach(item => {
      worksheet.addRow({
        cliente: item.cliente,
        tipo: item.tipo,
        cantidad: item.cantidad,
        pesoTotal: item.pesoTotal,
        porcentaje: item.porcentaje,
        fecha: new Date(item.fecha).toLocaleDateString('es-ES')
      });
    });

    // Estilizar encabezados
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2980B9' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const nombreArchivo = `${configuracion.nombre}_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, nombreArchivo);

    return {
      success: true,
      nombreArchivo,
      tamano: blob.size,
      fechaGeneracion: new Date().toISOString(),
      tipo: 'cliente'
    };
  }

  /**
   * Genera reporte Excel para resumen diario
   */
  static async generarExcelDiario(
    datos: DatosReporteDiario[],
    configuracion: ConfiguracionReporteEspecifico
  ): Promise<ResultadoReporte> {
    if (datos.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resumen Diario');

    // Configurar columnas
    worksheet.columns = [
      { header: 'Tipo', key: 'tipo', width: 10 },
      { header: 'Cantidad', key: 'cantidad', width: 12 },
      { header: 'Peso Total (kg)', key: 'pesoTotal', width: 15 },
      { header: 'Estatus', key: 'estatus', width: 12 },
      { header: 'Porcentaje (%)', key: 'porcentaje', width: 15 },
      { header: 'Cliente', key: 'cliente', width: 25 },
      { header: 'Fecha', key: 'fecha', width: 15 }
    ];

    // Agregar datos
    datos.forEach(item => {
      worksheet.addRow({
        tipo: item.tipo,
        cantidad: item.cantidad,
        pesoTotal: item.pesoTotal,
        estatus: item.estatus,
        porcentaje: item.porcentaje,
        cliente: item.cliente,
        fecha: new Date(item.fecha).toLocaleDateString('es-ES')
      });
    });

    // Estilizar encabezados
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2980B9' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const nombreArchivo = `${configuracion.nombre}_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, nombreArchivo);

    return {
      success: true,
      nombreArchivo,
      tamano: blob.size,
      fechaGeneracion: new Date().toISOString(),
      tipo: 'diario'
    };
  }

  /**
   * Genera reporte PDF para período
   */
  static async generarPDFPeriodo(
    datos: DatosReportePeriodo[],
    configuracion: ConfiguracionReporteEspecifico
  ): Promise<ResultadoReporte> {
    return generarPDFPeriodo(datos, configuracion);
  }

  /**
   * Genera reporte PDF para cliente
   */
  static async generarPDFCliente(
    datos: DatosReporteCliente[],
    configuracion: ConfiguracionReporteEspecifico
  ): Promise<ResultadoReporte> {
    return generarPDFCliente(datos, configuracion);
  }

  /**
   * Genera reporte PDF para resumen diario
   */
  static async generarPDFDiario(
    datos: DatosReporteDiario[],
    configuracion: ConfiguracionReporteEspecifico
  ): Promise<ResultadoReporte> {
    return generarPDFDiario(datos, configuracion);
  }
}
