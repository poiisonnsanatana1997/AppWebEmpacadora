/**
 * Hook para manejar los reportes específicos del inventario
 */

import { useState, useCallback } from 'react';
import { ReportesEspecificosService } from '@/services/reportesEspecificos.service';
import type { InventarioTipoDTO } from '@/types/Inventario/inventario.types';
import type {
  ConfiguracionReporteEspecifico,
  EstadoModalReporte,
  OpcionesFiltrosReportes,
  ResultadoReporte,
  DatosReportePeriodo,
  DatosReporteCliente,
  DatosReporteDiario
} from '@/types/Inventario/reportesEspecificos.types';

/**
 * Hook para reportes específicos
 */
export const useReportesEspecificos = () => {
  // Estados principales
  const [estadoModal, setEstadoModal] = useState<EstadoModalReporte>({
    isOpen: false,
    tipoReporte: null,
    configuracion: null
  });

  const [opcionesFiltros, setOpcionesFiltros] = useState<OpcionesFiltrosReportes>({
    clientes: [],
    fechasDisponibles: []
  });

  const [isGenerando, setIsGenerando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reporteGenerado, setReporteGenerado] = useState<boolean>(false);

  /**
   * Abre el modal de configuración para un tipo de reporte
   */
  const abrirModalConfiguracion = useCallback((tipoReporte: 'periodo' | 'cliente' | 'diario') => {
    setEstadoModal({
      isOpen: true,
      tipoReporte,
      configuracion: null
    });
    setError(null);
    setReporteGenerado(false);
  }, []);

  /**
   * Cierra el modal de configuración
   */
  const cerrarModalConfiguracion = useCallback(() => {
    setEstadoModal({
      isOpen: false,
      tipoReporte: null,
      configuracion: null
    });
    setError(null);
    setReporteGenerado(false);
  }, []);

  /**
   * Actualiza la configuración del reporte
   */
  const actualizarConfiguracion = useCallback((configuracion: ConfiguracionReporteEspecifico) => {
    setEstadoModal(prev => ({
      ...prev,
      configuracion
    }));
  }, []);

  /**
   * Carga las opciones de filtros disponibles
   */
  const cargarOpcionesFiltros = useCallback((datos: InventarioTipoDTO[]) => {
    // Extraer clientes únicos
    const clientesUnicos = Array.from(
      new Set(datos.map(item => item.cliente).filter(Boolean))
    ).map(cliente => ({
      id: cliente,
      nombre: cliente
    }));

    // Extraer fechas disponibles
    const fechasUnicas = Array.from(
      new Set(datos.map(item => new Date(item.fechaRegistro).toISOString().split('T')[0]))
    ).sort();

    setOpcionesFiltros({
      clientes: clientesUnicos,
      fechasDisponibles: fechasUnicas
    });
  }, []);

  /**
   * Genera reporte por período
   */
  const generarReportePeriodo = useCallback(async (
    datos: InventarioTipoDTO[],
    configuracion: ConfiguracionReporteEspecifico
  ): Promise<ResultadoReporte> => {
    try {
      setIsGenerando(true);
      setError(null);

      // Simular tiempo de procesamiento para mostrar el feedback
      await new Promise(resolve => setTimeout(resolve, 2000));

      const datosProcesados = ReportesEspecificosService.procesarDatosPeriodo(datos, configuracion);
      
      if (datosProcesados.length === 0) {
        throw new Error('No hay datos para el período seleccionado');
      }

      let resultado: ResultadoReporte;

      if (configuracion.formato === 'excel') {
        resultado = await ReportesEspecificosService.generarExcelPeriodo(datosProcesados, configuracion);
      } else {
        resultado = await ReportesEspecificosService.generarPDFPeriodo(datosProcesados, configuracion);
      }

      setReporteGenerado(true);
      cerrarModalConfiguracion();
      return resultado;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al generar reporte por período';
      setError(errorMessage);
      throw error;
    } finally {
      setIsGenerando(false);
    }
  }, [cerrarModalConfiguracion]);

  /**
   * Genera reporte por cliente
   */
  const generarReporteCliente = useCallback(async (
    datos: InventarioTipoDTO[],
    configuracion: ConfiguracionReporteEspecifico
  ): Promise<ResultadoReporte> => {
    try {
      setIsGenerando(true);
      setError(null);

      // Simular tiempo de procesamiento para mostrar el feedback
      await new Promise(resolve => setTimeout(resolve, 2000));

      const datosProcesados = ReportesEspecificosService.procesarDatosCliente(datos, configuracion);
      
      if (datosProcesados.length === 0) {
        throw new Error('No hay datos para los clientes seleccionados');
      }

      let resultado: ResultadoReporte;

      if (configuracion.formato === 'excel') {
        resultado = await ReportesEspecificosService.generarExcelCliente(datosProcesados, configuracion);
      } else {
        resultado = await ReportesEspecificosService.generarPDFCliente(datosProcesados, configuracion);
      }

      setReporteGenerado(true);
      cerrarModalConfiguracion();
      return resultado;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al generar reporte por cliente';
      setError(errorMessage);
      throw error;
    } finally {
      setIsGenerando(false);
    }
  }, [cerrarModalConfiguracion]);

  /**
   * Genera resumen diario
   */
  const generarReporteDiario = useCallback(async (
    datos: InventarioTipoDTO[],
    configuracion: ConfiguracionReporteEspecifico
  ): Promise<ResultadoReporte> => {
    try {
      setIsGenerando(true);
      setError(null);

      // Simular tiempo de procesamiento para mostrar el feedback
      await new Promise(resolve => setTimeout(resolve, 2000));

      const datosProcesados = ReportesEspecificosService.procesarDatosDiario(datos, configuracion);
      
      if (datosProcesados.length === 0) {
        throw new Error('No hay datos para la fecha seleccionada');
      }

      let resultado: ResultadoReporte;

      if (configuracion.formato === 'excel') {
        resultado = await ReportesEspecificosService.generarExcelDiario(datosProcesados, configuracion);
      } else {
        resultado = await ReportesEspecificosService.generarPDFDiario(datosProcesados, configuracion);
      }

      setReporteGenerado(true);
      cerrarModalConfiguracion();
      return resultado;
    } catch (error: any) {
      const errorMessage = error.message || 'Error al generar resumen diario';
      setError(errorMessage);
      throw error;
    } finally {
      setIsGenerando(false);
    }
  }, [cerrarModalConfiguracion]);

  /**
   * Genera el reporte según el tipo
   */
  const generarReporte = useCallback(async (
    datos: InventarioTipoDTO[],
    configuracion: ConfiguracionReporteEspecifico
  ): Promise<ResultadoReporte> => {
    switch (configuracion.tipo) {
      case 'periodo':
        return generarReportePeriodo(datos, configuracion);
      case 'cliente':
        return generarReporteCliente(datos, configuracion);
      case 'diario':
        return generarReporteDiario(datos, configuracion);
      default:
        throw new Error('Tipo de reporte no válido');
    }
  }, [generarReportePeriodo, generarReporteCliente, generarReporteDiario]);

  /**
   * Obtiene vista previa de datos para el reporte
   */
  const obtenerVistaPrevia = useCallback((
    datos: InventarioTipoDTO[],
    configuracion: ConfiguracionReporteEspecifico
  ) => {
    switch (configuracion.tipo) {
      case 'periodo':
        return ReportesEspecificosService.procesarDatosPeriodo(datos, configuracion);
      case 'cliente':
        return ReportesEspecificosService.procesarDatosCliente(datos, configuracion);
      case 'diario':
        return ReportesEspecificosService.procesarDatosDiario(datos, configuracion);
      default:
        return [];
    }
  }, []);

  return {
    // Estados
    estadoModal,
    opcionesFiltros,
    isGenerando,
    error,
    reporteGenerado,

    // Acciones
    abrirModalConfiguracion,
    cerrarModalConfiguracion,
    actualizarConfiguracion,
    cargarOpcionesFiltros,
    generarReporte,
    obtenerVistaPrevia
  };
};
