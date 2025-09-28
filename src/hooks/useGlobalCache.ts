import { useState, useEffect, useRef } from 'react';
import { clientesService } from '@/services/clientes.service';
import { ProductosService } from '@/services/productos.service';
import { ClienteDTO } from '@/types/Cliente/cliente.types';
import { ProductoDto } from '@/types/Productos/productos.types';

interface CacheData {
  clientes: ClienteDTO[];
  productos: ProductoDto[];
  lastUpdated: {
    clientes: number;
    productos: number;
  };
  isLoading: {
    clientes: boolean;
    productos: boolean;
  };
  error: {
    clientes: string | null;
    productos: string | null;
  };
}

// Cache global fuera del hook para persistir entre renders
let globalCache: CacheData = {
  clientes: [],
  productos: [],
  lastUpdated: {
    clientes: 0,
    productos: 0,
  },
  isLoading: {
    clientes: false,
    productos: false,
  },
  error: {
    clientes: null,
    productos: null,
  },
};

// Tiempo de expiración del cache (5 minutos)
const CACHE_EXPIRATION = 5 * 60 * 1000;

export const useGlobalCache = () => {
  const [cache, setCache] = useState<CacheData>(globalCache);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isCacheValid = (type: 'clientes' | 'productos') => {
    const now = Date.now();
    const lastUpdated = globalCache.lastUpdated[type];
    return now - lastUpdated < CACHE_EXPIRATION && globalCache[type].length > 0;
  };

  const updateCache = (updates: Partial<CacheData>) => {
    globalCache = { ...globalCache, ...updates };
    setCache(globalCache);
  };

  const fetchClientes = async (forceRefresh = false) => {
    if (!forceRefresh && isCacheValid('clientes')) {
      return globalCache.clientes;
    }

    if (globalCache.isLoading.clientes) {
      // Si ya se está cargando, esperar
      return new Promise<ClienteDTO[]>((resolve) => {
        const checkLoading = () => {
          if (!globalCache.isLoading.clientes) {
            resolve(globalCache.clientes);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      updateCache({
        isLoading: { ...globalCache.isLoading, clientes: true },
        error: { ...globalCache.error, clientes: null },
      });

      const data = await clientesService.getClientesDetallados();
      
      updateCache({
        clientes: data,
        lastUpdated: { ...globalCache.lastUpdated, clientes: Date.now() },
        isLoading: { ...globalCache.isLoading, clientes: false },
      });

      return data;
    } catch (error: any) {
      const errorMessage = error?.response?.status !== 401 
        ? 'Error al cargar los clientes' 
        : null;
      
      updateCache({
        error: { ...globalCache.error, clientes: errorMessage },
        isLoading: { ...globalCache.isLoading, clientes: false },
      });
      
      throw error;
    }
  };

  const fetchProductos = async (forceRefresh = false) => {
    if (!forceRefresh && isCacheValid('productos')) {
      return globalCache.productos;
    }

    if (globalCache.isLoading.productos) {
      // Si ya se está cargando, esperar
      return new Promise<ProductoDto[]>((resolve) => {
        const checkLoading = () => {
          if (!globalCache.isLoading.productos) {
            resolve(globalCache.productos);
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      updateCache({
        isLoading: { ...globalCache.isLoading, productos: true },
        error: { ...globalCache.error, productos: null },
      });

      const data = await ProductosService.obtenerProductos();
      
      updateCache({
        productos: data,
        lastUpdated: { ...globalCache.lastUpdated, productos: Date.now() },
        isLoading: { ...globalCache.isLoading, productos: false },
      });

      return data;
    } catch (error: any) {
      const errorMessage = error?.response?.status !== 401 
        ? 'Error al cargar los productos' 
        : null;
      
      updateCache({
        error: { ...globalCache.error, productos: errorMessage },
        isLoading: { ...globalCache.isLoading, productos: false },
      });
      
      throw error;
    }
  };

  const fetchAllData = async (forceRefresh = false) => {
    try {
      const [clientesData, productosData] = await Promise.all([
        fetchClientes(forceRefresh),
        fetchProductos(forceRefresh),
      ]);

      return { clientes: clientesData, productos: productosData };
    } catch (error) {
      console.error('Error al cargar datos:', error);
      throw error;
    }
  };

  const clearCache = () => {
    updateCache({
      clientes: [],
      productos: [],
      lastUpdated: { clientes: 0, productos: 0 },
      error: { clientes: null, productos: null },
    });
  };

  const invalidateCache = (type: 'clientes' | 'productos' | 'all') => {
    if (type === 'all') {
      updateCache({
        lastUpdated: { clientes: 0, productos: 0 },
      });
    } else {
      updateCache({
        lastUpdated: { ...globalCache.lastUpdated, [type]: 0 },
      });
    }
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // Estado actual
    clientes: cache.clientes,
    productos: cache.productos,
    isLoading: cache.isLoading,
    error: cache.error,
    
    // Métodos
    fetchClientes,
    fetchProductos,
    fetchAllData,
    clearCache,
    invalidateCache,
    
    // Utilidades
    isCacheValid,
  };
};
