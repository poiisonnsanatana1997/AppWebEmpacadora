/**
 * Header del dashboard de analytics
 */

import React from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onActualizarTodo: () => void;
  isRefreshingAll: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onActualizarTodo,
  isRefreshingAll
}) => {
  return (
    <div className="flex justify-between items-center mb-4 flex-wrap gap-3 w-full md:mb-5 lg:mb-6 max-[480px]:mb-3 max-[480px]:gap-2 max-[480px]:flex-col max-[480px]:items-start">
      <div className="flex items-center gap-2 flex-1 min-w-0 md:gap-3 max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-1">
        <BarChart3 size={24} color="#6366f1" />
        <div>
          <h2 className="text-xl font-semibold text-gray-800 m-0 leading-tight md:text-2xl max-[480px]:text-lg">
            Dashboard Analytics
          </h2>
          <p className="text-xs text-gray-500 m-0 mt-1 leading-snug md:text-sm max-[480px]:text-xs">
            Análisis detallado del inventario
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap flex-shrink-0 md:gap-3 max-[480px]:w-full max-[480px]:justify-end max-[480px]:mt-2">
        <Button
          onClick={onActualizarTodo}
          variant="outline"
          size="sm"
          disabled={isRefreshingAll}
          className="flex items-center gap-2"
        >
          <RefreshCw 
            size={16} 
            className={isRefreshingAll ? 'animate-spin' : ''} 
          />
          {isRefreshingAll ? 'Actualizando...' : 'Actualizar Todo'}
        </Button>
      </div>
    </div>
  );
};
