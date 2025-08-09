import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TableHeaderProps {
  onNewPedido?: () => void;
  loading?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  onNewPedido,
  loading = false,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pedidos Cliente</h2>
            <p className="text-sm text-gray-500">
              Gestiona los pedidos de tus clientes
            </p>
          </div>
        </div>
      </div>
      
      <Link to="/pedidos-cliente/crear">
        <Button
          disabled={loading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Pedido
        </Button>
      </Link>
    </div>
  );
}; 