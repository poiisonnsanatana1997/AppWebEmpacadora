/**
 * Componente PanelReporte
 * Muestra el panel de control para el modo reporte de órdenes de entrada clasificadas
 */

// Importaciones de React y librerías externas
import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

// Importaciones de componentes UI
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Importaciones de iconos
import { 
  FileText, 
  Table, 
  X, 
  Download, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  CheckSquare
} from 'lucide-react';

// Importaciones de tipos
import { PanelReporteProps } from '@/types/Reportes/reporteOrdenesClasificadas.types';

/**
 * Componente PanelReporte
 * Panel flotante que aparece cuando el modo reporte está activo
 * Muestra el estado de la selección y botones de acción
 */
export const PanelReporte: React.FC<PanelReporteProps> = ({
  ordenesSeleccionadas,
  limiteMaximo,
  onGenerarReporte,
  onLimpiarSeleccion,
  cargando = false,
  onSeleccionarTodas,
  onSeleccionarVisibles,
  onSeleccionarPorProveedor,
  onSeleccionarPorFecha,
  ordenesDisponibles = [],
  proveedoresDisponibles = []
}) => {
  
  const seleccionadas = ordenesSeleccionadas.length;
  const porcentaje = (seleccionadas / limiteMaximo) * 100;
  const estaCercaDelLimite = porcentaje >= 80;
  const estaEnLimite = seleccionadas >= limiteMaximo;
  
  // Verificar si hay órdenes disponibles para reporte
  const hayOrdenesDisponibles = ordenesDisponibles && ordenesDisponibles.length > 0;

  // Determinar el color del progreso
  const getProgressColor = () => {
    if (estaEnLimite) return 'bg-red-500';
    if (estaCercaDelLimite) return 'bg-amber-500';
    return 'bg-green-500';
  };

  // Determinar el estado del panel
  const getEstadoPanel = () => {
    if (seleccionadas === 0) return 'vacio';
    if (estaEnLimite) return 'limite';
    if (estaCercaDelLimite) return 'advertencia';
    return 'normal';
  };

  const estadoPanel = getEstadoPanel();

  // Manejar generación de reporte con validación
  const handleGenerarReporte = (formato: 'pdf' | 'excel') => {
    if (seleccionadas === 0) {
      toast.warning('Selecciona al menos una orden para generar el reporte');
      return;
    }

    if (seleccionadas > limiteMaximo) {
      toast.error(`Máximo ${limiteMaximo} órdenes por reporte`);
      return;
    }

    if (!hayOrdenesDisponibles) {
      toast.error('No hay órdenes disponibles para generar el reporte. Verifica que hay órdenes clasificadas.');
      return;
    }

    onGenerarReporte(formato);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`
        border rounded-md p-2 sm:p-3 mb-3 shadow-sm
        ${estadoPanel === 'limite' ? 'bg-red-50/50 border-red-200/50' : 
          estadoPanel === 'advertencia' ? 'bg-amber-50/50 border-amber-200/50' : 
          'bg-gray-50/50 border-gray-200/50'}
      `}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Reporte
          </span>
          <Badge variant="outline" className="text-xs h-5">
            {seleccionadas}/{limiteMaximo}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLimpiarSeleccion}
                  disabled={seleccionadas === 0 || cargando}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Limpiar selección</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Barra de progreso sutil */}
      {seleccionadas > 0 && (
        <div className="mb-2">
          <Progress 
            value={porcentaje} 
            className="h-1"
          />
        </div>
      )}

      {/* Mensajes de estado sutiles */}
      {estadoPanel === 'advertencia' && (
        <div className="text-xs text-amber-600 mb-2">
          Cerca del límite ({limiteMaximo} máximo)
        </div>
      )}

      {estadoPanel === 'limite' && (
        <div className="text-xs text-red-600 mb-2">
          Límite alcanzado
        </div>
      )}

      {/* Botones de acción compactos */}
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        {/* Botón simple de seleccionar todas */}
        {onSeleccionarTodas && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-gray-600 hover:text-gray-800"
                  disabled={cargando || estaEnLimite}
                  onClick={() => {
                    onSeleccionarTodas(ordenesDisponibles);
                  }}
                >
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Todas
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Seleccionar todas las órdenes clasificadas (respeta filtros aplicados)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGenerarReporte('pdf')}
                disabled={seleccionadas === 0 || cargando || !hayOrdenesDisponibles}
                className="h-7 px-2 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                PDF
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generar reporte PDF</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGenerarReporte('excel')}
                disabled={seleccionadas === 0 || cargando || !hayOrdenesDisponibles}
                className="h-7 px-2 text-xs border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Table className="w-3 h-3" />
                )}
                Excel
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generar reporte Excel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Información adicional sutil */}
      {seleccionadas === 0 && (
        <div className="text-xs text-gray-500 mt-1">
          {!hayOrdenesDisponibles ? 'No hay órdenes disponibles para reporte' : 'Solo órdenes clasificadas'}
        </div>
      )}
    </motion.div>
  );
};
