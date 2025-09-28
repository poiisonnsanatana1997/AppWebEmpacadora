/**
 * Sección de indicadores del dashboard
 */

import React from 'react';
import { motion } from 'motion/react';
import { Scale, Package, XCircle } from 'lucide-react';
import type { IndicadoresInventarioDTO } from '@/types/Inventario/inventario.types';
import { formatearPesoInteligente, formatearNumero } from '@/utils/formatters';

interface IndicatorsSectionProps {
  indicadores?: IndicadoresInventarioDTO | null;
  loading?: boolean;
}

interface IndicatorCardProps {
  icon: React.ReactNode;
  value: string | React.ReactNode;
  label: string;
  color: string;
  delay: number;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({
  icon,
  value,
  label,
  color,
  delay
}) => (
  <motion.div
    initial={{ opacity: 0, x: -5 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3 transition-all duration-200 min-h-[80px] w-full overflow-hidden hover:border-indigo-200 hover:bg-indigo-50 md:p-5 md:gap-4 md:min-h-[90px] max-[480px]:p-3 max-[480px]:gap-2 max-[480px]:min-h-[70px] max-[480px]:rounded-lg"
  >
    <div 
      className="p-2 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 min-w-[40px] min-h-[40px] md:p-3 md:rounded-xl md:min-w-[48px] md:min-h-[48px] max-[480px]:p-2 max-[480px]:rounded-lg max-[480px]:min-w-[36px] max-[480px]:min-h-[36px]"
      style={{ 
        backgroundColor: `${color}15`,
        color: color
      }}
    >
      {icon}
    </div>
    <div className="flex flex-col gap-1 flex-1">
      <span className="text-xl font-semibold text-slate-700 leading-tight break-words md:text-2xl max-[480px]:text-lg">
        {value}
      </span>
      <span className="text-xs text-slate-500 font-medium leading-snug break-words md:text-sm max-[480px]:text-xs">
        {label}
      </span>
    </div>
  </motion.div>
);

export const IndicatorsSection: React.FC<IndicatorsSectionProps> = ({
  indicadores,
  loading = false
}) => {
  const LoadingSkeleton = () => (
    <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
  );

  return (
    <div className="flex flex-col gap-4 mb-4 w-full md:gap-5 md:mb-5 lg:gap-6 lg:mb-6 max-[480px]:gap-3 max-[480px]:mb-3">
      <div className="grid grid-cols-1 gap-3 w-full min-[480px]:grid-cols-2 md:grid-cols-4 md:gap-4 lg:gap-4 max-[480px]:gap-2">
        {/* Peso Total */}
        <IndicatorCard
          icon={<Scale className="w-5 h-5" />}
          value={loading ? <LoadingSkeleton /> : formatearPesoInteligente(indicadores?.pesoTotalInventario || 0)}
          label="Peso Total"
          color="#6366f1"
          delay={0}
        />

        {/* Peso Total Sin Asignar */}
        <IndicatorCard
          icon={<Package className="w-5 h-5" />}
          value={loading ? <LoadingSkeleton /> : formatearPesoInteligente(indicadores?.pesoTotalSinAsignar || 0)}
          label="Peso Total Sin Asignar"
          color="#f59e0b"
          delay={0.1}
        />

        {/* Tarimas Totales */}
        <IndicatorCard
          icon={<Package className="w-5 h-5" />}
          value={loading ? <LoadingSkeleton /> : formatearNumero((indicadores?.tarimasAsignadas || 0) + (indicadores?.tarimasNoAsignadas || 0))}
          label="Tarimas Totales"
          color="#06b6d4"
          delay={0.2}
        />

        {/* Tarimas No Asignadas */}
        <IndicatorCard
          icon={<XCircle className="w-5 h-5" />}
          value={loading ? <LoadingSkeleton /> : formatearNumero(indicadores?.tarimasNoAsignadas || 0)}
          label="Tarimas No Asignadas"
          color="#ef4444"
          delay={0.3}
        />
      </div>
    </div>
  );
};
