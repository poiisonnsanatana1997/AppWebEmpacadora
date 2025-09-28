import React, { useEffect, useState } from 'react';
import { CajaClienteDTO } from '../../../types/Cajas/cajaCliente.types';
import { CajaClienteModalMobile } from './CajaClienteModalMobile.tsx';
import { CajaClienteModalDesktop } from './CajaClienteModalDesktop.tsx';

interface CajaClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteNombre?: string;
  cajasCliente: CajaClienteDTO[];
  cajaSeleccionada: CajaClienteDTO | null;
  showForm: boolean;
  loading?: boolean;
  onCrearCajaCliente: () => void;
  onEditarCajaCliente: (caja: CajaClienteDTO) => void;
  onEliminarCajaCliente: (id: number) => void;
  onSubmitForm: (data: any) => void;
  onCancelForm: () => void;
}

export const CajaClienteModal: React.FC<CajaClienteModalProps> = ({
  open,
  onOpenChange,
  clienteNombre,
  cajasCliente,
  cajaSeleccionada,
  showForm,
  loading = false,
  onCrearCajaCliente,
  onEditarCajaCliente,
  onEliminarCajaCliente,
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
    cajasCliente,
    cajaSeleccionada,
    showForm,
    loading,
    onCrearCajaCliente,
    onEditarCajaCliente,
    onEliminarCajaCliente,
    onSubmitForm,
    onCancelForm
  };

  // ===== RENDERIZADO CONDICIONAL =====
  // Si es móvil, usar el componente drawer separado
  if (isMobile) {
    return <CajaClienteModalMobile {...commonProps} />;
  }

  // Si es desktop, usar el componente desktop separado
  return <CajaClienteModalDesktop {...commonProps} />;
};
