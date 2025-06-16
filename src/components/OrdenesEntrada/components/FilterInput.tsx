import React from 'react';
import { Input } from '@/components/ui/input';

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FilterInput({ value, onChange, placeholder }: FilterInputProps) {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-8 w-full"
    />
  );
} 