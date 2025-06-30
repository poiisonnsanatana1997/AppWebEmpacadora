import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  FileText,
  ExternalLink,
  Loader2,
  X,
  Download,
  Eye
} from 'lucide-react';
import type { ProveedorCompletoDto } from '@/types/Proveedores/proveedores.types';
import { SituacionFiscalViewer } from './SituacionFiscalViewer';

interface DetalleProveedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  proveedor: ProveedorCompletoDto | null;
  loading?: boolean;
}

// Función para formatear fechas
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return 'No disponible';
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

// Función para abrir enlace en nueva pestaña
const handleOpenSituacionFiscal = (url: string) => {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

export function DetalleProveedorModal({ isOpen, onClose, proveedor, loading = false }: DetalleProveedorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Detalle del Proveedor
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando información del proveedor...</span>
            </div>
          </div>
        ) : proveedor ? (
          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="space-y-6 p-1">
              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información Básica
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nombre</label>
                      <p className="text-sm text-gray-900 mt-1">{proveedor.nombre}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        RFC
                      </label>
                      <p className="text-sm text-gray-900 mt-1 font-mono">
                        {proveedor.rfc || 'No disponible'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        Teléfono
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {proveedor.telefono || 'No disponible'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Correo Electrónico
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {proveedor.correo || 'No disponible'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Dirección Fiscal
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {proveedor.direccionFiscal || 'No disponible'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Estado</label>
                      <div className="mt-1">
                        <Badge 
                          variant="secondary"
                          className={proveedor.activo ? 
                            'bg-green-200 text-green-800 hover:bg-green-300 font-semibold' : 
                            'bg-red-200 text-red-800 hover:bg-red-300 font-semibold'
                          }
                        >
                          {proveedor.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Información de registro */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Información de Registro
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha de Registro</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(proveedor.fechaRegistro)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Usuario de Registro</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {proveedor.usuarioRegistro || 'No disponible'}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Situación Fiscal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Situación Fiscal
                </h3>
                
                {proveedor.situacionFiscal ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleOpenSituacionFiscal(proveedor.situacionFiscal!)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Documento
                      </Button>
                      <span className="text-sm text-gray-600">
                        Se abrirá en una nueva pestaña
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm text-gray-700">
                        <strong>URL del documento:</strong>
                      </p>
                      <p className="text-sm text-blue-600 break-all mt-1">
                        {proveedor.situacionFiscal}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    No hay documento de situación fiscal disponible
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500 text-center">
              <p className="font-semibold">No se pudo cargar la información</p>
              <p className="text-sm">Intenta nuevamente</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 