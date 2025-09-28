import React, { useState } from 'react';
import { RetornoDetalleDTO } from '../../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import { RetornosService } from '../../services/retornos.service';
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

interface RetornosDetalleProps {
  retornos: RetornoDetalleDTO[];
  lote: string;
  onDeleteRetorno?: (retornoId: number) => void;
  disabled?: boolean;
}

export const RetornosDetalle: React.FC<RetornosDetalleProps> = ({ retornos, lote, onDeleteRetorno, disabled = false }) => {
  const [retornoToDelete, setRetornoToDelete] = useState<RetornoDetalleDTO | null>(null);
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

  const pesoTotal = retornos.reduce((total, retorno) => total + retorno.peso, 0);

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

  if (retornos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Retornos - Lote {lote}</span>
            <Badge variant="outline">Sin retornos</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No hay retornos registrados para este lote.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Retornos - Lote {lote}</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{retornos.length} retornos</Badge>
            <Badge className="bg-orange-100 text-orange-800">
              {pesoTotal.toFixed(2)} kg total
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {retornos.map((retorno) => (
            <div key={retorno.id} className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{retorno.numero}</Badge>
                  <span className="font-semibold text-orange-600">{retorno.peso.toFixed(2)} kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {formatearFecha(retorno.fechaRegistro)}
                  </span>
                  {!disabled && onDeleteRetorno && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(retorno)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              {retorno.observaciones && (
                <p className="text-sm text-gray-700">{retorno.observaciones}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Registrado por: {retorno.usuarioRegistro}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Modal de confirmación de eliminación */}
    <AlertDialog open={!!retornoToDelete} onOpenChange={handleCancelDelete}>
      <AlertDialogContent className="w-[95%] sm:w-[500px] max-w-[95vw]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl">¿Eliminar retorno?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
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
                Sí, eliminar retorno
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
}; 