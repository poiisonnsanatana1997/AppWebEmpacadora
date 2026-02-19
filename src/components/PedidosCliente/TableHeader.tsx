import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface TableHeaderProps {
  loading?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  loading = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50"
    >
      <div className="flex items-center justify-between gap-3">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700 flex-shrink-0" strokeWidth={2} />
          <span className="truncate">Pedidos Cliente</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0"
        >
          <Link to="/pedidos-cliente/crear">
            <Button
              disabled={loading}
              aria-label="Crear nuevo pedido"
              size="sm"
              className="h-9 sm:h-10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
                  <span className="hidden sm:inline">Cargando...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Nuevo Pedido</span>
                  <span className="sm:hidden">Nuevo</span>
                </>
              )}
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};
