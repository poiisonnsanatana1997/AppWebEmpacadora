import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { ProductosService } from "@/services/productos.service";
import { productSchema } from "@/schemas/productSchema";
import type { ProductoApi } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, Image as ImageIcon, Package, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductFormProps {
  producto?: ProductoApi | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({ producto, open, onClose, onSuccess }: ProductFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error("La imagen no puede ser mayor a 5MB");
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  const form = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      codigo: "",
      nombre: "",
      variedad: "",
      unidadMedida: "",
      precio: "",
      imagen: "",
      estatus: "Activo"
    },
  });

  useEffect(() => {
    if (producto) {
      form.reset({
        codigo: producto.codigo,
        nombre: producto.nombre,
        variedad: producto.variedad,
        unidadMedida: producto.unidadMedida,
        precio: producto.precio.toString(),
        estatus: producto.estatus
      });
      if (producto.imagen) {
        setPreviewUrl(producto.imagen);
      }
    } else {
      form.reset({
        codigo: "",
        nombre: "",
        variedad: "",
        unidadMedida: "",
        precio: "",
        estatus: "Activo"
      });
      setPreviewUrl("");
    }
    setSelectedImage(null);
  }, [producto, form]);

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    form.setValue("imagen", "");
  };

  const onSubmit = form.handleSubmit(async (data: any) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("Codigo", data.codigo);
      formData.append("Nombre", data.nombre);
      formData.append("Variedad", data.variedad);
      formData.append("UnidadMedida", data.unidadMedida);
      formData.append("Precio", data.precio);
      formData.append("Estatus", data.estatus);
      if (selectedImage) {
        formData.append("Imagen", selectedImage);
      }

      if (producto) {
        await ProductosService.actualizarProducto(producto.id, formData);
        toast.success("Producto actualizado correctamente");
      } else {
        await ProductosService.crearProducto(formData);
        toast.success("Producto creado correctamente");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Error al guardar el producto";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {producto ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
              <DialogDescription>
                Complete el formulario con la información del producto. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Información Básica</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="codigo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código *</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder="Código del producto"
                              />
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
                              <Input
                                type="text"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder="Nombre del producto"
                              />
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
                              <Input
                                type="text"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder="Variedad del producto"
                              />
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
                            <FormControl>
                              <Input
                                type="text"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder="Unidad de medida"
                              />
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
                                type="text"
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder="Precio del producto"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Imagen del Producto</h3>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
                        ${isDragActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50'
                        }`}
                    >
                      <input {...getInputProps()} />
                      {previewUrl ? (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Vista previa"
                            className="w-full h-48 object-contain rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
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
                      "Guardar"
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

export default ProductForm; 