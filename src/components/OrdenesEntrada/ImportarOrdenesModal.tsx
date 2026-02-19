import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CloudUpload, FileSpreadsheet, AlertCircle, CheckCircle, Download, Loader2 } from 'lucide-react';
import { ResultadoImportacion } from '@/types/OrdenesEntrada/importacion.types';
import { generarPlantillaOrdenesEntrada } from '@/utils/generarPlantillaExcel';
import { cn } from '@/lib/utils';

interface ImportarOrdenesModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<ResultadoImportacion>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes

export const ImportarOrdenesModal = ({ open, onClose, onImport }: ImportarOrdenesModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ResultadoImportacion | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSetFile = (file: File | null) => {
    if (!file) return;

    // Validación de extensión
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Seleccione un archivo Excel válido (.xlsx o .xls)');
      setSelectedFile(null);
      return;
    }

    // Validación de tamaño
    if (file.size > MAX_FILE_SIZE) {
      setError(`El archivo excede el tamaño máximo permitido (5MB). Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      setSelectedFile(null);
      return;
    }

    setError('');
    setResultado(null);
    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file || null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError('');

    try {
      const result = await onImport(selectedFile);
      setResultado(result);

      // Si no hay errores, cerrar automáticamente después de 2 segundos
      if (result.errores.length === 0) {
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Error al importar el archivo. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setResultado(null);
    setError('');
    setLoading(false);
    setIsDragging(false);
    onClose();
  };

  const descargarPlantilla = () => {
    try {
      generarPlantillaOrdenesEntrada();
    } catch (error) {
      console.error('Error al generar la plantilla:', error);
      setError('Error al generar la plantilla. Por favor, intente nuevamente.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            Importar Órdenes de Entrada
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Región de anuncios para lectores de pantalla */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {loading && "Importando archivo, por favor espere..."}
            {resultado && resultado.errores.length === 0 && `Importación exitosa: ${resultado.ordenesCreadas} órdenes creadas`}
            {resultado && resultado.errores.length > 0 && `Importación parcial: ${resultado.ordenesCreadas} órdenes creadas, ${resultado.errores.length} errores encontrados`}
            {error && `Error: ${error}`}
          </div>

          {/* Instrucciones y descarga de plantilla */}
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Importe múltiples órdenes desde un archivo Excel. El archivo debe contener las columnas: Proveedor, Producto, Fecha Estimada y Observaciones (opcional).
            </p>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm text-blue-600 hover:text-blue-700 hover:underline"
              onClick={descargarPlantilla}
            >
              <Download className="h-4 w-4 mr-1" />
              Descargar plantilla de ejemplo con formato correcto
            </Button>
          </div>

          {/* Área de carga de archivo con drag-and-drop */}
          <label
            htmlFor="file-upload"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200",
              isDragging && "border-blue-500 bg-blue-50 scale-[1.02]",
              selectedFile && !error && "border-green-500 bg-green-50",
              error && "border-red-500 bg-red-50",
              !isDragging && !selectedFile && !error && "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
              "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
            )}
          >
            {selectedFile && !error ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-600 mb-3" />
                <span className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-gray-600 mt-1">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </span>
              </>
            ) : (
              <>
                <CloudUpload className={cn(
                  "h-12 w-12 mb-3 transition-colors",
                  isDragging ? "text-blue-500" : "text-gray-400"
                )} />
                <span className="text-sm font-medium text-gray-700">
                  {isDragging ? 'Suelte el archivo aquí' : 'Arrastre un archivo o haga clic para seleccionar'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Formatos: .xlsx, .xls (máximo 5MB)
                </span>
              </>
            )}
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Seleccionar archivo Excel"
          />

          {/* Resultado de la importación */}
          {resultado && (
            <Alert className={resultado.errores.length === 0 ? 'border-green-500 bg-green-50' : 'border-amber-600 bg-amber-50'}>
              {resultado.errores.length === 0 ? (
                <CheckCircle className="h-4 w-4 text-green-700" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-700" />
              )}
              <AlertDescription>
                <p className="font-medium text-gray-900">
                  {resultado.ordenesCreadas} {resultado.ordenesCreadas === 1 ? 'orden importada' : 'órdenes importadas'} exitosamente
                </p>
                {resultado.errores.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-semibold text-gray-900">Errores encontrados:</p>
                    <div
                      className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500"
                      role="region"
                      aria-label="Lista de errores de importación"
                      tabIndex={0}
                    >
                      <ul className="text-sm list-disc list-inside text-gray-800 space-y-1">
                        {resultado.errores.slice(0, 5).map((err, idx) => (
                          <li key={idx}>
                            Fila {err.fila}: {err.error}
                          </li>
                        ))}
                        {resultado.errores.length > 5 && (
                          <li className="font-medium text-blue-600">
                            ... y {resultado.errores.length - 5} errores más
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Mensaje de error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedFile || loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                'Importar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
