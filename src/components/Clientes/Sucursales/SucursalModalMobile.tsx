import React, { useEffect } from 'react';
import { Button } from '../../ui/button';
import { Building2, Plus, X } from 'lucide-react';
import { SucursalForm } from './SucursalForm';
import { SucursalDTO } from '../../../types/Sucursales/sucursales.types';
import { CrearSucursalFormData, ActualizarSucursalFormData } from '../../../schemas/sucursalFormSchema';
import { Dialog } from '../../ui/dialog';
import { ScrollArea } from '../../ui/scroll-area';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, MapPin, Phone, Mail, User } from 'lucide-react';
import { format } from 'date-fns';
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface SucursalModalMobileProps {
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

export const SucursalModalMobile: React.FC<SucursalModalMobileProps> = ({
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

  // Componente tabla móvil interno adaptado al drawer
  const SucursalTableMobile = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      );
    }

    if (sucursales.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-gray-50 rounded-full p-4 mb-4">
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2 text-center">
            No hay sucursales registradas
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Este cliente aún no tiene sucursales registradas.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {sucursales.map((sucursal) => (
          <Card key={sucursal.id} className="hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
            <CardHeader className="pb-2 px-3 py-3 sm:px-4">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <CardTitle className="text-sm flex items-center gap-2 min-w-0 flex-1">
                  <Building2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="truncate font-medium">{sucursal.nombre}</span>
                </CardTitle>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Badge variant={sucursal.activo ? "default" : "secondary"} className="text-xs px-2 py-1 whitespace-nowrap">
                    {sucursal.activo ? 'Activa' : 'Inactiva'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => onEditarSucursal(sucursal)} className="text-sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onEliminarSucursal(sucursal.id)}
                        className="text-red-600 text-sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 px-3 pb-3 sm:px-4">
              {/* Dirección */}
              <div className="flex items-start gap-2 text-sm text-gray-600 min-w-0">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="break-words leading-relaxed">{sucursal.direccion}</span>
              </div>
              
              {/* Teléfono */}
              <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{sucursal.telefono}</span>
              </div>
              
              {/* Encargado de almacén */}
              {sucursal.encargadoAlmacen && (
                <div className="flex items-start gap-2 text-sm text-gray-600 min-w-0">
                  <User className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words leading-relaxed">{sucursal.encargadoAlmacen}</span>
                </div>
              )}
              
              {/* Correo */}
              {sucursal.correo && (
                <div className="flex items-start gap-2 text-sm text-gray-600 min-w-0">
                  <Mail className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span className="break-all leading-relaxed">{sucursal.correo}</span>
                </div>
              )}
              
              {/* Fecha de registro */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                Registrada: {format(new Date(sucursal.fechaRegistro), 'dd/MM/yyyy HH:mm')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Drawer móvil personalizado optimizado
  const MobileDrawer = ({ children }: { children: React.ReactNode }) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className="fixed inset-0 top-auto z-50 h-[90vh] w-full bg-white shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300 ease-out rounded-t-xl border-0 flex flex-col"
        onEscapeKeyDown={() => onOpenChange(false)}
        onInteractOutside={() => onOpenChange(false)}
      >
        <DialogPrimitive.Title className="sr-only">
          {showForm ? (sucursalSeleccionada ? 'Editar Sucursal' : 'Nueva Sucursal') : `Sucursales de ${clienteNombre}`}
        </DialogPrimitive.Title>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );

  // Modal para formulario - diseño móvil drawer optimizado
  if (showForm) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <MobileDrawer>
          {/* Header del formulario adaptado al drawer */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 py-3 rounded-t-xl sm:px-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base text-gray-900 truncate">
                    {sucursalSeleccionada ? 'Editar Sucursal' : 'Nueva Sucursal'}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {sucursalSeleccionada 
                      ? 'Modifica la información de la sucursal'
                      : `Crear una nueva sucursal para ${clienteNombre}`
                    }
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelForm}
                disabled={loading}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

                  {/* Contenido del formulario adaptado al drawer */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full w-full">
            <div className="p-3 sm:p-4 pb-6">
              <SucursalForm
                sucursal={sucursalSeleccionada}
                clienteNombre={clienteNombre}
                onSubmit={onSubmitForm}
                onCancel={onCancelForm}
                loading={loading}
              />
            </div>
          </ScrollArea>
        </div>
        </MobileDrawer>
      </Dialog>
    );
  }

  // Modal para lista de sucursales - diseño móvil tipo drawer optimizado
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <MobileDrawer>
        {/* Header móvil fijo adaptado al drawer */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 py-3 rounded-t-xl sm:px-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base text-gray-900 truncate">
                  Sucursales de {clienteNombre}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {sucursales.length} sucursales registradas
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenido scrollable adaptado al drawer */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full w-full">
            <div className="p-3 sm:p-4 pb-6">
              <SucursalTableMobile />
            </div>
          </ScrollArea>
        </div>

        {/* Footer móvil fijo adaptado al drawer */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-3 py-3 sm:px-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 h-10 text-sm"
            onClick={onCrearSucursal}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sucursal
          </Button>
        </div>
      </MobileDrawer>
    </Dialog>
  );
};
