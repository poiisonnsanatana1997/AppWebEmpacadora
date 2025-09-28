/**
 * Hook unificado para manejar todos los datos de inventario
 * Centraliza todas las llamadas a la API en una sola función
 */

import { useState, useEffect, useCallback } from 'react';
import { InventarioService } from '@/services/inventario.service';
import { TarimaResumenService } from '@/services/tarimas.resumen.service';
import { reportesService } from '@/services/reportes.service';
import type { 
  InventarioTipoDTO, 
  IndicadoresInventarioDTO, 
  InventarioFilters,
  OpcionesFiltrosInventario
} from '@/types/Inventario/inventario.types';
import type { TarimaParcialCompletaDTO } from '@/types/Tarimas/tarima.types';
import type { TarimaEvolucionDTO } from '@/types/Tarimas/tarima.resumen.types';
import type { AnalyticsData, AnalyticsFilters } from '@/types/Inventario/reportes.types';
import { TarimaServiceError } from '@/services/tarimas.service';
import { useInventarioEvents } from '@/utils/inventario-events';

/**
 * Interface para los filtros de tarimas resumen
 */
export interface TarimasResumenFilters {
  fecha: string;
  fechaInicio: string;
  fechaFin: string;
  periodo: '7d' | '30d' | '90d' | '1y';
  agruparPor: 'dia' | 'semana' | 'mes';
  metricaEvolucion: 'peso' | 'tarimas';
}

/**
 * Interface para el estado unificado
 */
export interface InventarioUnificadoState {
  // Datos principales de inventario
  datos: InventarioTipoDTO[];
  datosFiltrados: InventarioTipoDTO[];
  indicadores: IndicadoresInventarioDTO | null;
  opcionesFiltros: OpcionesFiltrosInventario;
  
  // Datos de evolución temporal
  evolucionDiaria: TarimaEvolucionDTO[];
  evolucionSemanal: TarimaEvolucionDTO[];
  evolucionMensual: TarimaEvolucionDTO[];
  
  // Datos de analytics
  analyticsData: AnalyticsData | null;
  
  // Estados de UI
  isLoading: boolean;
  error: string | null;
  isRefreshing: boolean;
  
  // Modal de detalles
  selectedTarima: TarimaParcialCompletaDTO | null;
  isDetailModalOpen: boolean;
}

/**
 * Hook unificado para gestionar todos los datos de inventario
 */
