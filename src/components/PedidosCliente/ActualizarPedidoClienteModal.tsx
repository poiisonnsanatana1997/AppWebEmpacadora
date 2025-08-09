import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Building, Calendar, Clock, Package } from 'lucide-react';
import { format } from 'date-fns';
import type { PedidoClienteResponseDTO, UpdatePedidoClienteDTO } from '@/types/PedidoCliente/pedidoCliente.types';

// Schema simplificado solo para estatus
import { z } from 'zod';

const actualizarEstatusSchema = z.object({
  estatus: z.enum(['Pendiente', 'En Proceso', 'Completado', 'Cancelado']),
});

type ActualizarEstatusData = z.infer<typeof actualizarEstatusSchema>;

interface ActualizarPedidoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: UpdatePedidoClienteDTO) => Promise<void>;
  pedido: PedidoClienteResponseDTO | null;
  loading?: boolean;
}

export const ActualizarPedidoClienteModal: React.FC<ActualizarPedidoClienteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  pedido,
  loading = false,
}) => {
  const form = useForm<ActualizarEstatusData>({
    resolver: zodResolver(actualizarEstatusSchema),
    defaultValues: {
      estatus: 'Pendiente',
    },
    mode: 'onChange',
  });

  // Actualizar formulario cuando cambie el pedido
  useEffect(() => {
    if (pedido) {
      form.reset({
        estatus: pedido.estatus as 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado',
      });
    }
  }, [pedido, form]);

  const handleSubmit = async (data: ActualizarEstatusData) => {
    if (!pedido) return;

    try {
      const updateData: UpdatePedidoClienteDTO = {
        estatus: data.estatus,
        fechaModificacion: new Date(),
      };

      await onSubmit(pedido.id, updateData);
      onClose();
    } catch (error) {
      console.error('Error al actualizar estatus del pedido cliente:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Los datos de cliente y sucursal ya vienen en el DTO como strings
  // No se pueden editar desde este modal

  if (!pedido) return null;

  const getStatusBadge = (estatus: string) => {
    const statusConfig = {
      'Pendiente': { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      'En Proceso': { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800' },
      'Completado': { variant: 'secondary' as const, className: 'bg-green-100 text-green-800' },
      'Cancelado': { variant: 'secondary' as const, className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[estatus as keyof typeof statusConfig] || statusConfig['Pendiente'];

    return (
      <Badge variant={config.variant} className={config.className}>
        {estatus}
      </Badge>
    );
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Fecha inválida';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Cambiar Estatus del Pedido #{pedido.id}
          </DialogTitle>
          <DialogDescription>
            Solo puedes cambiar el estatus del pedido. Los demás campos son de solo lectura.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Pedido (solo lectura) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Información del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Cliente</label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{pedido?.cliente || 'No disponible'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Sucursal</label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{pedido?.sucursal || 'No disponible'}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{formatDate(pedido?.fechaRegistro || '')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Fecha de Embarque</label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {pedido?.fechaEmbarque ? formatDate(pedido.fechaEmbarque) : 'No definida'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Observaciones</label>
                <div className="p-3 border rounded-md bg-gray-50">
                  <p className="text-sm whitespace-pre-wrap">{pedido?.observaciones || 'Sin observaciones'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario para cambiar estatus */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Cambiar Estatus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Estatus Actual */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Estatus Actual</label>
                    <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                      {getStatusBadge(pedido?.estatus || 'Pendiente')}
                    </div>
                  </div>

                  {/* Nuevo Estatus */}
                  <FormField
                    control={form.control}
                    name="estatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nuevo Estatus *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un nuevo estatus" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="En Proceso">En Proceso</SelectItem>
                            <SelectItem value="Completado">Completado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || !form.formState.isValid}>
                  {loading ? 'Actualizando...' : 'Cambiar Estatus'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 