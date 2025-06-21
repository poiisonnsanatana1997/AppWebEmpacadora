import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit3, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { UsuarioDto, UsuarioFormData } from '@/types/Usuarios/usuarios.type';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phoneNumber: z.string().min(1, 'El número de teléfono es requerido'),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ActualizarUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UsuarioFormData) => void;
  usuario: UsuarioDto;
}

export const ActualizarUsuarioModal: React.FC<ActualizarUsuarioModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  usuario,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      isActive: true,
    },
  });

  // Efecto para actualizar los valores del formulario cuando cambia el usuario
  useEffect(() => {
    if (isOpen && usuario) {
      form.reset({
        name: usuario.name,
        email: usuario.email,
        phoneNumber: usuario.phoneNumber,
        isActive: usuario.isActive,
      });
    }
  }, [isOpen, usuario, form]);

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await onSubmit({
        ...data,
        username: usuario.username,
        roleId: 0, // TODO: Obtener el roleId del usuario
      } as UsuarioFormData);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-600" />
            Actualizar Usuario
          </DialogTitle>
          <DialogDescription>
            Modifica la información del usuario seleccionado. Los cambios se aplicarán inmediatamente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Estado</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Activar o desactivar el usuario
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Usuario'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 