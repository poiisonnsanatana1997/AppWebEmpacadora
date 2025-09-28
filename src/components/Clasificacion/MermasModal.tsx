import React, { useState } from 'react';
import { MermaDetalleDTO } from '@/types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Package, X, Plus, Trash2, Loader2 } from 'lucide-react';
import { MermasService } from '@/services/mermas.service';
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

interface MermasModalProps {
  open: boolean;
  onClose: () => void;
  mermas: MermaDetalleDTO[];
  onAddMerma: () => void;
  onDeleteMerma?: (mermaId: number) => void;
  disabled?: boolean;
}

export const MermasModal: React.FC<MermasModalProps> = ({ 
  open, 
  onClose, 
  mermas, 
  onAddMerma, 
  onDeleteMerma,
  disabled = false 
}) => {
  const [mermaToDelete, setMermaToDelete] = useState<MermaDetalleDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (merma: MermaDetalleDTO) => {
    setMermaToDelete(merma);
  };

  const handleConfirmDelete = async () => {
    if (!mermaToDelete || !onDeleteMerma) return;

    setIsDeleting(true);
    try {
      await MermasService.delete(mermaToDelete.id);
      onDeleteMerma(mermaToDelete.id);
      toast.success('Merma eliminada correctamente');
      setMermaToDelete(null);
    } catch (error: any) {
      toast.error(error?.message || 'Error al eliminar la merma');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setMermaToDelete(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Mermas Registradas
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto">
            {mermas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay mermas registradas
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Tipo</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Peso (kg)</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Observaciones</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Fecha</th>
                    {!disabled && onDeleteMerma && (
                      <th className="px-3 py-2 text-center font-medium text-gray-700">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {mermas.map((merma, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{merma.tipo}</td>
                      <td className="px-3 py-2 font-medium">{merma.peso?.toFixed(2) || '0.00'}</td>
                      <td className="px-3 py-2 text-gray-600 max-w-xs truncate" title={merma.observaciones}>
                        {merma.observaciones || '-'}
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-xs">
                        {merma.fechaRegistro ? new Date(merma.fechaRegistro).toLocaleDateString('es-ES') : '-'}
                      </td>
                      {!disabled && onDeleteMerma && (
                        <td className="px-3 py-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(merma)}
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
              Total: {mermas.length} merma(s) - Peso total: {mermas.reduce((sum, m) => sum + (m.peso || 0), 0).toFixed(2)} kg
            </div>
            <div className="flex gap-2">
              {!disabled && (
                <Button 
                  onClick={onAddMerma}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Merma
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
      <AlertDialog open={!!mermaToDelete} onOpenChange={handleCancelDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar merma?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la merma:
              <br />
              <strong>Tipo:</strong> {mermaToDelete?.tipo}
              <br />
              <strong>Peso:</strong> {mermaToDelete?.peso?.toFixed(2)} kg
              {mermaToDelete?.observaciones && (
                <>
                  <br />
                  <strong>Observaciones:</strong> {mermaToDelete.observaciones}
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