import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { retornoFormSchema, type RetornoFormData } from '@/schemas/retornoFormSchema';
import { RetornosService } from '@/services/retornos.service';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

export const useRetornoForm = (clasificacionId: number, onSuccess?: () => void) => {
  const [retornosExistentes, setRetornosExistentes] = useState<any[]>([]);
  const [loadingRetornos, setLoadingRetornos] = useState(false);

  // Función para generar el siguiente número de retorno
  const generarNumeroRetorno = () => {
    const siguienteNumero = retornosExistentes.length + 1;
    return `RET-${siguienteNumero.toString().padStart(3, '0')}`;
  };

  // Cargar retornos existentes para generar el número
  const cargarRetornosExistentes = async () => {
    setLoadingRetornos(true);
    try {
      const retornos = await RetornosService.getAll();
      // Filtrar solo los retornos de esta clasificación
      const retornosClasificacion = retornos.filter(r => r.idClasificacion === clasificacionId);
      setRetornosExistentes(retornosClasificacion);
    } catch (error) {
      console.error('Error al cargar retornos existentes:', error);
      // Si no se pueden cargar, usar un array vacío
      setRetornosExistentes([]);
    } finally {
      setLoadingRetornos(false);
    }
  };

  const form = useForm<RetornoFormData>({
    resolver: zodResolver(retornoFormSchema),
    defaultValues: {
      numero: '',
      peso: 0,
      observaciones: '',
      idClasificacion: clasificacionId,
    },
    mode: 'onChange',
  });

  // Cargar retornos existentes al inicializar
  useEffect(() => {
    cargarRetornosExistentes();
  }, [clasificacionId]);

  // Actualizar el número automáticamente cuando se cargan los retornos
  useEffect(() => {
    if (!loadingRetornos) {
      const numeroGenerado = generarNumeroRetorno();
      form.setValue('numero', numeroGenerado);
    }
  }, [retornosExistentes, loadingRetornos, form]);

  const onSubmit = async (data: RetornoFormData) => {
    try {
      // Generar el número si no está presente
      const numeroRetorno = data.numero || generarNumeroRetorno();
      
      const retornoData = {
        numero: numeroRetorno,
        peso: data.peso,
        observaciones: data.observaciones,
        fechaRegistro: new Date().toISOString(),
        idClasificacion: clasificacionId,
      };
      
      await RetornosService.create(retornoData);
      toast.success('Retorno creado correctamente');
      form.reset();
      // Recargar retornos existentes después de crear uno nuevo
      await cargarRetornosExistentes();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || 'Error al crear el retorno');
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    loadingRetornos,
    numeroGenerado: generarNumeroRetorno(),
  };
}; 