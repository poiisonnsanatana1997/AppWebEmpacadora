import { useMemo } from 'react';
import { ClasificacionCompletaDTO, TarimaClasificacionDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';

export interface IndicadoresPesosData {
  pesoXL: number;
  pesoL: number;
  pesoM: number;
  pesoS: number;
  pesoRetornos: number;
  pesoMermas: number;
  pesoTotalClasificado: number;
  pesoTotalEsperado: number;
  progreso: number;
  pesosPorTipo: Record<string, number>;
}

export const useIndicadoresPesos = (
  clasificaciones: ClasificacionCompletaDTO[]
): IndicadoresPesosData => {
  return useMemo(() => {
    // Unificar todas las tarimas de todas las clasificaciones
    const tarimas: TarimaClasificacionDTO[] = clasificaciones?.flatMap(c => c.tarimasClasificaciones || []) || [];

    // Cálculo de pesos por tipo de tarima
    const pesosPorTipo = tarimas.reduce((acc, tarima) => {
      const tipo = tarima.tipo;
      if (!acc[tipo]) {
        acc[tipo] = 0;
      }
      acc[tipo] += tarima.peso;
      return acc;
    }, {} as Record<string, number>);

    // Pesos por tipo (con valores por defecto si no existen)
    const pesoXL = pesosPorTipo['XL'] || 0;
    const pesoL = pesosPorTipo['L'] || 0;
    const pesoM = pesosPorTipo['M'] || 0;
    const pesoS = pesosPorTipo['S'] || 0;

    // Pesos totales de retornos y mermas
    const pesoRetornos = clasificaciones.reduce((total, c) => 
      total + c.retornosDetalle.reduce((acc, r) => acc + r.peso, 0), 0
    );
    const pesoMermas = clasificaciones.reduce((total, c) => 
      total + c.mermas.reduce((acc, m) => acc + m.peso, 0), 0
    );

    // Peso total clasificado (suma de todos los tipos + retornos + mermas)
    const pesoTotalClasificado = pesoXL + pesoL + pesoM + pesoS + pesoRetornos + pesoMermas;

    // Peso total esperado
    const pesoTotalEsperado = clasificaciones.reduce((total, c) => total + c.pesoTotal, 0);

    // Cálculo del progreso
    const progreso = pesoTotalEsperado > 0 ? (pesoTotalClasificado / pesoTotalEsperado) * 100 : 0;

    return {
      pesoXL,
      pesoL,
      pesoM,
      pesoS,
      pesoRetornos,
      pesoMermas,
      pesoTotalClasificado,
      pesoTotalEsperado,
      progreso,
      pesosPorTipo
    };
  }, [clasificaciones]);
};

// Hook para una sola clasificación
export const useIndicadoresPesosClasificacion = (
  clasificacion: ClasificacionCompletaDTO
): IndicadoresPesosData => {
  return useMemo(() => {
    // Cálculo de pesos por tipo de tarima
    const pesosPorTipo = clasificacion.tarimasClasificaciones.reduce((acc, tarima) => {
      const tipo = tarima.tipo;
      if (!acc[tipo]) {
        acc[tipo] = 0;
      }
      acc[tipo] += tarima.peso;
      return acc;
    }, {} as Record<string, number>);

    // Pesos por tipo (con valores por defecto si no existen)
    const pesoXL = pesosPorTipo['XL'] || 0;
    const pesoL = pesosPorTipo['L'] || 0;
    const pesoM = pesosPorTipo['M'] || 0;
    const pesoS = pesosPorTipo['S'] || 0;

    // Cálculo de pesos por tipo de tarima
    const pesoRetornos = clasificacion.retornosDetalle.reduce((acc, r) => acc + r.peso, 0);
    const pesoMermas = clasificacion.mermas.reduce((acc, m) => acc + m.peso, 0);

    // Peso total clasificado (suma de todos los tipos + retornos + mermas)
    const pesoTotalClasificado = pesoXL + pesoL + pesoM + pesoS + pesoRetornos + pesoMermas;

    // Peso total esperado (usando el pesoTotal de la clasificación como referencia)
    const pesoTotalEsperado = clasificacion.pesoTotal;

    // Cálculo del progreso
    const progreso = pesoTotalEsperado > 0 ? (pesoTotalClasificado / pesoTotalEsperado) * 100 : 0;

    return {
      pesoXL,
      pesoL,
      pesoM,
      pesoS,
      pesoRetornos,
      pesoMermas,
      pesoTotalClasificado,
      pesoTotalEsperado,
      progreso,
      pesosPorTipo
    };
  }, [clasificacion]);
}; 