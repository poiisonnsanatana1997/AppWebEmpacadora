import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EstadoOrden, OrdenEntradaDto, ProductoDto, ProveedorDto, ESTADO_ORDEN, OrdenEntradaFormData } from '../../types/ordenesEntrada';
import { OrdenesEntradaService } from '../../services/ordenesEntrada.service';
import { ScrollArea } from '../ui/scroll-area';
import { ClipboardList, Package, Hash } from 'lucide-react';
import { Combobox } from '../ui/combobox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  proveedor: z.object({
    id: z.string().min(1, 'Debe seleccionar un proveedor'),
    nombre: z.string()
  }),
  fecha: z.string().min(1, 'Debe seleccionar una fecha'),
  estado: z.enum(['Pendiente', 'Procesando', 'Recibida', 'Cancelada'] as const),
  observaciones: z.string(),
  productos: z.object({
    id: z.string().min(1, 'Debe seleccionar un producto'),
    nombre: z.string()
  })
});

interface OrdenEntradaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orden: OrdenEntradaFormData) => void;
  orden: OrdenEntradaDto | null;
}

export function OrdenEntradaModal({ isOpen, onClose, onSave, orden }: OrdenEntradaModalProps) {
  const [proveedores, setProveedores] = useState<ProveedorDto[]>([]);
  const [productos, setProductos] = useState<ProductoDto[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proveedor: { id: '', nombre: '' },
      fecha: new Date().toISOString().split('T')[0],
      estado: ESTADO_ORDEN.PENDIENTE,
      observaciones: '',
      productos: { id: '', nombre: '' }
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
      if (orden) {
        const fechaFormateada = new Date(orden.fechaEstimada).toISOString().split('T')[0];
        form.reset({
          proveedor: {
            id: orden.proveedor.id.toString(),
            nombre: orden.proveedor.nombre
          },
          fecha: fechaFormateada,
          estado: orden.estado,
          observaciones: orden.observaciones,
          productos: {
            id: orden.producto.id.toString(),
            nombre: orden.producto.nombre
          }
        });
      } else {
        form.reset({
          proveedor: { id: '', nombre: '' },
          fecha: new Date().toISOString().split('T')[0],
          estado: ESTADO_ORDEN.PENDIENTE,
          observaciones: '',
          productos: { id: '', nombre: '' }
        });
      }
    }
  }, [isOpen, orden, form]);

  const cargarDatos = async () => {
    try {
      const [proveedoresData, productosData] = await Promise.all([
        OrdenesEntradaService.obtenerProveedores(),
        OrdenesEntradaService.obtenerProductos()
      ]);
      setProveedores(proveedoresData);
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSave({
      proveedor: {
        id: parseInt(data.proveedor.id),
        nombre: data.proveedor.nombre
      },
      producto: {
        id: parseInt(data.productos.id),
        nombre: data.productos.nombre
      },
      fechaEstimada: data.fecha,
      estado: data.estado as EstadoOrden,
      observaciones: data.observaciones || '',
      fechaRegistro: null,
      fechaRecepcion: null
    });
  };

  const handleSelectProveedor = (id: string) => {
    const proveedor = proveedores.find(p => p.id.toString() === id);
    if (proveedor) {
      form.setValue('proveedor', {
        id: proveedor.id.toString(),
        nombre: proveedor.nombre
      });
    }
  };

  const handleSelectProducto = (id: string) => {
    const productoSeleccionado = productos.find(p => p.id.toString() === id);
    if (productoSeleccionado) {
      form.setValue('productos', {
        id: productoSeleccionado.id.toString(),
        nombre: productoSeleccionado.nombre
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-4">
            <DialogHeader className="space-y-4">
              <div className="flex items-center justify-between pr-6">
                <DialogTitle className="flex items-center gap-2">
                  {orden ? (
                    <>
                      <Package className="h-5 w-5" />
                      Editar Orden
                    </>
                  ) : (
                    <>
                      <ClipboardList className="h-5 w-5" />
                      Nueva Orden
                    </>
                  )}
                </DialogTitle>
                {orden && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    {orden.codigo}
                  </Badge>
                )}
              </div>
              <DialogDescription>
                Complete el formulario con la información de la orden. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                {/* Sección de Información General */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="proveedor.id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Proveedor <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Combobox
                            options={proveedores.map(p => ({
                              value: p.id.toString(),
                              label: p.nombre
                            }))}
                            value={field.value}
                            onValueChange={(value) => {
                              handleSelectProveedor(value);
                              form.trigger('proveedor.id');
                            }}
                            placeholder="Seleccione un proveedor"
                            emptyText="No se encontraron proveedores"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 font-medium" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sección de Producto */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="productos.id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Producto <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Combobox
                            options={productos.map(p => ({
                              value: p.id.toString(),
                              label: p.nombre
                            }))}
                            value={field.value}
                            onValueChange={(value) => {
                              handleSelectProducto(value);
                              form.trigger('productos.id');
                            }}
                            placeholder="Seleccione un producto"
                            emptyText="No se encontraron productos"
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 font-medium" />
                      </FormItem>
                    )}
                  />

                </div>

                {/* Sección de Fecha */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fecha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Fecha estimada de recepción <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            required
                            className="w-full"
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => {
                              field.onChange(e);
                              form.trigger('fecha');
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 font-medium" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sección de Observaciones */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observaciones</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ingrese las observaciones de la orden..."
                            className="min-h-[100px] w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500 font-medium" />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {orden ? 'Guardando' : 'Guardar'}
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