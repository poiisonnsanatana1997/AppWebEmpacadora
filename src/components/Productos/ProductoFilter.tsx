import React from 'react';
import { Input } from '@/components/ui/input';

interface ProductoFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const ProductoFilter = React.forwardRef<HTMLInputElement, ProductoFilterProps>(
  ({ value, onChange, placeholder }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full"
      />
    );
  }
);

ProductoFilter.displayName = 'ProductoFilter'; 