import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { Loader2, UserPlus, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import usersService, { User } from '@/api/users';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const formSchema = z.object({
  name: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(50, { message: "El nombre no puede tener más de 50 caracteres." })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "El nombre solo puede contener letras y espacios." }),
  username: z.string()
    .min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres." })
    .max(20, { message: "El nombre de usuario no puede tener más de 20 caracteres." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "El nombre de usuario solo puede contener letras, números y guiones bajos." }),
  email: z.string()
    .email({ message: "Por favor ingresa un email válido." })
    .min(5, { message: "El email debe tener al menos 5 caracteres." })
    .max(100, { message: "El email no puede tener más de 100 caracteres." }),
  roleId: z.string({
    required_error: "Por favor selecciona un rol.",
  }),
  password: z.string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .max(50, { message: "La contraseña no puede tener más de 50 caracteres." })
    .regex(passwordRegex, {
      message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.",
    }),
  confirmPassword: z.string(),
  isActive: z.boolean(),
  phoneNumber: z.string()
    .min(1, { message: "El número de teléfono es requerido." })
    .regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Por favor ingresa un número de teléfono válido.",
    }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface NewUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (user: User) => void;
}

export function NewUserForm({ open, onOpenChange, onSuccess }: NewUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      roleId: "3",
      password: "",
      confirmPassword: "",
      isActive: true,
      phoneNumber: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const userData = {
        name: values.name,
        username: values.username,
        email: values.email,
        roleId: Number(values.roleId),
        password: values.password,
        isActive: values.isActive,
        phoneNumber: values.phoneNumber,
      };

      const createdUser = await usersService.createUser(userData);
      
      toast.success("Usuario creado exitosamente");
      onSuccess?.(createdUser);
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error.message || "Ha ocurrido un error al crear el usuario. Por favor, inténtalo de nuevo.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-visible">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Crear Nuevo Usuario
              </DialogTitle>
              <DialogDescription>
                Complete el formulario para crear un nuevo usuario. Todos los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Juan Pérez" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre de usuario *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="juanperez" 
                            {...field} 
                            disabled={isSubmitting}
                          />
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="juan@ejemplo.com" 
                            {...field}
                            type="email"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent position="popper" sideOffset={4} className="z-[9999] w-full min-w-[var(--radix-select-trigger-width)]">
                            <SelectItem value="1">Administrador</SelectItem>
                            <SelectItem value="2">Gerente</SelectItem>
                            <SelectItem value="3">Usuario</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1234567890" 
                            {...field}
                            type="tel"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Formato internacional (ejemplo: +1234567890)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="********" 
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormDescription>
                          Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Contraseña *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="********" 
                            {...field}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Usuario Activo
                          </FormLabel>
                          <FormDescription>
                            Desactiva esta opción para crear un usuario inactivo
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      'Crear Usuario'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 