import React from 'react';
import { MermaDetalleDTO } from '@/types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Package, X, Plus } from 'lucide-react';

interface MermasModalProps {
  open: boolean;
  onClose: () => void;
  mermas: MermaDetalleDTO[];
  onAddMerma: () => void;
}

export const MermasModal: React.FC<MermasModalProps> = ({ open, onClose, mermas, onAddMerma }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mermas</DialogTitle>
        </DialogHeader>
        <table className="min-w-full text-sm mb-4">
          <thead>
            <tr>
              <th className="px-2 py-1">Tipo</th>
              <th className="px-2 py-1">Peso</th>
              <th className="px-2 py-1">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {mermas.map((merma, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-2 py-1">{merma.tipo}</td>
                <td className="px-2 py-1">{merma.peso}</td>
                <td className="px-2 py-1">{merma.observaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <DialogFooter>
          <Button 
            onClick={onAddMerma}
            className="bg-purple-600 text-white hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Merma
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