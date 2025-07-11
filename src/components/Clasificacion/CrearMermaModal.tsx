import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Form } from '../ui/form';
import { MermaForm } from './MermaForm';
import { useMermaForm } from '../../hooks/Clasificacion/useMermaForm';
import { Package } from 'lucide-react';

interface CrearMermaModalProps {
  open: boolean;
  onClose: () => void;
  clasificacionId: number;
  onSuccess?: () => void;
  clasificaciones?: any[];
  onValidate?: (peso: number) => { isValid: boolean; message: string };
}

export const CrearMermaModal: React.FC<CrearMermaModalProps> = ({
  open,
  onClose,
  clasificacionId,
  onSuccess,
  clasificaciones = [],
  onValidate
}) => {
  const { form, onSubmit, isSubmitting } = useMermaForm(clasificacionId, () => {
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
            <Package className="h-5 w-5 text-purple-600" />
            Crear Nueva Merma
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <MermaForm
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