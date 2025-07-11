import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ajustePesosFormSchema, AjustePesosFormData } from '../../schemas/ajustePesosFormSchema';
import { ClasificacionService } from '../../services/clasificacion.service';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';
import { TarimaClasificacionDTO, ClasificacionCompletaDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';

interface UseAjustarPesosFormProps {
  clasificacionId: number;
  tarimas: TarimaClasificacionDTO[];
  clasificaciones: ClasificacionCompletaDTO[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useAjustarPesosForm = ({ clasificacionId, tarimas, clasificaciones, onSuccess, onCancel }: UseAjustarPesosFormProps) => {
  const form = useForm<AjustePesosFormData>({
    resolver: zodResolver(ajustePesosFormSchema),
    defaultValues: {
      xl: undefined,
      l: undefined,
      m: undefined,
      s: undefined,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determinar qué tipos tienen tarimas clasificadas
  const tiposHabilitados = useMemo(() => {
    const tipos = new Set(tarimas.map(t => t.tipo));
    return {
      tieneXL: tipos.has('XL'),
      tieneL: tipos.has('L'),
      tieneM: tipos.has('M'),
      tieneS: tipos.has('S')
    };
  }, [tarimas]);

  // Función para validar el ajuste de pesos
  const validateAjustePesos = (ajuste: AjustePesosFormData) => {
    // Calcular el peso del ajuste (suma de todos los tipos)
    const pesoAjuste = (ajuste.xl || 0) + (ajuste.l || 0) + (ajuste.m || 0) + (ajuste.s || 0);
    
    if (pesoAjuste === 0) {
      return {
        isValid: false,
        message: 'Debe especificar al menos un peso para ajustar',
        remainingWeight: 0,
        currentProgress: 0
      };
    }

    // Calcular el peso total actual (tarimas + mermas + retornos)
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

    const pesoTotalActual = pesoTotalClasificado + pesoTotalMermas + pesoTotalRetornos;
    const pesoTotalConAjuste = pesoTotalActual + pesoAjuste;
    const pesoRestante = pesoTotalEsperado - pesoTotalActual;
    const progresoActual = (pesoTotalActual / pesoTotalEsperado) * 100;
    const progresoConAjuste = (pesoTotalConAjuste / pesoTotalEsperado) * 100;

    const isValid = pesoTotalConAjuste <= pesoTotalEsperado;
    
    let finalMessage = '';
    if (!isValid) {
      finalMessage = `No se puede ajustar los pesos. Peso máximo disponible: ${pesoRestante.toFixed(2)} kg`;
    } else if (progresoConAjuste > 95) {
      finalMessage = `⚠️ Advertencia: Al ajustar esto el progreso será del ${progresoConAjuste.toFixed(1)}%`;
    }

    return {
      isValid,
      message: finalMessage,
      remainingWeight: pesoRestante,
      currentProgress: progresoActual
    };
  };

  const handleSubmit = async (data: AjustePesosFormData) => {
    setIsSubmitting(true);
    try {
      // Validar el ajuste antes de proceder
      const validation = validateAjustePesos(data);
      
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
      
      if (validation.message) {
        toast.warning(validation.message);
      }

      // Filtrar solo los campos que tienen valores
      const ajuste = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined && value !== null)
      );

      await ClasificacionService.ajustarPesoClasificacion(clasificacionId, ajuste);
      toast.success('Pesos ajustados correctamente');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || 'Error al ajustar los pesos');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return {
    form,
    isSubmitting,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleCancel,
    tiposHabilitados,
    validateAjustePesos,
  };
}; 