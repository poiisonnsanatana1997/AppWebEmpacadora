import { useState, useEffect, useCallback } from 'react';
import { TarimasService } from '../../services/tarimas.service';
import { TarimaParcialSeleccionadaDTO, TarimaParcialFiltradaDTO, TarimaUpdateParcialDTO } from '../../types/Tarimas/tarimaParcial.types';
import { toast } from 'sonner';

export const useTarimasParciales = () => {
  const [tarimasParciales, setTarimasParciales] = useState<TarimaParcialSeleccionadaDTO[]>([]);
  const [tarimaSeleccionada, setTarimaSeleccionada] = useState<TarimaParcialSeleccionadaDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');

  // Cargar tarimas parciales
  const cargarTarimasParciales = useCallback(async () => {
    setLoading(true);
    try {
      const data = await TarimasService.getTarimasParciales();
      setTarimasParciales(data);
      
      if (data.length === 0) {
        toast.info('No se encontraron tarimas parciales disponibles');
      } else {
        toast.success(`Se cargaron ${data.length} tarima(s) parcial(es) correctamente`);
      }
    } catch (error: any) {
      console.error('Error al cargar tarimas parciales:', error);
      
      // Mensajes de error específicos según el tipo de error
      if (error?.response?.status === 404) {
        toast.error('No se encontraron tarimas parciales en el sistema');
      } else if (error?.response?.status === 401) {
        toast.error('No tienes permisos para acceder a las tarimas parciales');
      } else if (error?.response?.status === 500) {
        toast.error('Error en el servidor. Por favor, intenta más tarde');
      } else if (error?.code === 'NETWORK_ERROR') {
        toast.error('Error de conexión. Verifica tu conexión a internet');
      } else {
        toast.error(error?.message || 'Error inesperado al cargar las tarimas parciales');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar tarima parcial
  const actualizarTarimaParcial = useCallback(async (
    idTarima: number, 
    cantidad: number, 
    idClasificacion: number, 
    tipo: string,
    onValidate?: (cantidad: number) => { isValid: boolean; message: string }
  ) => {
    // Validar límite de clasificación si se proporciona la función de validación
    if (onValidate) {
      const validation = onValidate(cantidad);
      if (!validation.isValid) {
        toast.error(validation.message);
        return false;
      }
      if (validation.message) {
        toast.warning(validation.message);
      }
    }

    setSaving(true);
    try {
      const data: TarimaUpdateParcialDTO = {
        estatus: 'COMPLETA',
        cantidad: cantidad,
        idTarima: idTarima,
        idClasificacion: idClasificacion,
        tipo: tipo,
      };

      await TarimasService.updateTarimaParcial(idTarima, data);
      
      // Actualizar la lista de tarimas parciales
      await cargarTarimasParciales();
      
      toast.success('Tarima parcial actualizada correctamente');
      return true;
    } catch (error: any) {
      console.error('Error al actualizar tarima parcial:', error);
      
      // Mensajes de error específicos
      if (error?.response?.status === 404) {
        toast.error('Tarima parcial no encontrada');
      } else if (error?.response?.status === 400) {
        toast.error('Datos inválidos para la actualización');
      } else if (error?.response?.status === 500) {
        toast.error('Error en el servidor. Por favor, intenta más tarde');
      } else {
        toast.error(error?.message || 'Error inesperado al actualizar la tarima parcial');
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [cargarTarimasParciales]);

  // Filtrar tarimas parciales
  const tarimasFiltradas = tarimasParciales
    .map(tarima => {
      const clasificacion = tarima.tarimasClasificaciones[0];
      const pedido = tarima.pedidoTarimas[0];
      
      return {
        id: tarima.id,
        codigo: tarima.codigo,
        estatus: tarima.estatus,
        cantidad: tarima.cantidad,
        peso: tarima.peso,
        tipo: clasificacion?.tipo || 'N/A',
        lote: clasificacion?.lote || 'N/A',
        cliente: pedido?.nombreCliente || 'N/A',
        sucursal: pedido?.nombreSucursal || 'N/A',
        fechaRegistro: tarima.fechaRegistro,
      } as TarimaParcialFiltradaDTO;
    })
    .filter(tarima => {
      const matchesSearch = 
        tarima.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarima.lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarima.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarima.sucursal.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTipo = filterTipo === 'all' || tarima.tipo === filterTipo;
      
      return matchesSearch && matchesTipo;
    });

  // Seleccionar tarima
  const seleccionarTarima = useCallback((tarima: TarimaParcialSeleccionadaDTO) => {
    setTarimaSeleccionada(tarima);
  }, []);

  // Limpiar selección
  const limpiarSeleccion = useCallback(() => {
    setTarimaSeleccionada(null);
  }, []);

  // Limpiar filtros
  const limpiarFiltros = useCallback(() => {
    setSearchTerm('');
    setFilterTipo('all');
  }, []);

  return {
    // Estado
    tarimasParciales,
    tarimaSeleccionada,
    tarimasFiltradas,
    loading,
    saving,
    searchTerm,
    filterTipo,
    
    // Acciones
    setSearchTerm,
    setFilterTipo,
    seleccionarTarima,
    limpiarSeleccion,
    cargarTarimasParciales,
    actualizarTarimaParcial,
    limpiarFiltros,
  };
}; 