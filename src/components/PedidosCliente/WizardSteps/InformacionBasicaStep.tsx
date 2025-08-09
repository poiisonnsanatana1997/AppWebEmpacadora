import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, FileText, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { type InformacionBasicaData } from '@/schemas/pedidoClienteWizardSchema';
import { ClienteDTO } from '@/types/Cliente/cliente.types';

interface InformacionBasicaStepProps {
  clientes: ClienteDTO[];
  onClienteChange: (idCliente: number) => void;
  obtenerSucursalesCliente: (idCliente: number) => any[];
}

export const InformacionBasicaStep: React.FC<InformacionBasicaStepProps> = ({
  clientes,
  onClienteChange,
  obtenerSucursalesCliente,
}) => {
  const form = useFormContext<InformacionBasicaData>();

  const handleClienteChange = (idCliente: number) => {
    onClienteChange(idCliente);
  };

  // Asegurar que el pedido siempre se cree como activo
  React.useEffect(() => {
    form.setValue('activo', true);
  }, [form]);

  return (
    <div className="space-y-4">
      {/* Sección Cliente y Sucursal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cliente */}
        <FormField
          control={form.control}
          name="idCliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Cliente *</FormLabel>
              <Select 
                onValueChange={(value) => {
                  const idCliente = Number(value);
                  field.onChange(idCliente);
                  handleClienteChange(idCliente);
                }} 
                value={field.value && field.value > 0 ? field.value.toString() : undefined}
              >
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
          render={({ field }) => {
            const idCliente = form.watch('idCliente');
            const sucursales = obtenerSucursalesCliente(idCliente);
            
            return (
              <FormItem>
                <FormLabel className="text-sm font-medium">Sucursal *</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(Number(value))} 
                  value={field.value && field.value > 0 ? field.value.toString() : undefined}
                  disabled={!idCliente || idCliente === 0 || sucursales.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !idCliente || idCliente === 0
                          ? "Primero selecciona un cliente" 
                          : sucursales.length === 0 
                            ? "No hay sucursales disponibles" 
                            : "Selecciona una sucursal"
                      } />
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
            );
          }}
        />
      </div>

      {/* Sección Estatus y Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estatus */}
        <FormField
          control={form.control}
          name="estatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Estatus *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estatus" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Proceso">En Proceso</SelectItem>
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
              <FormLabel className="text-sm font-medium">Fecha de Embarque</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    field.onChange(date);
                  }}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Observaciones - Ocupa todo el ancho */}
      <FormField
        control={form.control}
        name="observaciones"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Observaciones</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ingresa las observaciones del pedido (opcional)..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}; 