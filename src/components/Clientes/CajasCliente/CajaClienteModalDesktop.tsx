import React, { useEffect } from 'react';
import { Button } from '../../ui/button';
import { Package, Plus, Weight, ArrowLeft, MoreHorizontal, Edit, Trash2, DollarSign } from 'lucide-react';
import { CajaClienteForm } from './CajaClienteForm.tsx';
import { CajaClienteDTO } from '../../../types/Cajas/cajaCliente.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Badge } from '../../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../ui/dropdown-menu';

interface CajaClienteModalDesktopProps {
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

export const CajaClienteModalDesktop: React.FC<CajaClienteModalDesktopProps> = ({
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
                    <Package className="h-5 w-5 text-blue-600" />
                    {cajaSeleccionada ? 'Editar Caja Cliente' : 'Nueva Caja Cliente'}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">
                    {cajaSeleccionada 
                      ? 'Modifica la información de la caja cliente'
                      : `Crear caja cliente para ${clienteNombre}`
                    }
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <CajaClienteForm
              caja={cajaSeleccionada}
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

  // Vista de lista de cajas
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        {/* Header profesional */}
        <DialogHeader className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Package className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Cajas de {clienteNombre}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-0.5">Administra las cajas del cliente</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mr-8">
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md border">
                {cajasCliente.length} cajas
              </div>
              <Button
                onClick={onCrearCajaCliente}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Caja
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
                <span className="text-sm text-gray-500">Cargando cajas...</span>
              </div>
            ) : cajasCliente.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-100 rounded-full p-3 mb-3">
                  <Package className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-700 mb-1">
                  No hay cajas registradas
                </h3>
                <p className="text-sm text-gray-500 text-center mb-4 max-w-sm">
                  Comienza creando la primera caja para este cliente
                </p>
                <Button
                  onClick={onCrearCajaCliente}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Caja
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {cajasCliente.map((caja) => (
                  <div key={caja.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg">
                          <Package className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-medium text-gray-900 truncate">
                              {caja.nombre || 'Sin nombre'}
                            </h3>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Weight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <span>{caja.peso.toFixed(2)} kg</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <span>
                                {caja.precio ? `$${caja.precio.toFixed(2)}` : 'Precio no definido'}
                              </span>
                            </div>
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
                            onClick={() => onEditarCajaCliente(caja)} 
                            className="text-sm cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2 text-blue-600" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onEliminarCajaCliente(caja.id)}
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
