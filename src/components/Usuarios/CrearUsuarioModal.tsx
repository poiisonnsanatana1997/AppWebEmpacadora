import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UsuarioFormData } from '@/types/Usuarios/usuarios.type';

const formSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phoneNumber: z.string().min(1, 'El número de teléfono es requerido'),
  isActive: z.boolean().optional(),
  roleId: z.number().min(1, 'Debe seleccionar un rol'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface CrearUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UsuarioFormData) => void;
}

export const CrearUsuarioModal: React.FC<CrearUsuarioModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phoneNumber: '',
      isActive: true,
      roleId: 1,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = data;
      await onSubmit(userData as UsuarioFormData);
    } catch (error) {
      console.error('Error al crear usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[500px] mx-auto p-3 sm:p-4 md:p-6 md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            <span className="break-words">Crear Nuevo Usuario</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm md:text-base leading-relaxed">
            Completa la información para crear un nuevo usuario en el sistema. Todos los campos marcados son obligatorios.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Nombre de Usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" className="text-sm sm:text-base" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" className="text-sm sm:text-base" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" className="text-sm sm:text-base" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" className="text-sm sm:text-base" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="text-sm sm:text-base" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-medium">Número de Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" className="text-sm sm:text-base" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base font-medium">Rol</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    value={field.value.toString()}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Seleccione un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Administrador</SelectItem>
                      <SelectItem value="2">Supervisor</SelectItem>
                      <SelectItem value="3">Operador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs sm:text-sm" />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2.5"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando Usuario...
                  </>
                ) : (
                  'Crear Usuario'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 