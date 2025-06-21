import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface FilterInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function FilterInput({ value, onChange, placeholder }: FilterInputProps) {
  return (
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
} 