import React, { forwardRef } from 'react';
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';

interface CantidadControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  tipoSeleccionado?: string;
  resumenCajas?: {
    XL: number;
    L: number;
    M: number;
    S: number;
    total: number;
  };
}

export const CantidadControl = forwardRef<HTMLInputElement, CantidadControlProps>(({
  value,
  onChange,
  min = -1000,
  max = 1000,
  step = 1,
  disabled = false,
  tipoSeleccionado,
  resumenCajas
}, ref) => {
  // Calcular el límite mínimo basado en las cajas existentes
  const getMinLimit = () => {
    if (!tipoSeleccionado || !resumenCajas) return min;
    
    const cajasExistentes = resumenCajas[tipoSeleccionado as keyof typeof resumenCajas] || 0;
    // No permitir restar más de las cajas existentes
    return -cajasExistentes;
  };

  const minLimit = getMinLimit();

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, minLimit);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Permitir solo números y signo negativo al inicio
    if (inputValue === '' || inputValue === '-') {
      onChange(0);
      return;
    }
    
    // Validar que solo contenga números y un signo negativo al inicio
    if (!/^-?\d*$/.test(inputValue)) {
      return;
    }
    
    // Convertir a número
    const numericValue = parseInt(inputValue) || 0;
    const clampedValue = Math.max(minLimit, Math.min(numericValue, max));
    onChange(clampedValue);
  };

  const getValueColor = () => {
    if (value === 0) return 'text-gray-700';
    if (value > 0) return 'text-green-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  return (
    <div className="flex items-center gap-3">
      {/* Botón restar profesional */}
      <Button
        type="button"
        variant="outline"
        onClick={handleDecrement}
        disabled={disabled || value <= minLimit}
        className="h-9 w-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Minus className="h-4 w-4 text-gray-600" />
      </Button>

      {/* Valor central profesional */}
      <div className="flex-1 flex items-center justify-center min-w-0">
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            className={`w-24 text-center text-lg font-bold bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-50 transition-all duration-200 ${getValueColor()}`}
            placeholder="0"
          />
        </div>
      </div>

      {/* Botón sumar profesional */}
      <Button
        type="button"
        variant="outline"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="h-9 w-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Plus className="h-4 w-4 text-gray-600" />
      </Button>
    </div>
  );
});

CantidadControl.displayName = 'CantidadControl'; 