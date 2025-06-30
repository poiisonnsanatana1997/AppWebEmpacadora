import React from 'react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder: string;
}

/**
 * Componente de selección de filtro reutilizable con menú desplegable
 * Características:
 * - Aparece/desaparece con animación
 * - Opciones personalizadas
 * - Texto de placeholder
 * - Transiciones suaves
 */
export const FilterSelect: React.FC<FilterSelectProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder 
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="h-8 w-full transition-all duration-200 focus:ring-2 focus:ring-primary">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </motion.div>
);

export default FilterSelect; 