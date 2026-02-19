import React from 'react';
import { Package, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TableHeaderProps {
  loading?: boolean;
  isRefreshing?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  loading = false,
  isRefreshing = false,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Inventario de Tarimas</h2>
              {isRefreshing && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 animate-pulse"
                  aria-live="polite"
                  aria-label="Actualizando datos"
                >
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span className="text-xs">Actualizando...</span>
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Gestiona el inventario de tarimas en el sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
