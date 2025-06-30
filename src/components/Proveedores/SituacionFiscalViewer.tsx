import React, { useState } from 'react';
import { FileText, FileImage, Download, Eye, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SituacionFiscalViewerProps {
  situacionFiscal: string | null; // Base64 string
  proveedorNombre: string;
  onRemove?: () => void;
  compact?: boolean; // Para usar en tabla
}

export const SituacionFiscalViewer: React.FC<SituacionFiscalViewerProps> = ({ 
  situacionFiscal, 
  proveedorNombre,
  onRemove,
  compact = false
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  if (!situacionFiscal) {
    if (compact) {
      return (
        <div className="flex items-center justify-center p-2 border border-dashed border-gray-300 rounded-md bg-gray-50">
          <FileText className="h-4 w-4 text-gray-400" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
        <div className="text-center">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No hay archivo de situación fiscal</p>
        </div>
      </div>
    );
  }

  // Determinar el tipo de archivo basado en el contenido base64
  const getFileType = (base64String: string) => {
    const header = base64String.substring(0, 30);
    if (header.includes('data:image/')) {
      return 'image';
    } else if (header.includes('data:application/pdf')) {
      return 'pdf';
    } else if (header.includes('data:application/msword') || header.includes('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      return 'document';
    }
    return 'unknown';
  };

  const fileType = getFileType(situacionFiscal);
  const fileName = `SituacionFiscal_${proveedorNombre.replace(/\s+/g, '_')}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = situacionFiscal;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <FileImage className="h-4 w-4 text-blue-500" />;
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const renderPreview = () => {
    if (fileType === 'image') {
      return (
        <div className="max-w-full max-h-96 overflow-auto">
          <img 
            src={situacionFiscal} 
            alt="Vista previa de situación fiscal" 
            className="w-full h-auto rounded-md"
          />
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center p-8 border border-gray-200 rounded-md bg-gray-50">
        <div className="text-center">
          {fileType === 'pdf' ? (
            <FileText className="h-12 w-12 text-red-500 mx-auto" />
          ) : fileType === 'document' ? (
            <FileText className="h-12 w-12 text-blue-600 mx-auto" />
          ) : (
            <FileText className="h-12 w-12 text-gray-400 mx-auto" />
          )}
          <p className="mt-2 text-sm text-gray-600">
            {fileType === 'pdf' ? 'Documento PDF' : 
             fileType === 'document' ? 'Documento Word' : 'Archivo'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Usa el botón de descarga para ver el archivo
          </p>
        </div>
      </div>
    );
  };

  // Versión compacta para tabla
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-white">
        {renderFileIcon()}
        <div className="flex items-center gap-1">
          <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Eye className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Vista previa - Situación Fiscal</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {renderPreview()}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleDownload}>
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  // Versión completa
  return (
    <div className="border border-gray-200 rounded-md p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">Situación Fiscal</h4>
        <div className="flex items-center gap-2">
          <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Eye className="h-4 w-4 mr-1" />
                Ver
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Vista previa - Situación Fiscal</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {renderPreview()}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" className="h-8" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Descargar
          </Button>
          
          {onRemove && (
            <Button variant="outline" size="sm" className="h-8 text-red-600 hover:text-red-700" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
        {fileType === 'pdf' ? (
          <FileText className="h-8 w-8 text-red-500" />
        ) : fileType === 'document' ? (
          <FileText className="h-8 w-8 text-blue-600" />
        ) : fileType === 'image' ? (
          <FileImage className="h-8 w-8 text-blue-500" />
        ) : (
          <FileText className="h-8 w-8 text-gray-400" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {fileName}
          </p>
          <p className="text-xs text-gray-500">
            {fileType === 'image' ? 'Imagen' : 
             fileType === 'pdf' ? 'Documento PDF' : 
             fileType === 'document' ? 'Documento Word' : 'Archivo'}
          </p>
        </div>
      </div>
    </div>
  );
}; 