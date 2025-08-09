import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// Input removed - not used
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
// Calendar component removed - using date input instead
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PackagePlus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { pedidoClienteFormSchema, type PedidoClienteFormData } from '@/schemas/pedidoClienteFormSchema';
import type { CreatePedidoClienteDTO } from '@/types/PedidoCliente/pedidoCliente.types';

interface CrearPedidoClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePedidoClienteDTO) => Promise<void>;
  loading?: boolean;
}

export const CrearPedidoClienteModal: React.FC<CrearPedidoClienteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

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

  const handleSubmit = async (data: PedidoClienteFormData) => {
    try {
      const createData: CreatePedidoClienteDTO = {
        observaciones: data.observaciones,
        estatus: data.estatus,
        fechaEmbarque: data.fechaEmbarque,
        idSucursal: data.idSucursal,
        idCliente: data.idCliente,
        fechaRegistro: new Date(),
        activo: data.activo,
        ordenes: [], // Array vacío de órdenes - se pueden agregar después
      };

      await onSubmit(createData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error al crear pedido cliente:', error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  // Datos mock para clientes y sucursales (en producción vendrían de la API)
  const clientes = [
    { id: 1, nombre: 'Cliente A', razonSocial: 'Empresa A S.A.' },
    { id: 2, nombre: 'Cliente B', razonSocial: 'Empresa B S.A.' },
    { id: 3, nombre: 'Cliente C', razonSocial: 'Empresa C S.A.' },
  ];

  const sucursales = [
    { id: 1, nombre: 'Sucursal Central', direccion: 'Av. Principal 123' },
    { id: 2, nombre: 'Sucursal Norte', direccion: 'Calle Norte 456' },
    { id: 3, nombre: 'Sucursal Sur', direccion: 'Calle Sur 789' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackagePlus className="h-5 w-5" />
            Crear Nuevo Pedido Cliente
          </DialogTitle>
          <DialogDescription>
            Completa la información para crear un nuevo pedido de cliente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Cliente */}
            <FormField
              control={form.control}
              name="idCliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id.toString()}>
                          {cliente.razonSocial}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sucursal */}
            <FormField
              control={form.control}
              name="idSucursal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una sucursal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sucursales.map((sucursal) => (
                        <SelectItem key={sucursal.id} value={sucursal.id.toString()}>
                          {sucursal.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estatus */}
            <FormField
              control={form.control}
              name="estatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estatus *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estatus" />
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

            {/* Fecha de Embarque */}
            <FormField
              control={form.control}
              name="fechaEmbarque"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Embarque</FormLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                                                     {field.value ? (
                             format(field.value, "PPP")
                           ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                                         <PopoverContent className="w-auto p-0" align="start">
                       <div className="p-3">
                         <input
                           type="date"
                           value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                           onChange={(e) => {
                             const date = e.target.value ? new Date(e.target.value) : undefined;
                             field.onChange(date);
                             setCalendarOpen(false);
                           }}
                           className="w-full p-2 border rounded"
                         />
                       </div>
                     </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observaciones */}
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa las observaciones del pedido..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado Activo */}
            <FormField
              control={form.control}
              name="activo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Estado Activo</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      El pedido estará disponible para su gestión
                    </div>
                  </div>
                                     <FormControl>
                     <Switch
                       checked={field.value}
                       onChange={(e) => field.onChange(e.target.checked)}
                     />
                   </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !form.formState.isValid}>
                {loading ? 'Creando...' : 'Crear Pedido'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 