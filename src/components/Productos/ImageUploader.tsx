import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (image: string) => void;
  previewImage?: string | null;
  maxSize?: number; // en bytes
}

export function ImageUploader({
  onImageSelect,
  previewImage,
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
}: ImageUploaderProps) {
  const [imgSrc, setImgSrc] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImgSrc(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize,
    multiple: false
  });

  const handleRemoveImage = () => {
    setImgSrc('');
    onImageSelect('');
  };

  // Función para formatear la URL de la imagen
  const getImageUrl = (image: string | null | undefined) => {
    if (!image) return null;
    if (image.startsWith('data:')) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  const displayImage = imgSrc || getImageUrl(previewImage);

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`w-full aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors relative
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50'}`}
      >
        <input {...getInputProps()} />
        {!displayImage ? (
          <div className="text-center p-4">
            {isDragActive ? (
              <p className="text-primary">Suelta la imagen aquí...</p>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  Arrastra y suelta una imagen aquí, o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG o WEBP hasta {maxSize / 1024 / 1024}MB
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={displayImage}
              alt="Vista previa"
              className="w-full h-full object-contain"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-background"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 