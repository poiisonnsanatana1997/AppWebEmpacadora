import { useState, useEffect } from 'react';
import { CajasService } from '@/services/cajas.service';
import { CajaDto } from '@/types/Cajas/cajas.types';
import { toast } from 'sonner';

export interface ResumenCajas {
  XL: number;
  L: number;
  M: number;
  S: number;
  total: number;
}

export const useCajasResumen = (clasificacionId: number) => {
  const [cajas, setCajas] = useState<CajaDto[]>([]);
  const [resumen, setResumen] = useState<ResumenCajas>({
    XL: 0,
    L: 0,
    M: 0,
    S: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);

  const cargarCajas = async () => {
    if (!clasificacionId) return;
    
    setLoading(true);
    try {
      const cajasData = await CajasService.obtenerCajasPorClasificacion(clasificacionId);
      setCajas(cajasData);
      
      // Calcular resumen por tipo
      const resumenCalculado = cajasData.reduce((acc, caja) => {
        const tipo = caja.tipo as keyof Omit<ResumenCajas, 'total'>;
        if (tipo && acc.hasOwnProperty(tipo)) {
          acc[tipo] += caja.cantidad || 0;
        }
        acc.total += caja.cantidad || 0;
        return acc;
      }, {
        XL: 0,
        L: 0,
        M: 0,
        S: 0,
        total: 0
      } as ResumenCajas);
      
      setResumen(resumenCalculado);
    } catch (error: any) {
      console.error('Error al cargar cajas:', error);
      // No mostrar error si es 404 (no hay cajas registradas)
      if (error?.message && !error.message.includes('404')) {
        toast.error('Error al cargar el resumen de cajas');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el resumen localmente sin refetch
  const actualizarResumenLocal = (tipo: string, cantidadAjuste: number) => {
    setResumen(prevResumen => {
      const nuevoResumen = { ...prevResumen };
      const tipoKey = tipo as keyof Omit<ResumenCajas, 'total'>;
      
      if (tipoKey && nuevoResumen.hasOwnProperty(tipoKey)) {
        nuevoResumen[tipoKey] += cantidadAjuste;
        nuevoResumen.total += cantidadAjuste;
      }
      
      return nuevoResumen;
    });
  };

  useEffect(() => {
    cargarCajas();
  }, [clasificacionId]);

  return {
    cajas,
    resumen,
    loading,
    refetch: cargarCajas,
    actualizarResumenLocal
  };
}; 