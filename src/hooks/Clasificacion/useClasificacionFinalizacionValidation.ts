import { useMemo } from 'react';
import { ClasificacionCompletaDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';

export interface ValidacionFinalizacion {
  puedeFinalizar: boolean;
  errores: string[];
  detallesValidacion: {
    tiposClasificados: boolean;
    preciosEstablecidos: boolean;
    progresoCompleto: boolean;
  };
  tiposClasificados: string[];
  tiposNoClasificados: string[];
}

export const useClasificacionFinalizacionValidation = (
  clasificaciones: ClasificacionCompletaDTO[],
  progreso: number
): ValidacionFinalizacion => {
  return useMemo(() => {
    const errores: string[] = [];
    
    if (!clasificaciones || clasificaciones.length === 0) {
      return {
        puedeFinalizar: false,
        errores: ['No hay clasificaciones disponibles'],
        detallesValidacion: {
          tiposClasificados: false,
          preciosEstablecidos: false,
          progresoCompleto: false
        },
        tiposClasificados: [],
        tiposNoClasificados: ['XL', 'L', 'M', 'S']
      };
    }

    // 1. Identificar qué tipos están clasificados (no es obligatorio clasificar todos)
    const tiposRequeridos = ['XL', 'L', 'M', 'S'];
    const tiposClasificados: string[] = [];
    const tiposNoClasificados: string[] = [];
    
    tiposRequeridos.forEach(tipo => {
      const existeTipo = clasificaciones.some(clasificacion => 
        clasificacion.tarimasClasificaciones?.some(tarima => tarima.tipo === tipo)
      );
      if (existeTipo) {
        tiposClasificados.push(tipo);
      } else {
        tiposNoClasificados.push(tipo);
        // NO agregar error por tipos no clasificados - no es obligatorio
      }
    });

    // 2. Validar precios establecidos SOLO para los tipos que están clasificados
    let preciosEstablecidos = true;
    
    clasificaciones.forEach(clasificacion => {
      // Solo validar precios de tipos que están clasificados
      if (tiposClasificados.includes('XL') && clasificacion.xl <= 0) {
        errores.push('Precio XL no establecido');
        preciosEstablecidos = false;
      }
      if (tiposClasificados.includes('L') && clasificacion.l <= 0) {
        errores.push('Precio L no establecido');
        preciosEstablecidos = false;
      }
      if (tiposClasificados.includes('M') && clasificacion.m <= 0) {
        errores.push('Precio M no establecido');
        preciosEstablecidos = false;
      }
      if (tiposClasificados.includes('S') && clasificacion.s <= 0) {
        errores.push('Precio S no establecido');
        preciosEstablecidos = false;
      }
    });

    // 3. Validar progreso completo
    const progresoCompleto = progreso >= 100;
    if (!progresoCompleto) {
      errores.push('El progreso debe ser del 100% para finalizar');
    }

    return {
      puedeFinalizar: tiposClasificados.length > 0 && preciosEstablecidos && progresoCompleto,
      errores,
      detallesValidacion: {
        tiposClasificados: tiposClasificados.length > 0,
        preciosEstablecidos,
        progresoCompleto
      },
      tiposClasificados,
      tiposNoClasificados
    };
  }, [clasificaciones, progreso]);
}; 