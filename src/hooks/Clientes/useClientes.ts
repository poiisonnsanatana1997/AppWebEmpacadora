import { useState, useEffect, useCallback } from 'react';
import { clientesService } from '../../services/clientes.service';
import { ClienteDTO, ClienteSummaryDTO, CreateClienteDTO, UpdateClienteDTO } from '../../types/Cliente/cliente.types';
import { useGlobalCache } from '../useGlobalCache';

export const useClientes = (autoFetch: boolean = true) => {
  const { clientes, isLoading: cacheLoading, error: cacheError, fetchClientes: fetchFromCache } = useGlobalCache();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchFromCache();
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error('Error fetching clientes:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFromCache]);

  const getClienteById = async (id: number): Promise<ClienteDTO | null> => {
    try {
      const cliente = await clientesService.getClienteById(id);
      return cliente;
    } catch (err) {
      setError('Error al obtener el cliente');
      console.error('Error fetching cliente by id:', err);
      return null;
    }
  };

  const createCliente = async (clienteData: CreateClienteDTO): Promise<ClienteDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const nuevoCliente = await clientesService.createCliente(clienteData);
      // Invalidar cache para forzar recarga
      await fetchFromCache(true);
      return nuevoCliente;
    } catch (err) {
      setError('Error al crear el cliente');
      console.error('Error creating cliente:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCliente = async (id: number, clienteData: UpdateClienteDTO): Promise<ClienteDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const clienteActualizado = await clientesService.updateCliente(id, clienteData);
      // Invalidar cache para forzar recarga
      await fetchFromCache(true);
      return clienteActualizado;
    } catch (err) {
      setError('Error al actualizar el cliente');
      console.error('Error updating cliente:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCliente = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await clientesService.deleteCliente(id);
      // Invalidar cache para forzar recarga
      await fetchFromCache(true);
      return true;
    } catch (err) {
      setError('Error al eliminar el cliente');
      console.error('Error deleting cliente:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Auto-fetch clientes al montar el hook si autoFetch es true
  useEffect(() => {
    if (autoFetch) {
      fetchClientes();
    }
  }, []); // Solo se ejecuta una vez al montar

  return {
    clientes,
    clientesDetallados: clientes, // Usar los mismos datos del cache
    loading: loading || cacheLoading.clientes,
    error: error || cacheError.clientes,
    fetchClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    clearError
  };
};
