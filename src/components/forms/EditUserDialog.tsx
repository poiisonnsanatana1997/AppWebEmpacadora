import { useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import usersService, { User } from '@/api/users';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, UserCheck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  phoneNumber: z.string().min(1, "El teléfono es obligatorio"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onSuccess?: (user: User) => void;
}

export function EditUserDialog({ open, onOpenChange, user, onSuccess }: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      phoneNumber: user.phoneNumber,
      isActive: user.isActive,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      setError(null);
      const updatedUser = await usersService.updateUser(user.id, values);
      toast.success("Usuario actualizado correctamente");
      onSuccess?.(updatedUser);
      onOpenChange(false);
    } catch (error: any) {
      setError(error.message || "Error al actualizar el usuario");
      toast.error(error.message || "Error al actualizar el usuario");
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Editar Usuario
          </DialogTitle>
          <DialogDescription>
            Modifica la información del usuario y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <Input {...form.register("name")} disabled={isSubmitting} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <Input {...form.register("phoneNumber")} disabled={isSubmitting} />
            </div>
            <div className="flex items-center gap-2">
              <Controller
                name="isActive"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              <span className="text-sm">Usuario activo</span>
            </div>
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
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 