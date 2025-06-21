import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productFormSchema } from '@/schemas/productFormSchema';
import type { ProductoDto } from '@/types/Productos/productos.types';
import type { ProductFormData } from '@/schemas/productFormSchema';

export const useProductoModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<ProductoDto | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      codigo: '',
      nombre: '',
      variedad: '',
      unidadMedida: '',
      precio: 0,
      fecha: new Date().toISOString().split('T')[0],
      activo: true,
      imagen: ''
    }
  });

  const handleOpenModal = (producto?: ProductoDto) => {
    if (producto) {
      setSelectedProducto(producto);
      setPreviewImage(producto.imagen);
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
    } else {
      setSelectedProducto(null);
      setPreviewImage(null);
      form.reset({
        codigo: '',
        nombre: '',
        variedad: '',
        unidadMedida: '',
        precio: 0,
        fecha: new Date().toISOString().split('T')[0],
        activo: true,
        imagen: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProducto(null);
    setPreviewImage(null);
    form.reset();
  };

  return {
    isModalOpen,
    selectedProducto,
    previewImage,
    setPreviewImage,
    form,
    handleOpenModal,
    handleCloseModal
  };
}; 