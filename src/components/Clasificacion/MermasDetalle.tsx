import React, { useState } from 'react';
import { MermaDetalleDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { MermasService } from '../../services/mermas.service';
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

interface MermasDetalleProps {
  mermas: MermaDetalleDTO[];
  lote: string;
  onDeleteMerma?: (mermaId: number) => void;
  disabled?: boolean;
}

export const MermasDetalle: React.FC<MermasDetalleProps> = ({ mermas, lote, onDeleteMerma, disabled = false }) => {
  const [mermaToDelete, setMermaToDelete] = useState<MermaDetalleDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pesoTotal = mermas.reduce((total, merma) => total + merma.peso, 0);

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

  if (mermas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Mermas - Lote {lote}</span>
            <Badge variant="outline">Sin mermas</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No hay mermas registradas para este lote.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mermas - Lote {lote}</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{mermas.length} mermas</Badge>
            <Badge className="bg-red-100 text-red-800">
              {pesoTotal.toFixed(2)} kg total
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mermas.map((merma) => (
            <div key={merma.id} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{merma.tipo}</Badge>
                  <span className="font-semibold text-red-600">{merma.peso.toFixed(2)} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {formatearFecha(merma.fechaRegistro)}
                  </span>
                  {!disabled && onDeleteMerma && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(merma)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              {merma.observaciones && (
                <p className="text-sm text-gray-700">{merma.observaciones}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Registrado por: {merma.usuarioRegistro}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Modal de confirmación de eliminación */}
    <AlertDialog open={!!mermaToDelete} onOpenChange={handleCancelDelete}>
      <AlertDialogContent className="w-[95%] sm:w-[500px] max-w-[95vw]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl">¿Eliminar merma?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
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
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto" disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Sí, eliminar merma
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
}; 