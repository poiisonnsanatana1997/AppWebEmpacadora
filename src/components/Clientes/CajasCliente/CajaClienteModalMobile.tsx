import React, { useEffect } from 'react';
import { Button } from '../../ui/button';
import { Package, Plus, X, Weight, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { CajaClienteForm } from './CajaClienteForm.tsx';
import { CajaClienteDTO } from '../../../types/Cajas/cajaCliente.types';
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
import * as DialogPrimitive from "@radix-ui/react-dialog";

interface CajaClienteModalMobileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteNombre?: string;
  cajasCliente: CajaClienteDTO[];
  cajaSeleccionada: CajaClienteDTO | null;
  showForm: boolean;
  loading?: boolean;
  onCrearCajaCliente: () => void;
  onEditarCajaCliente: (caja: CajaClienteDTO) => void;
  onEliminarCajaCliente: (id: number) => void;
  onSubmitForm: (data: any) => void;
  onCancelForm: () => void;
}

export const CajaClienteModalMobile: React.FC<CajaClienteModalMobileProps> = ({
  open,
  onOpenChange,
  clienteNombre,
  cajasCliente,
  cajaSeleccionada,
  showForm,
  loading = false,
  onCrearCajaCliente,
  onEditarCajaCliente,
  onEliminarCajaCliente,
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
  const CajaClienteTableMobile = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      );
    }

    if (cajasCliente.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-gray-50 rounded-full p-4 mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-2 text-center">
            No hay cajas registradas
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            Este cliente aún no tiene cajas registradas.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {cajasCliente.map((caja) => (
          <Card key={caja.id} className="hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
            <CardHeader className="pb-2 px-3 py-3 sm:px-4">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <CardTitle className="text-sm flex items-center gap-2 min-w-0 flex-1">
                  <Package className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="truncate font-medium">{caja.nombre || 'Sin nombre'}</span>
                </CardTitle>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => onEditarCajaCliente(caja)} className="text-sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onEliminarCajaCliente(caja.id)}
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
              {/* Peso */}
              <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                <Weight className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{caja.peso.toFixed(2)} kg</span>
              </div>
              
              {/* Precio */}
              {caja.precio && (
                <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0">
                  <span className="font-medium">$</span>
                  <span className="truncate">{caja.precio.toFixed(2)}</span>
                </div>
              )}
              
              {/* Fecha de registro */}
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                Registrada: {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
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
          {showForm ? (cajaSeleccionada ? 'Editar Caja' : 'Nueva Caja') : `Cajas de ${clienteNombre}`}
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
                <Package className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base text-gray-900 truncate">
                    {cajaSeleccionada ? 'Editar Caja' : 'Nueva Caja'}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {cajaSeleccionada 
                      ? 'Modifica la información de la caja'
                      : `Crear una nueva caja para ${clienteNombre}`
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
                <CajaClienteForm
                  caja={cajaSeleccionada}
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

  // Modal para lista de cajas - diseño móvil tipo drawer optimizado
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <MobileDrawer>
        {/* Header móvil fijo adaptado al drawer */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-3 py-3 rounded-t-xl sm:px-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Package className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base text-gray-900 truncate">
                  Cajas de {clienteNombre}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {cajasCliente.length} cajas registradas
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
              <CajaClienteTableMobile />
            </div>
          </ScrollArea>
        </div>

        {/* Footer móvil fijo adaptado al drawer */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-3 py-3 sm:px-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 h-10 text-sm"
            onClick={onCrearCajaCliente}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Caja
          </Button>
        </div>
      </MobileDrawer>
    </Dialog>
  );
};
