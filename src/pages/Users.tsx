// ----------------------
// Importaciones principales de React, librerías de UI, iconos y utilidades
// ----------------------
import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Download,
  HelpCircle,
  UserPlus,
  Edit2,
  Eye,
  Lock,
  Unlock,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  X,
  Menu,
  Trash2,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import api from '@/api/axios';
import { User } from '@/api/users';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NewUserForm } from '@/components/forms/NewUserForm';
import { Toaster, toast } from "sonner";
import { EditUserDialog } from '@/components/forms/EditUserDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import UsersHeader from './UsersHeader';
import UsersTable from '@/components/users/UsersTable';
import UsersPagination from '@/components/users/UsersPagination';
import UsersFilters from '@/components/users/UsersFilters';
// ----------------------
// Componentes estilizados y variantes de animación para la UI
// ----------------------
// Estos componentes definen la estructura visual y responsiva de la página
// con styled-components y animaciones de framer-motion

// Header principal de la página
const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
  }
`;

// Contenido del header (título y subtítulo)
const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

// Título del header
const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

// Subtítulo del header
const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
`;

// Acciones del header (botones)
const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
    justify-content: flex-end;
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
}

const tagVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } }
}

const cardVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30
    }
  },
  tap: { scale: 0.98 }
}

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #F1F5F9;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1E293B;

  button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #64748B;

    &:hover {
      color: #DC2626;
    }
  }
`;

const UsersTableContainer = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  overflow: hidden;
`

const TableHeaderSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #E2E8F0;
`

const TableTitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1E293B;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`

const TableContentSection = styled.div`
  padding: 1.5rem;
  overflow-x: auto;
`

const MobileMenuButton = styled(motion.button)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const PrimaryButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #1E40AF;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background: #1E3A8A;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  width: 100%;

  &:focus-within {
    border-color: #1E40AF;
    box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.1);
  }

  @media (min-width: 768px) {
    width: 300px;
  }
`

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  margin-left: 0.5rem;
  color: #1E293B;
  font-size: 0.875rem;

  &::placeholder {
    color: #94A3B8;
  }
`

// ----------------------
// Tipos e interfaces para filtros, estado y ordenamiento
// ----------------------
// Estructura de un filtro activo
interface Filter {
  id: string;
  type: string;
  value: string;
  label: string;
}
// Estado de los filtros
interface FilterState {
  roleName: string;
  status: string;
  dateRange: string;
}
// Configuración de ordenamiento de la tabla
interface SortConfig {
  key: keyof typeof sortOptions;
  direction: 'asc' | 'desc';
}

// ----------------------
// Opciones de ordenamiento para la tabla de usuarios
// ----------------------
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

// ----------------------
// Función utilitaria para mostrar el nombre legible del rol
// ----------------------
function getRoleLabel(roleName: string) {
  switch (roleName) {
    case 'admin': return 'Administrador';
    case 'manager': return 'Gerente';
    case 'user': return 'Usuario';
    default: return roleName;
  }
}

