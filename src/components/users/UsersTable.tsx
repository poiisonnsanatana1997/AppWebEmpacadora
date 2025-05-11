import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit2, Lock, Unlock, Trash2, Loader2, ArrowUpDown, ChevronUp, ChevronDown, Users } from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UsersTable({
  currentUsers,
  loading,
  selectedUsers,
  setSelectedUsers,
  handleSort,
  sortConfig,
  getRoleLabel,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleActive
}: {
  currentUsers: any[];
  loading: boolean;
  selectedUsers: number[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>;
  handleSort: (key: "name" | "username" | "email" | "roleName" | "isActive" | "createdAt") => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' };
  getRoleLabel: (roleName: string) => string;
  onViewUser: (user: any) => void;
  onEditUser: (user: any) => void;
  onDeleteUser: (user: any) => void;
  onToggleActive: (user: any) => void;
}) {
  return (
    <div className="px-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={currentUsers.length > 0 && selectedUsers.length === currentUsers.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedUsers(currentUsers.map(user => user.id));
                  } else {
                    setSelectedUsers([]);
                  }
                }}
                aria-label="Seleccionar todos los usuarios"
              />
            </TableHead>
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={() => handleSort('name')} className="hover:bg-slate-100">
                      Nombre
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ordenar por nombre</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={() => handleSort('username')} className="hover:bg-slate-100">
                      Usuario
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ordenar por nombre de usuario</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={() => handleSort('email')} className="hover:bg-slate-100">
                      Email
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ordenar por correo electrónico</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={() => handleSort('roleName')} className="hover:bg-slate-100">
                      Rol
                      {sortConfig.key === 'roleName' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ordenar por rol</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={() => handleSort('isActive')} className="hover:bg-slate-100">
                      Estado
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ordenar por estado</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead className="w-[150px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="wait">
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400 mb-2" />
                    <div className="text-slate-400">Cargando usuarios...</div>
                  </motion.div>
                </TableCell>
              </TableRow>
            ) : currentUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <Users size={40} className="text-slate-200 mb-2" />
                    <div className="text-slate-400">No se encontraron usuarios.</div>
                    <div className="text-slate-300 text-sm mt-1">Intenta ajustar los filtros o la búsqueda</div>
                  </motion.div>
                </TableCell>
              </TableRow>
            ) : (
              currentUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="transition-colors hover:bg-slate-50"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers(prev => [...prev, user.id]);
                        } else {
                          setSelectedUsers(prev => prev.filter(id => id !== user.id));
                        }
                      }}
                      aria-label={`Seleccionar usuario ${user.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {getRoleLabel(user.roleName)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'destructive'}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onViewUser(user)} className="hover:bg-slate-100">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver detalles</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onEditUser(user)} className="hover:bg-slate-100">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Editar usuario</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onToggleActive(user)} className="hover:bg-slate-100">
                              {user.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user.isActive ? 'Desactivar usuario' : 'Activar usuario'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => onDeleteUser(user)} className="hover:bg-slate-100 hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar usuario</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
export default UsersTable; 