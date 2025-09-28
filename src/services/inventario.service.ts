import type { TarimaParcialCompletaDTO } from '@/types/Tarimas/tarima.types';
import type { AsignarTarimaDTO, AsignarTarimaResponseDTO, PedidoClienteDisponibleDTO } from '@/types/Inventario/inventario.types';
import { TarimasService, TarimaServiceError } from './tarimas.service';
import { api } from '@/lib/api';
import { inventarioEvents } from '@/utils/inventario-events';
import { TarimaResumenService } from './tarimas.resumen.service';

/**
 * Interface para los datos procesados de inventario por tipo
 */
export interface InventarioTipoDTO {
  codigo: string;
  tipo: string;
  pesoTotalPorTipo: number;
  cliente: string;
  sucursal: string;
  lote: string;
  fechaRegistro: string;
  estatus: string;
  tarimaOriginal: TarimaParcialCompletaDTO;
}

/**
 * Interface para los indicadores de inventario
 */
export interface IndicadoresInventarioDTO {
  pesoTotalInventario: number;
  tarimasAsignadas: number;
  tarimasNoAsignadas: number;
  pesoTotalSinAsignar: number;
}

/**
 * Cache para almacenar los datos de tarimas y evitar llamadas duplicadas
 */
interface InventarioCache {
  tarimasCompletas: TarimaParcialCompletaDTO[] | null;
  datosInventario: InventarioTipoDTO[] | null;
  indicadores: IndicadoresInventarioDTO | null;
  timestamp: number;
  isExpired: boolean;
}

// Cache global con tiempo de expiración de 5 minutos
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos
let inventarioCache: InventarioCache = {
  tarimasCompletas: null,
  datosInventario: null,
  indicadores: null,
  timestamp: 0,
  isExpired: true
};

// Promise cache para evitar múltiples llamadas simultáneas
let tarimasPromise: Promise<TarimaParcialCompletaDTO[]> | null = null;

/**
 * Verifica si el cache está válido
 */
const isCacheValid = (): boolean => {
  return !inventarioCache.isExpired && 
         (Date.now() - inventarioCache.timestamp) < CACHE_DURATION;
};

/**
 * Invalida el cache
 */
const invalidateCache = (source: string = 'InventarioService'): void => {
  inventarioCache = {
    tarimasCompletas: null,
    datosInventario: null,
    indicadores: null,
    timestamp: 0,
    isExpired: true
  };
  // También limpiar la promise cache
  tarimasPromise = null;
  
  // Invalidar también el cache del servicio de resumen de tarimas
  TarimaResumenService.invalidateCache(`${source} -> TarimaResumenService`);
  
  // Emitir evento de cache invalidado
  inventarioEvents.emitCacheInvalidated(source);
};

/**
 * Obtiene las tarimas completas con cache y promise caching
 * Evita múltiples llamadas simultáneas al mismo endpoint
 */
const obtenerTarimasCompletasConCache = async (): Promise<TarimaParcialCompletaDTO[]> => {
  // Si hay datos válidos en cache, retornarlos
  if (isCacheValid() && inventarioCache.tarimasCompletas) {
    return inventarioCache.tarimasCompletas;
  }

  // Si hay una promise en curso, esperar a que termine
  if (tarimasPromise) {
    return await tarimasPromise;
  }

  // Crear nueva promise para obtener datos
  tarimasPromise = (async () => {
    try {
      const tarimasCompletas = await TarimasService.obtenerTarimasParcialesCompletas();
      
      // Actualizar cache
      inventarioCache.tarimasCompletas = tarimasCompletas;
      inventarioCache.timestamp = Date.now();
      inventarioCache.isExpired = false;
      
      return tarimasCompletas;
    } finally {
      // Limpiar la promise cache después de completar
      tarimasPromise = null;
    }
  })();

  return await tarimasPromise;
};

/**
 * Procesa los datos de inventario desde las tarimas completas
 */
