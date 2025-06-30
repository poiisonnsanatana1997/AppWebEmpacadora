import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import type { CrearProveedorDto } from '@/types/Proveedores/proveedores.types';
import { useState } from 'react';
import { UserPlus, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { SituacionFiscalUploader } from './SituacionFiscalUploader';

// Schema para el formulario
const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  rfc: z.string().max(13, "Máximo 13 caracteres").optional(),
  telefono: z.string().max(20, "Máximo 20 caracteres").optional(),
  correo: z.string().email("Correo inválido").max(100, "Máximo 100 caracteres").optional().or(z.literal('')),
  direccionFiscal: z.string().max(200, "Máximo 200 caracteres").optional(),
  activo: z.boolean().optional(),
  situacionFiscal: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CrearProveedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CrearProveedorDto) => Promise<void>;
}

export function CrearProveedorModal({
  isOpen,
  onClose,
  onSubmit
}: CrearProveedorModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      rfc: '',
      telefono: '',
      correo: '',
      direccionFiscal: '',
      activo: true,
      situacionFiscal: null
    }
  });

  const handleSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const proveedorData: CrearProveedorDto = {
        nombre: data.nombre,
        rfc: data.rfc || '',
        telefono: data.telefono || '',
        correo: data.correo || '',
        direccionFiscal: data.direccionFiscal || '',
        activo: data.activo ?? true,
        fechaRegistro: new Date().toISOString().split('T')[0],
        situacionFiscal: selectedFile
      };
      await onSubmit(proveedorData);
      form.reset();
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('Error al crear el proveedor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    form.setValue('situacionFiscal', file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-green-600" />
                Nuevo Proveedor
              </DialogTitle>
              <DialogDescription>
                Completa la información para crear un nuevo proveedor en el sistema. Todos los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Columna Izquierda: Información básica */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre *</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Nombre del proveedor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rfc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RFC</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="RFC del proveedor" {...field} />
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
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Teléfono del proveedor" {...field} />
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
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Columna Derecha: Información adicional */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="direccionFiscal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dirección Fiscal</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Dirección fiscal del proveedor" 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="situacionFiscal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Situación Fiscal</FormLabel>
                          <FormControl>
                            <SituacionFiscalUploader file={selectedFile} onFileSelect={(file) => {
                              setSelectedFile(file);
                              form.setValue('situacionFiscal', file);
                            }} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="activo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormLabel>Activo</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Crear Proveedor'}
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

export default CrearProveedorModal; 