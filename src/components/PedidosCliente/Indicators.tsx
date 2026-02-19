// Componente de Indicadores de Pedidos Cliente
// Refactorizado con Tailwind + shadcn/ui
// Incluye: 5 indicadores, tooltips, interactividad, accesibilidad completa

import { motion } from 'motion/react';
import {
  Clock,
  Package,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// Interfaces
// ============================================
interface PedidoClienteStats {
  totalPedidos: number;
  pedidosPendientes: number;
  pedidosEnProceso: number;
  pedidosCompletados: number;
  pedidosCancelados: number;
}

interface IndicatorsProps {
  stats: PedidoClienteStats;
  loading: boolean;
  onFilterByPendientes?: () => void;
  onFilterByEnProceso?: () => void;
  onFilterByCompletados?: () => void;
  onFilterByCancelados?: () => void;
  filtroActivo?: string | null;
}

// Configuración de esquemas de color (minimalista)
// ============================================
const COLOR_SCHEMES = {
  total: {
    icon: 'text-gray-600'
  },
  pending: {
    icon: 'text-orange-600'
  },
  inProgress: {
    icon: 'text-blue-600'
  },
  completed: {
    icon: 'text-green-600'
  },
  canceled: {
    icon: 'text-red-600'
  }
};

// Componente individual de indicador
// ============================================
interface IndicatorCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  tooltip: string;
  colorScheme: keyof typeof COLOR_SCHEMES;
  loading?: boolean;
  onClick?: () => void;
  isActive?: boolean;
  ariaLabel: string;
}

const IndicatorCard = ({
  icon,
  value,
  label,
  tooltip,
  colorScheme,
  loading = false,
  onClick,
  isActive = false,
  ariaLabel
}: IndicatorCardProps) => {
  const scheme = COLOR_SCHEMES[colorScheme];
  const isClickable = !!onClick;

  const cardContent = (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-md transition-all",
        "bg-white border border-gray-200",
        isClickable && "cursor-pointer hover:border-gray-300 hover:shadow-sm",
        isActive && "border-gray-400 bg-gray-50",
        "group"
      )}
      onClick={onClick}
      role={isClickable ? 'button' : 'article'}
      aria-label={ariaLabel}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Icono */}
      <div
        className="flex-shrink-0"
        aria-hidden="true"
      >
        {loading ? (
          <Loader2 className={cn("w-4 h-4 animate-spin", scheme.icon)} />
        ) : (
          <div className={scheme.icon}>
            {icon}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <span
          className="text-xl font-semibold text-gray-900 leading-tight"
          aria-live="polite"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-gray-400 inline" />
              <span className="sr-only">Cargando {label}</span>
            </>
          ) : (
            <>
              {value}
              <span className="sr-only">{label}</span>
            </>
          )}
        </span>
        <span className="text-xs font-medium text-gray-500">
          {label}
        </span>
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Componente Principal: Indicators
// ============================================
/**
 * Componente de indicadores para pedidos de cliente
 * Características:
 * - 5 indicadores: Total, Pendientes, En Proceso, Completados, Cancelados
 * - Tooltips descriptivos en cada indicador
 * - Indicadores clickeables para filtrado rápido
 * - Diseño responsivo (2-5 columnas según viewport)
 * - Accesibilidad completa (ARIA, SR-only, navegación por teclado)
 * - Esquemas de color semánticos
 */
export function Indicators({
  stats,
  loading,
  onFilterByPendientes,
  onFilterByEnProceso,
  onFilterByCompletados,
  onFilterByCancelados,
  filtroActivo
}: IndicatorsProps) {
  return (
    <motion.div
      className={cn(
        "grid gap-3 mb-4 w-full",
        // Mobile: 2 columnas
        "grid-cols-2",
        // Tablet: 3 columnas
        "sm:grid-cols-3",
        // Desktop: 5 columnas
        "lg:grid-cols-5"
      )}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="region"
      aria-label="Indicadores de pedidos de cliente"
    >
      {/* Total de Pedidos */}
      <IndicatorCard
        icon={<Package className="w-4 h-4" strokeWidth={2} />}
        value={stats.totalPedidos}
        label="Total pedidos"
        tooltip="Total de pedidos activos en el sistema, excluyendo los completamente entregados."
        colorScheme="total"
        loading={loading}
        ariaLabel={`Total de ${stats.totalPedidos} pedidos en el sistema`}
      />

      {/* Pedidos Pendientes */}
      <IndicatorCard
        icon={<Clock className="w-4 h-4" strokeWidth={2} />}
        value={stats.pedidosPendientes}
        label="Pendientes"
        tooltip="Pedidos con estatus 'Pendiente' esperando iniciar proceso de surtido. Click para filtrar la tabla."
        colorScheme="pending"
        loading={loading}
        onClick={onFilterByPendientes}
        isActive={filtroActivo === 'Pendiente'}
        ariaLabel={`${stats.pedidosPendientes} pedidos pendientes. Click para filtrar`}
      />

      {/* Pedidos En Proceso */}
      <IndicatorCard
        icon={<Activity className="w-4 h-4" strokeWidth={2} />}
        value={stats.pedidosEnProceso}
        label="En proceso"
        tooltip="Pedidos actualmente en proceso: siendo surtidos, surtidos o embarcados. Click para ver detalles."
        colorScheme="inProgress"
        loading={loading}
        onClick={onFilterByEnProceso}
        isActive={filtroActivo === 'Surtiendo' || filtroActivo === 'Surtido' || filtroActivo === 'Embarcado'}
        ariaLabel={`${stats.pedidosEnProceso} pedidos en proceso. Click para filtrar`}
      />

      {/* Pedidos Completados */}
      <IndicatorCard
        icon={<CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
        value={stats.pedidosCompletados}
        label="Completados"
        tooltip="Pedidos con estatus 'Entregado' que han sido recibidos exitosamente por el cliente. Click para filtrar."
        colorScheme="completed"
        loading={loading}
        onClick={onFilterByCompletados}
        isActive={filtroActivo === 'Entregado'}
        ariaLabel={`${stats.pedidosCompletados} pedidos completados. Click para filtrar`}
      />

      {/* Pedidos Cancelados */}
      <IndicatorCard
        icon={<XCircle className="w-4 h-4" strokeWidth={2} />}
        value={stats.pedidosCancelados}
        label="Cancelados"
        tooltip="Pedidos cancelados por cualquier motivo. Valor alto puede indicar problemas operativos. Click para revisar."
        colorScheme="canceled"
        loading={loading}
        onClick={onFilterByCancelados}
        isActive={filtroActivo === 'Cancelado'}
        ariaLabel={`${stats.pedidosCancelados} pedidos cancelados. Click para filtrar`}
      />
    </motion.div>
  );
}
