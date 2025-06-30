import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

/**
 * Componente de entrada de filtro reutilizable
 * Características:
 * - Icono de búsqueda
 * - Placeholder personalizable
 * - Transiciones suaves
 */
export const FilterInput: React.FC<FilterInputProps> = ({ 
  value, 
  onChange, 
  placeholder 
}) => (
  <div className="relative">
    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-8 w-full pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary"
    />
  </div>
);

export default FilterInput; 