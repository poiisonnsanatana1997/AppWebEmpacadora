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
  const clientesActivos = React.useMemo(() => clientes.filter(c => c.activo), [clientes]);
  

  const handleClienteChange = (idCliente: number) => {
    onClienteChange(idCliente);
  };

  // Función para formatear la información del cliente
  const formatearCliente = (cliente: ClienteDTO) => {
    if (cliente.nombre && cliente.nombre !== cliente.razonSocial) {
      return `${cliente.razonSocial} (${cliente.nombre})`;
    }
    return cliente.razonSocial;
  };

  // Función para formatear la información de la sucursal
  const formatearSucursal = (sucursal: any) => {
    if (sucursal.direccion && sucursal.direccion.trim()) {
      // Limitar la dirección a 40 caracteres para optimizar espacio
      const direccionCorta = sucursal.direccion.length > 40 
        ? sucursal.direccion.substring(0, 40) + '...' 
        : sucursal.direccion;
      return `${sucursal.nombre} - ${direccionCorta}`;
    }
    return sucursal.nombre;
  };

  // Función para formatear cliente en móvil (versión corta)
  const formatearClienteMobile = (cliente: ClienteDTO) => {
    if (cliente.nombre && cliente.nombre !== cliente.razonSocial) {
      // En móvil, mostrar solo la razón social si es muy larga
      return cliente.razonSocial.length > 25 
        ? cliente.razonSocial.substring(0, 25) + '...' 
        : cliente.razonSocial;
    }
    return cliente.razonSocial.length > 25 
      ? cliente.razonSocial.substring(0, 25) + '...' 
      : cliente.razonSocial;
  };

  // Función para formatear sucursal en móvil (versión corta)
  const formatearSucursalMobile = (sucursal: any) => {
    if (sucursal.direccion && sucursal.direccion.trim()) {
      // En móvil, mostrar solo el nombre si la dirección es muy larga
      const direccionCorta = sucursal.direccion.length > 20 
        ? sucursal.direccion.substring(0, 20) + '...' 
        : sucursal.direccion;
      return `${sucursal.nombre} - ${direccionCorta}`;
    }
    return sucursal.nombre.length > 25 
      ? sucursal.nombre.substring(0, 25) + '...' 
      : sucursal.nombre;
  };

  // Asegurar que el pedido siempre se cree como activo
  React.useEffect(() => {
    form.setValue('activo', true);
  }, [form]);

  // Forzar estatus siempre como "Pendiente"
  React.useEffect(() => {
    form.setValue('estatus', 'Pendiente');
  }, [form]);

  return (
    <div className="space-y-4 w-full max-w-full">
      {/* Sección Cliente y Sucursal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-full">
        {/* Cliente */}
        <FormField
          control={form.control}
          name="idCliente"
          render={({ field }) => (
            <FormItem className="w-full">
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
                  <SelectTrigger className="min-h-[44px] sm:min-h-[40px] text-sm w-full max-w-full overflow-hidden">
                    <SelectValue placeholder="Selecciona un cliente (Razón Social)">
                      {field.value && field.value > 0 && (() => {
                        const clienteSeleccionado = clientesActivos.find(c => c.id === field.value);
                        return clienteSeleccionado ? (
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-medium truncate">
                              {formatearCliente(clienteSeleccionado)}
                            </span>
                          </div>
                        ) : undefined;
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" className="max-h-[300px] overflow-y-auto overflow-x-hidden w-[--radix-select-trigger-width] max-w-[100vw]">
                  {clientesActivos.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()} className="py-2">
                      <div className="flex flex-col min-w-0 w-full">
                        <span className="font-medium truncate w-full">{cliente.razonSocial}</span>
                        {cliente.nombre && cliente.nombre !== cliente.razonSocial && (
                          <span className="text-xs text-muted-foreground truncate w-full">
                            {cliente.nombre}
                          </span>
                        )}
                      </div>
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
              <FormItem className="w-full">
                <FormLabel className="text-sm font-medium">Sucursal *</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(Number(value))} 
                  value={field.value && field.value > 0 ? field.value.toString() : undefined}
                  disabled={!idCliente || idCliente === 0 || sucursales.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="min-h-[44px] sm:min-h-[40px] text-sm w-full max-w-full overflow-hidden">
                      <SelectValue placeholder={
                        !idCliente || idCliente === 0
                          ? "Primero selecciona un cliente" 
                          : sucursales.length === 0 
                            ? "No hay sucursales disponibles" 
                            : "Selecciona una sucursal"
                      }>
                        {field.value && field.value > 0 && (() => {
                          const sucursalSeleccionada = sucursales.find(s => s.id === field.value);
                          return sucursalSeleccionada ? (
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className="font-medium truncate">
                                {formatearSucursal(sucursalSeleccionada)}
                              </span>
                            </div>
                          ) : undefined;
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper" className="max-h-[300px] overflow-y-auto overflow-x-hidden w-[--radix-select-trigger-width] max-w-[100vw]">
                    {sucursales.map((sucursal) => (
                      <SelectItem key={sucursal.id} value={sucursal.id.toString()} className="py-2">
                        <div className="flex flex-col min-w-0 w-full">
                          <span className="font-medium truncate w-full">{sucursal.nombre}</span>
                          {sucursal.direccion && sucursal.direccion.trim() && (
                            <span className="text-xs text-muted-foreground truncate w-full">
                              {sucursal.direccion}
                            </span>
                          )}
                        </div>
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

      {/* Sección Fecha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-full">
        {/* Fecha de Embarque */}
        <FormField
          control={form.control}
          name="fechaEmbarque"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-sm font-medium">Fecha de Embarque</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    field.onChange(date);
                  }}
                  className="w-full min-h-[44px] sm:min-h-[40px] text-sm"
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
          <FormItem className="w-full">
            <FormLabel className="text-sm font-medium">Observaciones</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Ingresa las observaciones del pedido (opcional)..."
                className="min-h-[80px] sm:min-h-[60px] text-sm resize-none w-full"
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