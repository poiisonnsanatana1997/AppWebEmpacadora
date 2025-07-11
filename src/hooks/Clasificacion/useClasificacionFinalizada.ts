import { useMemo } from 'react';
import { PedidoCompletoDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { useClasificacionFinalizacionValidation } from './useClasificacionFinalizacionValidation';

export interface ClasificacionFinalizadaInfo {
  estaFinalizada: boolean;
  puedeFinalizar: boolean;
  progreso: number;
  mensajeEstado: string;
  errores: string[];
  detallesValidacion: {
    tiposClasificados: boolean;
    preciosEstablecidos: boolean;
    progresoCompleto: boolean;
  };
  tiposClasificados: string[];
  tiposNoClasificados: string[];
}

export const useClasificacionFinalizada = (
  orden: PedidoCompletoDTO | null,
  progreso: number
): ClasificacionFinalizadaInfo => {
  // Usar la nueva validación de finalización
  const validacion = useClasificacionFinalizacionValidation(
    orden?.clasificaciones || [],
    progreso
  );

  return useMemo(() => {
    if (!orden) {
      return {
        estaFinalizada: false,
        puedeFinalizar: false,
        progreso: 0,
        mensajeEstado: 'Cargando...',
        errores: [],
        detallesValidacion: {
          tiposClasificados: false,
          preciosEstablecidos: false,
          progresoCompleto: false
        },
        tiposClasificados: [],
        tiposNoClasificados: ['XL', 'L', 'M', 'S']
      };
    }

    const estaFinalizada = orden.estado === 'Clasificado';
    
    // Usar la validación personalizada para determinar si puede finalizar
    const puedeFinalizar = validacion.puedeFinalizar && !estaFinalizada;
    
    let mensajeEstado = '';
    if (estaFinalizada) {
      mensajeEstado = 'Clasificación finalizada';
    } else if (validacion.puedeFinalizar) {
      mensajeEstado = 'Listo para finalizar';
    } else if (validacion.errores.length > 0) {
      mensajeEstado = `Pendiente: ${validacion.errores.length} validación(es) requerida(s)`;
    } else {
      mensajeEstado = `Progreso: ${progreso.toFixed(1)}%`;
    }

    return {
      estaFinalizada,
      puedeFinalizar,
      progreso,
      mensajeEstado,
      errores: validacion.errores,
      detallesValidacion: validacion.detallesValidacion,
      tiposClasificados: validacion.tiposClasificados,
      tiposNoClasificados: validacion.tiposNoClasificados
    };
  }, [orden, progreso, validacion]);
}; 