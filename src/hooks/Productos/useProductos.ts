import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductoDto, BaseProductoDto } from '@/types/Productos/productos.types';
import { ProductosService } from '@/services/productos.service';
import { productFormSchema } from '@/schemas/productFormSchema';

export const useProductos = () => {
  const [productos, setProductos] = useState<ProductoDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<ProductoDto | null>(null);

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      codigo: '',
      nombre: '',
      variedad: '',
      unidadMedida: 'kilogramos',
      precio: 0,
      fecha: new Date().toISOString(),
      imagen: '',
      activo: true
    }
  });

  const cargarProductos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ProductosService.obtenerProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOpenModal = useCallback((producto?: ProductoDto) => {
    if (producto) {
      setSelectedProducto(producto);
      form.reset({
        codigo: producto.codigo,
        nombre: producto.nombre,
        variedad: producto.variedad,
        unidadMedida: producto.unidadMedida,
        precio: producto.precio,
        fecha: producto.fechaRegistro,
        imagen: producto.imagen,
        activo: producto.activo
      });
    } else {
      setSelectedProducto(null);
      form.reset();
    }
    setIsModalOpen(true);
  }, [form]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProducto(null);
    form.reset();
  }, [form]);

  const onSubmit = useCallback(async (data: BaseProductoDto) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      if (selectedProducto) {
        await ProductosService.actualizarProducto(selectedProducto.id, formData);
      } else {
        await ProductosService.crearProducto(formData);
      }
      await cargarProductos();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProducto, cargarProductos, handleCloseModal]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await ProductosService.eliminarProducto(id);
      await cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }, [cargarProductos]);

  return {
    productos,
    isLoading,
    isModalOpen,
    selectedProducto,
    form,
    cargarProductos,
    handleOpenModal,
    handleCloseModal,
    onSubmit,
    handleDelete
  };
}; 