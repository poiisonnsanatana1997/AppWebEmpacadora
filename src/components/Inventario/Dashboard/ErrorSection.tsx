/**
 * Sección de error del dashboard
 */

import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

interface ErrorSectionProps {
  error: string;
  onRetry: () => void;
}

export const ErrorSection: React.FC<ErrorSectionProps> = ({
  error,
  onRetry
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-200 w-full max-w-full overflow-hidden md:p-5 md:mb-5 lg:p-6 lg:mb-6 max-[480px]:p-3 max-[480px]:mb-3 max-[480px]:rounded-xl"
    >
      <div className="flex items-center justify-center h-72 text-red-500 text-center p-4 w-full md:h-96 md:p-8 max-[480px]:h-60 max-[480px]:p-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Error al cargar analytics</h3>
          <p className="text-sm mb-4 max-w-md">{error}</p>
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="mt-4"
          >
            Reintentar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
