/**
 * Hook personalizado para manejar la exportación de reportes del inventario
 */

import { useState, useCallback } from 'react';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import { reportesService } from '@/services/reportes.service';
import type { 
  ConfiguracionReporte, 
  PlantillaReporte, 
  EstadoGeneracionReporte,
  ExportConfig 
} from '@/types/Inventario/reportes.types';
import type { InventarioTipoDTO } from '@/types/Inventario/inventario.types';

/**
 * Hook para reportes exportables
 */
export const useReportesExportables = () => {
  // Estados principales
  const [plantillas, setPlantillas] = useState<PlantillaReporte[]>([]);
  const [estadoGeneracion, setEstadoGeneracion] = useState<EstadoGeneracionReporte>({
    isGenerating: false,
    progreso: 0,
    error: null,
    reporteGenerado: null
  });

  // Estados de UI
  const [isLoadingPlantillas, setIsLoadingPlantillas] = useState(false);
  const [errorPlantillas, setErrorPlantillas] = useState<string | null>(null);

  /**
   * Carga las plantillas de reportes disponibles
   */
  const cargarPlantillas = useCallback(async () => {
    try {
      setIsLoadingPlantillas(true);
      setErrorPlantillas(null);

      // En desarrollo, usar plantillas de prueba
      const plantillasPrueba: PlantillaReporte[] = [
        {
          id: '1',
          nombre: 'Inventario por Cliente',
          descripcion: 'Reporte detallado del inventario agrupado por cliente',
          esPredeterminada: true,
          configuracion: {
            nombre: 'Inventario por Cliente',
            formato: 'excel',
            filtros: {},
            columnas: ['codigo', 'tipo', 'pesoTotalPorTipo', 'cliente', 'sucursal', 'estatus']
          }
        },
        {
          id: '2',
          nombre: 'Resumen Diario',
          descripcion: 'Resumen diario de movimientos y estado del inventario',
          esPredeterminada: true,
          configuracion: {
            nombre: 'Resumen Diario',
            formato: 'pdf',
            filtros: {},
            columnas: ['codigo', 'tipo', 'pesoTotalPorTipo', 'cliente', 'estatus'],
            agruparPor: 'cliente'
          }
        },
        {
          id: '3',
          nombre: 'Tarimas Sin Asignar',
          descripcion: 'Listado de tarimas que no están asignadas a ningún cliente',
          esPredeterminada: true,
          configuracion: {
            nombre: 'Tarimas Sin Asignar',
            formato: 'excel',
            filtros: { estatus: ['Disponible'] },
            columnas: ['codigo', 'tipo', 'pesoTotalPorTipo', 'fechaRegistro']
          }
        }
      ];

      setPlantillas(plantillasPrueba);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar plantillas';
      setErrorPlantillas(errorMessage);
      console.error('Error en cargarPlantillas:', error);
    } finally {
      setIsLoadingPlantillas(false);
    }
  }, []);

  /**
   * Genera un reporte con la configuración especificada
   */
  const generarReporte = useCallback(async (
    configuracion: ConfiguracionReporte,
    datos: InventarioTipoDTO[]
  ) => {
    try {
      setEstadoGeneracion({
        isGenerating: true,
        progreso: 0,
        error: null,
        reporteGenerado: null
      });

      // Simular progreso
      const interval = setInterval(() => {
        setEstadoGeneracion(prev => ({
          ...prev,
          progreso: Math.min(prev.progreso + 10, 90)
        }));
      }, 200);

      // En desarrollo, generar localmente
      // En producción, usar: const reporte = await reportesService.generarReporte(configuracion);
      const reporte = await generarReporteLocal(configuracion, datos);

      clearInterval(interval);
      
      setEstadoGeneracion({
        isGenerating: false,
        progreso: 100,
        error: null,
        reporteGenerado: reporte
      });

      return reporte;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error al generar reporte';
      setEstadoGeneracion(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  /**
   * Genera reporte localmente para desarrollo
   */
  const generarReporteLocal = async (
    configuracion: ConfiguracionReporte,
    datos: InventarioTipoDTO[]
  ) => {
    return new Promise<{ id: string; nombre: string; url: string; fechaGeneracion: string; tamano: number; formato: string }>((resolve) => {
      setTimeout(() => {
        const reporte = {
          id: `reporte_${Date.now()}`,
          nombre: configuracion.nombre,
          url: '#',
          fechaGeneracion: new Date().toISOString(),
          tamano: Math.floor(Math.random() * 1000000) + 50000,
          formato: configuracion.formato
        };
        resolve(reporte);
      }, 2000);
    });
  };

  /**
   * Exporta datos a Excel
   */
  const exportarAExcel = useCallback(async (
    datos: InventarioTipoDTO[],
    configuracion: ConfiguracionReporte
  ) => {
    try {
      if (!datos || datos.length === 0) {
        throw new Error('No hay datos para exportar');
      }

      // Crear workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Inventario');

      // Definir columnas
      worksheet.columns = [
        { header: 'Código', key: 'codigo', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 20 },
        { header: 'Peso Total (kg)', key: 'pesoTotal', width: 15 },
        { header: 'Cliente', key: 'cliente', width: 25 },
        { header: 'Sucursal', key: 'sucursal', width: 20 },
        { header: 'Lote', key: 'lote', width: 15 },
        { header: 'Fecha Registro', key: 'fechaRegistro', width: 15 },
        { header: 'Estatus', key: 'estatus', width: 15 }
      ];

      // Agregar datos
      datos.forEach((item) => {
        worksheet.addRow({
          codigo: item.codigo,
          tipo: item.tipo,
          pesoTotal: item.pesoTotalPorTipo,
          cliente: item.cliente,
          sucursal: item.sucursal,
          lote: item.lote,
          fechaRegistro: new Date(item.fechaRegistro).toLocaleDateString('es-MX'),
          estatus: item.estatus
        });
      });

      // Aplicar estilos al header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2E8F0' }
      };

      // Generar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Descargar archivo
      const nombreArchivo = `${configuracion.nombre}_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, nombreArchivo);

      return { success: true, nombreArchivo };
    } catch (error) {
      throw new Error(`Error al generar archivo Excel: ${error.message}`);
    }
  }, []);

  /**
   * Exporta datos a CSV
   */
  const exportarACSV = useCallback((
    datos: InventarioTipoDTO[],
    configuracion: ConfiguracionReporte
  ) => {
    try {
      if (!datos || datos.length === 0) {
        throw new Error('No hay datos para exportar');
      }

      // Preparar datos
      const datosExportar = datos.map(item => ({
        codigo: item.codigo,
        tipo: item.tipo,
        pesoTotal: item.pesoTotalPorTipo,
        cliente: item.cliente,
        sucursal: item.sucursal,
        lote: item.lote,
        fechaRegistro: item.fechaRegistro,
        estatus: item.estatus
      }));

      // Convertir a CSV
      const headers = Object.keys(datosExportar[0] || {});
      const csvContent = [
        headers.join(','),
        ...datosExportar.map(row => 
          headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
        )
      ].join('\n');

      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const nombreArchivo = `${configuracion.nombre}_${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, nombreArchivo);

      return { success: true, nombreArchivo };
    } catch (error) {
      throw new Error(`Error al generar archivo CSV: ${error.message}`);
    }
  }, []);

  /**
   * Descarga un reporte generado
   */
  const descargarReporte = useCallback(async (id: string) => {
    try {
      const blob = await reportesService.descargarReporte(id);
      const nombreArchivo = `reporte_${id}.pdf`;
      saveAs(blob, nombreArchivo);
    } catch (error: any) {
      console.error('Error al descargar reporte:', error);
      throw new Error('Error al descargar reporte');
    }
  }, []);

  /**
   * Limpia el estado de generación
   */
  const limpiarEstadoGeneracion = useCallback(() => {
    setEstadoGeneracion({
      isGenerating: false,
      progreso: 0,
      error: null,
      reporteGenerado: null
    });
  }, []);

  return {
    // Datos
    plantillas,
    estadoGeneracion,

    // Estados
    isLoadingPlantillas,
    errorPlantillas,

    // Acciones
    cargarPlantillas,
    generarReporte,
    exportarAExcel,
    exportarACSV,
    descargarReporte,
    limpiarEstadoGeneracion
  };
};
