import { useState } from 'react';
import { CajaClienteService } from '../../services/cajaCliente.service';
import { CajaClienteDTO, CreateCajaClienteDTO, UpdateCajaClienteDTO } from '../../types/Cajas/cajaCliente.types';

export const useCajasCliente = (clienteId?: number) => {
  const [cajasCliente, setCajasCliente] = useState<CajaClienteDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCajasCliente = async (idCliente: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await CajaClienteService.obtenerCajasClientePorCliente(idCliente);
      setCajasCliente(data);
    } catch (err) {
      setError('Error al cargar las cajas del cliente');
      console.error('Error fetching cajas cliente:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCajaCliente = async (cajaData: CreateCajaClienteDTO): Promise<CajaClienteDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const nuevaCaja = await CajaClienteService.crearCajaCliente(cajaData);
      setCajasCliente(prev => [...prev, nuevaCaja]);
      return nuevaCaja;
    } catch (err) {
      setError('Error al crear la caja cliente');
      console.error('Error creating caja cliente:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCajaCliente = async (id: number, cajaData: UpdateCajaClienteDTO): Promise<CajaClienteDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const cajaActualizada = await CajaClienteService.actualizarCajaCliente(id, cajaData);
      setCajasCliente(prev => prev.map(caja => 
        caja.id === id ? cajaActualizada : caja
      ));
      return cajaActualizada;
    } catch (err) {
      setError('Error al actualizar la caja cliente');
      console.error('Error updating caja cliente:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCajaCliente = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await CajaClienteService.eliminarCajaCliente(id);
      setCajasCliente(prev => prev.filter(caja => caja.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar la caja cliente');
      console.error('Error deleting caja cliente:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCajaClienteById = async (id: number): Promise<CajaClienteDTO | null> => {
    try {
      const caja = await CajaClienteService.obtenerCajaClientePorId(id);
      return caja;
    } catch (err) {
      setError('Error al obtener la caja cliente');
      console.error('Error fetching caja cliente by id:', err);
      return null;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    cajasCliente,
    loading,
    error,
    fetchCajasCliente,
    createCajaCliente,
    updateCajaCliente,
    deleteCajaCliente,
    getCajaClienteById,
    clearError
  };
};
