/**
 * Servicio para manejo de reportes y analytics del inventario
 */

import api from '@/api/axios';
import type { 
  AnalyticsData, 
  ConfiguracionReporte, 
  PlantillaReporte, 
  ReporteGenerado,
  AnalyticsFilters,
  ExportConfig 
} from '@/types/Inventario/reportes.types';
import type { InventarioTipoDTO } from '@/types/Inventario/inventario.types';

/**
 * Clase para manejo de errores del servicio de reportes
 */
export class ReportesServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ReportesServiceError';
  }
}

/**
 * Servicio para reportes y analytics del inventario
 */
export class ReportesService {
  private static instance: ReportesService;

  private constructor() {}

  public static getInstance(): ReportesService {
    if (!ReportesService.instance) {
      ReportesService.instance = new ReportesService();
    }
    return ReportesService.instance;
  }

  /**
   * Obtiene datos de analytics para el dashboard
   */
  async obtenerAnalytics(filtros: AnalyticsFilters): Promise<AnalyticsData> {
    try {
      const response = await api.get('/inventario/analytics', { params: filtros });
      return response.data;
    } catch (error: any) {
      throw new ReportesServiceError(
        error.response?.data?.message || 'Error al obtener datos de analytics',
        error.response?.status
      );
    }
  }

  /**
   * Obtiene las plantillas de reportes disponibles
   */
  async obtenerPlantillas(): Promise<PlantillaReporte[]> {
    try {
      const response = await api.get('/inventario/reportes/plantillas');
      return response.data;
    } catch (error: any) {
      throw new ReportesServiceError(
        error.response?.data?.message || 'Error al obtener plantillas de reportes',
        error.response?.status
      );
    }
  }

  /**
   * Genera un reporte con la configuración especificada
   */
  async generarReporte(configuracion: ConfiguracionReporte): Promise<ReporteGenerado> {
    try {
      const response = await api.post('/inventario/reportes/generar', configuracion);
      return response.data;
    } catch (error: any) {
      throw new ReportesServiceError(
        error.response?.data?.message || 'Error al generar reporte',
        error.response?.status
      );
    }
  }

  /**
   * Descarga un reporte generado
   */
  async descargarReporte(id: string): Promise<Blob> {
    try {
      const response = await api.get(`/inventario/reportes/${id}/descargar`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw new ReportesServiceError(
        error.response?.data?.message || 'Error al descargar reporte',
        error.response?.status
      );
    }
  }

  /**
   * Programa un reporte para generación automática
   */
  async programarReporte(
    configuracion: ConfiguracionReporte, 
    programacion: { frecuencia: string; hora: string; dias: string[] }
  ): Promise<void> {
    try {
      await api.post('/inventario/reportes/programar', {
        configuracion,
        programacion
      });
    } catch (error: any) {
      throw new ReportesServiceError(
        error.response?.data?.message || 'Error al programar reporte',
        error.response?.status
      );
    }
  }

  /**
   * Obtiene el estado de generación de un reporte
   */
  async obtenerEstadoGeneracion(id: string): Promise<{ estado: string; progreso: number }> {
    try {
      const response = await api.get(`/inventario/reportes/${id}/estado`);
      return response.data;
    } catch (error: any) {
      throw new ReportesServiceError(
        error.response?.data?.message || 'Error al obtener estado de generación',
        error.response?.status
      );
    }
  }

  /**
   * Guarda una nueva plantilla de reporte
   */
  async guardarPlantilla(plantilla: Omit<PlantillaReporte, 'id'>): Promise<PlantillaReporte> {
    try {
      const response = await api.post('/inventario/reportes/plantillas', plantilla);
      return response.data;
    } catch (error: any) {
      throw new ReportesServiceError(
        error.response?.data?.message || 'Error al guardar plantilla',
        error.response?.status
      );
    }
  }

  /**
   * Elimina una plantilla de reporte
   */
  async eliminarPlantilla(id: string): Promise<void> {
    try {
      await api.delete(`/inventario/reportes/plantillas/${id}`);
    } catch (error: any) {
      throw new ReportesServiceError(
        error.response?.data?.message || 'Error al eliminar plantilla',
        error.response?.status
      );
    }
  }

  /**
   * Genera datos de prueba para desarrollo
   */
  generarDatosPrueba(): AnalyticsData {
    const fechaActual = new Date();
    const tendencias = Array.from({ length: 30 }, (_, i) => {
      const fecha = new Date(fechaActual);
      fecha.setDate(fecha.getDate() - (29 - i));
      return {
        fecha: fecha.toISOString().split('T')[0],
        pesoTotal: Math.random() * 10000 + 5000,
        tarimasAsignadas: Math.floor(Math.random() * 50) + 20,
        tarimasNoAsignadas: Math.floor(Math.random() * 30) + 10
      };
    });

    const distribucionClientes = [
      { cliente: 'Cliente A', cantidad: 45, pesoTotal: 8500, porcentaje: 35 },
      { cliente: 'Cliente B', cantidad: 32, pesoTotal: 6200, porcentaje: 25 },
      { cliente: 'Cliente C', cantidad: 28, pesoTotal: 4800, porcentaje: 20 },
      { cliente: 'Cliente D', cantidad: 20, pesoTotal: 3200, porcentaje: 15 },
      { cliente: 'Sin asignar', cantidad: 15, pesoTotal: 1800, porcentaje: 5 }
    ];

    const ocupacionTipos = [
      { tipo: 'Tipo A', cantidad: 60, pesoTotal: 12000, ocupacion: 85 },
      { tipo: 'Tipo B', cantidad: 45, pesoTotal: 9000, ocupacion: 70 },
      { tipo: 'Tipo C', cantidad: 30, pesoTotal: 6000, ocupacion: 55 },
      { tipo: 'Tipo D', cantidad: 15, pesoTotal: 3000, ocupacion: 30 }
    ];

    return {
      tendencias,
      distribucionClientes,
      ocupacionTipos,
      kpis: {
        rotacionInventario: 2.5,
        tiempoPromedioAsignacion: 3.2,
        eficienciaOcupacion: 78.5,
        satisfaccionClientes: 92.3
      }
    };
  }
}

// Exportar instancia singleton
export const reportesService = ReportesService.getInstance();
