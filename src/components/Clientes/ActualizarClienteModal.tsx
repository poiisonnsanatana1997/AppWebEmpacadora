import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { ClienteDTO, UpdateClienteDTO } from '../../types/Cliente/cliente.types';
import { Loader2 } from 'lucide-react';

interface ActualizarClienteModalProps {
  cliente: ClienteDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UpdateClienteDTO) => Promise<void>;
  loading?: boolean;
}

interface FormData {
  nombre: string;
  razonSocial: string;
  rfc: string;
  telefono: string;
  correo: string;
  representanteComercial: string;
  tipoCliente: string;
  activo: boolean;
  constanciaFiscal?: File;
}

interface FormErrors {
  nombre?: string;
  razonSocial?: string;
  rfc?: string;
  telefono?: string;
  correo?: string;
  representanteComercial?: string;
  tipoCliente?: string;
}

export const ActualizarClienteModal: React.FC<ActualizarClienteModalProps> = ({
  cliente,
  open,
  onOpenChange,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    razonSocial: '',
    rfc: '',
    telefono: '',
    correo: '',
    representanteComercial: '',
    tipoCliente: '',
    activo: true
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Cargar datos del cliente cuando se abre el modal
  useEffect(() => {
    if (cliente && open) {
      setFormData({
        nombre: cliente.nombre || '',
        razonSocial: cliente.razonSocial || '',
        rfc: cliente.rfc || '',
        telefono: cliente.telefono || '',
        correo: cliente.correo || '',
        representanteComercial: cliente.representanteComercial || '',
        tipoCliente: cliente.tipoCliente || '',
        activo: cliente.activo
      });
      setErrors({});
      setTouched({});
    }
  }, [cliente, open]);

  // Función de validación
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.length > 150) return 'El nombre no puede exceder 150 caracteres';
        break;
      case 'razonSocial':
        if (!value.trim()) return 'La razón social es requerida';
        if (value.length > 200) return 'La razón social no puede exceder 200 caracteres';
        break;
      case 'rfc':
        if (!value.trim()) return 'El RFC es requerido';
        if (value.length > 13) return 'El RFC no puede exceder 13 caracteres';
        break;
      case 'telefono':
        if (!value.trim()) return 'El teléfono es requerido';
        if (value.length > 20) return 'El teléfono no puede exceder 20 caracteres';
        // Validar formato de teléfono mexicano
        const phoneRegex = /^(\+52\s?)?(\(?[0-9]{2,3}\)?[\s-]?[0-9]{3,4}[\s-]?[0-9]{4}|[0-9]{10})$/;
        if (value.trim() && !phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'Formato de teléfono inválido. Use: 10 dígitos, (55) 1234-5678, +52 55 1234 5678';
        }
        break;
      case 'correo':
        if (value.trim()) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(value)) {
            return 'Formato de correo electrónico inválido';
          }
        }
        break;
      case 'representanteComercial':
        if (value.length > 100) return 'El representante comercial no puede exceder 100 caracteres';
        break;
             case 'tipoCliente':
         if (!value.trim()) return 'El tipo de cliente es requerido';
         if (value.length > 50) return 'El tipo de cliente no puede exceder 50 caracteres';
         break;
    }
    return undefined;
  };

  // Función para manejar cambios en los campos
  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar solo si el campo ha sido tocado
    if (touched[name] || typeof value === 'boolean') {
      const error = validateField(name, typeof value === 'string' ? value : '');
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Función para manejar el blur de los campos
  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const value = formData[name as keyof FormData];
    const error = validateField(name, typeof value === 'string' ? value : '');
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Función para validar todo el formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'activo' && key !== 'constanciaFiscal') {
        const error = validateField(key, formData[key as keyof FormData] as string);
        if (error) {
          newErrors[key as keyof FormErrors] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'activo' && key !== 'constanciaFiscal') {
        allTouched[key] = true;
      }
    });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    const clienteData: UpdateClienteDTO = {
      nombre: formData.nombre,
      razonSocial: formData.razonSocial,
      rfc: formData.rfc,
      telefono: formData.telefono,
      correo: formData.correo || undefined,
      representanteComercial: formData.representanteComercial || undefined,
      tipoCliente: formData.tipoCliente || undefined,
      activo: formData.activo,
      constanciaFiscal: formData.constanciaFiscal
    };

    await onSubmit(clienteData);
    handleCancel();
  };

  // Función para cancelar
  const handleCancel = () => {
    setFormData({
      nombre: '',
      razonSocial: '',
      rfc: '',
      telefono: '',
      correo: '',
      representanteComercial: '',
      tipoCliente: '',
      activo: true
    });
    setErrors({});
    setTouched({});
    onOpenChange(false);
  };

  if (!cliente) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifique la información del cliente {cliente.nombre}. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                onBlur={() => handleBlur('nombre')}
                placeholder="Nombre del cliente"
                className={errors.nombre ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre}</p>
              )}
            </div>

            {/* Razón Social */}
            <div className="space-y-2">
              <Label htmlFor="razonSocial">Razón Social *</Label>
              <Input
                id="razonSocial"
                value={formData.razonSocial}
                onChange={(e) => handleInputChange('razonSocial', e.target.value)}
                onBlur={() => handleBlur('razonSocial')}
                placeholder="Razón social"
                className={errors.razonSocial ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.razonSocial && (
                <p className="text-sm text-red-500">{errors.razonSocial}</p>
              )}
            </div>

            {/* RFC */}
            <div className="space-y-2">
              <Label htmlFor="rfc">RFC *</Label>
              <Input
                id="rfc"
                value={formData.rfc}
                onChange={(e) => handleInputChange('rfc', e.target.value)}
                onBlur={() => handleBlur('rfc')}
                placeholder="RFC"
                className={errors.rfc ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.rfc && (
                <p className="text-sm text-red-500">{errors.rfc}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                onBlur={() => handleBlur('telefono')}
                placeholder="Teléfono"
                className={errors.telefono ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.telefono && (
                <p className="text-sm text-red-500">{errors.telefono}</p>
              )}
            </div>

            {/* Correo */}
            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => handleInputChange('correo', e.target.value)}
                onBlur={() => handleBlur('correo')}
                placeholder="correo@ejemplo.com"
                className={errors.correo ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.correo && (
                <p className="text-sm text-red-500">{errors.correo}</p>
              )}
            </div>

                         {/* Tipo de Cliente */}
             <div className="space-y-2">
               <Label htmlFor="tipoCliente">Tipo de Cliente *</Label>
              <Select 
                value={formData.tipoCliente}
                onValueChange={(value) => handleInputChange('tipoCliente', value)}
              >
                <SelectTrigger className={errors.tipoCliente ? 'border-red-500 focus:border-red-500' : ''}>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nacional">Nacional</SelectItem>
                  <SelectItem value="Exportación">Exportación</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoCliente && (
                <p className="text-sm text-red-500">{errors.tipoCliente}</p>
              )}
            </div>
          </div>

          {/* Representante Comercial */}
          <div className="space-y-2">
            <Label htmlFor="representanteComercial">Representante Comercial</Label>
            <Input
              id="representanteComercial"
              value={formData.representanteComercial}
              onChange={(e) => handleInputChange('representanteComercial', e.target.value)}
              onBlur={() => handleBlur('representanteComercial')}
              placeholder="Nombre del representante comercial"
              className={errors.representanteComercial ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.representanteComercial && (
              <p className="text-sm text-red-500">{errors.representanteComercial}</p>
            )}
          </div>

          {/* Estado Activo */}
          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={formData.activo}
              onChange={(e) => handleInputChange('activo', e.target.checked)}
            />
            <Label htmlFor="activo">Cliente Activo</Label>
          </div>

          {/* Constancia Fiscal */}
          <div className="space-y-2">
            <Label htmlFor="constanciaFiscal">Constancia Fiscal (PDF)</Label>
            <Input
              id="constanciaFiscal"
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData(prev => ({ ...prev, constanciaFiscal: file }));
                }
              }}
            />
            <p className="text-sm text-gray-500">
              Solo archivos PDF. Máximo 5MB. Deje vacío para mantener el archivo actual.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Cliente
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
