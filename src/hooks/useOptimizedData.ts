import { useEffect, useRef, useCallback } from 'react';
import { useGlobalCache } from './useGlobalCache';

interface UseOptimizedDataOptions {
  autoLoad?: boolean;
  dependencies?: any[];
  forceRefresh?: boolean;
}

/**
 * Hook optimizado para cargar datos con cache y evitar llamadas duplicadas
 */
export const useOptimizedData = (options: UseOptimizedDataOptions = {}) => {
  const { autoLoad = true, dependencies = [], forceRefresh = false } = options;
  const { 
    clientes, 
    productos, 
    isLoading, 
    error, 
    fetchAllData,
    isCacheValid 
  } = useGlobalCache();
  
  const hasLoadedRef = useRef(false);
  const loadingRef = useRef(false);

  const loadData = useCallback(async () => {
    if (loadingRef.current) return; // Evitar llamadas simultáneas
    
    // Si ya tenemos datos válidos y no se fuerza refresh, no cargar
    if (!forceRefresh && isCacheValid('clientes') && isCacheValid('productos')) {
      hasLoadedRef.current = true;
      return;
    }

    loadingRef.current = true;
    try {
      await fetchAllData(forceRefresh);
      hasLoadedRef.current = true;
    } catch (error) {
      console.error('Error loading optimized data:', error);
    } finally {
      loadingRef.current = false;
    }
  }, [fetchAllData, isCacheValid, forceRefresh]);

  useEffect(() => {
    if (autoLoad && !hasLoadedRef.current) {
      loadData();
    }
  }, [autoLoad, loadData, ...dependencies]);

  return {
    clientes,
    productos,
    isLoading,
    error,
    loadData,
    hasLoaded: hasLoadedRef.current,
  };
};
