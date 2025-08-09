import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Circle,
  Package,
  FileText,
  CheckSquare
} from 'lucide-react';
import { InformacionBasicaStep } from './WizardSteps/InformacionBasicaStep';
import { OrdenesPedidoCliente } from './OrdenesPedidoCliente';
import { ResumenPedidoCliente } from './ResumenPedidoCliente';
import { usePedidoClienteWizard } from '@/hooks/PedidosCliente/usePedidoClienteWizard';
import { type WizardStep } from '@/schemas/pedidoClienteWizardSchema';

const steps = [
  { key: 'informacion', label: 'Información Básica', icon: FileText },
  { key: 'ordenes', label: 'Órdenes', icon: Package },
  { key: 'resumen', label: 'Resumen', icon: CheckSquare },
];

export const PedidoClienteWizard: React.FC = () => {
  const {
    wizardState,
    clientes,
    productos,
    isLoading,
    error,
    informacionForm,
    ordenesForm,
    nextStep,
    prevStep,
    obtenerSucursalesCliente,
    handleClienteChange,
    agregarOrden,
    eliminarOrden,
    actualizarOrden,
    crearPedidoCliente,
  } = usePedidoClienteWizard();

  const currentStepIndex = steps.findIndex(step => step.key === wizardState.currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (wizardState.currentStep) {
      case 'informacion':
        return (
          <FormProvider {...informacionForm}>
            <InformacionBasicaStep
              clientes={clientes}
              onClienteChange={handleClienteChange}
              obtenerSucursalesCliente={obtenerSucursalesCliente}
            />
          </FormProvider>
        );
      
      case 'ordenes':
        return (
          <FormProvider {...ordenesForm}>
            <OrdenesPedidoCliente
              ordenes={ordenesForm.watch('ordenes')}
              productos={productos}
              onAgregarOrden={agregarOrden}
              onEliminarOrden={eliminarOrden}
              onActualizarOrden={actualizarOrden}
            />
          </FormProvider>
        );
      
      case 'resumen':
        return (
          <ResumenPedidoCliente
            informacion={informacionForm.getValues()}
            ordenes={ordenesForm.watch('ordenes')}
            clientes={clientes}
            productos={productos}
          />
        );
      
      default:
        return null;
    }
  };

  const handleNext = async () => {
    if (wizardState.currentStep === 'resumen') {
      await crearPedidoCliente();
    } else {
      await nextStep();
    }
  };

  const handlePrev = () => {
    prevStep();
  };

  const isLastStep = wizardState.currentStep === 'resumen';
  const isFirstStep = wizardState.currentStep === 'informacion';

  return (
    <div className="space-y-4">
      {/* Progress Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-blue-800">Progreso: {Math.round(progress)}%</h3>
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              Paso {currentStepIndex + 1} de {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Steps Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = wizardState.steps[step.key as WizardStep];
            const isCurrent = step.key === wizardState.currentStep;
            const Icon = step.icon;
            
            return (
              <div key={step.key} className="flex items-center gap-2">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`
                  text-xs font-medium hidden sm:block
                  ${isCurrent ? 'text-blue-800' : isCompleted ? 'text-green-700' : 'text-gray-500'}
                `}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-4 h-px bg-gray-300 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <Circle className="h-4 w-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={isFirstStep || isLoading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLastStep ? (
              <>
                {isLoading ? 'Creando...' : 'Crear Pedido'}
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}; 