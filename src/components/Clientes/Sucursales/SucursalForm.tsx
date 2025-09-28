import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form';
import { Switch } from '../../ui/switch';
import { DialogFooter } from '../../ui/dialog';
import { Loader2 } from 'lucide-react';
import { crearSucursalSchema, actualizarSucursalSchema, CrearSucursalFormData, ActualizarSucursalFormData } from '../../../schemas/sucursalFormSchema';
import { SucursalDTO } from '../../../types/Sucursales/sucursales.types';

interface SucursalFormProps {
  sucursal?: SucursalDTO | null;
  clienteNombre?: string;
  onSubmit: (data: CrearSucursalFormData | ActualizarSucursalFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const SucursalForm: React.FC<SucursalFormProps> = ({
  sucursal,
  clienteNombre,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const isEditing = !!sucursal;
  const schema = isEditing ? actualizarSucursalSchema : crearSucursalSchema;

  const form = useForm<CrearSucursalFormData | ActualizarSucursalFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: sucursal?.nombre || '',
      direccion: sucursal?.direccion || '',
      encargadoAlmacen: sucursal?.encargadoAlmacen || '',
      telefono: sucursal?.telefono || '',
      correo: sucursal?.correo || '',
      activo: isEditing ? (sucursal?.activo ?? true) : true,
    }
  });

  const handleFormSubmit = (data: CrearSucursalFormData | ActualizarSucursalFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Nombre de la Sucursal *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Sucursal Centro" {...field} className="h-9 text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Teléfono *</FormLabel>
                <FormControl>
                  <Input 
                    type="tel" 
                    placeholder="Ej: 5551234567" 
                    {...field} 
                    className="h-9 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Dirección *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Av. Principal #123, Col. Centro" {...field} className="h-9 text-sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="encargadoAlmacen"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Encargado de Almacén</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Juan Pérez" {...field} className="h-9 text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Correo Electrónico</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Ej: sucursal@empresa.com" {...field} className="h-9 text-sm" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Campo activo solo en modo edición */}
        {isEditing && (
          <FormField
            control={form.control}
            name="activo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">Estado de la Sucursal</FormLabel>
                  <div className="text-xs text-muted-foreground">
                    {field.value ? 'La sucursal está activa y disponible' : 'La sucursal está inactiva'}
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="h-9 text-sm"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="h-9 text-sm"
          >
            {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {isEditing ? 'Actualizar Sucursal' : 'Crear Sucursal'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
