import { useState } from 'react';
import { SucursalesService } from '../../services/sucursales.service';
import { SucursalDTO, CreateSucursalDTO, UpdateSucursalDTO } from '../../types/Sucursales/sucursales.types';

export const useSucursales = (clienteId?: number) => {
  const [sucursales, setSucursales] = useState<SucursalDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSucursalesByCliente = async (idCliente: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await SucursalesService.obtenerSucursalesPorCliente(idCliente);
      setSucursales(data);
    } catch (err) {
      setError('Error al cargar las sucursales del cliente');
      console.error('Error fetching sucursales by cliente:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSucursal = async (sucursalData: CreateSucursalDTO): Promise<SucursalDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const nuevaSucursal = await SucursalesService.crearSucursal(sucursalData);
      setSucursales(prev => [...prev, nuevaSucursal]);
      return nuevaSucursal;
    } catch (err) {
      setError('Error al crear la sucursal');
      console.error('Error creating sucursal:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSucursal = async (id: number, sucursalData: UpdateSucursalDTO): Promise<SucursalDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const sucursalActualizada = await SucursalesService.actualizarSucursal(id, sucursalData);
      setSucursales(prev => prev.map(sucursal => 
        sucursal.id === id ? sucursalActualizada : sucursal
      ));
      return sucursalActualizada;
    } catch (err) {
      setError('Error al actualizar la sucursal');
      console.error('Error updating sucursal:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSucursal = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await SucursalesService.eliminarSucursal(id);
      setSucursales(prev => prev.filter(sucursal => sucursal.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar la sucursal');
      console.error('Error deleting sucursal:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSucursalById = async (id: number): Promise<SucursalDTO | null> => {
    try {
      const sucursal = await SucursalesService.obtenerSucursalPorId(id);
      return sucursal;
    } catch (err) {
      setError('Error al obtener la sucursal');
      console.error('Error fetching sucursal by id:', err);
      return null;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    sucursales,
    loading,
    error,
    fetchSucursalesByCliente,
    createSucursal,
    updateSucursal,
    deleteSucursal,
    getSucursalById,
    clearError
  };
};
