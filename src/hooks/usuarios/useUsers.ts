import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { UsuarioDto } from '@/types/Usuarios/usuarios.type';
import { UserFilters } from '@/types/Usuarios/filters.type';

interface UseUsersReturn {
  users: UsuarioDto[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUsers(filters: UserFilters): UseUsersReturn {
  const [users, setUsers] = useState<UsuarioDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.get('/usuarios', { params: filters });
      setUsers(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(new Error(axiosError.response?.data?.message || 'Error al cargar usuarios'));
      } else {
        setError(new Error('Error al cargar usuarios'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.search, filters.roleName, filters.isActive]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
  };
} 