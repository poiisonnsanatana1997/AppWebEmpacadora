import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus, Edit } from 'lucide-react';
import { SucursalFormModal } from './Sucursales/SucursalFormModal';
import { CreateSucursalDTO, UpdateSucursalDTO, SucursalDTO } from '../../types/Sucursales/sucursales.types';
import { toast } from 'sonner';

interface SucursalesManagerProps {
  clienteId: number;
  clienteNombre: string;
  sucursales: SucursalDTO[];
  onSucursalCreated?: (sucursal: SucursalDTO) => void;
  onSucursalUpdated?: (sucursal: SucursalDTO) => void;
}

export const SucursalesManager: React.FC<SucursalesManagerProps> = ({
  clienteId,
  clienteNombre,
  sucursales,
  onSucursalCreated,
  onSucursalUpdated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<SucursalDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenCreateModal = () => {
    setSelectedSucursal(null); // null = modo crear
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sucursal: SucursalDTO) => {
    setSelectedSucursal(sucursal); // objeto = modo editar
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSucursal(null);
  };

  const handleSubmit = async (data: CreateSucursalDTO | UpdateSucursalDTO) => {
    setIsLoading(true);
    try {
      if (selectedSucursal) {
        // Modo editar
        const updateData = data as UpdateSucursalDTO;
        // Aquí llamarías a tu servicio para actualizar
        // await SucursalesService.actualizarSucursal(selectedSucursal.id, updateData);
        
        toast.success('Sucursal actualizada correctamente');
        onSucursalUpdated?.(selectedSucursal);
      } else {
        // Modo crear
        const createData = data as CreateSucursalDTO;
        // Aquí llamarías a tu servicio para crear
        // const nuevaSucursal = await SucursalesService.crearSucursal(createData);
        
        toast.success('Sucursal creada correctamente');
        onSucursalCreated?.({} as SucursalDTO); // Placeholder
      }
    } catch (error) {
      console.error('Error al procesar sucursal:', error);
      toast.error('Error al procesar la sucursal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header con botón de crear */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sucursales ({sucursales.length})</h3>
        <Button 
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nueva Sucursal
        </Button>
      </div>

      {/* Lista de sucursales */}
      <div className="space-y-2">
        {sucursales.map((sucursal) => (
          <div 
            key={sucursal.id} 
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <h4 className="font-medium">{sucursal.nombre}</h4>
              <p className="text-sm text-muted-foreground">{sucursal.direccion}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenEditModal(sucursal)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {sucursales.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No hay sucursales registradas
          </div>
        )}
      </div>

      {/* Modal unificado */}
      <SucursalFormModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
        sucursal={selectedSucursal}
        clienteId={clienteId}
        clienteNombre={clienteNombre}
        onSubmit={handleSubmit}
        loading={isLoading}
      />
    </div>
  );
};
