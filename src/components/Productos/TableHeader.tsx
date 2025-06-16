import { motion } from 'framer-motion';
import { TableHeaderProps } from './types';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

/**
 * Componente TableHeader
 * @param onNewProductClick - Función para manejar la creación de un nuevo producto
 */
export function TableHeader({ onNewProductClick }: TableHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Package className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Productos</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onNewProductClick}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Button>
      </div>
    </div>
  );
} 