export const useInventarioUnificado = () => {
  // Hook de eventos para sincronización
  const { subscribe, emitTarimaAssigned, emitTarimaUnassigned, emitDataUpdated } = useInventarioEvents();

  // Estados principales
  const [state, setState] = useState<InventarioUnificadoState>({
    datos: [],
    datosFiltrados: [],
    indicadores: null,
    opcionesFiltros: {
      estatuses: [],
      clientes: []
    },
    evolucionDiaria: [],
    evolucionSemanal: [],
    evolucionMensual: [],
    analyticsData: null,
    isLoading: true,
    error: null,
    isRefreshing: false,
    selectedTarima: null,
    isDetailModalOpen: false
  });

  // Estados de filtros
  const [filtros, setFiltros] = useState<InventarioFilters>({
    busqueda: '',
    estatus: '',
    cliente: ''
  });

  // Filtros de tarimas resumen
  const [filtrosTarimas, setFiltrosTarimas] = useState<TarimasResumenFilters>({
    fecha: new Date().toISOString().split('T')[0],
    fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    periodo: '30d',
    agruparPor: 'dia',
    metricaEvolucion: 'peso'
  });

  // Filtros de analytics
  const [filtrosAnalytics, setFiltrosAnalytics] = useState<AnalyticsFilters>({
    periodo: '30d',
    agruparPor: 'dia'
  });

  /**
   * Actualiza el estado del hook
   */
  const updateState = useCallback((updates: Partial<InventarioUnificadoState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Maneja errores del servicio
   */
  const handleError = useCallback((error: any, context: string) => {
    const errorMessage = error instanceof TarimaServiceError 
      ? error.message 
      : `Error en ${context}`;
    updateState({ error: errorMessage });
    console.error(`Error en useInventarioUnificado - ${context}:`, error);
  }, [updateState]);

  /**
   * Calcula indicadores desde los datos de inventario
   */
  const calcularIndicadoresDesdeDatos = useCallback((datosInventario: InventarioTipoDTO[]): IndicadoresInventarioDTO => {
    let pesoTotalInventario = 0;
    let tarimasAsignadas = 0;
    let tarimasNoAsignadas = 0;
    let pesoTotalSinAsignar = 0;

    // Agrupar por tarima para evitar duplicados
    const tarimasUnicas = new Map<string, InventarioTipoDTO>();
    
    datosInventario.forEach(item => {
      if (!tarimasUnicas.has(item.codigo)) {
        tarimasUnicas.set(item.codigo, item);
      }
    });

    tarimasUnicas.forEach((item) => {
      // Sumar peso de todas las clasificaciones de la tarima
      const pesoTarima = datosInventario
        .filter(d => d.codigo === item.codigo)
        .reduce((total, d) => total + d.pesoTotalPorTipo, 0);
      
      pesoTotalInventario += pesoTarima;

      // Verificar si la tarima está asignada
      if (item.cliente !== 'Sin asignar') {
        tarimasAsignadas++;
      } else {
        tarimasNoAsignadas++;
        pesoTotalSinAsignar += pesoTarima;
      }
    });

    return {
      pesoTotalInventario: Math.round(pesoTotalInventario * 100) / 100,
      tarimasAsignadas,
      tarimasNoAsignadas,
      pesoTotalSinAsignar: Math.round(pesoTotalSinAsignar * 100) / 100
    };
  }, []);

  /**
   * Obtiene valores únicos para filtros desde los datos
   */
  const obtenerValoresFiltrosDesdeDatos = useCallback((datosInventario: InventarioTipoDTO[]): OpcionesFiltrosInventario => {
    const estatusesUnicos = [...new Set(datosInventario.map(item => item.estatus))].filter(Boolean) as string[];
    const clientesUnicos = [...new Set(datosInventario.map(item => item.cliente))].filter(Boolean) as string[];
    
    return {
      estatuses: estatusesUnicos.sort(),
      clientes: clientesUnicos.sort()
    };
  }, []);

  /**
   * Carga solo los datos de evolución temporal
   */
  const cargarDatosEvolucion = useCallback(async (filtrosActuales: TarimasResumenFilters) => {
    try {
      let evolucionDiaria: TarimaEvolucionDTO[] = [];
      let evolucionSemanal: TarimaEvolucionDTO[] = [];
      let evolucionMensual: TarimaEvolucionDTO[] = [];

      switch (filtrosActuales.agruparPor) {
        case 'dia':
          evolucionDiaria = await TarimaResumenService.getEvolucionDiaria(filtrosActuales.fechaInicio, filtrosActuales.fechaFin);
          break;
        case 'semana':
          evolucionSemanal = await TarimaResumenService.getEvolucionSemanal(filtrosActuales.fechaInicio, filtrosActuales.fechaFin);
          break;
        case 'mes':
          evolucionMensual = await TarimaResumenService.getEvolucionMensual(filtrosActuales.fechaInicio, filtrosActuales.fechaFin);
          break;
      }

      updateState({
        evolucionDiaria,
        evolucionSemanal,
        evolucionMensual
      });
    } catch (error) {
      handleError(error, 'cargarDatosEvolucion');
    }
  }, [updateState, handleError]);

  /**
   * Carga todos los datos de inventario de forma unificada
   */
  const cargarTodosLosDatos = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });

      // 1. Cargar datos principales de inventario
      const datosInventario = await InventarioService.obtenerDatosInventario();
      
      // 2. Procesar datos localmente
      const indicadoresData = calcularIndicadoresDesdeDatos(datosInventario);
      const opcionesFiltrosData = obtenerValoresFiltrosDesdeDatos(datosInventario);

      // 3. Cargar datos de evolución temporal con filtros actuales
      await cargarDatosEvolucion(filtrosTarimas);

      // 4. Cargar datos de analytics
      const analyticsData = reportesService.generarDatosPrueba();

      // 5. Aplicar filtros a los datos
      const datosFiltrados = datosInventario.filter(item => {
        const cumpleBusqueda = filtros.busqueda === '' || 
          item.codigo.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
          item.lote.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
          item.tipo.toLowerCase().includes(filtros.busqueda.toLowerCase());
          
        const cumpleEstatus = filtros.estatus === '' || item.estatus === filtros.estatus;
        const cumpleCliente = filtros.cliente === '' || item.cliente === filtros.cliente;
        
        return cumpleBusqueda && cumpleEstatus && cumpleCliente;
      });

      // 6. Actualizar estado con todos los datos
      updateState({
        datos: datosInventario,
        datosFiltrados,
        indicadores: indicadoresData,
        opcionesFiltros: opcionesFiltrosData,
        analyticsData,
        isLoading: false
      });

    } catch (error) {
      handleError(error, 'cargarTodosLosDatos');
      updateState({ isLoading: false });
    }
  }, [
    calcularIndicadoresDesdeDatos,
    obtenerValoresFiltrosDesdeDatos,
    cargarDatosEvolucion,
    filtros,
    updateState,
    handleError
  ]);

  /**
   * Refresca todos los datos
   */
  const refrescar = useCallback(async () => {
    updateState({ isRefreshing: true });
    try {
      // Invalidar cache del servicio para forzar recarga
      InventarioService.invalidarCache('useInventarioUnificado.refrescar');
      await cargarTodosLosDatos();
    } finally {
      updateState({ isRefreshing: false });
    }
  }, [cargarTodosLosDatos, updateState]);

  /**
   * Actualiza un filtro específico
   */
  const actualizarFiltro = useCallback((key: keyof InventarioFilters, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  /**
   * Limpia todos los filtros
   */
  const limpiarFiltros = useCallback(() => {
    setFiltros({
      busqueda: '',
      estatus: '',
      cliente: ''
    });
  }, []);

  /**
   * Actualiza los filtros de tarimas
   */
  const actualizarFiltrosTarimas = useCallback((nuevosFiltros: Partial<TarimasResumenFilters>) => {
    setFiltrosTarimas(prev => ({ ...prev, ...nuevosFiltros }));
  }, []);

  /**
   * Actualiza los filtros de analytics
   */
  const actualizarFiltrosAnalytics = useCallback((nuevosFiltros: Partial<AnalyticsFilters>) => {
    setFiltrosAnalytics(prev => ({ ...prev, ...nuevosFiltros }));
  }, []);

  /**
   * Abre el modal de detalles con una tarima específica
   */
  const abrirDetalleTarima = useCallback((tarima: TarimaParcialCompletaDTO) => {
    updateState({ 
      selectedTarima: tarima,
      isDetailModalOpen: true 
    });
  }, [updateState]);

  /**
   * Cierra el modal de detalles
   */
  const cerrarDetalleTarima = useCallback(() => {
    updateState({ 
      selectedTarima: null,
      isDetailModalOpen: false 
    });
  }, [updateState]);

  /**
   * Actualiza localmente las tarimas asignadas
   */
  const actualizarTarimasAsignadas = useCallback((pedidoAsignado: { id: number; cliente: string; sucursal: string }, tarimasAsignadas: InventarioTipoDTO[]) => {
    setState(prevState => {
      const nuevosDatos = prevState.datos.map(tarima => {
        const tarimaAsignada = tarimasAsignadas.find(t => t.codigo === tarima.codigo);
        if (tarimaAsignada) {
          return {
            ...tarima,
            cliente: pedidoAsignado.cliente,
            sucursal: pedidoAsignado.sucursal,
            tarimaOriginal: {
              ...tarima.tarimaOriginal,
              pedidoTarimas: [
                {
                  idPedidoCliente: pedidoAsignado.id,
                  nombreCliente: pedidoAsignado.cliente,
                  nombreSucursal: pedidoAsignado.sucursal,
                  estatus: 'Activo',
                  fechaEmbarque: new Date().toISOString(),
                  fechaRegistro: new Date().toISOString(),
                  usuarioRegistro: 'Sistema'
                }
              ]
            }
          };
        }
        return tarima;
      });

      // Recalcular indicadores
      const nuevosIndicadores = calcularIndicadoresDesdeDatos(nuevosDatos);
      
      // Emitir evento
      emitTarimaAssigned(pedidoAsignado, tarimasAsignadas, 'useInventarioUnificado.actualizarTarimasAsignadas');

      return {
        ...prevState,
        datos: nuevosDatos,
        indicadores: nuevosIndicadores
      };
    });
  }, [calcularIndicadoresDesdeDatos, emitTarimaAssigned]);

  /**
   * Actualiza localmente las tarimas desasignadas
   */
  const actualizarTarimasDesasignadas = useCallback((tarimasDesasignadas: InventarioTipoDTO[]) => {
    setState(prevState => {
      const nuevosDatos = prevState.datos.map(tarima => {
        const tarimaDesasignada = tarimasDesasignadas.find(t => t.codigo === tarima.codigo);
        if (tarimaDesasignada) {
          return {
            ...tarima,
            cliente: 'Sin asignar',
            sucursal: '',
            tarimaOriginal: {
              ...tarima.tarimaOriginal,
              pedidoTarimas: []
            }
          };
        }
        return tarima;
      });

      // Recalcular indicadores
      const nuevosIndicadores = calcularIndicadoresDesdeDatos(nuevosDatos);
      
      // Emitir evento
      emitTarimaUnassigned(tarimasDesasignadas, 'useInventarioUnificado.actualizarTarimasDesasignadas');

      return {
        ...prevState,
        datos: nuevosDatos,
        indicadores: nuevosIndicadores
      };
    });
  }, [calcularIndicadoresDesdeDatos, emitTarimaUnassigned]);

  /**
   * Obtiene los datos de evolución según el filtro actual
   */
  const getEvolucionActual = useCallback(() => {
    switch (filtrosTarimas.agruparPor) {
      case 'dia':
        return state.evolucionDiaria;
      case 'semana':
        return state.evolucionSemanal;
      case 'mes':
        return state.evolucionMensual;
      default:
        return state.evolucionDiaria;
    }
  }, [filtrosTarimas.agruparPor, state.evolucionDiaria, state.evolucionSemanal, state.evolucionMensual]);

  /**
   * Formatea los datos para gráficos
   */
  const datosFormateados = useCallback(() => {
    const evolucionActual = getEvolucionActual();
    
    // Procesar datos de evolución temporal por tipos específicos
    const procesarEvolucionTemporal = () => {
      const tiposEspecificos = ['XL', 'L', 'M', 'S'];
      
      return evolucionActual.map(item => {
        const datosProcesados: any = {
          fecha: item.fecha,
          fechaFormateada: new Date(item.fecha).toLocaleDateString('es-MX', {
            month: 'short',
            day: 'numeric'
          })
        };

        // Agregar datos por tipo según la métrica seleccionada
        tiposEspecificos.forEach(tipo => {
          if (filtrosTarimas.metricaEvolucion === 'peso') {
            datosProcesados[tipo] = item.pesoPorTipo[tipo] || 0;
          } else {
            datosProcesados[tipo] = item.tarimasPorTipo[tipo] || 0;
          }
        });

        return datosProcesados;
      });
    };

    // Procesar datos de distribución por tipos
    const procesarDistribucionTipos = () => {
      if (!state.datos || state.datos.length === 0) {
        return { distribucionTipos: [] };
      }

      const pesosPorTipo: Record<string, number> = {};
      let pesoTotal = 0;

      state.datos.forEach(item => {
        const tipo = item.tipo || 'Sin Tipo';
        const peso = item.pesoTotalPorTipo || 0;
        
        if (peso > 0) {
          pesosPorTipo[tipo] = (pesosPorTipo[tipo] || 0) + peso;
          pesoTotal += peso;
        }
      });

      if (pesoTotal === 0) {
        return { distribucionTipos: [] };
      }

      return {
        distribucionTipos: Object.entries(pesosPorTipo)
          .sort(([a], [b]) => {
            const orden = { 'XL': 0, 'L': 1, 'M': 2, 'S': 3 };
            const ordenA = orden[a as keyof typeof orden] ?? 999;
            const ordenB = orden[b as keyof typeof orden] ?? 999;
            
            if (ordenA !== 999 || ordenB !== 999) {
              return ordenA - ordenB;
            }
            
            return a.localeCompare(b);
          })
          .map(([tipo, peso]) => ({
            tipo,
            cantidad: peso, // Cambiado de 'peso' a 'cantidad' para compatibilidad con el gráfico
            porcentaje: pesoTotal > 0 ? (peso / pesoTotal) * 100 : 0
          }))
      };
    };
    
    return {
      // Datos para gráfico de evolución temporal
      evolucionTemporal: procesarEvolucionTemporal(),
      metricaEvolucion: filtrosTarimas.metricaEvolucion,
      periodo: filtrosTarimas.periodo,
      agruparPor: filtrosTarimas.agruparPor,
      
      // Datos para gráfico de distribución por tipos
      ...procesarDistribucionTipos()
    };
  }, [state.datos, getEvolucionActual, filtrosTarimas.metricaEvolucion]);

  // Carga inicial de datos
  useEffect(() => {
    cargarTodosLosDatos();
  }, [cargarTodosLosDatos]);

  // Efecto separado para cambios en filtros de tarimas (solo evolución temporal)
  useEffect(() => {
    // Solo cargar evolución temporal cuando cambien los filtros relevantes
    // No recargar todos los datos
    // Evitar ejecución en el montaje inicial (ya se carga en cargarTodosLosDatos)
    if (state.datos.length > 0) {
      cargarDatosEvolucion(filtrosTarimas);
    }
  }, [filtrosTarimas.agruparPor, filtrosTarimas.fechaInicio, filtrosTarimas.fechaFin, cargarDatosEvolucion, state.datos.length]);

  // Efecto para escuchar eventos de sincronización
  useEffect(() => {
    const unsubscribeCacheInvalidated = subscribe('cache-invalidated', (event) => {
      const { source } = event.detail;
      console.log(`[useInventarioUnificado] Cache invalidado por: ${source}`);
      
      if (!source.includes('useInventarioUnificado')) {
        cargarTodosLosDatos();
      }
    });

    const unsubscribeDataUpdated = subscribe('data-updated', (event) => {
      const { source } = event.detail;
      console.log(`[useInventarioUnificado] Datos actualizados por: ${source}`);
      
      if (!source.includes('useInventarioUnificado')) {
        cargarTodosLosDatos();
      }
    });

    return () => {
      unsubscribeCacheInvalidated();
      unsubscribeDataUpdated();
    };
  }, [subscribe, cargarTodosLosDatos]);

  return {
    // Datos principales
    datos: state.datosFiltrados,
    indicadores: state.indicadores,
    opcionesFiltros: state.opcionesFiltros,
    
    // Datos de evolución temporal
    evolucionActual: getEvolucionActual(),
    datosFormateados: datosFormateados(),
    
    // Datos de analytics
    analyticsData: state.analyticsData,
    
    // Filtros
    filtros,
    filtrosTarimas,
    filtrosAnalytics,
    actualizarFiltro,
    limpiarFiltros,
    actualizarFiltrosTarimas,
    actualizarFiltrosAnalytics,
    
    // Estados
    isLoading: state.isLoading,
    error: state.error,
    isRefreshing: state.isRefreshing,
    
    // Modal de detalles
    selectedTarima: state.selectedTarima,
    isDetailModalOpen: state.isDetailModalOpen,
    abrirDetalleTarima,
    cerrarDetalleTarima,
    
    // Acciones
    refrescar,
    actualizarTarimasAsignadas,
    actualizarTarimasDesasignadas,
    
    // Computed values
    hayDatos: state.datosFiltrados.length > 0,
    totalRegistros: state.datosFiltrados.length,
    hayFiltrosActivos: Object.values(filtros).some(filtro => filtro !== '')
  };
};
