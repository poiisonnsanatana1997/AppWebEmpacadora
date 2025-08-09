import api from '../api/axios';
import { ClienteDTO } from '../types/Cliente/cliente.types';

/**
 * Servicio para manejar las operaciones relacionadas con Clientes
 */
export const clientesService = {
  /**
   * Obtiene la lista detallada de todos los clientes
   * @returns Promise con la lista de clientes con información completa
   */
  async getClientesDetallados(): Promise<ClienteDTO[]> {
    try {
      const response = await api.get<ClienteDTO[]>('/Clientes/detallados');
      return response.data;
    } catch (error) {
      console.error('Error en getClientesDetallados:', error);
      throw error;
    }
  }
}; 