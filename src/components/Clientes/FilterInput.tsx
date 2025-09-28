import React from 'react';
import { Input } from '../ui/input';

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const FilterInput = React.forwardRef<HTMLInputElement, FilterInputProps>(
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

FilterInput.displayName = 'FilterInput';
