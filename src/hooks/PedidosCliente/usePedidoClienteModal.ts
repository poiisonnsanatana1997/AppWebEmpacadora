import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pedidoClienteFormSchema, type PedidoClienteFormData } from '@/schemas/pedidoClienteFormSchema';
import type { PedidoClienteResponseDTO } from '@/types/PedidoCliente/pedidoCliente.types';

export const usePedidoClienteModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<PedidoClienteResponseDTO | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<PedidoClienteFormData>({
    resolver: zodResolver(pedidoClienteFormSchema),
    defaultValues: {
      observaciones: '',
      estatus: 'Pendiente',
      fechaEmbarque: undefined,
      idSucursal: 0,
      idCliente: 0,
      activo: true,
    },
    mode: 'onChange',
  });

  // Abrir modal para crear
  const openCreateModal = useCallback(() => {
    setSelectedPedido(null);
    setIsEditMode(false);
    form.reset({
      observaciones: '',
      estatus: 'Pendiente',
      fechaEmbarque: undefined,
      idSucursal: 0,
      idCliente: 0,
      activo: true,
    });
    setIsModalOpen(true);
  }, [form]);

  // Abrir modal para editar
  const openEditModal = useCallback((pedido: PedidoClienteResponseDTO) => {
    setSelectedPedido(pedido);
    setIsEditMode(true);
    form.reset({
      observaciones: pedido.observaciones,
      estatus: pedido.estatus as 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado',
      fechaEmbarque: pedido.fechaEmbarque ? new Date(pedido.fechaEmbarque) : undefined,
      // Los campos idSucursal e idCliente no se pueden editar desde el modal de actualización
      // ya que ahora vienen como strings en el DTO de respuesta
      idSucursal: 0,
      idCliente: 0,
      activo: pedido.activo,
    });
    setIsModalOpen(true);
  }, [form]);

  // Abrir modal para ver detalles
  const openDetailModal = useCallback((pedido: PedidoClienteResponseDTO) => {
    setSelectedPedido(pedido);
    setIsEditMode(false);
    setIsModalOpen(true);
  }, []);

  // Cerrar modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPedido(null);
    setIsEditMode(false);
    form.reset();
  }, [form]);

  // Validar formulario
  const validateForm = useCallback(async (): Promise<boolean> => {
    try {
      await form.trigger();
      return form.formState.isValid;
    } catch {
      return false;
    }
  }, [form]);

  // Obtener valores del formulario
  const getFormValues = useCallback((): PedidoClienteFormData | null => {
    if (!form.formState.isValid) return null;
    return form.getValues();
  }, [form]);

  return {
    // Estado
    isModalOpen,
    selectedPedido,
    isEditMode,
    form,
    formState: form.formState,

    // Acciones
    openCreateModal,
    openEditModal,
    openDetailModal,
    closeModal,
    validateForm,
    getFormValues,
  };
}; 