import React from 'react';
import { RetornoDetalleDTO } from '@/types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { RotateCcw, X, Plus } from 'lucide-react';

interface RetornosModalProps {
  open: boolean;
  onClose: () => void;
  retornos: RetornoDetalleDTO[];
  onAddRetorno: () => void;
}

export const RetornosModal: React.FC<RetornosModalProps> = ({ open, onClose, retornos, onAddRetorno }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retornos</DialogTitle>
        </DialogHeader>
        <table className="min-w-full text-sm mb-4">
          <thead>
            <tr>
              <th className="px-2 py-1">Número</th>
              <th className="px-2 py-1">Peso</th>
              <th className="px-2 py-1">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {retornos.map((retorno, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-2 py-1">{retorno.numero}</td>
                <td className="px-2 py-1">{retorno.peso}</td>
                <td className="px-2 py-1">{retorno.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <DialogFooter>
          <Button 
            onClick={onAddRetorno}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Retorno
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 