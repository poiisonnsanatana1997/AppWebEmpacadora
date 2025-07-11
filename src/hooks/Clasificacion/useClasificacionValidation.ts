import { ClasificacionCompletaDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';

export interface ValidationResult {
  isValid: boolean;
  message: string;
  remainingWeight: number;
  currentProgress: number;
}

export interface ClasificacionValidationParams {
  cantidadAAgregar: number;
  tipoOperacion: 'tarima' | 'merma' | 'retorno';
  clasificacionId: number;
  clasificaciones: ClasificacionCompletaDTO[];
}

// Función auxiliar para calcular totales
const calculateCurrentTotals = (clasificaciones: ClasificacionCompletaDTO[]) => {
  let pesoTotalClasificado = 0;
  let pesoTotalMermas = 0;
  let pesoTotalRetornos = 0;
  let pesoTotalEsperado = 0;

  clasificaciones.forEach(clasificacion => {
    // Peso clasificado (solo tarimas)
    pesoTotalClasificado += clasificacion.tarimasClasificaciones?.reduce((sum, tarima) => 
      sum + (tarima.peso || 0), 0) || 0;
    
    // Peso mermas
    pesoTotalMermas += clasificacion.mermas?.reduce((sum, merma) => 
      sum + (merma.peso || 0), 0) || 0;
    
    // Peso retornos
    pesoTotalRetornos += clasificacion.retornosDetalle?.reduce((sum, retorno) => 
      sum + (retorno.peso || 0), 0) || 0;
    
    // Peso esperado
    pesoTotalEsperado += clasificacion.pesoTotal || 0;
  });

  return {
    pesoTotalClasificado,
    pesoTotalMermas,
    pesoTotalRetornos,
    pesoTotalEsperado
  };
};

export const useClasificacionValidation = () => {
  const validateClasificacionLimit = ({
    cantidadAAgregar,
    tipoOperacion,
    clasificacionId,
    clasificaciones
  }: ClasificacionValidationParams): ValidationResult => {
    const totals = calculateCurrentTotals(clasificaciones);
    
    // Calcular el peso total actual (tarimas + mermas + retornos)
    const pesoTotalActual = totals.pesoTotalClasificado + totals.pesoTotalMermas + totals.pesoTotalRetornos;
    
    let pesoActual = 0;
    let mensaje = '';

    switch (tipoOperacion) {
      case 'tarima':
        pesoActual = pesoTotalActual;
        mensaje = 'No se puede agregar más peso clasificado';
        break;
      case 'merma':
        pesoActual = pesoTotalActual;
        mensaje = 'No se puede agregar más merma';
        break;
      case 'retorno':
        pesoActual = pesoTotalActual;
        mensaje = 'No se puede agregar más retorno';
        break;
    }

    const pesoTotalConNuevo = pesoActual + cantidadAAgregar;
    const pesoRestante = totals.pesoTotalEsperado - pesoActual;
    const progresoActual = (pesoActual / totals.pesoTotalEsperado) * 100;
    const progresoConNuevo = (pesoTotalConNuevo / totals.pesoTotalEsperado) * 100;

    const isValid = pesoTotalConNuevo <= totals.pesoTotalEsperado;
    
    let finalMessage = '';
    if (!isValid) {
      finalMessage = `${mensaje}. Peso máximo disponible: ${pesoRestante.toFixed(2)} kg`;
    } else if (progresoConNuevo > 95) {
      finalMessage = `⚠️ Advertencia: Al agregar esto el progreso será del ${progresoConNuevo.toFixed(1)}%`;
    }

    return {
      isValid,
      message: finalMessage,
      remainingWeight: pesoRestante,
      currentProgress: progresoActual
    };
  };

  const getProgressInfo = (clasificaciones: ClasificacionCompletaDTO[]) => {
    const totals = calculateCurrentTotals(clasificaciones);
    const pesoTotalActual = totals.pesoTotalClasificado + totals.pesoTotalMermas + totals.pesoTotalRetornos;
    const progreso = (pesoTotalActual / totals.pesoTotalEsperado) * 100;
    const pesoRestante = totals.pesoTotalEsperado - pesoTotalActual;

    return {
      progreso,
      pesoRestante,
      pesoTotalClasificado: totals.pesoTotalClasificado,
      pesoTotalEsperado: totals.pesoTotalEsperado,
      pesoTotalMermas: totals.pesoTotalMermas,
      pesoTotalRetornos: totals.pesoTotalRetornos
    };
  };

  return {
    validateClasificacionLimit,
    getProgressInfo
  };
}; 