import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../ui/table';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

import { Trash2, Package, Weight, DollarSign, Plus, X, Check } from 'lucide-react';
import { CajaClienteDTO, CreateCajaClienteDTO } from '../../../types/Cajas/cajaCliente.types';
import { toast } from 'sonner';

interface CajaClienteTableProps {
  cajasCliente: CajaClienteDTO[];
  onDelete: (id: number) => void;
  onCreate: (data: CreateCajaClienteDTO) => Promise<void>;
  loading?: boolean;
}

export const CajaClienteTable: React.FC<CajaClienteTableProps> = ({
  cajasCliente,
  onDelete,
  onCreate,
  loading = false
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCaja, setNewCaja] = useState({
    nombre: '',
    peso: '',
    precio: ''
  });
  const [creating, setCreating] = useState(false);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewCaja({ nombre: '', peso: '', precio: '' });
  };

  const handleCancelAdd = () => {
    setIsAddingNew(false);
    setNewCaja({ nombre: '', peso: '', precio: '' });
  };

  const handleSaveNew = async () => {
    // Validación
    const pesoNumero = parseFloat(newCaja.peso);
    const precioNumero = newCaja.precio ? parseFloat(newCaja.precio) : undefined;

    if (!newCaja.peso || isNaN(pesoNumero) || pesoNumero <= 0) {
      toast.error('El peso debe ser mayor a 0');
      return;
    }

    if (newCaja.precio && (isNaN(precioNumero!) || precioNumero! < 0)) {
      toast.error('El precio debe ser un número válido');
      return;
    }

    setCreating(true);
    try {
      const createData: CreateCajaClienteDTO = {
        nombre: newCaja.nombre || undefined,
        peso: pesoNumero,
        precio: precioNumero,
        idCliente: 0 // Se pasará desde el componente padre
      };

      await onCreate(createData);
      setIsAddingNew(false);
      setNewCaja({ nombre: '', peso: '', precio: '' });
      toast.success('Caja creada correctamente');
    } catch (error) {
      console.error('Error al crear caja:', error);
      toast.error('Error al crear la caja');
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewCaja(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Botón para agregar nueva caja */}
      {!isAddingNew && (
        <div className="p-4 border-b border-gray-200">
          <Button
            onClick={handleAddNew}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Nueva Caja
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-700">Nombre</TableHead>
            <TableHead className="font-semibold text-gray-700">Peso (kg)</TableHead>
            <TableHead className="font-semibold text-gray-700">Precio</TableHead>
            <TableHead className="font-semibold text-gray-700 w-[80px]">Eliminar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Fila de formulario para nueva caja */}
          {isAddingNew && (
            <motion.tr
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-gray-100 bg-green-50"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-500" />
                  <Input
                    value={newCaja.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Nombre de la caja"
                    className="w-full max-w-[200px]"
                    disabled={creating}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Weight className="h-3 w-3 text-gray-400" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newCaja.peso}
                    onChange={(e) => handleInputChange('peso', e.target.value)}
                    placeholder="0.00"
                    className="w-full max-w-[120px]"
                    disabled={creating}
                  />
                  <span className="text-sm text-gray-500">kg</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-gray-400" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newCaja.precio}
                    onChange={(e) => handleInputChange('precio', e.target.value)}
                    placeholder="0.00"
                    className="w-full max-w-[120px]"
                    disabled={creating}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveNew}
                    disabled={creating || !newCaja.peso}
                    className="h-8 w-8 p-0 hover:bg-green-100 text-green-600 hover:text-green-700"
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Guardar caja</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelAdd}
                    disabled={creating}
                    className="h-8 w-8 p-0 hover:bg-gray-100 text-gray-600 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancelar</span>
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          )}

          {/* Filas existentes de cajas */}
          {cajasCliente.map((caja, index) => (
            <motion.tr
              key={caja.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <TableCell className="font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-500" />
                  <span>{caja.nombre || 'Sin nombre'}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Weight className="h-3 w-3 text-gray-400" />
                  <span className="font-medium text-gray-700">
                    {caja.peso.toFixed(2)} kg
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {caja.precio ? (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-gray-400" />
                    <span className="font-medium text-gray-700">
                      ${caja.precio.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No definido</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(caja.id)}
                  className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar caja</span>
                </Button>
              </TableCell>
            </motion.tr>
          ))}

          {/* Mensaje cuando no hay cajas */}
          {cajasCliente.length === 0 && !isAddingNew && (
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <TableCell colSpan={4} className="text-center py-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-gray-50 rounded-full p-4 mb-4">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No hay cajas registradas
                  </h3>
                  <p className="text-sm text-gray-500 text-center max-w-md">
                    Este cliente aún no tiene cajas registradas. 
                    Puedes agregar una nueva caja usando el botón de arriba.
                  </p>
                </div>
              </TableCell>
            </motion.tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
