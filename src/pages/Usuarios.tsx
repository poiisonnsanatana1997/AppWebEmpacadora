/**
 * Página principal de gestión de usuarios
 * Permite crear, actualizar, eliminar y gestionar usuarios
 */

// Importaciones de React y librerías externas
import { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// Importaciones de componentes personalizados
import { UsuarioTable } from '@/components/Usuarios/UsuarioTable';
import { TableHeader } from '@/components/Usuarios/TableHeader';
import { ActualizarUsuarioModal } from '@/components/Usuarios/ActualizarUsuarioModal';
import { CrearUsuarioModal } from '@/components/Usuarios/CrearUsuarioModal';

// Importaciones de hooks y servicios
import { usuariosService } from '../services/usuarios.service';
import { useUsuarios } from '@/hooks/usuarios/useUsuarios';

// Componentes estilizados para la interfaz
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: rgba(255, 255, 255, 0);
  width: 100%;
`;

const UsersTableContainer = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #E2E8F0;
  overflow: hidden;
  width: 100%;
  
  @media (max-width: 768px) {
    border-radius: 0.75rem;
  }
  
  @media (max-width: 480px) {
    border-radius: 0.5rem;
  }
`;

const TableContentSection = styled(motion.div)`
  padding: 1.5rem;
  overflow-x: auto;
  background: #fff;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const StyledTable = styled(motion.table)`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 1.08rem;
  border-radius: 1rem;
  overflow: hidden;

  th, td {
    padding: 1.1rem 1rem;
  }

  th {
    background: #f1f5f9;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  tr:hover td {
    background: #f8fafc;
    transition: background 0.2s;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    
    th, td {
      padding: 0.75rem 0.5rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
    
    th, td {
      padding: 0.5rem 0.25rem;
    }
  }
`;

export default function Usuarios() {
  // Hook personalizado para gestionar los usuarios
  const {
    usuarios,
    isLoading,
    isModalOpen,
    selectedUsuario,
    cargarUsuarios,
    handleOpenModal,
    handleCloseModal,
    onSubmit
  } = useUsuarios();

  // Efecto para cargar los usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []); // Solo se ejecuta al montar el componente

  // Manejadores para abrir y cerrar modales
  const handleOpenModalNuevoUsuario = useCallback(() => {
    handleOpenModal();
  }, [handleOpenModal]);

  const handleOpenModalEditar = useCallback((id: number) => {
    const usuario = usuarios.find((u: { id: number }) => u.id === id);
    if (usuario) {
      handleOpenModal(usuario);
    }
  }, [usuarios, handleOpenModal]);

  // Handler para activar/desactivar usuarios
  const handleToggleStatus = async (id: number, activo: boolean) => {
    try {
      const usuario = usuarios.find(u => u.id === id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      await usuariosService.actualizarUsuario(id, {
        name: usuario.name,
        phoneNumber: usuario.phoneNumber,
        isActive: activo
      });
      
      toast.success(activo ? 'Usuario reactivado correctamente' : 'Usuario desactivado correctamente');
      await cargarUsuarios();
    } catch (error) {
      toast.error('Error al cambiar el estado del usuario');
    }
  };

  // Renderizado del componente
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster richColors position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Contenedor principal de la tabla de usuarios */}
        <UsersTableContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TableHeader 
            onNewUserClick={handleOpenModalNuevoUsuario}
          />

          <TableContentSection
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <StyledTable
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <UsuarioTable
                usuarios={usuarios}
                loading={isLoading}
                error={null}
                onEdit={handleOpenModalEditar}
                onToggleStatus={handleToggleStatus}
              />
            </StyledTable>
          </TableContentSection>
        </UsersTableContainer>
      </motion.div>

      {/* Modales de usuario */}
      {selectedUsuario ? (
        <ActualizarUsuarioModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
          usuario={selectedUsuario}
        />
      ) : (
        <CrearUsuarioModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
        />
      )}
    </PageContainer>
  );
}
