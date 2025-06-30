import React, { useRef, useState } from 'react';
import { Upload, FileText, FileImage, X, Image as ImageIcon } from 'lucide-react';

interface SituacionFiscalUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const SituacionFiscalUploader: React.FC<SituacionFiscalUploaderProps> = ({ file, onFileSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    onFileSelect(selected);
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const renderPreview = () => {
    if (!file) return null;
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      const url = URL.createObjectURL(file);
      return (
        <div className="flex items-center gap-2 mt-2">
          <img src={url} alt={file.name} className="w-10 h-10 object-cover rounded border" />
          <span className="text-xs text-gray-700">{file.name}</span>
          <button type="button" onClick={handleRemove} className="ml-2 p-1 rounded hover:bg-gray-200">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      );
    }
    // PDF, DOC, etc.
    const isPdf = file.type === 'application/pdf';
    const isDoc = file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx');
    return (
      <div className="flex items-center gap-2 mt-2">
        {isPdf ? (
          <FileText className="w-8 h-8 text-red-500" />
        ) : isDoc ? (
          <FileText className="w-8 h-8 text-blue-500" />
        ) : (
          <FileText className="w-8 h-8 text-gray-400" />
        )}
        <span className="text-xs text-gray-700">{file.name}</span>
        <button type="button" onClick={handleRemove} className="ml-2 p-1 rounded hover:bg-gray-200">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    );
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-md transition-colors cursor-pointer w-full py-4 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      tabIndex={0}
      aria-label="Zona para subir archivo de situación fiscal"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={handleChange}
        className="hidden"
        id="situacionFiscalUploader"
      />
      <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
        {file ? (
          <>
            {renderPreview()}
            <span className="text-xs text-gray-500">Arrastra otro archivo para reemplazar</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-600">Arrastra o haz clic para seleccionar archivo</span>
            <span className="text-xs text-gray-400">PDF, DOC, JPG, PNG</span>
          </>
        )}
      </div>
    </div>
  );
}; 