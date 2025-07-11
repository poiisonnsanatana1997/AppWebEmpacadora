import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clasificacionFormSchema } from '../../schemas/clasificacionFormSchema';
import { ClasificacionCompletaDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { toast } from 'sonner';

export interface PrecioHistory {
  tipo: string;
  precioAnterior: number;
  precioNuevo: number;
  timestamp: Date;
  porcentajeCambio: number;
}

export interface EstadisticasPrecios {
  promedio: number;
  maximo: number;
  minimo: number;
  rango: number;
  total: number;
  desviacionEstandar: number;
}

export interface UseEditarPreciosClasificacionProps {
  clasificacion: ClasificacionCompletaDTO;
  onSave: (clasificacion: ClasificacionCompletaDTO) => Promise<void>;
}

export const useEditarPreciosClasificacion = ({ clasificacion, onSave }: UseEditarPreciosClasificacionProps) => {
  const [precioHistory, setPrecioHistory] = useState<PrecioHistory[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalValues, setOriginalValues] = useState({
    xl: clasificacion.xl,
    l: clasificacion.l,
    m: clasificacion.m,
    s: clasificacion.s,
    retornos: clasificacion.retornos,
  });

  const form = useForm({
    resolver: zodResolver(clasificacionFormSchema),
    defaultValues: {
      xl: clasificacion.xl,
      l: clasificacion.l,
      m: clasificacion.m,
      s: clasificacion.s,
      retornos: clasificacion.retornos,
    },
    mode: 'onChange',
  });

  // Efecto para inicializar valores cuando cambia la clasificación
  useEffect(() => {
    const newValues = {
      xl: clasificacion.xl,
      l: clasificacion.l,
      m: clasificacion.m,
      s: clasificacion.s,
      retornos: clasificacion.retornos,
    };
    
    setOriginalValues(newValues);
    form.reset(newValues);
    setPrecioHistory([]);
    setShowSummary(false);
  }, [clasificacion, form]);

  // Función para detectar cambios en precios
  const detectarCambios = useCallback((fieldName: string, newValue: number) => {
    const oldValue = originalValues[fieldName as keyof typeof originalValues];
    if (Math.abs(newValue - oldValue) > 0.01) {
      const porcentajeCambio = oldValue > 0 ? ((newValue - oldValue) / oldValue) * 100 : 0;
      
      const cambio: PrecioHistory = {
        tipo: fieldName.toUpperCase(),
        precioAnterior: oldValue,
        precioNuevo: newValue,
        timestamp: new Date(),
        porcentajeCambio,
      };
      
      setPrecioHistory(prev => {
        const filtered = prev.filter(p => p.tipo !== fieldName.toUpperCase());
        return [...filtered, cambio];
      });
    }
  }, [originalValues]);

  // Función para calcular estadísticas de precios
  const calcularEstadisticas = useCallback((): EstadisticasPrecios => {
    const valores = form.getValues();
    const precios = Object.values(valores);
    
    const promedio = precios.reduce((a, b) => a + b, 0) / precios.length;
    const maximo = Math.max(...precios);
    const minimo = Math.min(...precios);
    const rango = maximo - minimo;
    const total = precios.reduce((a, b) => a + b, 0);
    
    // Calcular desviación estándar
    const sumaCuadrados = precios.reduce((sum, precio) => sum + Math.pow(precio - promedio, 2), 0);
    const desviacionEstandar = Math.sqrt(sumaCuadrados / precios.length);
    
    return {
      promedio,
      maximo,
      minimo,
      rango,
      total,
      desviacionEstandar,
    };
  }, [form]);

  // Función para aplicar incremento porcentual
  const aplicarIncremento = useCallback((porcentaje: number) => {
    setIsCalculating(true);
    try {
      const valores = form.getValues();
      const nuevosValores = Object.keys(valores).reduce((acc, key) => {
        acc[key as keyof typeof valores] = valores[key as keyof typeof valores] * (1 + porcentaje / 100);
        return acc;
      }, {} as typeof valores);
      
      form.reset(nuevosValores);
      
      // Detectar cambios automáticamente
      Object.entries(nuevosValores).forEach(([key, value]) => {
        detectarCambios(key, value);
      });
      
      toast.success(`Incremento del ${porcentaje}% aplicado a todos los precios`);
    } catch (error) {
      toast.error('Error al aplicar el incremento');
    } finally {
      setIsCalculating(false);
    }
  }, [form, detectarCambios]);

  // Función para aplicar decremento porcentual
  const aplicarDecremento = useCallback((porcentaje: number) => {
    setIsCalculating(true);
    try {
      const valores = form.getValues();
      const nuevosValores = Object.keys(valores).reduce((acc, key) => {
        acc[key as keyof typeof valores] = valores[key as keyof typeof valores] * (1 - porcentaje / 100);
        return acc;
      }, {} as typeof valores);
      
      form.reset(nuevosValores);
      
      // Detectar cambios automáticamente
      Object.entries(nuevosValores).forEach(([key, value]) => {
        detectarCambios(key, value);
      });
      
      toast.success(`Decremento del ${porcentaje}% aplicado a todos los precios`);
    } catch (error) {
      toast.error('Error al aplicar el decremento');
    } finally {
      setIsCalculating(false);
    }
  }, [form, detectarCambios]);

  // Función para copiar precios al portapapeles
  const copiarPrecios = useCallback(async () => {
    try {
      const valores = form.getValues();
      const texto = Object.entries(valores)
        .map(([key, value]) => `${key.toUpperCase()}: $${value.toFixed(2)}`)
        .join('\n');
      
      await navigator.clipboard.writeText(texto);
      toast.success('Precios copiados al portapapeles');
    } catch (error) {
      toast.error('Error al copiar los precios');
    }
  }, [form]);

  // Función para restaurar valores originales
  const restaurarOriginales = useCallback(() => {
    form.reset(originalValues);
    setPrecioHistory([]);
    toast.info('Valores originales restaurados');
  }, [form, originalValues]);

  // Función para validar cambios significativos
  const validarCambios = useCallback((data: any): boolean => {
    const hasChanges = Object.keys(data).some(key => 
      Math.abs(data[key] - originalValues[key as keyof typeof originalValues]) > 0.01
    );

    if (!hasChanges) {
      toast.warning('No se detectaron cambios en los precios');
      return false;
    }

    return true;
  }, [originalValues]);

  // Función para guardar cambios
  const guardarCambios = useCallback(async (data: any) => {
    if (!validarCambios(data)) {
      return false;
    }

    // Mostrar resumen de cambios si hay muchos
    if (precioHistory.length > 2) {
      setShowSummary(true);
      return false;
    }

    setIsSaving(true);
    try {
      await onSave({ ...clasificacion, ...data });
      toast.success('Precios actualizados correctamente');
      return true;
    } catch (error) {
      toast.error('Error al actualizar los precios. Por favor, inténtalo de nuevo.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [validarCambios, precioHistory.length, onSave, clasificacion]);

  // Función para confirmar guardado desde el resumen
  const confirmarGuardado = useCallback(async () => {
    setIsSaving(true);
    try {
      const data = form.getValues();
      await onSave({ ...clasificacion, ...data });
      setShowSummary(false);
      toast.success('Precios actualizados correctamente');
      return true;
    } catch (error) {
      toast.error('Error al actualizar los precios');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [form, onSave, clasificacion]);

  // Función para obtener el resumen de cambios
  const obtenerResumenCambios = useCallback(() => {
    return precioHistory.map(cambio => ({
      ...cambio,
      diferencia: cambio.precioNuevo - cambio.precioAnterior,
      esIncremento: cambio.precioNuevo > cambio.precioAnterior,
    }));
  }, [precioHistory]);

  // Función para limpiar historial
  const limpiarHistorial = useCallback(() => {
    setPrecioHistory([]);
  }, []);

  // Función para obtener el total de cambios
  const obtenerTotalCambios = useCallback(() => {
    return precioHistory.reduce((total, cambio) => {
      return total + Math.abs(cambio.precioNuevo - cambio.precioAnterior);
    }, 0);
  }, [precioHistory]);

  // Función para obtener el promedio de cambios
  const obtenerPromedioCambios = useCallback(() => {
    if (precioHistory.length === 0) return 0;
    
    const totalCambios = precioHistory.reduce((total, cambio) => {
      return total + Math.abs(cambio.porcentajeCambio);
    }, 0);
    
    return totalCambios / precioHistory.length;
  }, [precioHistory]);

  return {
    // Estado
    precioHistory,
    showSummary,
    isCalculating,
    isSaving,
    originalValues,
    hasChanges: form.formState.isDirty,
    
    // Formulario
    form,
    
    // Funciones principales
    detectarCambios,
    calcularEstadisticas,
    aplicarIncremento,
    aplicarDecremento,
    copiarPrecios,
    restaurarOriginales,
    guardarCambios,
    confirmarGuardado,
    
    // Funciones de utilidad
    obtenerResumenCambios,
    limpiarHistorial,
    obtenerTotalCambios,
    obtenerPromedioCambios,
    
    // Control de modales
    setShowSummary,
  };
}; 