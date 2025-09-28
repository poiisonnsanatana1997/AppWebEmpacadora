/**
 * Sistema de eventos para sincronización de datos del inventario
 * Permite que todos los hooks y componentes se mantengan sincronizados
 * cuando hay cambios en los datos
 */

/**
 * Tipos de eventos disponibles
 */
export type InventarioEventType = 
  | 'data-updated'           // Datos generales actualizados
  | 'tarima-assigned'        // Tarima asignada a pedido
  | 'tarima-unassigned'      // Tarima desasignada
  | 'cache-invalidated'      // Cache invalidado manualmente
  | 'indicators-updated'     // Indicadores recalculados
  | 'filters-changed';       // Filtros modificados

/**
 * Interface para los datos del evento
 */
export interface InventarioEventDetail {
  timestamp: number;
  source: string;
  data?: any;
}

/**
 * Clase para gestionar eventos del inventario
 * Extiende EventTarget para usar la API nativa del navegador
 */
class InventarioEventEmitter extends EventTarget {
  private static instance: InventarioEventEmitter;
  
  /**
   * Singleton pattern para asegurar una sola instancia
   */
  public static getInstance(): InventarioEventEmitter {
    if (!InventarioEventEmitter.instance) {
      InventarioEventEmitter.instance = new InventarioEventEmitter();
    }
    return InventarioEventEmitter.instance;
  }

  /**
   * Emite evento cuando los datos generales se actualizan
   */
  emitDataUpdated(source: string = 'unknown', data?: any) {
    const detail: InventarioEventDetail = {
      timestamp: Date.now(),
      source,
      data
    };
    
    this.dispatchEvent(new CustomEvent('data-updated', { detail }));
    console.log(`[InventarioEvents] Data updated from: ${source}`, detail);
  }

  /**
   * Emite evento cuando una tarima es asignada
   */
  emitTarimaAssigned(pedidoAsignado: any, tarimasAsignadas: any[], source: string = 'unknown') {
    const detail: InventarioEventDetail = {
      timestamp: Date.now(),
      source,
      data: { pedidoAsignado, tarimasAsignadas }
    };
    
    this.dispatchEvent(new CustomEvent('tarima-assigned', { detail }));
    this.emitDataUpdated(source, detail.data);
    console.log(`[InventarioEvents] Tarima assigned from: ${source}`, detail);
  }

  /**
   * Emite evento cuando una tarima es desasignada
   */
  emitTarimaUnassigned(tarimasDesasignadas: any[], source: string = 'unknown') {
    const detail: InventarioEventDetail = {
      timestamp: Date.now(),
      source,
      data: { tarimasDesasignadas }
    };
    
    this.dispatchEvent(new CustomEvent('tarima-unassigned', { detail }));
    this.emitDataUpdated(source, detail.data);
    console.log(`[InventarioEvents] Tarima unassigned from: ${source}`, detail);
  }

  /**
   * Emite evento cuando el cache es invalidado
   */
  emitCacheInvalidated(source: string = 'unknown') {
    const detail: InventarioEventDetail = {
      timestamp: Date.now(),
      source
    };
    
    this.dispatchEvent(new CustomEvent('cache-invalidated', { detail }));
    console.log(`[InventarioEvents] Cache invalidated from: ${source}`, detail);
  }

  /**
   * Emite evento cuando los indicadores se actualizan
   */
  emitIndicatorsUpdated(indicadores: any, source: string = 'unknown') {
    const detail: InventarioEventDetail = {
      timestamp: Date.now(),
      source,
      data: indicadores
    };
    
    this.dispatchEvent(new CustomEvent('indicators-updated', { detail }));
    console.log(`[InventarioEvents] Indicators updated from: ${source}`, detail);
  }

  /**
   * Emite evento cuando los filtros cambian
   */
  emitFiltersChanged(filtros: any, source: string = 'unknown') {
    const detail: InventarioEventDetail = {
      timestamp: Date.now(),
      source,
      data: filtros
    };
    
    this.dispatchEvent(new CustomEvent('filters-changed', { detail }));
    console.log(`[InventarioEvents] Filters changed from: ${source}`, detail);
  }

  /**
   * Método helper para suscribirse a eventos
   */
  subscribe(eventType: InventarioEventType, callback: (event: CustomEvent<InventarioEventDetail>) => void) {
    this.addEventListener(eventType, callback as EventListener);
    
    // Retornar función de cleanup
    return () => {
      this.removeEventListener(eventType, callback as EventListener);
    };
  }

  /**
   * Método helper para suscribirse a múltiples eventos
   */
  subscribeToMultiple(
    eventTypes: InventarioEventType[], 
    callback: (eventType: InventarioEventType, event: CustomEvent<InventarioEventDetail>) => void
  ) {
    const unsubscribeFunctions: (() => void)[] = [];

    eventTypes.forEach(eventType => {
      const wrappedCallback = (event: CustomEvent<InventarioEventDetail>) => {
        callback(eventType, event);
      };
      
      this.addEventListener(eventType, wrappedCallback as EventListener);
      unsubscribeFunctions.push(() => {
        this.removeEventListener(eventType, wrappedCallback as EventListener);
      });
    });

    // Retornar función que limpia todas las suscripciones
    return () => {
      unsubscribeFunctions.forEach(unsub => unsub());
    };
  }

  /**
   * Método para debug - listar todos los listeners activos
   */
  getActiveListeners(): Record<string, number> {
    // Nota: Esta es una aproximación ya que EventTarget no expone listeners directamente
    const events: InventarioEventType[] = [
      'data-updated',
      'tarima-assigned', 
      'tarima-unassigned',
      'cache-invalidated',
      'indicators-updated',
      'filters-changed'
    ];
    
    const counts: Record<string, number> = {};
    events.forEach(event => {
      // Esto es solo para logging, no podemos obtener el count real
      counts[event] = 0;
    });
    
    return counts;
  }
}

// Exportar instancia singleton
export const inventarioEvents = InventarioEventEmitter.getInstance();

/**
 * Hook personalizado para usar los eventos del inventario
 * Simplifica la suscripción y limpieza automática
 */
export const useInventarioEvents = () => {
  return {
    events: inventarioEvents,
    
    // Métodos de emisión
    emitDataUpdated: (source: string, data?: any) => inventarioEvents.emitDataUpdated(source, data),
    emitTarimaAssigned: (pedido: any, tarimas: any[], source: string) => 
      inventarioEvents.emitTarimaAssigned(pedido, tarimas, source),
    emitTarimaUnassigned: (tarimas: any[], source: string) => 
      inventarioEvents.emitTarimaUnassigned(tarimas, source),
    emitCacheInvalidated: (source: string) => inventarioEvents.emitCacheInvalidated(source),
    emitIndicatorsUpdated: (indicadores: any, source: string) => 
      inventarioEvents.emitIndicatorsUpdated(indicadores, source),
    emitFiltersChanged: (filtros: any, source: string) => 
      inventarioEvents.emitFiltersChanged(filtros, source),
    
    // Método de suscripción con cleanup automático
    subscribe: (eventType: InventarioEventType, callback: (event: CustomEvent<InventarioEventDetail>) => void) =>
      inventarioEvents.subscribe(eventType, callback),
      
    subscribeToMultiple: (
      eventTypes: InventarioEventType[], 
      callback: (eventType: InventarioEventType, event: CustomEvent<InventarioEventDetail>) => void
    ) => inventarioEvents.subscribeToMultiple(eventTypes, callback)
  };
};

// Los tipos ya están exportados arriba en sus definiciones
