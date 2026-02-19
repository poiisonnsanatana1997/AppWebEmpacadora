import api from '../api/axios';
import {
  DashboardEstadisticasDto,
  OrdenesClasificadasHoyDto,
  OrdenesRetrasadasDto,
  OrdenesEnClasificacionDto,
  TasaCumplimientoHoyDto,
  ProveedoresActivosHoyDto,
  PesoRecibidoHoyDto,
  OrdenesPendientesHoyDto
} from '../types/OrdenesEntrada/estadisticas.types';

/**
 * Servicio para obtener estadísticas y métricas del dashboard de Órdenes de Entrada
 * Centraliza todas las llamadas a endpoints de estadísticas
 *
 * @namespace EstadisticasOrdenesEntradaService
 */
export const EstadisticasOrdenesEntradaService = {

  /**
   * Obtiene todas las estadísticas del dashboard en una sola llamada
   * Optimizado para reducir latencia mediante una única petición
   * Endpoint: GET /OrdenEntrada/estadisticas/dashboard
   *
   * @returns {Promise<DashboardEstadisticasDto>} Todas las métricas del dashboard
   */
  async obtenerDashboardCompleto(): Promise<DashboardEstadisticasDto> {
    try {
      const { data } = await api.get<DashboardEstadisticasDto>('/OrdenEntrada/estadisticas/dashboard');
      return data;
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      // Retornar valores por defecto en caso de error
      return this.obtenerEstadisticasDefault();
    }
  },

  /**
   * Obtiene estadísticas de órdenes pendientes con comparación
   * Endpoint: GET /OrdenEntrada/estadisticas/pendientes-hoy
   *
   * @returns {Promise<OrdenesPendientesHoyDto>} Estadísticas de órdenes pendientes
   */
  async obtenerOrdenesPendientesHoy(): Promise<OrdenesPendientesHoyDto> {
    try {
      const { data } = await api.get<OrdenesPendientesHoyDto>('/OrdenEntrada/estadisticas/pendientes-hoy');
      return data;
    } catch (error) {
      console.error('Error al obtener órdenes pendientes hoy:', error);
      return {
        cantidadPendientes: 0,
        comparacionAyer: 0,
        tendencia: 'stable'
      };
    }
  },

  /**
   * Obtiene estadísticas de peso recibido con tendencias
   * Endpoint: GET /OrdenEntrada/estadisticas/peso-recibido-hoy
   *
   * @returns {Promise<PesoRecibidoHoyDto>} Estadísticas de peso recibido
   */
  async obtenerPesoRecibidoHoy(): Promise<PesoRecibidoHoyDto> {
    try {
      const { data } = await api.get<PesoRecibidoHoyDto>('/OrdenEntrada/estadisticas/peso-recibido-hoy');
      return data;
    } catch (error) {
      console.error('Error al obtener peso recibido hoy:', error);
      return {
        pesoTotal: 0,
        comparacionAyer: 0,
        tendencia: 'stable',
        unidad: 'kg'
      };
    }
  },

  /**
   * Obtiene estadísticas de órdenes clasificadas en el día
   * Endpoint: GET /OrdenEntrada/estadisticas/clasificadas-hoy
   *
   * @returns {Promise<OrdenesClasificadasHoyDto>} Estadísticas de clasificación
   */
  async obtenerOrdenesClasificadasHoy(): Promise<OrdenesClasificadasHoyDto> {
    try {
      const { data } = await api.get<OrdenesClasificadasHoyDto>('/OrdenEntrada/estadisticas/clasificadas-hoy');
      return data;
    } catch (error) {
      console.error('Error al obtener órdenes clasificadas hoy:', error);
      return {
        cantidadClasificadas: 0,
        porcentajeCumplimiento: 0,
        comparacionAyer: 0,
        tendencia: 'stable'
      };
    }
  },

  /**
   * Obtiene estadísticas de órdenes retrasadas
   * Endpoint: GET /OrdenEntrada/estadisticas/retrasadas
   *
   * @returns {Promise<OrdenesRetrasadasDto>} Estadísticas de órdenes retrasadas
   */
  async obtenerOrdenesRetrasadas(): Promise<OrdenesRetrasadasDto> {
    try {
      const { data } = await api.get<OrdenesRetrasadasDto>('/OrdenEntrada/estadisticas/retrasadas');
      return data;
    } catch (error) {
      console.error('Error al obtener órdenes retrasadas:', error);
      return {
        cantidadRetrasadas: 0,
        ordenesRetrasadas: [],
        alertLevel: 'success'
      };
    }
  },

  /**
   * Obtiene estadísticas de órdenes en proceso de clasificación
   * Endpoint: GET /OrdenEntrada/estadisticas/en-clasificacion
   *
   * @returns {Promise<OrdenesEnClasificacionDto>} Estadísticas de órdenes en clasificación
   */
  async obtenerOrdenesEnClasificacion(): Promise<OrdenesEnClasificacionDto> {
    try {
      const { data } = await api.get<OrdenesEnClasificacionDto>('/OrdenEntrada/estadisticas/en-clasificacion');
      return data;
    } catch (error) {
      console.error('Error al obtener órdenes en clasificación:', error);
      return {
        cantidadEnClasificacion: 0,
        tiempoPromedioEnProceso: 0
      };
    }
  },

  /**
   * Obtiene la tasa de cumplimiento del día
   * Endpoint: GET /OrdenEntrada/estadisticas/tasa-cumplimiento-hoy
   *
   * @returns {Promise<TasaCumplimientoHoyDto>} Tasa de cumplimiento
   */
  async obtenerTasaCumplimientoHoy(): Promise<TasaCumplimientoHoyDto> {
    try {
      const { data } = await api.get<TasaCumplimientoHoyDto>('/OrdenEntrada/estadisticas/tasa-cumplimiento-hoy');
      return data;
    } catch (error) {
      console.error('Error al obtener tasa de cumplimiento:', error);
      return {
        tasaCumplimiento: 0,
        ordenesATiempo: 0,
        totalEsperadas: 0,
        comparacionMesAnterior: 0,
        tendencia: 'stable',
        alertLevel: 'info'
      };
    }
  },

  /**
   * Obtiene estadísticas de proveedores activos
   * Endpoint: GET /OrdenEntrada/estadisticas/proveedores-activos-hoy
   *
   * @returns {Promise<ProveedoresActivosHoyDto>} Estadísticas de proveedores
   */
  async obtenerProveedoresActivosHoy(): Promise<ProveedoresActivosHoyDto> {
    try {
      const { data } = await api.get<ProveedoresActivosHoyDto>('/OrdenEntrada/estadisticas/proveedores-activos-hoy');
      return data;
    } catch (error) {
      console.error('Error al obtener proveedores activos:', error);
      return {
        cantidadProveedores: 0,
        nombresProveedores: [],
        comparacionAyer: 0
      };
    }
  },

  /**
   * Retorna estadísticas por defecto cuando hay errores
   * Evita que la UI se rompa si el backend no responde
   *
   * @returns {DashboardEstadisticasDto} Valores por defecto
   */
  obtenerEstadisticasDefault(): DashboardEstadisticasDto {
    return {
      ordenesPendientes: {
        cantidadPendientes: 0,
        comparacionAyer: 0,
        tendencia: 'stable'
      },
      pesoRecibido: {
        pesoTotal: 0,
        comparacionAyer: 0,
        tendencia: 'stable',
        unidad: 'kg'
      },
      ordenesClasificadas: {
        cantidadClasificadas: 0,
        porcentajeCumplimiento: 0,
        comparacionAyer: 0,
        tendencia: 'stable'
      },
      ordenesRetrasadas: {
        cantidadRetrasadas: 0,
        ordenesRetrasadas: [],
        alertLevel: 'success'
      },
      ordenesEnClasificacion: {
        cantidadEnClasificacion: 0,
        tiempoPromedioEnProceso: 0
      },
      tasaCumplimiento: {
        tasaCumplimiento: 0,
        ordenesATiempo: 0,
        totalEsperadas: 0,
        comparacionMesAnterior: 0,
        tendencia: 'stable',
        alertLevel: 'info'
      },
      ultimaActualizacion: new Date().toISOString()
    };
  },

  /**
   * Refresca todas las estadísticas del cache
   * Útil para forzar actualización después de operaciones críticas
   *
   * @returns {Promise<void>}
   */
  async refrescarEstadisticas(): Promise<void> {
    try {
      await api.post('/OrdenEntrada/estadisticas/refresh-cache');
    } catch (error) {
      console.error('Error al refrescar estadísticas:', error);
    }
  }
};
