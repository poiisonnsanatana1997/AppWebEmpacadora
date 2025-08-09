import React from 'react';
import { BreadcrumbsPedidoCliente } from '@/components/PedidosCliente/BreadcrumbsPedidoCliente';
import { PedidoClienteWizard } from '@/components/PedidosCliente/PedidoClienteWizard';
import { usePedidoClienteWizard } from '@/hooks/PedidosCliente/usePedidoClienteWizard';
import { useNavigate } from 'react-router-dom';
import { PackagePlus } from 'lucide-react';

export const CrearPedidoCliente: React.FC = () => {
  const navigate = useNavigate();
  const { wizardState, isLoading } = usePedidoClienteWizard();

  // Redirigir a la lista después de crear exitosamente
  React.useEffect(() => {
    if (wizardState.currentStep === 'informacion' && wizardState.steps.resumen) {
      // El wizard se reseteó, significa que se creó exitosamente
      navigate('/pedidos-cliente');
    }
  }, [wizardState, navigate]);

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Breadcrumbs */}
      <BreadcrumbsPedidoCliente currentStep={wizardState.currentStep} />
      
      {/* Título compacto con ícono */}
      <div className="flex items-center gap-2 mb-4">
        <PackagePlus className="h-6 w-6 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800">
          Crear Nuevo Pedido
        </h1>
      </div>
      
      {/* Wizard */}
      <PedidoClienteWizard />
    </div>
  );
}; 