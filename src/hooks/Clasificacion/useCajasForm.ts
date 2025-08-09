import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cajasFormSchema, type CajasFormData } from '../../schemas/cajasFormSchema';
import { CajasService } from '@/services/cajas.service';
import { toast } from 'sonner';
import { useState } from 'react';

interface ResumenCajas {
  XL: number;
  L: number;
  M: number;
  S: number;
  total: number;
}

export const useCajasForm = (clasificacionId: number, onSuccess?: (tipo: string, cantidad: number) => void, resumenCajas?: ResumenCajas) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CajasFormData>({
    resolver: zodResolver(cajasFormSchema),
    defaultValues: {
      tipo: undefined as any,
      cantidad: 0,
      idClasificacion: clasificacionId,
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (data: CajasFormData) => {
    if (!clasificacionId) {
      toast.error('ID de clasificación no válido');
      return;
    }

    if (!data.tipo) {
      toast.error('Debes seleccionar un tipo de caja');
      return;
    }

    // Validar que no se resten más cajas de las que existen
    if (data.cantidad < 0 && resumenCajas) {
      const cajasExistentes = resumenCajas[data.tipo as keyof ResumenCajas] || 0;
      const cantidadARestar = Math.abs(data.cantidad);
      
      if (cantidadARestar > cajasExistentes) {
        toast.error(`No puedes restar ${cantidadARestar} cajas ${data.tipo}. Solo tienes ${cajasExistentes} disponibles.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const cajaData = {
        tipo: data.tipo,
        cantidadAjuste: data.cantidad,
        pesoAjuste: null,
        idClasificacion: clasificacionId,
      };
      
      await CajasService.ajustarCantidadCaja(cajaData);
      
      const mensaje = data.cantidad > 0 
        ? `${data.cantidad} cajas ${data.tipo} agregadas correctamente`
        : `${Math.abs(data.cantidad)} cajas ${data.tipo} restadas correctamente`;
      
      toast.success(mensaje);
      
      // Resetear solo el formulario, sin recargar datos
      form.reset({
        tipo: undefined as any,
        cantidad: 0,
        idClasificacion: clasificacionId,
      });
      
      // Llamar callback de éxito con los datos para actualización local
      onSuccess?.(data.tipo, data.cantidad);
    } catch (error: any) {
      console.error('Error al registrar cajas:', error);
      toast.error(error?.message || 'Error al registrar las cajas');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    form,
    onSubmit: handleSubmit,
    isSubmitting,
    reset: form.reset,
  };
}; 