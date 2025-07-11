import React, { useState } from 'react';
import { Button } from '../ui/button';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';

interface FinalizarClasificacionButtonProps {
  onFinalizar: () => Promise<void>;
  isSubmitting?: boolean;
}

export const FinalizarClasificacionButton: React.FC<FinalizarClasificacionButtonProps> = ({
  onFinalizar,
  isSubmitting = false
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleFinalizar = async () => {
    try {
      await onFinalizar();
      setShowConfirmDialog(false);
      toast.success('Clasificación finalizada exitosamente');
    } catch (error: any) {
      toast.error(error?.message || 'Error al finalizar la clasificación');
    }
  };

  return (
    <>
      <Button
        onClick={() => setShowConfirmDialog(true)}
        disabled={isSubmitting}
        className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        size="lg"
      >
        <CheckCircle className="h-5 w-5 mr-2" />
        {isSubmitting ? 'Finalizando...' : 'Finalizar Clasificación'}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirmar Finalización
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas finalizar la clasificación? Esta acción:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Cambiará el estado de la orden a "Clasificado"</li>
                <li>Bloqueará la edición de tarimas, mermas y retornos</li>
                <li>Permitirá generar reportes de clasificación</li>
                <li>No se podrá deshacer esta acción</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalizar}
              disabled={isSubmitting}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isSubmitting ? 'Finalizando...' : 'Sí, Finalizar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 