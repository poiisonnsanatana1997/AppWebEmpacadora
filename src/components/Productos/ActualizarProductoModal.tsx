import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProductoModal } from '@/hooks/Productos/useProductoModal';
import { ProductoDto, BaseProductoDto } from '@/types/Productos/productos.types';
import { ImageUploader } from './ImageUploader';
import { useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import { toast } from 'sonner';

interface ActualizarProductoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BaseProductoDto) => Promise<void>;
  producto: ProductoDto;
}

export function ActualizarProductoModal({
  isOpen,
  onClose,
  onSubmit,
  producto
}: ActualizarProductoModalProps) {
  const { form, previewImage, setPreviewImage } = useProductoModal();

  // Efecto para inicializar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && producto) {
      form.reset({
        codigo: producto.codigo,
        nombre: producto.nombre,
        variedad: producto.variedad,
        unidadMedida: producto.unidadMedida,
        precio: producto.precio,
        fecha: producto.fechaRegistro.split('T')[0],
        activo: producto.activo,
        imagen: producto.imagen
      });
      setPreviewImage(producto.imagen);
    }
  }, [isOpen, producto, form, setPreviewImage]);

  const handleSubmit = async (data: BaseProductoDto) => {
    try {
      await onSubmit(data);
      toast.success('Producto actualizado correctamente');
      await onClose();
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      toast.error('Error al actualizar el producto');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-blue-600" />
                Actualizar Producto
              </DialogTitle>
              <DialogDescription>
                Modifica los datos del producto seleccionado. Los cambios se aplicarán inmediatamente. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Columna Izquierda: Imagen */}
                  <div className="flex flex-col items-center gap-4">
                    <FormField
                      control={form.control}
                      name="imagen"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Imagen del Producto *</FormLabel>
                          <FormControl>
                            <ImageUploader
                              onImageSelect={(image) => {
                                field.onChange(image);
                                setPreviewImage(image);
                              }}
                              previewImage={previewImage}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Columna Derecha: Campos */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="codigo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código *</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="Código del producto" {...field} />
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
                            <Input type="text" placeholder="Nombre del producto" {...field} />
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
                            <Input type="text" placeholder="Variedad del producto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unidadMedida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unidad de Medida *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione una unidad de medida" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kilogramos">Kilogramos</SelectItem>
                              <SelectItem value="caja">Caja</SelectItem>
                              <SelectItem value="individual">Individual</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <NumericFormat
                              customInput={Input}
                              thousandSeparator=","
                              decimalSeparator="."
                              prefix="$"
                              decimalScale={2}
                              fixedDecimalScale
                              value={field.value || ''}
                              onValueChange={(values) => {
                                field.onChange(values.floatValue || 0);
                              }}
                              placeholder="0.00"
                            />
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
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Guardar Cambios
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