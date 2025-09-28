import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clienteFormSchema, type ClienteFormData } from '../../schemas/clienteFormSchema';
import { CreateClienteDTO } from '../../types/Cliente/cliente.types';

export const useClienteForm = (onSubmit: (data: CreateClienteDTO) => Promise<void>) => {
  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteFormSchema),
    defaultValues: {
      nombre: '',
      razonSocial: '',
      rfc: '',
      telefono: '',
      correo: '',
      representanteComercial: '',
      tipoCliente: '',
      activo: true,
      constanciaFiscal: undefined,
    },
    mode: 'onChange',
  });

  const handleSubmit = async (data: ClienteFormData) => {
    const clienteData: CreateClienteDTO = {
      nombre: data.nombre,
      razonSocial: data.razonSocial,
      rfc: data.rfc,
      telefono: data.telefono,
      correo: data.correo || undefined,
      representanteComercial: data.representanteComercial || undefined,
      tipoCliente: data.tipoCliente || undefined,
      activo: true,
      fechaRegistro: new Date().toISOString(),
      constanciaFiscal: data.constanciaFiscal,
    };

    await onSubmit(clienteData);
  };

  const resetForm = () => {
    form.reset({
      nombre: '',
      razonSocial: '',
      rfc: '',
      telefono: '',
      correo: '',
      representanteComercial: '',
      tipoCliente: '',
      activo: true,
      constanciaFiscal: undefined,
    });
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    resetForm,
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
  };
};
