import React from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { ProductoDto } from '@/types/Productos/productos.types';

interface IndicatorsProps {
  productos: ProductoDto[];
  loading?: boolean;
}

export function Indicators({ productos, loading = false }: IndicatorsProps) {
  // Calcular estadísticas
  const totalProductos = productos.length;
  const productosActivos = productos.filter(p => p.activo).length;
  const productosInactivos = totalProductos - productosActivos;
  const precioPromedio = productos.length > 0 
    ? productos.reduce((sum, p) => sum + p.precio, 0) / productos.length 
    : 0;

  const indicators = [
    {
      title: 'Total de Productos',
      value: totalProductos,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Productos Activos',
      value: productosActivos,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Productos Inactivos',
      value: productosInactivos,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Precio Promedio',
      value: new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(precioPromedio),
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
    >
      {indicators.map((indicator, index) => (
        <motion.div
          key={indicator.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`${indicator.bgColor} rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {indicator.title}
              </p>
              <p className={`text-2xl font-bold ${indicator.textColor}`}>
                {indicator.value}
              </p>
            </div>
            <div className={`${indicator.color} p-2 rounded-full`}>
              <indicator.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
