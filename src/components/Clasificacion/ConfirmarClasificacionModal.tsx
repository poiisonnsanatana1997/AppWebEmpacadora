import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface ConfirmarClasificacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmarClasificacionModal: React.FC<ConfirmarClasificacionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[400px] p-0">
        <div className="p-4">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between pr-2">
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Confirmar Clasificación
              </DialogTitle>
            </div>
            <DialogDescription>
              ¿Estás seguro que deseas registrar la clasificación para esta orden? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose} type="button" aria-label="Cancelar">
              Cancelar
            </Button>
            <Button variant="default" onClick={onConfirm} type="button" aria-label="Confirmar registro de clasificación">
              Confirmar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 