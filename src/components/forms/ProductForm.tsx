import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import productsService from "@/api/products";
import { productSchema, type ProductFormData } from "@/schemas/productSchema";
import type { Product } from "@/types/product";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { X, Image as ImageIcon, Package, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ProductFormProps {
  product?: Product | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({ product, open, onClose, onSuccess }: ProductFormProps) {
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

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: "",
      name: "",
      variety: "",
      isActive: true,
      size: "",
      packagingType: "",
      unit: "",
      imageBase64: "",
      data1: "",
      data2: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        code: product.code,
        name: product.name,
        variety: product.variety,
        isActive: product.isActive,
        size: product.size || "",
        packagingType: product.packagingType || "",
        unit: product.unit || "",
        imageBase64: product.imageBase64 || "",
        data1: product.data1 || "",
        data2: product.data2 || "",
      });
      if (product.imageBase64) {
        setPreviewUrl(`data:image/jpeg;base64,${product.imageBase64}`);
      }
    } else {
      form.reset({
        code: "",
        name: "",
        variety: "",
        isActive: true,
        size: "",
        packagingType: "",
        unit: "",
        imageBase64: "",
        data1: "",
        data2: "",
      });
      setPreviewUrl("");
    }
    setSelectedImage(null);
  }, [product, form]);

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
    form.setValue("imageBase64", "");
  };

  const onSubmit = form.handleSubmit(async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      
      // Agregar campos con nombres en PascalCase según el DTO del backend
      formData.append("Code", data.code ?? "");
      formData.append("Name", data.name ?? "");
      formData.append("Variety", data.variety ?? "");
      formData.append("Size", data.size ?? "");
      formData.append("PackagingType", data.packagingType ?? "");
      formData.append("Unit", data.unit ?? "");
      formData.append("Data1", data.data1 ?? "");
      formData.append("Data2", data.data2 ?? "");
      formData.append("IsActive", data.isActive.toString());

      // Agregar la imagen si se seleccionó una nueva
      if (selectedImage) {
        formData.append("Image", selectedImage);
        console.log("Agregando imagen:", selectedImage.name);
      } else if (product?.imageBase64) {
        // Si no hay nueva imagen pero hay una imagen existente, la mantenemos
        formData.append("Image", product.imageBase64);
        console.log("Manteniendo imagen existente");
      }

      // Log del FormData antes de enviar
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      if (product) {
        console.log("Actualizando producto:", product.id);
        const response = await productsService.updateProduct(product.id, formData);
        console.log("Respuesta de actualización:", response);
        toast.success("Producto actualizado correctamente");
      } else {
        console.log("Creando nuevo producto");
        const response = await productsService.createProduct(formData);
        console.log("Respuesta de creación:", response);
        toast.success("Producto creado correctamente");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error detallado:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      console.error("Estado del error:", error.response?.status);
      console.error("Headers de la respuesta:", error.response?.headers);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          "Error al guardar el producto";
      
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
                {product ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
              <DialogDescription>
                Complete el formulario con la información del producto. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Información Básica</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Código *</FormLabel>
                              <FormControl>
                                <Input placeholder="Código del producto" {...field} />
                              </FormControl>
                              <FormDescription>
                                Solo letras mayúsculas, números y guiones
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre *</FormLabel>
                              <FormControl>
                                <Input placeholder="Nombre del producto" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="variety"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Variedad *</FormLabel>
                              <FormControl>
                                <Input placeholder="Variedad del producto" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Características</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="size"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tamaño</FormLabel>
                              <FormControl>
                                <Input placeholder="Tamaño del producto" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="packagingType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Empaque</FormLabel>
                              <FormControl>
                                <Input placeholder="Tipo de empaque" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unidad</FormLabel>
                              <FormControl>
                                <Input placeholder="Unidad de medida" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
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
                          <div className="flex flex-col items-center gap-2 py-8">
                            <ImageIcon className="h-12 w-12 text-gray-400" />
                            <div className="text-sm text-gray-600">
                              {isDragActive ? (
                                <p>Suelta la imagen aquí...</p>
                              ) : (
                                <p>
                                  Arrastra y suelta una imagen aquí, o{" "}
                                  <span className="text-primary">haz clic para seleccionar</span>
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG o GIF hasta 5MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Información Adicional</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="data1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dato Adicional 1</FormLabel>
                              <FormControl>
                                <Input placeholder="Dato adicional 1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="data2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dato Adicional 2</FormLabel>
                              <FormControl>
                                <Input placeholder="Dato adicional 2" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Estado</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          {field.value ? "Producto activo" : "Producto inactivo"}
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
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
                        {product ? "Actualizando..." : "Creando..."}
                      </>
                    ) : (
                      product ? "Actualizar Producto" : "Crear Producto"
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