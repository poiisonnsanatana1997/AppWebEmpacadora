import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Filter,
  Download,
  HelpCircle,
  ChevronDown,
  UserPlus,
  UserCheck,
  UserX,
  Menu,
  X,
  ChevronUp,
  Trash2,
  Edit2,
  Eye,
  Mail,
  Lock,
  Unlock,
  ArrowUpDown
} from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Importar los componentes de la tabla
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { NewUserForm } from '@/components/forms/NewUserForm';
import { Toaster } from "sonner";

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #F8FAFC;
  position: relative;
  padding: 1rem;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

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

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
`;

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

const filterVariants = {
  hidden: { opacity: 0, y: -20 },
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

const StatsCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  width: 100%;
  cursor: pointer;

  h3 {
    color: #64748B;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    line-height: 20px;
    font-weight: 500;

    svg {
      width: 20px;
      height: 20px;
      stroke-width: 1.5;
    }
  }

  .value {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1E293B;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  }

  .change {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;

    &.positive {
      color: #059669;
      background: #ECFDF5;
    }

    &.negative {
      color: #DC2626;
      background: #FEF2F2;
    }
  }
`;

const FilterSection = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1E293B;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 20px;
    height: 20px;
    color: #64748B;
  }
`;

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

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #E2E8F0;
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

const TableHeaderCell = TableHead;
const DataTable = Table;
const IconButton = Button;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;

  ${({ status }) => status === 'active' && `
    background: #ECFDF5;
    color: #059669;
  `}

  ${({ status }) => status === 'inactive' && `
    background: #FEF2F2;
    color: #DC2626;
  `}
`;

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

interface Filter {
  id: string;
  type: string;
  value: string;
  label: string;
}

interface FilterState {
  role: string;
  status: string;
  dateRange: string;
}

interface SortConfig {
  key: keyof typeof sortOptions;
  direction: 'asc' | 'desc';
}

const sortOptions = {
  name: (a: any, b: any, direction: 'asc' | 'desc') => 
    direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  email: (a: any, b: any, direction: 'asc' | 'desc') => 
    direction === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email),
  role: (a: any, b: any, direction: 'asc' | 'desc') => 
    direction === 'asc' ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role),
  status: (a: any, b: any, direction: 'asc' | 'desc') => 
    direction === 'asc' ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
}

const TableActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: space-between;
  align-items: center;
`

const BatchActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #E2E8F0;
`

const Pagination = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const PageInfo = styled.span`
  color: #64748B;
  font-size: 0.875rem;
`

const SortButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #64748B;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;

  &:hover {
    color: #1E293B;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    role: "",
    status: "",
    dateRange: ""
  });

  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' })
  const [showActions, setShowActions] = useState<number | null>(null)

  const handleFilterChange = (type: keyof FilterState, value: string) => {
    if (!value) return;

    setFilters(prev => ({ ...prev, [type]: value }));
    
    const filterLabels: Record<keyof FilterState, Record<string, string>> = {
      role: {
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
    setActiveFilters(prev => prev.filter(f => f.id !== filterId))
    const [type] = filterId.split("-")
    setFilters(prev => ({ ...prev, [type]: "" }))
  }

  const clearFilters = () => {
    setFilters({ role: "", status: "", dateRange: "" })
    setActiveFilters([])
  }

  const applyFilters = () => {
    // Aquí iría la lógica para aplicar los filtros
    console.log("Filtros aplicados:", filters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Datos de ejemplo
  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'manager', status: 'active' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 'user', status: 'inactive' },
  ];

  const itemsPerPage = 10
  const totalPages = Math.ceil(users.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const handleSort = (key: keyof typeof sortOptions) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleBatchAction = (action: string) => {
    console.log(`Acción ${action} aplicada a usuarios:`, selectedUsers)
    setSelectedUsers([])
  }

  const sortedUsers = [...users].sort((a, b) => 
    sortOptions[sortConfig.key](a, b, sortConfig.direction)
  )

  const currentUsers = sortedUsers.slice(startIndex, endIndex)

  const handleUserCreated = useCallback((values: any) => {
    // Aquí iría la lógica para actualizar la lista de usuarios
    console.log('Usuario creado:', values);
  }, []);

  return (
    <>
      <Toaster richColors position="top-right" />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Header>
          <HeaderContent>
            <motion.div variants={itemVariants}>
              <HeaderTitle>Gestión de Usuarios</HeaderTitle>
              <HeaderSubtitle>Administra los usuarios y sus permisos</HeaderSubtitle>
            </motion.div>
          </HeaderContent>
          <HeaderActions>
            <MobileMenuButton 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
            >
              <Menu />
            </MobileMenuButton>
            <motion.button
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
            >
              <Filter />
            </motion.button>
            <motion.button
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
            >
              <Download />
            </motion.button>
            <motion.button
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
            >
              <HelpCircle />
            </motion.button>
            <PrimaryButton
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowNewUserForm(true)}
            >
              <UserPlus size={18} />
              Nuevo Usuario
            </PrimaryButton>
          </HeaderActions>
        </Header>

        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
          >
            <StatsCard>
              <h3><Users /> Total de Usuarios</h3>
              <div className="value">24</div>
              <span className="change positive">+3 este mes</span>
            </StatsCard>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
          >
            <StatsCard>
              <h3><UserCheck /> Usuarios Activos</h3>
              <div className="value">18</div>
              <span className="change positive">+2 este mes</span>
            </StatsCard>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
          >
            <StatsCard>
              <h3><UserX /> Usuarios Inactivos</h3>
              <div className="value">6</div>
              <span className="change negative">-1 este mes</span>
            </StatsCard>
          </motion.div>
        </motion.div>

        <UsersTableContainer variants={itemVariants}>
          <TableHeaderSection>
            <TableTitleSection>
              <h2>
                <Users size={24} className="text-slate-400" />
                Lista de Usuarios
              </h2>
              <div className="flex items-center gap-2">
                <SearchContainer>
                  <Search size={18} color="#94A3B8" />
                  <SearchInput
                    placeholder="Buscar usuarios..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </SearchContainer>
                <Button onClick={() => setShowNewUserForm(true)}>
                  <UserPlus size={18} />
                  Nuevo Usuario
                </Button>
              </div>
            </TableTitleSection>

            <FilterGrid>
              <FilterGroup>
                <Label>Rol</Label>
                <Select
                  value={filters.role}
                  onValueChange={(value) => handleFilterChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="user">Usuario</SelectItem>
                  </SelectContent>
                </Select>
              </FilterGroup>

              <FilterGroup>
                <Label>Estado</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </FilterGroup>

              <FilterGroup>
                <Label>Período</Label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => handleFilterChange("dateRange", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mes</SelectItem>
                    <SelectItem value="year">Este año</SelectItem>
                  </SelectContent>
                </Select>
              </FilterGroup>
            </FilterGrid>

            <AnimatePresence>
              {activeFilters.length > 0 && (
                <ActiveFilters>
                  {activeFilters.map((filter) => (
                    <motion.div
                      key={filter.id}
                      variants={tagVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                    >
                      <FilterTag>
                        {filter.label}
                        <button onClick={() => removeFilter(filter.id)}>
                          <X size={14} />
                        </button>
                      </FilterTag>
                    </motion.div>
                  ))}
                </ActiveFilters>
              )}
            </AnimatePresence>

            {selectedUsers.length > 0 && (
              <TableActions>
                <BatchActions>
                  <Button variant="outline" onClick={() => handleBatchAction('activate')}>
                    <Unlock size={16} />
                    Activar Seleccionados
                  </Button>
                  <Button variant="outline" onClick={() => handleBatchAction('deactivate')}>
                    <Lock size={16} />
                    Desactivar Seleccionados
                  </Button>
                  <Button variant="outline" onClick={() => handleBatchAction('delete')}>
                    <Trash2 size={16} />
                    Eliminar Seleccionados
                  </Button>
                </BatchActions>
                <Button variant="outline" onClick={() => handleBatchAction('export')}>
                  <Download size={16} />
                  Exportar Seleccionados
                </Button>
              </TableActions>
            )}
          </TableHeaderSection>

          <TableContentSection>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={selectedUsers.length === users.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers(users.map(user => user.id))
                        } else {
                          setSelectedUsers([])
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('name')}>
                      Nombre
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('email')}>
                      Email
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('role')}>
                      Rol
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('status')}>
                      Estado
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(prev => [...prev, user.id])
                          } else {
                            setSelectedUsers(prev => prev.filter(id => id !== user.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          {user.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContentSection>

          <TableFooter>
            <PageInfo>
              Mostrando {startIndex + 1} a {Math.min(endIndex, users.length)} de {users.length} usuarios
            </PageInfo>
            <Pagination>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <PageInfo>{currentPage} de {totalPages}</PageInfo>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </Button>
            </Pagination>
          </TableFooter>
        </UsersTableContainer>

        <NewUserForm 
          open={showNewUserForm} 
          onOpenChange={setShowNewUserForm}
          onSuccess={handleUserCreated}
        />
      </motion.div>
    </>
  );
} 