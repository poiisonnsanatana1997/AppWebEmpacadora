import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { usuariosService } from '../../services/usuarios.service';
import { UsuarioDto, CrearUsuarioDto, ActualizarUsuarioDto, UsuarioFormData } from '../../types/Usuarios/usuarios.type';

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioDto | null>(null);

  const cargarUsuarios = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await usuariosService.obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      toast.error('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOpenModal = useCallback((usuario?: UsuarioDto) => {
    if (usuario) {
      setSelectedUsuario(usuario);
    } else {
      setSelectedUsuario(null);
    }
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUsuario(null);
  }, []);

  const onSubmit = useCallback(async (data: UsuarioFormData) => {
    try {
      if (selectedUsuario) {
        const usuarioParaActualizar: ActualizarUsuarioDto = {
          name: data.name,
          phoneNumber: data.phoneNumber,
          isActive: data.isActive
        };
        await usuariosService.actualizarUsuario(selectedUsuario.id, usuarioParaActualizar);
        toast.success('Usuario actualizado correctamente');
      } else {
        const usuarioParaCrear: CrearUsuarioDto = {
          name: data.name,
          username: data.username,
          password: data.password!,
          email: data.email,
          phoneNumber: data.phoneNumber,
          isActive: data.isActive,
          roleId: data.roleId
        };
        await usuariosService.crearUsuario(usuarioParaCrear);
        toast.success('Usuario creado correctamente');
      }
      handleCloseModal();
      cargarUsuarios();
    } catch (error) {
      toast.error('Error al guardar el usuario');
    }
  }, [selectedUsuario, cargarUsuarios, handleCloseModal]);

  return {
    usuarios,
    isLoading,
    isModalOpen,
    selectedUsuario,
    cargarUsuarios,
    handleOpenModal,
    handleCloseModal,
    onSubmit
  };
}; 