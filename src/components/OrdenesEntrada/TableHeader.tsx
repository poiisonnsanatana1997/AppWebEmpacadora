import { Button } from '@/components/ui/button';
import { ClipboardList, CloudUpload, Plus, FilterX, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface TableHeaderProps {
  onImportClick: () => void;
  onNewOrderClick: () => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  modoReporte?: boolean;
  onToggleModoReporte?: () => void;
}

/**
 * Componente TableHeader
 * Muestra el encabezado de la tabla de órdenes de entrada con título y botones de acción
 * @param onImportClick - Función para manejar la importación
 * @param onNewOrderClick - Función para manejar la creación de nuevas órdenes
 * @param onClearFilters - Función para limpiar los filtros activos
 * @param hasActiveFilters - Indica si hay filtros activos
 * @param modoReporte - Indica si el modo reporte está activo
 * @param onToggleModoReporte - Función para activar/desactivar el modo reporte
 */
export function TableHeader({ 
  onImportClick, 
  onNewOrderClick, 
  onClearFilters, 
  hasActiveFilters,
  modoReporte = false,
  onToggleModoReporte
}: TableHeaderProps) {
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
          <ClipboardList className="w-6 h-6 text-blue-700" />
          Lista de Órdenes de Entrada
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col sm:flex-row gap-2"
        >
          {hasActiveFilters && onClearFilters && (
            <Button 
              variant="ghost" 
              onClick={onClearFilters}
              className="w-full sm:w-auto text-orange-600 hover:text-orange-700 hover:bg-orange-50"
            >
              <FilterX className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          )}
          
          {onToggleModoReporte && (
            <Button 
              variant={modoReporte ? "default" : "outline"}
              onClick={onToggleModoReporte}
              className="w-full sm:w-auto"
            >
              <FileText className="w-4 h-4 mr-2" />
              {modoReporte ? 'Salir' : 'Reporte'}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={onImportClick}
            className="w-full sm:w-auto"
          >
            <CloudUpload className="w-4 h-4 mr-2" />
            Importar
          </Button>
          <Button 
            onClick={onNewOrderClick}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Orden
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
} 