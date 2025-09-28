import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Building2, Plus } from 'lucide-react';

interface TableHeaderProps {
  onNewClienteClick: () => void;
}

/**
 * Componente TableHeader
 * Muestra el encabezado de la tabla de clientes con título y botones de acción
 * @param onNewClienteClick - Función para manejar la creación de nuevos clientes
 */
export function TableHeader({ onNewClienteClick }: TableHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 border-b border-gray-200 bg-gray-50"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold text-gray-900 flex items-center gap-2"
        >
          <Building2 className="w-6 h-6 text-blue-700" />
          Lista de Clientes
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <Button 
            onClick={onNewClienteClick}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}