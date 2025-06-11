import { useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CloudUpload } from 'lucide-react';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #94a3b8;
    background-color: #f8fafc;
  }
`;

interface ImportarOrdenesModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

export const ImportarOrdenesModal = ({ open, onClose, onImport }: ImportarOrdenesModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Por favor seleccione un archivo Excel válido (.xlsx o .xls)');
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      await onImport(selectedFile);
      onClose();
    } catch (error) {
      setError('Error al importar el archivo. Por favor intente nuevamente.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Órdenes de Entrada</DialogTitle>
        </DialogHeader>

        <StyledForm onSubmit={handleSubmit}>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Seleccione un archivo Excel (.xlsx o .xls) con los datos de las órdenes de entrada.
            </p>

            <FileLabel htmlFor="file-upload">
              <CloudUpload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium">
                {selectedFile ? selectedFile.name : 'Haga clic para seleccionar un archivo'}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                Formatos soportados: .xlsx, .xls
              </span>
            </FileLabel>
            <FileInput
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedFile}>
              Importar
            </Button>
          </DialogFooter>
        </StyledForm>
      </DialogContent>
    </Dialog>
  );
}; 