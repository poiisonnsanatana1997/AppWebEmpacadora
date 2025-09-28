import { useState, useCallback } from 'react';
import type { InventarioTipoDTO } from '../../types/Inventario/inventario.types';

/**
 * Hook personalizado para manejar la selección de tarimas
 * @returns {Object} Estado y funciones para la selección de tarimas
 */
export const useTarimaSeleccion = () => {
  const [tarimasSeleccionadas, setTarimasSeleccionadas] = useState<InventarioTipoDTO[]>([]);

  /**
   * Verifica si una tarima es elegible para selección según el modo de operación
   */
  const isTarimaElegible = useCallback((tarima: InventarioTipoDTO, modo?: 'asignar' | 'desasignar'): boolean => {
    // Si no hay modo especificado, usar lógica por defecto (solo tarimas sin asignar)
    if (!modo) {
      const tienePedidos = tarima.tarimaOriginal.pedidoTarimas && 
                          tarima.tarimaOriginal.pedidoTarimas.length > 0;
      return !tienePedidos;
    }
    
    // Verificar si la tarima tiene pedidos asignados
    const tienePedidosAsignados = tarima.tarimaOriginal.pedidoTarimas && 
                                  tarima.tarimaOriginal.pedidoTarimas.length > 0;
    
    // Para asignar: tarimas SIN pedidos asignados
    if (modo === 'asignar') {
      return !tienePedidosAsignados;
    } 
    // Para desasignar: tarimas CON pedidos asignados
    else {
      return tienePedidosAsignados;
    }
  }, []);

  /**
   * Alterna la selección de una tarima
   */
  const toggleTarimaSeleccion = useCallback((tarima: InventarioTipoDTO, modo?: 'asignar' | 'desasignar') => {
    if (!isTarimaElegible(tarima, modo)) return;
    
    setTarimasSeleccionadas(prev => {
      const existe = prev.find(t => t.codigo === tarima.codigo);
      if (existe) {
        return prev.filter(t => t.codigo !== tarima.codigo);
      } else {
        return [...prev, tarima];
      }
    });
  }, [isTarimaElegible]);

  /**
   * Limpia la selección de tarimas
   */
  const limpiarSeleccion = useCallback(() => {
    setTarimasSeleccionadas([]);
  }, []);

  /**
   * Selecciona todas las tarimas elegibles
   */
  const seleccionarTodas = useCallback((tarimas: InventarioTipoDTO[], modo?: 'asignar' | 'desasignar') => {
    const tarimasElegibles = tarimas.filter(tarima => isTarimaElegible(tarima, modo));
    setTarimasSeleccionadas(tarimasElegibles);
  }, [isTarimaElegible]);

  /**
   * Deselecciona todas las tarimas
   */
  const deseleccionarTodas = useCallback(() => {
    setTarimasSeleccionadas([]);
  }, []);

  /**
   * Remueve tarimas específicas de la selección
   */
  const removerTarimasDeSeleccion = useCallback((tarimasARemover: InventarioTipoDTO[]) => {
    setTarimasSeleccionadas(prev => {
      const codigosARemover = tarimasARemover.map(t => t.codigo);
      return prev.filter(tarima => !codigosARemover.includes(tarima.codigo));
    });
  }, []);

  return {
    tarimasSeleccionadas,
    isTarimaElegible,
    toggleTarimaSeleccion,
    limpiarSeleccion,
    seleccionarTodas,
    deseleccionarTodas,
    removerTarimasDeSeleccion,
    hayTarimasSeleccionadas: tarimasSeleccionadas.length > 0,
    cantidadTarimasSeleccionadas: tarimasSeleccionadas.length
  };
};
