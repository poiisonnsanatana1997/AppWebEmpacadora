import { useState, useCallback, useEffect } from 'react';
import api from '@/api/axios';
import { User } from '@/api/users';

// Tipos para filtros y ordenamiento
export interface Filter {
  id: string;
  type: string;
  value: string;
  label: string;
}
export interface FilterState {
  roleName: string;
  status: string;
  dateRange: string;
}
export interface SortConfig {
  key: keyof typeof sortOptions;
  direction: 'asc' | 'desc';
}

// Opciones de ordenamiento
const sortOptions = {
  name: (a: any, b: any, direction: 'asc' | 'desc') =>
    direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  username: (a: any, b: any, direction: 'asc' | 'desc') =>
    direction === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username),
  email: (a: any, b: any, direction: 'asc' | 'desc') =>
    direction === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email),
  roleName: (a: any, b: any, direction: 'asc' | 'desc') =>
    direction === 'asc' ? a.roleName.localeCompare(b.roleName) : b.roleName.localeCompare(a.roleName),
  isActive: (a: any, b: any, direction: 'asc' | 'desc') =>
    direction === 'asc' ? (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1) : (a.isActive === b.isActive ? 0 : a.isActive ? 1 : -1),
  createdAt: (a: any, b: any, direction: 'asc' | 'desc') =>
    direction === 'asc' ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
};

// Utilidad para mostrar el nombre legible del rol
export function getRoleLabel(roleName: string) {
  switch (roleName) {
    case 'admin': return 'Administrador';
    case 'manager': return 'Gerente';
    case 'user': return 'Usuario';
    default: return roleName;
  }
}

export function useUsersLogic() {
  // Estados principales
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({ roleName: "", status: "", dateRange: "" });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  // Modales y acciones
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get<User[]>('/users');
        setUsers(response.data);
      } catch (err) {
        // Manejo de error (puedes usar toast aquí si lo deseas)
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handlers de filtros
  const handleFilterChange = (type: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    
    if (value === 'all') {
      setActiveFilters(prev => prev.filter(f => f.type !== type));
      return;
    }

    const filterLabels: Record<keyof FilterState, Record<string, string>> = {
      roleName: {
        admin: "Administrador",
        manager: "Gerente",
        user: "Usuario"
      },
      status: {
        active: "Activo",
        inactive: "Inactivo"
      },
      dateRange: {
        today: "Hoy",
        week: "Esta semana",
        month: "Este mes",
        year: "Este año"
      }
    };
    const newFilter: Filter = {
      id: `${type}-${value}`,
      type,
      value,
      label: filterLabels[type][value]
    };
    setActiveFilters(prev => [...prev.filter(f => f.type !== type), newFilter]);
  };
  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
    const [type] = filterId.split("-");
    setFilters(prev => ({ ...prev, [type]: "" }));
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Paginación y ordenamiento
  const itemsPerPage = 10;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handleSort = (key: keyof typeof sortOptions) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Acciones en lote
  const handleBatchAction = (action: string) => {
    // Aquí puedes implementar la lógica real
    setSelectedUsers([]);
  };

  // Filtrado y ordenamiento
  const filteredUsers = users.filter((user) => {
    if (filters.roleName && filters.roleName !== 'all' && user.roleName !== filters.roleName) return false;
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active' && !user.isActive) return false;
      if (filters.status === 'inactive' && user.isActive) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !user.name.toLowerCase().includes(q) &&
        !user.username.toLowerCase().includes(q) &&
        !user.email.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });
  const sortedUsers = [...filteredUsers].sort((a, b) => sortOptions[sortConfig.key](a, b, sortConfig.direction));
  const currentUsers = sortedUsers.slice(startIndex, endIndex);

  // Callback para agregar un usuario nuevo
  const handleUserCreated = useCallback((newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
    setShowNewUserForm(false);
  }, []);

  return {
    // Estados y setters para UI
    searchQuery, setSearchQuery,
    filters, setFilters,
    users, setUsers,
    loading,
    activeFilters, setActiveFilters,
    selectedUsers, setSelectedUsers,
    currentPage, setCurrentPage,
    sortConfig, setSortConfig,
    showNewUserForm, setShowNewUserForm,
    editUser, setEditUser,
    editDialogOpen, setEditDialogOpen,
    userToDelete, setUserToDelete,
    deleteDialogOpen, setDeleteDialogOpen,
    isDeleting, setIsDeleting,
    viewUser, setViewUser,
    viewDialogOpen, setViewDialogOpen,
    // Datos derivados
    itemsPerPage, totalPages, startIndex, endIndex,
    filteredUsers, sortedUsers, currentUsers,
    // Handlers
    handleFilterChange,
    removeFilter,
    handleSearchChange,
    handleSort,
    handleBatchAction,
    handleUserCreated,
    // Utilidades
    getRoleLabel,
  };
} 