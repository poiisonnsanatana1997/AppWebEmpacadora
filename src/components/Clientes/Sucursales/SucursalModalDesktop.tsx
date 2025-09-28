import React, { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { Building2, Plus, MapPin, Phone, Mail, User, Calendar, Hash, ArrowLeft } from 'lucide-react';
import { SucursalForm } from './SucursalForm';
import { SucursalDTO } from '../../../types/Sucursales/sucursales.types';
import { CrearSucursalFormData, ActualizarSucursalFormData } from '../../../schemas/sucursalFormSchema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Badge } from '../../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';

interface SucursalModalDesktopProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteNombre?: string;
  sucursales: SucursalDTO[];
  sucursalSeleccionada: SucursalDTO | null;
  showForm: boolean;
  loading?: boolean;
  onCrearSucursal: () => void;
  onEditarSucursal: (sucursal: SucursalDTO) => void;
  onEliminarSucursal: (id: number) => void;
  onSubmitForm: (data: CrearSucursalFormData | ActualizarSucursalFormData) => void;
  onCancelForm: () => void;
}

export const SucursalModalDesktop: React.FC<SucursalModalDesktopProps> = ({
  open,
  onOpenChange,
  clienteNombre,
  sucursales,
  sucursalSeleccionada,
  showForm,
  loading = false,
  onCrearSucursal,
  onEditarSucursal,
  onEliminarSucursal,
  onSubmitForm,
  onCancelForm
}) => {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  // Vista de formulario
  if (showForm) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[600px] max-h-[80vh] p-0">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancelForm}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {sucursalSeleccionada ? 'Editar Sucursal' : 'Nueva Sucursal'}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    {sucursalSeleccionada 
                      ? 'Modifica la información de la sucursal'
                      : `Crear sucursal para ${clienteNombre}`
                    }
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <SucursalForm
              sucursal={sucursalSeleccionada}
              clienteNombre={clienteNombre}
              onSubmit={onSubmitForm}
              onCancel={onCancelForm}
              loading={loading}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Vista de lista de sucursales
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        {/* Header profesional */}
        <DialogHeader className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Sucursales de {clienteNombre}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-0.5">Administra las sucursales del cliente</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mr-8">
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md border">
                {sucursales.length} sucursales
              </div>
              <Button
                onClick={onCrearSucursal}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Sucursal
              </Button>
            </div>
          </div>
        </DialogHeader>

                 <div className="overflow-y-auto max-h-[calc(90vh-120px)]">

                    {/* Contenido principal */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mb-3"></div>
                <span className="text-sm text-gray-500">Cargando sucursales...</span>
              </div>
            ) : sucursales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-100 rounded-full p-3 mb-3">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-700 mb-1">
                  No hay sucursales
                </h3>
                <p className="text-sm text-gray-500 text-center mb-4 max-w-sm">
                  Comienza creando la primera sucursal para este cliente
                </p>
                <Button
                  onClick={onCrearSucursal}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Sucursal
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {sucursales.map((sucursal) => (
                  <div key={sucursal.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <Building2 className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-medium text-gray-900 truncate">{sucursal.nombre}</h3>
                            <Badge 
                              variant={sucursal.activo ? "default" : "secondary"}
                              className={`text-xs ${
                                sucursal.activo 
                                  ? 'bg-green-50 text-green-700 border border-green-200' 
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {sucursal.activo ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <span className="truncate" title={sucursal.direccion}>
                                {sucursal.direccion}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <span>{sucursal.telefono}</span>
                            </div>
                            {sucursal.correo && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="truncate" title={sucursal.correo}>
                                  {sucursal.correo}
                                </span>
                              </div>
                            )}
                            {sucursal.encargadoAlmacen && (
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                <span className="truncate" title={sucursal.encargadoAlmacen}>
                                  {sucursal.encargadoAlmacen}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem 
                            onClick={() => onEditarSucursal(sucursal)} 
                            className="text-sm cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2 text-blue-600" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onEliminarSucursal(sucursal.id)}
                            className="text-sm cursor-pointer text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
