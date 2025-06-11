import React from 'react';
import styled from 'styled-components';
import { Image } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const ImageContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    color: #94A3B8;
    width: 24px;
    height: 24px;
  }
`;

interface ProductImageProps {
  imageBase64?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ imageBase64 }) => {
  const [open, setOpen] = React.useState(false);

  if (!imageBase64) {
    return (
      <ImageContainer>
        <Image className="placeholder" />
      </ImageContainer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button type="button" style={{ border: 'none', background: 'none', padding: 0 }}>
          <ImageContainer>
            <img 
              src={`data:image/jpeg;base64,${imageBase64}`} 
              alt="Producto"
              loading="lazy"
            />
          </ImageContainer>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none">
        <img 
          src={`data:image/jpeg;base64,${imageBase64}`} 
          alt="Vista previa del producto"
          className="w-full h-full object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}; 