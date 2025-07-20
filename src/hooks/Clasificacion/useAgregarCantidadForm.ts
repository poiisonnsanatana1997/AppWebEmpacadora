import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { agregarCantidadFormSchema, type AgregarCantidadFormData } from '@/schemas/agregarCantidadFormSchema';
import { TarimasService } from '@/services/tarimas.service';
import { TarimaParcialSeleccionadaDTO } from '@/types/Tarimas/tarimaParcial.types';
import { toast } from 'sonner';

interface UseAgregarCantidadFormProps {
  tarimaActual: TarimaParcialSeleccionadaDTO;
  clasificacionId: number;
  onSuccess?: () => void;
  onValidate?: (cantidad: number) => { isValid: boolean; message: string };
}

export const useAgregarCantidadForm = ({
  tarimaActual,
  clasificacionId,
  onSuccess,
  onValidate,
}: UseAgregarCantidadFormProps) => {
  const form = useForm<AgregarCantidadFormData>({
    resolver: zodResolver(agregarCantidadFormSchema) as any,
    defaultValues: {
      cantidad: undefined,
      observaciones: '',
      upc: '',
      estadoTarima: 'parcial', // Valor por defecto
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: AgregarCantidadFormData) => {
    // Validaciones adicionales antes de enviar
    if (!data.cantidad || data.cantidad <= 0) {
      toast.error('❌ Debes ingresar una cantidad válida mayor a 0');
      return;
    }

    if (!data.estadoTarima) {
      toast.error('❌ Debes seleccionar el estado de la tarima');
      return;
    }

    const pesoTotalAgregar = (data.cantidad || 0) * (tarimaActual.peso || 0);
    
    // Validación de límites de clasificación
    if (onValidate) {
      const validation = onValidate(pesoTotalAgregar);
      if (!validation.isValid) {
        toast.error(`❌ ${validation.message}`);
        return;
      }
    }

    // Validación de peso por caja
    if (!tarimaActual.peso || tarimaActual.peso <= 0) {
      toast.error('❌ Error: El peso por caja no es válido. Contacta al administrador.');
      return;
    }

    // Mostrar resumen antes de enviar
    const resumen = `📋 Resumen de la operación:
• Cantidad nueva a agregar: ${data.cantidad} caja(s)
• Cantidad actual de la tarima: ${tarimaActual.tarimasClasificaciones[0]?.cantidad || 0} caja(s)
• Cantidad total después de agregar: ${tarimaActual.tarimasClasificaciones[0]?.cantidad + (data.cantidad || 0)} caja(s)
• Peso por caja: ${tarimaActual.peso.toFixed(2)} kg
• Peso total a agregar: ${pesoTotalAgregar.toFixed(2)} kg
• Estado final: ${data.estadoTarima === 'completo' ? 'Completa' : 'Parcial'}
• Tarima: ${tarimaActual.codigo}`;

    toast.info(resumen, {
      duration: 4000,
    });

    try {
      const tipo = tarimaActual.tarimasClasificaciones[0]?.tipo || 'GENERAL';
      
      await TarimasService.updateTarimaParcial(tarimaActual.id, {
        estatus: data.estadoTarima === 'completo' ? 'COMPLETA' : 'PARCIAL',
        cantidad: data.cantidad || 0,  // Solo la cantidad nueva
        idTarima: tarimaActual.id,
        idClasificacion: clasificacionId,
        tipo: tipo,
      });

      toast.success(`✅ Cantidad agregada correctamente a la tarima ${tarimaActual.codigo}`);
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error al actualizar tarima parcial:', error);
      
      // Mensajes de error específicos
      if (error?.response?.status === 404) {
        toast.error('❌ Tarima parcial no encontrada');
      } else if (error?.response?.status === 400) {
        toast.error('❌ Datos inválidos para la actualización');
      } else if (error?.response?.status === 500) {
        toast.error('❌ Error en el servidor. Por favor, intenta más tarde');
      } else {
        toast.error(`❌ ${error?.message || 'Error inesperado al actualizar la tarima parcial'}`);
      }
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
  };
}; 