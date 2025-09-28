import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PedidosClienteService } from '@/services/pedidosCliente.service';
import { useGlobalCache } from '@/hooks/useGlobalCache';
import {
  informacionBasicaSchema,
  ordenesSchema,
  pedidoClienteWizardSchema,
  type InformacionBasicaData,
  type OrdenData,
  type OrdenesData,
  type PedidoClienteWizardData,
  type WizardStep,
  type WizardState
} from '@/schemas/pedidoClienteWizardSchema';
import { ClienteDTO } from '@/types/Cliente/cliente.types';
import { ProductoDto } from '@/types/Productos/productos.types';
import { CreatePedidoClienteDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { CrearOrdenSimpleDTO } from '@/types/PedidoCliente/ordenPedidoCliente.types';

export const usePedidoClienteWizard = () => {
  // Usar cache global
  const { 
    clientes, 
    productos, 
    isLoading: cacheLoading, 
    error: cacheError, 
    fetchAllData 
  } = useGlobalCache();

  // Estado del wizard
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 'informacion',
    steps: {
      informacion: false,
      ordenes: false,
      resumen: false,
    },
    data: {},
  });

  // Estado local para operaciones del wizard
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formularios
  const informacionForm = useForm<InformacionBasicaData>({
    resolver: zodResolver(informacionBasicaSchema),
    defaultValues: {
      idCliente: 0,
      idSucursal: 0,
      observaciones: '',
      estatus: 'Pendiente',
      fechaEmbarque: undefined,
      activo: true,
    },
    mode: 'onChange',
  });

  const ordenesForm = useForm<OrdenesData>({
    resolver: zodResolver(ordenesSchema),
    defaultValues: {
      ordenes: [],
    },
    mode: 'onChange',
  });

  // Cargar datos iniciales usando cache global
  const cargarDatos = useCallback(async () => {
    try {
      setError(null);
      await fetchAllData();
    } catch (error: any) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos necesarios. Verifica la conexión con la API.');
    }
  }, [fetchAllData]);

  // Cargar datos al montar el componente solo si no están en cache
  useEffect(() => {
    if (clientes.length === 0 || productos.length === 0) {
      cargarDatos();
    }
  }, [cargarDatos, clientes.length, productos.length]);

  // Navegación entre pasos
  const nextStep = useCallback(async () => {
    const currentStep = wizardState.currentStep;
    
    try {
      if (currentStep === 'informacion') {
        console.log('Debug - Validando información básica...');
        const isValid = await informacionForm.trigger();
        console.log('Debug - Resultado validación:', isValid);
        if (!isValid) return;

        const data = informacionForm.getValues();
        setWizardState(prev => ({
          ...prev,
          currentStep: 'ordenes',
          steps: { ...prev.steps, informacion: true },
          data: { ...prev.data, ...data },
        }));
      } else if (currentStep === 'ordenes') {
        const isValid = await ordenesForm.trigger();
        if (!isValid) return;

        const data = ordenesForm.getValues();
        setWizardState(prev => ({
          ...prev,
          currentStep: 'resumen',
          steps: { ...prev.steps, ordenes: true },
          data: { ...prev.data, ...data },
        }));
      }
    } catch (error) {
      console.error('Error al validar paso:', error);
    }
  }, [wizardState.currentStep, informacionForm, ordenesForm]);

  const prevStep = useCallback(() => {
    const currentStep = wizardState.currentStep;
    
    if (currentStep === 'ordenes') {
      setWizardState(prev => ({
        ...prev,
        currentStep: 'informacion',
      }));
    } else if (currentStep === 'resumen') {
      setWizardState(prev => ({
        ...prev,
        currentStep: 'ordenes',
      }));
    }
  }, [wizardState.currentStep]);

  // Obtener sucursales del cliente seleccionado
  const obtenerSucursalesCliente = useCallback((idCliente: number) => {
    const cliente = clientes.find(c => c.id === idCliente);
    return cliente?.sucursales || [];
  }, [clientes]);

  // Manejar cambio de cliente
  const handleClienteChange = useCallback((idCliente: number) => {
    informacionForm.setValue('idCliente', idCliente);
    informacionForm.setValue('idSucursal', 0); // Reset sucursal
  }, [informacionForm]);

  // Agregar orden
  const agregarOrden = useCallback((orden: Omit<OrdenData, 'id'>) => {
    const ordenesActuales = ordenesForm.getValues('ordenes');
    
    // Buscar si ya existe una orden con el mismo tipo y producto
    const ordenExistenteIndex = ordenesActuales.findIndex(
      ordenExistente => 
        ordenExistente.tipo === orden.tipo && 
        ordenExistente.idProducto === orden.idProducto
    );

    if (ordenExistenteIndex !== -1) {
      // Si existe, sumar las cantidades y pesos
      const ordenExistente = ordenesActuales[ordenExistenteIndex];
      const nuevasOrdenes = [...ordenesActuales];
      
      nuevasOrdenes[ordenExistenteIndex] = {
        ...ordenExistente,
        cantidad: (ordenExistente.cantidad || 0) + (orden.cantidad || 0),
        peso: (ordenExistente.peso || 0) + (orden.peso || 0),
      };
      
      ordenesForm.setValue('ordenes', nuevasOrdenes);
    } else {
      // Si no existe, agregar como nueva orden
      const nuevaOrden: OrdenData = {
        ...orden,
        id: Date.now(), // ID temporal para el frontend
      };

      ordenesForm.setValue('ordenes', [...ordenesActuales, nuevaOrden]);
    }
  }, [ordenesForm]);

  // Eliminar orden
  const eliminarOrden = useCallback((index: number) => {
    const ordenesActuales = ordenesForm.getValues('ordenes');
    const nuevasOrdenes = ordenesActuales.filter((_, i) => i !== index);
    ordenesForm.setValue('ordenes', nuevasOrdenes);
  }, [ordenesForm]);

  // Actualizar orden
  const actualizarOrden = useCallback((index: number, orden: Partial<OrdenData>) => {
    const ordenesActuales = ordenesForm.getValues('ordenes');
    const ordenOriginal = ordenesActuales[index];
    
    // Si se está cambiando el tipo o producto, verificar si ya existe una orden con la nueva combinación
    if (orden.tipo && orden.idProducto && 
        (orden.tipo !== ordenOriginal.tipo || orden.idProducto !== ordenOriginal.idProducto)) {
      
      const ordenExistenteIndex = ordenesActuales.findIndex(
        (ordenExistente, i) => 
          i !== index && // Excluir la orden que se está editando
          ordenExistente.tipo === orden.tipo && 
          ordenExistente.idProducto === orden.idProducto
      );

      if (ordenExistenteIndex !== -1) {
        // Si existe, sumar las cantidades y pesos, y eliminar la orden original
        const ordenExistente = ordenesActuales[ordenExistenteIndex];
        const nuevasOrdenes = ordenesActuales.filter((_, i) => i !== index);
        
        nuevasOrdenes[ordenExistenteIndex] = {
          ...ordenExistente,
          cantidad: (ordenExistente.cantidad || 0) + (orden.cantidad || 0),
          peso: (ordenExistente.peso || 0) + (orden.peso || 0),
        };
        
        ordenesForm.setValue('ordenes', nuevasOrdenes);
        return;
      }
    }
    
    // Si no hay duplicados, actualizar normalmente
    const nuevasOrdenes = ordenesActuales.map((o, i) =>
      i === index ? { ...o, ...orden } : o
    );
    ordenesForm.setValue('ordenes', nuevasOrdenes);
  }, [ordenesForm]);

  // Crear pedido cliente
  const crearPedidoCliente = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const informacionData = informacionForm.getValues();
      const ordenesData = ordenesForm.getValues();

      const createData: CreatePedidoClienteDTO = {
        observaciones: informacionData.observaciones,
        estatus: informacionData.estatus,
        fechaEmbarque: informacionData.fechaEmbarque,
        idSucursal: informacionData.idSucursal,
        idCliente: informacionData.idCliente,
        fechaRegistro: new Date(),
        activo: true, // Siempre se crea como activo
        ordenes: ordenesData.ordenes.map(orden => ({
          tipo: orden.tipo,
          cantidad: orden.cantidad,
          peso: orden.peso,
          idProducto: orden.idProducto,
        })) as CrearOrdenSimpleDTO[],
      };

      await PedidosClienteService.crearPedidoCliente(createData);
      
      // Resetear formularios
      informacionForm.reset();
      ordenesForm.reset();
      setWizardState({
        currentStep: 'informacion',
        steps: {
          informacion: false,
          ordenes: false,
          resumen: false,
        },
        data: {},
      });
    } catch (error: any) {
      console.error('Error al crear pedido cliente:', error);
      setError('Error al crear el pedido cliente');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [informacionForm, ordenesForm]);

  return {
    // Estado
    wizardState,
    clientes,
    productos,
    isLoading: isLoading || cacheLoading.clientes || cacheLoading.productos,
    error: error || cacheError.clientes || cacheError.productos,
    
    // Formularios
    informacionForm,
    ordenesForm,
    
    // Métodos
    nextStep,
    prevStep,
    obtenerSucursalesCliente,
    handleClienteChange,
    agregarOrden,
    eliminarOrden,
    actualizarOrden,
    crearPedidoCliente,
    cargarDatos,
  };
}; 