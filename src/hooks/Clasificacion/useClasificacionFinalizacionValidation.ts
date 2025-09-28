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

// Constantes para tolerancias robustas
const TOLERANCIA_PROGRESO = 0.1; // 0.1% de tolerancia para errores de punto flotante
const PROGRESO_MINIMO_ACEPTABLE = 100 - TOLERANCIA_PROGRESO; // 99.9%

export const useClasificacionFinalizacionValidation = (
  clasificaciones: ClasificacionCompletaDTO[],
  progreso: number
): ValidacionFinalizacion => {
  return useMemo(() => {
    const errores: string[] = [];
    
    // Validación inicial más robusta
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

    // Validar que el progreso sea un número válido
    if (typeof progreso !== 'number' || isNaN(progreso) || !isFinite(progreso)) {
      return {
        puedeFinalizar: false,
        errores: ['Error en el cálculo del progreso'],
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
    
    clasificaciones.forEach((clasificacion, index) => {
      // Validar que la clasificación tenga los campos necesarios
      if (!clasificacion || typeof clasificacion !== 'object') {
        errores.push(`Clasificación ${index + 1} no válida`);
        preciosEstablecidos = false;
        return;
      }

      // Solo validar precios de tipos que están clasificados
      if (tiposClasificados.includes('XL')) {
        const precioXL = Number(clasificacion.xl);
        if (isNaN(precioXL) || precioXL <= 0) {
          errores.push('Precio XL no establecido o inválido');
          preciosEstablecidos = false;
        }
      }
      if (tiposClasificados.includes('L')) {
        const precioL = Number(clasificacion.l);
        if (isNaN(precioL) || precioL <= 0) {
          errores.push('Precio L no establecido o inválido');
          preciosEstablecidos = false;
        }
      }
      if (tiposClasificados.includes('M')) {
        const precioM = Number(clasificacion.m);
        if (isNaN(precioM) || precioM <= 0) {
          errores.push('Precio M no establecido o inválido');
          preciosEstablecidos = false;
        }
      }
      if (tiposClasificados.includes('S')) {
        const precioS = Number(clasificacion.s);
        if (isNaN(precioS) || precioS <= 0) {
          errores.push('Precio S no establecido o inválido');
          preciosEstablecidos = false;
        }
      }
    });

    // 3. Validar progreso completo con tolerancia robusta
    const progresoCompleto = progreso >= PROGRESO_MINIMO_ACEPTABLE;
    if (!progresoCompleto) {
      const diferencia = Math.abs(100 - progreso);
      if (diferencia <= TOLERANCIA_PROGRESO) {
        // Si está muy cerca del 100%, considerarlo válido pero mostrar advertencia
        console.warn(`Progreso muy cercano al 100%: ${progreso.toFixed(3)}% (diferencia: ${diferencia.toFixed(3)}%)`);
      } else {
        errores.push(`El progreso debe ser del 100% para finalizar (actual: ${progreso.toFixed(2)}%)`);
      }
    }

    // 4. Validaciones adicionales de seguridad
    const tieneTiposClasificados = tiposClasificados.length > 0;
    
    // Validar que al menos haya una clasificación con datos
    const tieneDatosValidos = clasificaciones.some(c => 
      c && 
      (c.tarimasClasificaciones?.length > 0 || 
       c.mermas?.length > 0 || 
       c.retornosDetalle?.length > 0)
    );
    
    if (!tieneDatosValidos) {
      errores.push('No hay datos de clasificación válidos');
    }

    // Validar que el progreso no sea negativo o excesivamente alto
    if (progreso < 0) {
      errores.push('El progreso no puede ser negativo');
    } else if (progreso > 150) {
      errores.push('El progreso excede el límite máximo (150%)');
    }

    // Determinar si puede finalizar con todas las validaciones
    const puedeFinalizar = tieneTiposClasificados && 
                          preciosEstablecidos && 
                          progresoCompleto && 
                          tieneDatosValidos && 
                          progreso >= 0 && 
                          progreso <= 150;

    return {
      puedeFinalizar,
      errores,
      detallesValidacion: {
        tiposClasificados: tieneTiposClasificados,
        preciosEstablecidos,
        progresoCompleto
      },
      tiposClasificados,
      tiposNoClasificados
    };
  }, [clasificaciones, progreso]);
}; 