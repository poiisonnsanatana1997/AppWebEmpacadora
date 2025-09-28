import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Switch } from '@/components/ui/switch';
import { Package, Weight, DollarSign, Loader2 } from 'lucide-react';
import { CajaClienteDTO } from '../../../types/Cajas/cajaCliente.types';
import { toast } from 'sonner';

interface CajaClienteFormProps {
  caja?: CajaClienteDTO | null;
  clienteNombre?: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const CajaClienteForm: React.FC<CajaClienteFormProps> = ({
  caja,
  clienteNombre,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [nombre, setNombre] = useState('');
  const [peso, setPeso] = useState('');
  const [precio, setPrecio] = useState('');

  // Cargar datos de la caja si estamos editando
  useEffect(() => {
    if (caja) {
      setNombre(caja.nombre || '');
      setPeso(caja.peso.toString());
      setPrecio(caja.precio?.toString() || '');
    } else {
      // Resetear formulario para nueva caja
      setNombre('');
      setPeso('');
      setPrecio('');
    }
  }, [caja]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    const pesoNumero = parseFloat(peso);
    const precioNumero = precio ? parseFloat(precio) : undefined;

    if (!peso || isNaN(pesoNumero) || pesoNumero <= 0) {
      toast.error('El peso debe ser mayor a 0');
      return;
    }

    if (precio && (isNaN(precioNumero!) || precioNumero! < 0)) {
      toast.error('El precio debe ser un número válido');
      return;
    }

    try {
      const formData = {
        nombre: nombre.trim() || undefined,
        peso: pesoNumero,
        precio: precioNumero
      };

      await onSubmit(formData);
    } catch (error) {
      console.error('Error al procesar formulario:', error);
      toast.error('Error al procesar el formulario');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre (Opcional)</Label>
          <div className="relative">
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre de la caja"
              maxLength={50}
            />
            <Package className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">
            Máximo 50 caracteres
          </p>
        </div>

        {/* Peso */}
        <div className="space-y-2">
          <Label htmlFor="peso">Peso (kg) *</Label>
          <div className="relative">
            <Input
              id="peso"
              type="number"
              step="0.01"
              min="0.01"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="0.00"
              required
            />
            <Weight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">
            Peso en kilogramos (mínimo 0.01 kg)
          </p>
        </div>

        {/* Precio */}
        <div className="space-y-2">
          <Label htmlFor="precio">Precio (Opcional)</Label>
          <div className="relative">
            <Input
              id="precio"
              type="number"
              step="0.01"
              min="0"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0.00"
            />
            <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">
            Precio en pesos mexicanos
          </p>
        </div>


      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {caja ? 'Actualizar Caja' : 'Crear Caja'}
        </Button>
      </div>
    </form>
  );
};
