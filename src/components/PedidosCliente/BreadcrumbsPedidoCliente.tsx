import React from 'react';
import { ChevronRight, Home, PackagePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbsPedidoClienteProps {
  currentStep: string;
}

export const BreadcrumbsPedidoCliente: React.FC<BreadcrumbsPedidoClienteProps> = ({
  currentStep,
}) => {
  const steps = [
    { key: 'informacion', label: 'Información Básica', icon: PackagePlus },
    { key: 'ordenes', label: 'Órdenes', icon: PackagePlus },
    { key: 'resumen', label: 'Resumen', icon: PackagePlus },
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link
        to="/pedidos-cliente"
        className="flex items-center hover:text-gray-800 transition-colors"
      >
        <Home className="h-4 w-4 mr-1" />
        Pedidos Cliente
      </Link>
      
      <ChevronRight className="h-4 w-4" />
      
      <span className="flex items-center text-gray-800 font-medium">
        <PackagePlus className="h-4 w-4 mr-1" />
        Crear Nuevo Pedido
      </span>
      
      {currentStep !== 'informacion' && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-800 font-medium">
            {steps[currentStepIndex]?.label}
          </span>
        </>
      )}
    </nav>
  );
}; 