import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../ui/table';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, MapPin, Phone, Mail, Building2, User, Calendar, Hash } from 'lucide-react';
import { SucursalDTO } from '../../../types/Sucursales/sucursales.types';
import { format } from 'date-fns';

interface SucursalTableProps {
  sucursales: SucursalDTO[];
  onEdit: (sucursal: SucursalDTO) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const SucursalTable: React.FC<SucursalTableProps> = ({
  sucursales,
  onEdit,
  onDelete,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando sucursales...</div>
      </div>
    );
  }

  if (sucursales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <Building2 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No hay sucursales registradas
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          Este cliente aún no tiene sucursales registradas. Crea la primera sucursal para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header de la tabla */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Lista de Sucursales</h3>
        <p className="text-sm text-gray-600 mt-1">
          Haz clic en los tres puntos para editar o eliminar una sucursal
        </p>
      </div>

      {/* Contenedor de scroll para la tabla */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              <TableRow>
                <TableHead className="w-[180px] font-semibold text-gray-700">Sucursal</TableHead>
                <TableHead className="w-[220px] font-semibold text-gray-700">Dirección</TableHead>
                <TableHead className="w-[180px] font-semibold text-gray-700">Contacto</TableHead>
                <TableHead className="w-[100px] font-semibold text-gray-700">Estado</TableHead>
                <TableHead className="w-[120px] font-semibold text-gray-700">Fecha</TableHead>
                <TableHead className="w-[80px] font-semibold text-gray-700">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sucursales.map((sucursal, index) => (
                <TableRow 
                  key={sucursal.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{sucursal.nombre}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Hash className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">ID: {sucursal.id}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 truncate" title={sucursal.direccion}>
                        {sucursal.direccion}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-green-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700">{sucursal.telefono}</span>
                      </div>
                      {sucursal.correo && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-blue-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600 truncate" title={sucursal.correo}>
                            {sucursal.correo}
                          </span>
                        </div>
                      )}
                      {sucursal.encargadoAlmacen && (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-gray-500 flex-shrink-0" />
                          <span className="text-xs text-gray-600 truncate" title={sucursal.encargadoAlmacen}>
                            {sucursal.encargadoAlmacen}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-3">
                    <Badge 
                      variant={sucursal.activo ? "default" : "secondary"}
                      className={`text-xs font-medium ${
                        sucursal.activo 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {sucursal.activo ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {format(new Date(sucursal.fechaRegistro), 'dd/MM/yyyy')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(sucursal.fechaRegistro), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-600" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem 
                          onClick={() => onEdit(sucursal)} 
                          className="text-sm cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2 text-blue-600" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(sucursal.id)}
                          className="text-sm cursor-pointer text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
