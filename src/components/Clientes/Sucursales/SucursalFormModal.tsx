import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, MapPin, Phone, Mail, User, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { ScrollArea } from '../../ui/scroll-area';
import { CreateSucursalDTO, UpdateSucursalDTO, SucursalDTO } from '../../../types/Sucursales/sucursales.types';
import { crearSucursalSchema, actualizarSucursalSchema, type CrearSucursalFormData, type ActualizarSucursalFormData } from '../../../schemas/sucursalFormSchema';

interface SucursalFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sucursal?: SucursalDTO | null; // null = crear, objeto = editar
  clienteId?: number;
  clienteNombre?: string;
  onSubmit: (data: CreateSucursalDTO | UpdateSucursalDTO) => Promise<void>;
  loading?: boolean;
}

export const SucursalFormModal: React.FC<SucursalFormModalProps> = ({
  open,
  onOpenChange,
  sucursal,
  clienteId,
  clienteNombre,
  onSubmit,
  loading = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isEditing = !!sucursal;

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determinar schema y tipo basado en si estamos editando o creando
  const schema = isEditing ? actualizarSucursalSchema : crearSucursalSchema;
  const form = useForm<CrearSucursalFormData | ActualizarSucursalFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      direccion: '',
      encargadoAlmacen: '',
      telefono: '',
      correo: '',
      activo: true,
    },
    mode: 'onChange',
  });

  // Actualizar valores del formulario cuando cambie la sucursal
  useEffect(() => {
    if (sucursal && isEditing) {
      form.reset({
        nombre: sucursal.nombre,
        direccion: sucursal.direccion,
        telefono: sucursal.telefono,
        encargadoAlmacen: sucursal.encargadoAlmacen || '',
        correo: sucursal.correo || '',
        activo: sucursal.activo,
      });
    } else {
      form.reset({
        nombre: '',
        direccion: '',
        encargadoAlmacen: '',
        telefono: '',
        correo: '',
        activo: true,
      });
    }
  }, [sucursal, isEditing, form]);

  const handleSubmit = async (data: CrearSucursalFormData | ActualizarSucursalFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        const updateData: UpdateSucursalDTO = {
          nombre: data.nombre,
          direccion: data.direccion,
          telefono: data.telefono,
          encargadoAlmacen: data.encargadoAlmacen || undefined,
          correo: data.correo || undefined,
          activo: data.activo,
        };
        await onSubmit(updateData);
      } else {
        const createData: CreateSucursalDTO = {
          nombre: data.nombre,
          direccion: data.direccion,
          encargadoAlmacen: data.encargadoAlmacen || undefined,
          telefono: data.telefono,
          correo: data.correo || undefined,
          activo: data.activo,
          idCliente: clienteId!,
        };
        await onSubmit(createData);
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error al procesar sucursal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !loading) {
      form.reset();
      onOpenChange(false);
    }
  };

  const title = isEditing ? `Editar Sucursal: ${sucursal?.nombre}` : 'Nueva Sucursal';
  const description = isEditing 
    ? 'Modifica la información de la sucursal seleccionada.'
    : `Crear una nueva sucursal para ${clienteNombre}`;
  const submitText = isSubmitting || loading 
    ? (isEditing ? 'Actualizando...' : 'Creando...') 
    : (isEditing ? 'Actualizar Sucursal' : 'Crear Sucursal');

  // Contenido del formulario
  const formContent = (
    <ScrollArea className={isMobile ? "max-h-[70vh]" : "max-h-[60vh]"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-1">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Nombre de la Sucursal *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Sucursal Centro"
                    {...field}
                    disabled={isSubmitting || loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dirección */}
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dirección *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Av. Principal #123, Col. Centro"
                    {...field}
                    disabled={isSubmitting || loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono *
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: (555) 123-4567"
                    {...field}
                    disabled={isSubmitting || loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Encargado de Almacén */}
          <FormField
            control={form.control}
            name="encargadoAlmacen"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Encargado de Almacén
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Juan Pérez"
                    {...field}
                    disabled={isSubmitting || loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Correo */}
          <FormField
            control={form.control}
            name="correo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Correo Electrónico
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Ej: sucursal@empresa.com"
                    {...field}
                    disabled={isSubmitting || loading}
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Sucursal Activa</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Determina si la sucursal está disponible para operaciones
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting || loading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ScrollArea>
  );

  // Footer con botones
  const footerContent = (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Button
        type="button"
        variant="outline"
        onClick={handleClose}
        disabled={isSubmitting || loading}
        className="flex-1 sm:flex-none"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        onClick={form.handleSubmit(handleSubmit)}
        disabled={isSubmitting || loading || !form.formState.isValid}
        className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
      >
        {submitText}
      </Button>
    </div>
  );

  // PROPUESTA 5: Drawer para móvil
  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="fixed bottom-0 left-0 right-0 top-auto h-[85vh] rounded-t-xl border-0 p-0">
          {/* Header móvil */}
          <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={isSubmitting || loading}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="flex-1 overflow-hidden">
            {formContent}
          </div>

          {/* Footer móvil */}
          <div className="sticky bottom-0 z-10 bg-white border-t px-4 py-3">
            {footerContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // PROPUESTA 1: Modal tradicional para desktop
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {formContent}

        <DialogFooter className="gap-2">
          {footerContent}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
