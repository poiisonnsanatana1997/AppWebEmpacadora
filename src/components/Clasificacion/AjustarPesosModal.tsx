import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { FormProvider } from 'react-hook-form';
import { useAjustarPesosForm } from '../../hooks/Clasificacion/useAjustarPesosForm';
import { AjustarPesosForm } from './AjustarPesosForm';
import { Scale } from 'lucide-react';

import { TarimaClasificacionDTO, ClasificacionCompletaDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';

interface AjustarPesosModalProps {
  open: boolean;
  onClose: () => void;
  clasificacionId: number;
  tarimas: TarimaClasificacionDTO[];
  clasificaciones: ClasificacionCompletaDTO[];
  onSuccess?: () => void;
}

export const AjustarPesosModal: React.FC<AjustarPesosModalProps> = ({
  open,
  onClose,
  clasificacionId,
  tarimas,
  clasificaciones,
  onSuccess,
}) => {
  const { form, isSubmitting, handleSubmit, handleCancel, tiposHabilitados, validateAjustePesos } = useAjustarPesosForm({
    clasificacionId,
    tarimas,
    clasificaciones,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
    onCancel: onClose,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Scale className="h-6 w-6 text-blue-600" />
            Ajustar Pesos de Clasificación
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Modifica los pesos de los tipos de clasificación según sea necesario
          </p>
        </DialogHeader>
        
        <FormProvider {...form}>
          <AjustarPesosForm
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            tiposHabilitados={tiposHabilitados}
            onValidate={validateAjustePesos}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}; 