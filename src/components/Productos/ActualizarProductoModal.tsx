import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Package, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { ProductoApi } from '@/types/product';
import { ProductoFormData } from './types';

const formSchema = z.object({
  codigo: z.string().min(1, 'El código es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  variedad: z.string().min(1, 'La variedad es requerida'),
  unidadMedida: z.string().min(1, 'La unidad de medida es requerida'),
  precio: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  estatus: z.string().min(1, 'El estatus es requerido'),
  activo: z.boolean()
});

interface ActualizarProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: ProductoFormData) => void;
  producto: ProductoApi;
}

export function ActualizarProductoModal({ isOpen, onClose, onSave, producto }: ActualizarProductoModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: producto.codigo,
      nombre: producto.nombre,
      variedad: producto.variedad,
      unidadMedida: producto.unidadMedida,
      precio: producto.precio,
      estatus: producto.estatus,
      activo: producto.activo
    }
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        codigo: producto.codigo,
        nombre: producto.nombre,
        variedad: producto.variedad,
        unidadMedida: producto.unidadMedida,
        precio: producto.precio,
        estatus: producto.estatus,
        activo: producto.activo
      });
    }
  }, [isOpen, producto, form]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      setSelectedImage(acceptedFiles[0]);
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('codigo', data.codigo);
      formData.append('nombre', data.nombre);
      formData.append('variedad', data.variedad);
      formData.append('unidadMedida', data.unidadMedida);
      formData.append('precio', data.precio.toString());
      formData.append('estatus', data.estatus);
      formData.append('activo', data.activo.toString());
      
      if (selectedImage) {
        formData.append('imagen', selectedImage);
      }

      onSave(formData as unknown as ProductoFormData);
      onClose();
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Editar Producto
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="codigo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Código del producto" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nombre del producto" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="variedad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Variedad *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Variedad del producto" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="unidadMedida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unidad de Medida *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Unidad de medida" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="precio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                              placeholder="Precio del producto" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <FormLabel>Imagen del Producto</FormLabel>
                      <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <input {...getInputProps()} />
                        {selectedImage ? (
                          <div className="flex items-center justify-center gap-2">
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="Preview"
                              className="h-20 w-20 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : producto.imagen ? (
                          <div className="flex items-center justify-center gap-2">
                            <img
                              src={producto.imagen}
                              alt="Preview"
                              className="h-20 w-20 object-cover rounded"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage(null);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              Arrastra una imagen o haz clic para seleccionar
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar'
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