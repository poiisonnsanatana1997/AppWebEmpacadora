import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { ClienteDTO } from '../../types/Cliente/cliente.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Building, 
  Package, 
  Phone, 
  Mail, 
  FileText, 
  User, 
  Calendar,
  MapPin,
  Users
} from 'lucide-react';


interface DetalleClienteModalProps {
  cliente: ClienteDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onViewSucursales: () => void;
  onViewCajas: () => void;
}

export const DetalleClienteModal: React.FC<DetalleClienteModalProps> = ({
  cliente,
  open,
  onOpenChange,
  onEdit,
  onViewSucursales,
  onViewCajas
}) => {
  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Detalles del Cliente</span>
          </DialogTitle>
          <DialogDescription>
            Información completa del cliente {cliente.nombre}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Información General</span>
                <Badge variant={cliente.activo ? "default" : "secondary"}>
                  {cliente.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-lg font-semibold">{cliente.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Razón Social</label>
                  <p className="text-lg">{cliente.razonSocial}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">RFC</label>
                  <p className="font-mono text-lg">{cliente.rfc}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Cliente</label>
                  <p className="text-lg">{cliente.tipoCliente || 'No especificado'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Información de Contacto</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="text-lg">{cliente.telefono}</p>
                  </div>
                </div>
                {cliente.correo && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Correo Electrónico</label>
                      <p className="text-lg">{cliente.correo}</p>
                    </div>
                  </div>
                )}
                {cliente.representanteComercial && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Representante Comercial</label>
                      <p className="text-lg">{cliente.representanteComercial}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información de Registro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Información de Registro</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                  <p className="text-lg">
                    {format(new Date(cliente.fechaRegistro), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Usuario de Registro</label>
                  <p className="text-lg">{cliente.usuarioRegistro}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Constancia Fiscal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Constancia Fiscal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cliente.constanciaFiscal ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">constancia_fiscal.pdf</p>
                        <p className="text-sm text-gray-500">Documento PDF</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => window.open(cliente.constanciaFiscal, '_blank')}
                      className="flex items-center space-x-2"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Abrir en Nueva Pestaña</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay constancia fiscal disponible</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumen de Relaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Relaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Sucursales</p>
                      <p className="text-sm text-gray-500">{cliente.sucursales?.length || 0} sucursales</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={onViewSucursales}>
                    Ver
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Cajas</p>
                      <p className="text-sm text-gray-500">{cliente.cajasCliente?.length || 0} cajas</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={onViewCajas}>
                    Ver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          <Button onClick={onEdit}>
            Editar Cliente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
