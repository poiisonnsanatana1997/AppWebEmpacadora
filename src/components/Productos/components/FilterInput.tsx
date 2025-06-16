import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Componente de entrada de filtro reutilizable con icono de búsqueda
 * Características:
 * - Aparece/desaparece con animación
 * - Icono de búsqueda
 * - Texto de placeholder
 * - Transiciones suaves
 */
export function FilterInput({ value, onChange, placeholder }: FilterInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 h-8"
      />
    </div>
  );
} 