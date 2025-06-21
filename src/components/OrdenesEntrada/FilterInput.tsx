import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

/**
 * Componente de entrada de filtro reutilizable con icono de búsqueda
 * Características:
 * - Icono de búsqueda
 * - Texto de placeholder
 * - Transiciones suaves
 */
export const FilterInput: React.FC<FilterInputProps> = ({ value, onChange, placeholder }) => (
  <div className="relative">
    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 pl-8 w-full transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
  </div>
); 