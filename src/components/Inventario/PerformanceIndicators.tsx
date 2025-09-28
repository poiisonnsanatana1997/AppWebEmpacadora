import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Activity, Zap, Clock, Database } from 'lucide-react';

interface PerformanceIndicatorsProps {
  totalRecords: number;
  visibleRecords: number;
  filterStats?: {
    total: number;
    filtered: number;
    reduction: number;
    reductionPercentage: number;
  };
  renderTime?: number;
  memoryUsage?: number;
}

/**
 * Componente para mostrar indicadores de rendimiento
 * Útil para monitorear el comportamiento con grandes volúmenes de datos
 */
export const PerformanceIndicators: React.FC<PerformanceIndicatorsProps> = ({
  totalRecords,
  visibleRecords,
  filterStats,
  renderTime,
  memoryUsage
}) => {
  // Determinar el nivel de carga basado en el número de registros
  const getLoadLevel = (records: number) => {
    if (records < 1000) return { level: 'low', color: 'bg-green-100 text-green-800', icon: '🟢' };
    if (records < 10000) return { level: 'medium', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' };
    if (records < 50000) return { level: 'high', color: 'bg-orange-100 text-orange-800', icon: '🟠' };
    return { level: 'extreme', color: 'bg-red-100 text-red-800', icon: '🔴' };
  };

  const loadLevel = getLoadLevel(totalRecords);

  // Formatear números grandes
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Formatear tiempo de renderizado
  const formatRenderTime = (time?: number) => {
    if (!time) return 'N/A';
    if (time < 16) return `${time.toFixed(1)}ms ⚡`;
    if (time < 50) return `${time.toFixed(1)}ms 🟢`;
    if (time < 100) return `${time.toFixed(1)}ms 🟡`;
    return `${time.toFixed(1)}ms 🔴`;
  };

  // Formatear uso de memoria
  const formatMemoryUsage = (usage?: number) => {
    if (!usage) return 'N/A';
    if (usage < 50) return `${usage.toFixed(1)}MB 🟢`;
    if (usage < 100) return `${usage.toFixed(1)}MB 🟡`;
    if (usage < 200) return `${usage.toFixed(1)}MB 🟠`;
    return `${usage.toFixed(1)}MB 🔴`;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-md">
      {/* Indicador de carga total */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={`flex items-center gap-1 ${loadLevel.color}`}>
              <Database className="h-3 w-3" />
              {formatNumber(totalRecords)} registros
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Carga {loadLevel.level}: {totalRecords.toLocaleString()} registros totales</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Indicador de registros visibles */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {formatNumber(visibleRecords)} visibles
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Registros actualmente renderizados: {visibleRecords.toLocaleString()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Indicador de eficiencia de filtrado */}
      {filterStats && filterStats.reduction > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {filterStats.reductionPercentage}% filtrado
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Filtrado: {filterStats.reduction.toLocaleString()} de {filterStats.total.toLocaleString()} registros ocultos
                <br />
                Eficiencia: {filterStats.reductionPercentage}% de reducción
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Indicador de tiempo de renderizado */}
      {renderTime && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRenderTime(renderTime)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tiempo de renderizado del último frame</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Indicador de uso de memoria */}
      {memoryUsage && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                {formatMemoryUsage(memoryUsage)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Uso estimado de memoria en el navegador</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Indicador de optimización */}
      {totalRecords > 10000 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Virtualizado
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tabla optimizada con virtualización para mejor rendimiento</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
