import React, { useState } from 'react';
import { RetornoDetalleDTO } from '@/types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { RotateCcw, X, Plus, Trash2, Loader2 } from 'lucide-react';
import { RetornosService } from '@/services/retornos.service';
import { toast } from 'sonner';
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

interface RetornosModalProps {
  open: boolean;
  onClose: () => void;
  retornos: RetornoDetalleDTO[];
  onAddRetorno: () => void;
  onDeleteRetorno?: (retornoId: number) => void;
  disabled?: boolean;
}

export const RetornosModal: React.FC<RetornosModalProps> = ({ 
  open, 
  onClose, 
  retornos, 
  onAddRetorno, 
  onDeleteRetorno,
  disabled = false 
}) => {
  const [retornoToDelete, setRetornoToDelete] = useState<RetornoDetalleDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (retorno: RetornoDetalleDTO) => {
    setRetornoToDelete(retorno);
  };

  const handleConfirmDelete = async () => {
    if (!retornoToDelete || !onDeleteRetorno) return;

    setIsDeleting(true);
    try {
      await RetornosService.delete(retornoToDelete.id);
      onDeleteRetorno(retornoToDelete.id);
      toast.success('Retorno eliminado correctamente');
      setRetornoToDelete(null);
    } catch (error: any) {
      toast.error(error?.message || 'Error al eliminar el retorno');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setRetornoToDelete(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Retornos Registrados
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto">
            {retornos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay retornos registrados
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Número</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Peso (kg)</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Observaciones</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Fecha</th>
                    {!disabled && onDeleteRetorno && (
                      <th className="px-3 py-2 text-center font-medium text-gray-700">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {retornos.map((retorno, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{retorno.numero}</td>
                      <td className="px-3 py-2 font-medium">{retorno.peso?.toFixed(2) || '0.00'}</td>
                      <td className="px-3 py-2 text-gray-600 max-w-xs truncate" title={retorno.observaciones}>
                        {retorno.observaciones || '-'}
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-xs">
                        {retorno.fechaRegistro ? new Date(retorno.fechaRegistro).toLocaleDateString('es-ES') : '-'}
                      </td>
                      {!disabled && onDeleteRetorno && (
                        <td className="px-3 py-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(retorno)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              Total: {retornos.length} retorno(s) - Peso total: {retornos.reduce((sum, r) => sum + (r.peso || 0), 0).toFixed(2)} kg
            </div>
            <div className="flex gap-2">
              {!disabled && (
                <Button 
                  onClick={onAddRetorno}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Retorno
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                <X className="h-4 w-4 mr-2" />
                Cerrar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={!!retornoToDelete} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar retorno?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el retorno:
              <br />
              <strong>Número:</strong> {retornoToDelete?.numero}
              <br />
              <strong>Peso:</strong> {retornoToDelete?.peso?.toFixed(2)} kg
              {retornoToDelete?.observaciones && (
                <>
                  <br />
                  <strong>Observaciones:</strong> {retornoToDelete.observaciones}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}; 