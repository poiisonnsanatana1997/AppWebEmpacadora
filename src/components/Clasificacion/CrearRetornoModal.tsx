import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form } from '../ui/form';
import { RetornoForm } from './RetornoForm';
import { useRetornoForm } from '../../hooks/Clasificacion/useRetornoForm';
import { RotateCcw } from 'lucide-react';

interface CrearRetornoModalProps {
  open: boolean;
  onClose: () => void;
  clasificacionId: number;
  onSuccess?: () => void;
  clasificaciones?: any[];
  onValidate?: (peso: number) => { isValid: boolean; message: string };
}

export const CrearRetornoModal: React.FC<CrearRetornoModalProps> = ({
  open,
  onClose,
  clasificacionId,
  onSuccess,
  clasificaciones = [],
  onValidate
}) => {
  const { form, onSubmit, isSubmitting } = useRetornoForm(clasificacionId, () => {
    onClose();
    onSuccess?.();
  });

  const handleCancel = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-green-600" />
            Crear Nuevo Retorno
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <RetornoForm
            onSubmit={onSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            clasificaciones={clasificaciones}
            onValidate={onValidate}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 