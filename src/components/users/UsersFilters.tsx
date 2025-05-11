import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UsersFilters({
  searchQuery,
  handleSearchChange,
  filters,
  handleFilterChange,
  activeFilters,
  removeFilter
}: {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: { roleName: string; status: string };
  handleFilterChange: (type: 'roleName' | 'status', value: string) => void;
  activeFilters: { id: string; label: string }[];
  removeFilter: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Barra de búsqueda */}
        <div className="relative flex-1">
          <Input
            className="pl-9"
            placeholder="Buscar por nombre, usuario o email..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
        </div>

        {/* Selects de filtros */}
        <div className="flex flex-col md:flex-row gap-2">
          <Select
            value={filters.roleName}
            onValueChange={(value) => handleFilterChange('roleName', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="manager">Gerente</SelectItem>
              <SelectItem value="user">Usuario</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filtros activos */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {activeFilters.map((filter) => (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <Filter className="h-3 w-3" />
                  {filter.label}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => removeFilter(filter.id)}
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Eliminar filtro</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UsersFilters; 