// ----------------------
// Componente principal de la página de gestión de usuarios
// ----------------------
export default function UsersPage() {
  // ----------------------
  // Estados principales para búsqueda, filtros, usuarios, carga, errores, selección, paginación y ordenamiento
  // ----------------------
  const [searchQuery, setSearchQuery] = useState(""); // Búsqueda
  const [showMobileMenu, setShowMobileMenu] = useState(false); // Menú móvil
  const [showNewUserForm, setShowNewUserForm] = useState(false); // Modal de nuevo usuario
  const [filters, setFilters] = useState<FilterState>({ roleName: "", status: "", dateRange: "" });
  const [users, setUsers] = useState<User[]>([]); // Lista de usuarios
  const [loading, setLoading] = useState(true); // Estado de carga
  const [, setError] = useState<string | null>(null); // Error de carga
  // Filtros activos y selección múltiple
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' })
  // Estados para los modales de edición, eliminación y vista de usuario
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // ----------------------
  // Efecto para cargar los usuarios al montar el componente
  // ----------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get<User[]>('/users');
        setUsers(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los usuarios');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ----------------------
  // Funciones para manejar filtros, búsqueda, selección y ordenamiento
  // ----------------------
  // Maneja el cambio de filtros (rol, estado, etc.)
  const handleFilterChange = (type: keyof FilterState, value: string) => {
    if (!value) return;
    setFilters(prev => ({ ...prev, [type]: value }));
    // Etiquetas legibles para los filtros
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
  // Elimina un filtro activo
  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId))
    const [type] = filterId.split("-")
    setFilters(prev => ({ ...prev, [type]: "" }))
  }
  // Maneja el cambio en la barra de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  // Paginación y ordenamiento
  const itemsPerPage = 10
  const totalPages = Math.ceil(users.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  // Ordena la tabla por la columna seleccionada
  const handleSort = (key: keyof typeof sortOptions) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }
  // Acciones en lote (activar, desactivar, eliminar, exportar)
  const handleBatchAction = (action: string) => {
    console.log(`Acción ${action} aplicada a usuarios:`, selectedUsers)
    setSelectedUsers([])
  }

  // ----------------------
  // Filtrado y búsqueda avanzada
  // ----------------------
  // Aplica los filtros y búsqueda sobre la lista de usuarios
  const filteredUsers = users.filter((user) => {
    // Filtro por rol
    if (filters.roleName && user.roleName !== filters.roleName) return false;
    // Filtro por estado
    if (filters.status) {
      if (filters.status === 'active' && !user.isActive) return false;
      if (filters.status === 'inactive' && user.isActive) return false;
    }
    // Búsqueda por nombre, usuario o email
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
  // Ordena los usuarios filtrados
  const sortedUsers = [...filteredUsers].sort((a, b) =>
    sortOptions[sortConfig.key](a, b, sortConfig.direction)
  );
  // Usuarios de la página actual
  const currentUsers = sortedUsers.slice(startIndex, endIndex);
  // Callback para agregar un usuario nuevo a la lista
  const handleUserCreated = useCallback((newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
    setShowNewUserForm(false);
  }, []);

  // ----------------------
  // Renderizado principal de la página
  // ----------------------
  return (
    <>
      {/* Toasts para feedback visual */}
      <Toaster richColors position="top-right" />
      {/* Animación de entrada */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        {/* Header principal de la página */}

        <UsersHeader
          onNewUser={() => setShowNewUserForm(true)}
          onToggleMenu={() => setShowMobileMenu(!showMobileMenu)}
          showMobileMenu={showMobileMenu}
        />

        <UsersTableContainer variants={itemVariants}>

          <TableHeaderSection>
            <UsersFilters
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              filters={filters}
              handleFilterChange={handleFilterChange}
              activeFilters={activeFilters}
              removeFilter={removeFilter}
            />
          </TableHeaderSection>
          
          <UsersTable
            currentUsers={currentUsers}
            loading={loading}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            handleSort={handleSort}
            sortConfig={sortConfig}
            getRoleLabel={getRoleLabel}
            onViewUser={user => { setViewUser(user); setViewDialogOpen(true); }}
            onEditUser={user => { setEditUser(user); setEditDialogOpen(true); }}
            onDeleteUser={user => { setUserToDelete(user); setDeleteDialogOpen(true); }}
            onToggleActive={user => {/* Aquí puedes implementar activar/desactivar */ }}
          />
          <UsersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={users.length}
          />

        </UsersTableContainer>

        <NewUserForm
          open={showNewUserForm}
          onOpenChange={setShowNewUserForm}
          onSuccess={handleUserCreated}
        />

        {editUser && (
          <EditUserDialog
            open={editDialogOpen}
            onOpenChange={(open: boolean) => {
              setEditDialogOpen(open);
              if (!open) setEditUser(null);
            }}
            user={editUser}
            onSuccess={(updatedUser: User) => {
              setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
              setEditDialogOpen(false);
              setEditUser(null);
            }}
          />
        )}

        {userToDelete && (
          <Dialog open={deleteDialogOpen} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setUserToDelete(null); }}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>¿Eliminar usuario?</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminar a <b>{userToDelete.name}</b>? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setUserToDelete(null); }} disabled={isDeleting}>Cancelar</Button>
                <Button variant="destructive" onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await api.delete(`/users/${userToDelete.id}`);
                    setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
                    setDeleteDialogOpen(false);
                    setUserToDelete(null);
                    setIsDeleting(false);
                    toast.success('Usuario eliminado correctamente');
                  } catch (error: any) {
                    setIsDeleting(false);
                    toast.error(error.message || 'Error al eliminar el usuario');
                  }
                }} disabled={isDeleting}>
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {viewUser && (
          <Dialog open={viewDialogOpen} onOpenChange={(open) => { setViewDialogOpen(open); if (!open) setViewUser(null); }}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Detalle de usuario</DialogTitle>
                <DialogDescription>
                  Información detallada del usuario.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-2">
                <div><b>Nombre:</b> {viewUser.name}</div>
                <div><b>Usuario:</b> {viewUser.username}</div>
                <div><b>Email:</b> {viewUser.email}</div>
                <div><b>Rol:</b> {getRoleLabel(viewUser.roleName)}</div>
                <div><b>Teléfono:</b> {viewUser.phoneNumber}</div>
                <div><b>Estado:</b> {viewUser.isActive ? 'Activo' : 'Inactivo'}</div>
                <div><b>Creado:</b> {new Date(viewUser.createdAt).toLocaleString()}</div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setViewDialogOpen(false); setViewUser(null); }}>Cerrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </>
  );
} 