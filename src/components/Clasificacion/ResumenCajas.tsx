import React from 'react';
import { Package, Loader2, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResumenCajas as ResumenCajasType } from '../../hooks/Clasificacion/useCajasResumen';

interface ResumenCajasProps {
  resumen: ResumenCajasType;
  loading: boolean;
}

const tiposCaja = [
  { key: 'XL', label: 'XL', color: 'bg-gradient-to-r from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
  { key: 'L', label: 'L', color: 'bg-gradient-to-r from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  { key: 'M', label: 'M', color: 'bg-gradient-to-r from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-700' },
  { key: 'S', label: 'S', color: 'bg-gradient-to-r from-orange-500 to-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
];

// Componente para animar números
const AnimatedNumber: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={className}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
};

export const ResumenCajas: React.FC<ResumenCajasProps> = ({ resumen, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2 bg-white/10 lg:bg-white/10 bg-gray-100 lg:text-white text-gray-600 rounded-md backdrop-blur-sm">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-xs">Cargando...</span>
      </div>
    );
  }

  if (resumen.total === 0) {
    return (
      <div className="flex items-center gap-2 p-2 bg-white/10 lg:bg-white/10 bg-gray-100 lg:text-white text-gray-600 rounded-md backdrop-blur-sm">
        <Package className="h-3 w-3" />
        <span className="text-xs">Sin cajas</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 p-2 lg:p-3 bg-white/10 lg:bg-white/10 bg-transparent lg:text-white text-gray-700 rounded-md backdrop-blur-sm">
      {/* Estadísticas responsivas */}
      <div className="flex flex-wrap items-center gap-3 lg:gap-4">
        {tiposCaja.map((tipo) => {
          const cantidad = resumen[tipo.key as keyof Omit<ResumenCajasType, 'total'>] || 0;
          if (cantidad === 0) return null;
          
          return (
            <div key={tipo.key} className="flex items-center gap-2">
              <div className={`w-3 h-3 lg:w-2 lg:h-2 ${tipo.color} rounded-full`}></div>
              <span className="text-sm lg:text-xs font-medium">
                {tipo.label}: <AnimatedNumber value={cantidad} className="text-lg lg:text-sm font-bold" />
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Separador - solo en desktop */}
      <div className="hidden lg:block w-px h-4 bg-white/20"></div>
      
      {/* Total */}
      <div className="flex items-center gap-2">
        <span className="text-sm lg:text-xs font-semibold">Total:</span>
        <span className="text-xl lg:text-sm font-bold">
          <AnimatedNumber value={resumen.total} />
        </span>
        <span className="text-sm lg:text-xs">cajas</span>
      </div>
    </div>
  );
}; 