const procesarDatosInventario = (tarimasCompletas: TarimaParcialCompletaDTO[]): InventarioTipoDTO[] => {
  const datosInventario: InventarioTipoDTO[] = [];

  tarimasCompletas.forEach(tarima => {
    // Procesar cada clasificación dentro de la tarima
    tarima.tarimasClasificaciones.forEach(clasificacion => {
      // Obtener información del cliente y sucursal del primer pedido (si existe)
      const primerPedido = tarima.pedidoTarimas[0];
      
      const item: InventarioTipoDTO = {
        codigo: tarima.codigo,
        tipo: clasificacion.tipo,
        pesoTotalPorTipo: clasificacion.pesoTotal,
        cliente: primerPedido?.nombreCliente || 'Sin asignar',
        sucursal: primerPedido?.nombreSucursal || 'Sin asignar',
        lote: clasificacion.lote,
        fechaRegistro: tarima.fechaRegistro,
        estatus: tarima.estatus,
        tarimaOriginal: tarima
      };
      
      datosInventario.push(item);
    });
  });

  // Ordenar por fecha de registro (más recientes primero)
  return datosInventario.sort((a, b) => 
    new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
  );
};

/**
 * Calcula los indicadores desde las tarimas completas
 */
const calcularIndicadoresDesdeTarimas = (tarimasCompletas: TarimaParcialCompletaDTO[]): IndicadoresInventarioDTO => {
  let pesoTotalInventario = 0;
  let tarimasAsignadas = 0;
  let tarimasNoAsignadas = 0;
  let pesoTotalSinAsignar = 0;

  tarimasCompletas.forEach(tarima => {
    // Calcular peso total de la tarima
    const pesoTarima = tarima.tarimasClasificaciones.reduce(
      (total, clasificacion) => total + clasificacion.pesoTotal, 
      0
    );
    
    pesoTotalInventario += pesoTarima;

    // Verificar si la tarima está asignada (tiene pedidos)
    const estaAsignada = tarima.pedidoTarimas && tarima.pedidoTarimas.length > 0;
    
    if (estaAsignada) {
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
};

/**
 * Servicio para gestionar el inventario de tarimas
 * Procesa y transforma los datos de tarimas para la vista de inventario
 */
export const InventarioService = {
  /**
   * Obtiene los datos procesados de inventario
   * Transforma las tarimas parciales completas en datos específicos para inventario
   * @returns {Promise<InventarioTipoDTO[]>} Lista de datos de inventario procesados
   * @throws {TarimaServiceError} Si hay un error al obtener los datos
   */
  async obtenerDatosInventario(): Promise<InventarioTipoDTO[]> {
    try {
      // Verificar cache primero
      if (isCacheValid() && inventarioCache.datosInventario) {
        return inventarioCache.datosInventario;
      }

      const tarimasCompletas = await obtenerTarimasCompletasConCache();
      const datosInventario = procesarDatosInventario(tarimasCompletas);
      
      // Actualizar cache
      inventarioCache.datosInventario = datosInventario;
      
      return datosInventario;
      
    } catch (error) {
      if (error instanceof TarimaServiceError) {
        throw error;
      }
      throw new TarimaServiceError('Error al procesar datos de inventario', error);
    }
  },

  /**
   * Calcula los indicadores de inventario
   * @returns {Promise<IndicadoresInventarioDTO>} Indicadores calculados
   * @throws {TarimaServiceError} Si hay un error al calcular los indicadores
   */
  async calcularIndicadores(): Promise<IndicadoresInventarioDTO> {
    try {
      // Verificar cache primero
      if (isCacheValid() && inventarioCache.indicadores) {
        return inventarioCache.indicadores;
      }

      const tarimasCompletas = await obtenerTarimasCompletasConCache();
      const indicadores = calcularIndicadoresDesdeTarimas(tarimasCompletas);
      
      // Actualizar cache
      inventarioCache.indicadores = indicadores;
      
      return indicadores;
      
    } catch (error) {
      if (error instanceof TarimaServiceError) {
        throw error;
      }
      throw new TarimaServiceError('Error al calcular indicadores de inventario', error);
    }
  },

  /**
   * Obtiene los datos de inventario filtrados
   * @param {string} busqueda - Término de búsqueda
   * @param {string} estatus - Filtro por estatus
   * @param {string} cliente - Filtro por cliente
   * @returns {Promise<InventarioTipoDTO[]>} Datos filtrados
   */
  async obtenerDatosInventarioFiltrados(
    busqueda: string = '',
    estatus: string = '',
    cliente: string = ''
  ): Promise<InventarioTipoDTO[]> {
    try {
      // Usar datos del cache si están disponibles
      let datos: InventarioTipoDTO[];
      if (isCacheValid() && inventarioCache.datosInventario) {
        datos = inventarioCache.datosInventario;
      } else {
        datos = await this.obtenerDatosInventario();
      }
      
      return datos.filter(item => {
        const cumpleBusqueda = busqueda === '' || 
          item.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.lote.toLowerCase().includes(busqueda.toLowerCase()) ||
          item.tipo.toLowerCase().includes(busqueda.toLowerCase());
          
        const cumpleEstatus = estatus === '' || item.estatus === estatus;
        const cumpleCliente = cliente === '' || item.cliente === cliente;
        
        return cumpleBusqueda && cumpleEstatus && cumpleCliente;
      });
      
    } catch (error) {
      if (error instanceof TarimaServiceError) {
        throw error;
      }
      throw new TarimaServiceError('Error al filtrar datos de inventario', error);
    }
  },

  /**
   * Obtiene los valores únicos para los filtros
   * @returns {Promise<{estatuses: string[], clientes: string[]}>} Valores únicos para filtros
   */
  async obtenerValoresFiltros(): Promise<{estatuses: string[], clientes: string[]}> {
    try {
      // Usar datos del cache si están disponibles
      let datos: InventarioTipoDTO[];
      if (isCacheValid() && inventarioCache.datosInventario) {
        datos = inventarioCache.datosInventario;
      } else {
        datos = await this.obtenerDatosInventario();
      }
      
      const estatusesUnicos = [...new Set(datos.map(item => item.estatus))].filter(Boolean) as string[];
      const clientesUnicos = [...new Set(datos.map(item => item.cliente))].filter(Boolean) as string[];
      
      return {
        estatuses: estatusesUnicos.sort(),
        clientes: clientesUnicos.sort()
      };
      
    } catch (error) {
      if (error instanceof TarimaServiceError) {
        throw error;
      }
      throw new TarimaServiceError('Error al obtener valores para filtros', error);
    }
  },

  /**
   * Obtiene los pedidos de cliente disponibles para asignación
   * @returns {Promise<PedidoClienteDisponibleDTO[]>} Lista de pedidos disponibles
   * @throws {TarimaServiceError} Si hay un error al obtener los pedidos
   */
  async obtenerPedidosDisponibles(): Promise<PedidoClienteDisponibleDTO[]> {
    try {
      const response = await api.get<PedidoClienteDisponibleDTO[]>('/PedidosCliente/disponibles');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new TarimaServiceError(
          `Error al obtener pedidos disponibles: ${error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al obtener pedidos disponibles', error);
    }
  },

  /**
   * Asigna una tarima a un pedido de cliente
   * @param {AsignarTarimaDTO} datos - Datos de la asignación
   * @returns {Promise<AsignarTarimaResponseDTO>} Respuesta de la asignación
   * @throws {TarimaServiceError} Si hay un error al asignar la tarima
   */
  async asignarTarima(datos: AsignarTarimaDTO): Promise<AsignarTarimaResponseDTO> {
    try {
      const response = await api.post<AsignarTarimaResponseDTO>('/Tarimas/asignar', datos);
      
      // Invalidar cache después de una asignación exitosa
      invalidateCache('InventarioService.asignarTarima');
      
      // Emitir evento de datos actualizados
      inventarioEvents.emitDataUpdated('InventarioService.asignarTarima', {
        action: 'tarima-assigned',
        tarimaAsignada: response.data.tarimaAsignada
      });
      
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new TarimaServiceError(
          `Error al asignar tarima: ${error.message}`,
          error
        );
      }
      throw new TarimaServiceError('Error desconocido al asignar tarima', error);
    }
  },

  /**
   * Invalida el cache manualmente
   * Útil para forzar una recarga de datos
   */
  invalidarCache(source: string = 'manual'): void {
    invalidateCache(source);
  },

  /**
   * Obtiene el estado del cache
   * Útil para debugging
   */
  obtenerEstadoCache(): InventarioCache {
    return { ...inventarioCache };
  },
};
