import React, { useEffect, useState } from 'react';
import { SucursalDTO } from '../../../types/Sucursales/sucursales.types';
import { CrearSucursalFormData, ActualizarSucursalFormData } from '../../../schemas/sucursalFormSchema';
import { SucursalModalMobile } from './SucursalModalMobile';
import { SucursalModalDesktop } from './SucursalModalDesktop';

interface SucursalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteNombre?: string;
  sucursales: SucursalDTO[];
  sucursalSeleccionada: SucursalDTO | null;
  showForm: boolean;
  loading?: boolean;
  onCrearSucursal: () => void;
  onEditarSucursal: (sucursal: SucursalDTO) => void;
  onEliminarSucursal: (id: number) => void;
  onSubmitForm: (data: CrearSucursalFormData | ActualizarSucursalFormData) => void;
  onCancelForm: () => void;
}

export const SucursalModal: React.FC<SucursalModalProps> = ({
  open,
  onOpenChange,
  clienteNombre,
  sucursales,
  sucursalSeleccionada,
  showForm,
  loading = false,
  onCrearSucursal,
  onEditarSucursal,
  onEliminarSucursal,
  onSubmitForm,
  onCancelForm
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil con mejor lógica
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const mobile = width <= 768;
      setIsMobile(mobile);

    };
    
    // Verificar inmediatamente
    checkMobile();
    
    // Agregar event listener para cambios de tamaño
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Props comunes para ambos componentes
  const commonProps = {
    open,
    onOpenChange,
    clienteNombre,
    sucursales,
    sucursalSeleccionada,
    showForm,
    loading,
    onCrearSucursal,
    onEditarSucursal,
    onEliminarSucursal,
    onSubmitForm,
    onCancelForm
  };

  // ===== RENDERIZADO CONDICIONAL =====
  // Si es móvil, usar el componente móvil separado
  if (isMobile) {
    return <SucursalModalMobile {...commonProps} />;
  }

  // Si es desktop, usar el componente desktop separado
  return <SucursalModalDesktop {...commonProps} />;
};
