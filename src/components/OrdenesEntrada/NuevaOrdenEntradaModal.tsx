import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EstadoOrden, ProductoDto, ProveedorDto, ESTADO_ORDEN, OrdenEntradaFormData } from '../../types/OrdenesEntrada/ordenesEntrada.types';
import { OrdenesEntradaService } from '../../services/ordenesEntrada.service';
import { ScrollArea } from '../ui/scroll-area';
import { Plus } from 'lucide-react';
import { Combobox } from '../ui/combobox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from '../ui/textarea';
import { ordenEntradaFormSchema, OrdenEntradaFormSchema } from '../../schemas/ordenEntradaFormSchema';
import { getTodayDateString, getMexicoLocalISOStringRobust } from '../../utils/dateUtils';


interface NuevaOrdenEntradaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (orden: OrdenEntradaFormData) => void;
}

/**
 * Componente modal para crear una nueva orden de entrada
 * Permite seleccionar proveedor, producto, fecha y agregar observaciones
 */
export function NuevaOrdenEntradaModal({ isOpen, onClose, onSave }: NuevaOrdenEntradaModalProps) {
  const [proveedores, setProveedores] = useState<ProveedorDto[]>([]);
  const [productos, setProductos] = useState<ProductoDto[]>([]);

  const form = useForm<OrdenEntradaFormSchema>({
    resolver: zodResolver(ordenEntradaFormSchema),
    defaultValues: {
      proveedor: { id: '', nombre: '' },
      fecha: getTodayDateString(),
      estado: ESTADO_ORDEN.PENDIENTE,
      observaciones: '',
      productos: { id: '', nombre: '', codigo: '', variedad: '' }
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (isOpen) {
      cargarDatos();
      form.reset({
        proveedor: { id: '', nombre: '' },
        fecha: getTodayDateString(),
        estado: ESTADO_ORDEN.PENDIENTE,
        observaciones: '',
        productos: { id: '', nombre: '', codigo: '', variedad: '' }
      });
    }
  }, [isOpen, form]);

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

  const onSubmit = (data: OrdenEntradaFormSchema) => {
    onSave({
      proveedor: {
        id: parseInt(data.proveedor.id),
        nombre: data.proveedor.nombre
      },
      producto: {
        id: parseInt(data.productos.id),
        nombre: data.productos.nombre,
        codigo: data.productos.codigo,
        variedad: data.productos.variedad
      },
      fechaEstimada: data.fecha,
      estado: data.estado as EstadoOrden,
      observaciones: data.observaciones || '',
      fechaRegistro: getMexicoLocalISOStringRobust(),
      fechaRecepcion: null,
      usuarioRegistro: '',
      usuarioRecepcion: null
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
        nombre: productoSeleccionado.nombre,
        codigo: productoSeleccionado.codigo,
        variedad: productoSeleccionado.variedad
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
                  <Plus className="h-5 w-5 text-green-600" />
                  Nueva Orden
                </DialogTitle>
              </div>
              <DialogDescription>
                Completa la información para crear una nueva orden de entrada en el sistema. Todos los campos marcados con * son obligatorios.
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
                              label: `${p.codigo} - ${p.nombre} - ${p.variedad}`
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
                            min={getTodayDateString()}
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
                    Guardar
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