import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ReporteOrdenesClasificadasService } from '@/services/reporteOrdenesClasificadas.service';
import { ParametrosReporteDTO } from '@/types/Reportes/reporteOrdenesClasificadas.types';
import { OrdenEntradaDto, ESTADO_ORDEN } from '@/types/OrdenesEntrada/ordenesEntrada.types';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook personalizado para manejar la lógica del modo reporte
 * Centraliza toda la funcionalidad relacionada con la selección y generación de reportes
 */
export const useModoReporte = () => {
  // Hook de autenticación
  const { user } = useAuth();
  
  // Estados del modo reporte
  const [modoReporte, setModoReporte] = useState(false);
  const [ordenesSeleccionadasReporte, setOrdenesSeleccionadasReporte] = useState<string[]>([]);
  const [cargandoReporte, setCargandoReporte] = useState(false);

  // Constantes
  const LIMITE_MAXIMO_ORDENES = 50;

  /**
   * Activa o desactiva el modo reporte
   */
  const toggleModoReporte = useCallback(() => {
    setModoReporte(prev => {
      const nuevoModo = !prev;
      if (!nuevoModo) {
        // Al salir del modo reporte, limpiar selección
        setOrdenesSeleccionadasReporte([]);
      }
      return nuevoModo;
    });
  }, []);

  /**
   * Maneja la selección/deselección de una orden para el reporte
   * @param codigo Código de la orden
   * @param seleccionado Si la orden debe estar seleccionada
   */
  const toggleSeleccionReporte = useCallback((codigo: string, seleccionado: boolean) => {
    if (seleccionado) {
      if (ordenesSeleccionadasReporte.length >= LIMITE_MAXIMO_ORDENES) {
        toast.warning(`Máximo ${LIMITE_MAXIMO_ORDENES} órdenes por reporte`);
        return;
      }
      setOrdenesSeleccionadasReporte(prev => [...prev, codigo]);
    } else {
      setOrdenesSeleccionadasReporte(prev => prev.filter(c => c !== codigo));
    }
  }, [ordenesSeleccionadasReporte.length, LIMITE_MAXIMO_ORDENES]);

  /**
   * Limpia toda la selección de órdenes para reporte
   */
  const limpiarSeleccionReporte = useCallback(() => {
    setOrdenesSeleccionadasReporte([]);
  }, []);

  /**
   * Verifica si una orden puede ser incluida en el reporte
   * @param orden Orden a verificar
   * @returns true si la orden puede ser incluida
   */
  const puedeIncluirEnReporte = useCallback((orden: OrdenEntradaDto): boolean => {
    // Solo incluir órdenes que estén en estado "Clasificado"
    return orden.estado === ESTADO_ORDEN.CLASIFICADO;
  }, []);

  /**
   * Selecciona todas las órdenes clasificadas disponibles (hasta el límite)
   */
  const seleccionarTodas = useCallback((ordenes: OrdenEntradaDto[]) => {
    const ordenesClasificadas = ordenes
      .filter(orden => puedeIncluirEnReporte(orden))
      .map(orden => orden.codigo)
      .slice(0, LIMITE_MAXIMO_ORDENES);
    
    setOrdenesSeleccionadasReporte(ordenesClasificadas);
    
    if (ordenesClasificadas.length === LIMITE_MAXIMO_ORDENES) {
      toast.info(`Seleccionadas ${LIMITE_MAXIMO_ORDENES} órdenes (límite máximo)`);
    } else {
      toast.success(`Seleccionadas ${ordenesClasificadas.length} órdenes clasificadas`);
    }
  }, [puedeIncluirEnReporte, LIMITE_MAXIMO_ORDENES]);

  /**
   * Selecciona solo las órdenes visibles en la página actual
   */
  const seleccionarVisibles = useCallback((ordenes: OrdenEntradaDto[]) => {
    const ordenesClasificadas = ordenes
      .filter(orden => puedeIncluirEnReporte(orden))
      .map(orden => orden.codigo);
    
    const disponibles = LIMITE_MAXIMO_ORDENES - ordenesSeleccionadasReporte.length;
    const aSeleccionar = ordenesClasificadas.slice(0, disponibles);
    
    setOrdenesSeleccionadasReporte(prev => [...prev, ...aSeleccionar]);
    
    if (aSeleccionar.length === 0) {
      toast.warning('Límite de selección alcanzado');
    } else {
      toast.success(`Seleccionadas ${aSeleccionar.length} órdenes de la página actual`);
    }
  }, [puedeIncluirEnReporte, ordenesSeleccionadasReporte.length, LIMITE_MAXIMO_ORDENES]);

  /**
   * Selecciona órdenes por proveedor
   */
  const seleccionarPorProveedor = useCallback((ordenes: OrdenEntradaDto[], proveedor: string) => {
    const ordenesProveedor = ordenes
      .filter(orden => puedeIncluirEnReporte(orden) && orden.proveedor?.nombre === proveedor)
      .map(orden => orden.codigo);
    
    const disponibles = LIMITE_MAXIMO_ORDENES - ordenesSeleccionadasReporte.length;
    const aSeleccionar = ordenesProveedor.slice(0, disponibles);
    
    setOrdenesSeleccionadasReporte(prev => [...prev, ...aSeleccionar]);
    
    if (aSeleccionar.length === 0) {
      toast.warning('No hay órdenes clasificadas de este proveedor o límite alcanzado');
    } else {
      toast.success(`Seleccionadas ${aSeleccionar.length} órdenes de ${proveedor}`);
    }
  }, [puedeIncluirEnReporte, ordenesSeleccionadasReporte.length, LIMITE_MAXIMO_ORDENES]);

  /**
   * Selecciona órdenes por rango de fechas
   */
  const seleccionarPorFecha = useCallback((ordenes: OrdenEntradaDto[], dias: number) => {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);
    
    const ordenesFecha = ordenes
      .filter(orden => {
        if (!puedeIncluirEnReporte(orden)) return false;
        const fechaOrden = new Date(orden.fechaRecepcion);
        return fechaOrden >= fechaLimite;
      })
      .map(orden => orden.codigo);
    
    const disponibles = LIMITE_MAXIMO_ORDENES - ordenesSeleccionadasReporte.length;
    const aSeleccionar = ordenesFecha.slice(0, disponibles);
    
    setOrdenesSeleccionadasReporte(prev => [...prev, ...aSeleccionar]);
    
    if (aSeleccionar.length === 0) {
      toast.warning(`No hay órdenes clasificadas de los últimos ${dias} días o límite alcanzado`);
    } else {
      toast.success(`Seleccionadas ${aSeleccionar.length} órdenes de los últimos ${dias} días`);
    }
  }, [puedeIncluirEnReporte, ordenesSeleccionadasReporte.length, LIMITE_MAXIMO_ORDENES]);

  /**
   * Obtiene las órdenes seleccionadas filtradas por las que pueden incluirse en reporte
   * @param ordenes Lista completa de órdenes
   * @returns IDs de las órdenes válidas para reporte
   */
  const obtenerOrdenesValidasParaReporte = useCallback((ordenes: OrdenEntradaDto[]): number[] => {
    return ordenes
      .filter(orden => 
        ordenesSeleccionadasReporte.includes(orden.codigo) && 
        puedeIncluirEnReporte(orden)
      )
      .map(orden => orden.id);
  }, [ordenesSeleccionadasReporte, puedeIncluirEnReporte]);

  /**
   * Genera un reporte en el formato especificado
   * @param formato Formato del reporte ('pdf' | 'excel')
   * @param ordenes Lista completa de órdenes
   */
  const generarReporte = useCallback(async (formato: 'pdf' | 'excel', ordenes: OrdenEntradaDto[]) => {
    if (ordenesSeleccionadasReporte.length === 0) {
      toast.warning('Selecciona al menos una orden para generar el reporte');
      return;
    }

    setCargandoReporte(true);
    try {
      // Obtener los IDs de las órdenes válidas
      const ordenIds = obtenerOrdenesValidasParaReporte(ordenes);

      if (ordenIds.length === 0) {
        toast.error('No hay órdenes válidas seleccionadas para el reporte');
        return;
      }

      // Obtener datos del reporte
      const datosReporte = await ReporteOrdenesClasificadasService.obtenerDatosReporte(ordenIds);

      // Parámetros del reporte
      const parametros: ParametrosReporteDTO = {
        ordenIds,
        formato,
        incluirDetalles: true,
        incluirMermas: true,
        incluirRetornos: true
      };

      console.log('Datos del reporte:', datosReporte);

      // Generar reporte según el formato
      if (formato === 'pdf') {
        const nombreUsuario = user?.name || 'Usuario';
        await ReporteOrdenesClasificadasService.generarReportePDF(datosReporte, parametros, nombreUsuario);
        toast.success('Reporte PDF generado correctamente');
      } else {
        await ReporteOrdenesClasificadasService.generarReporteExcel(datosReporte, parametros);
        toast.success('Reporte Excel generado correctamente');
      }

    } catch (error) {
      console.error('Error al generar reporte:', error);
      toast.error('Error al generar el reporte. Inténtalo de nuevo.');
    } finally {
      setCargandoReporte(false);
    }
  }, [ordenesSeleccionadasReporte, obtenerOrdenesValidasParaReporte]);

  /**
   * Obtiene estadísticas de la selección actual
   */
  const obtenerEstadisticasSeleccion = useCallback((ordenes: OrdenEntradaDto[]) => {
    const ordenesValidas = ordenes.filter(orden => 
      ordenesSeleccionadasReporte.includes(orden.codigo) && 
      puedeIncluirEnReporte(orden)
    );

    return {
      totalSeleccionadas: ordenesSeleccionadasReporte.length,
      validasParaReporte: ordenesValidas.length,
      limiteMaximo: LIMITE_MAXIMO_ORDENES,
      porcentajeCompletado: (ordenesSeleccionadasReporte.length / LIMITE_MAXIMO_ORDENES) * 100,
      estaCercaDelLimite: ordenesSeleccionadasReporte.length >= LIMITE_MAXIMO_ORDENES * 0.8,
      estaEnLimite: ordenesSeleccionadasReporte.length >= LIMITE_MAXIMO_ORDENES
    };
  }, [ordenesSeleccionadasReporte, puedeIncluirEnReporte]);

  return {
    // Estados
    modoReporte,
    ordenesSeleccionadasReporte,
    cargandoReporte,
    
    // Constantes
    LIMITE_MAXIMO_ORDENES,
    
    // Funciones básicas
    toggleModoReporte,
    toggleSeleccionReporte,
    limpiarSeleccionReporte,
    generarReporte,
    puedeIncluirEnReporte,
    obtenerOrdenesValidasParaReporte,
    obtenerEstadisticasSeleccion,
    
    // Funciones de selección masiva
    seleccionarTodas,
    seleccionarVisibles,
    seleccionarPorProveedor,
    seleccionarPorFecha
  };
};
