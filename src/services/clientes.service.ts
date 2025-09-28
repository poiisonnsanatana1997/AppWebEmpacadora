import api from '../api/axios';
import { 
  ClienteDTO, 
  ClienteSummaryDTO, 
  CreateClienteDTO, 
  UpdateClienteDTO 
} from '../types/Cliente/cliente.types';

/**
 * Servicio para manejar las operaciones relacionadas con Clientes
 */
export const clientesService = {
  /**
   * Obtiene la lista de todos los clientes (resumen)
   * @returns Promise con la lista de clientes resumida
   */
  async getClientes(): Promise<ClienteSummaryDTO[]> {
    try {
      const response = await api.get<ClienteSummaryDTO[]>('/Clientes');
      return response.data;
    } catch (error) {
      console.error('Error en getClientes:', error);
      throw error;
    }
  },

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
  },

  /**
   * Obtiene un cliente específico por su ID
   * @param id - ID del cliente a obtener
   * @returns Promise con los datos del cliente
   */
  async getClienteById(id: number): Promise<ClienteDTO> {
    try {
      const response = await api.get<ClienteDTO>(`/Clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error en getClienteById(${id}):`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo cliente
   * @param clienteData - Datos del cliente a crear
   * @returns Promise con el cliente creado
   */
  async createCliente(clienteData: CreateClienteDTO): Promise<ClienteDTO> {
    try {
      // Crear FormData para manejar archivos
      const formData = new FormData();
      
      // Agregar campos de texto
      formData.append('nombre', clienteData.nombre);
      formData.append('razonSocial', clienteData.razonSocial);
      formData.append('rfc', clienteData.rfc);
      formData.append('telefono', clienteData.telefono);
      formData.append('activo', clienteData.activo.toString());
      formData.append('fechaRegistro', clienteData.fechaRegistro);
      
      // Agregar campos opcionales
      if (clienteData.constanciaFiscal) {
        formData.append('constanciaFiscal', clienteData.constanciaFiscal);
      }
      if (clienteData.representanteComercial) {
        formData.append('representanteComercial', clienteData.representanteComercial);
      }
      if (clienteData.tipoCliente) {
        formData.append('tipoCliente', clienteData.tipoCliente);
      }
      if (clienteData.correo) {
        formData.append('correo', clienteData.correo);
      }

      const response = await api.post<ClienteDTO>('/Clientes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error en createCliente:', error);
      throw error;
    }
  },

  /**
   * Actualiza un cliente existente
   * @param id - ID del cliente a actualizar
   * @param clienteData - Datos del cliente a actualizar
   * @returns Promise con el cliente actualizado
   */
  async updateCliente(id: number, clienteData: UpdateClienteDTO): Promise<ClienteDTO> {
    try {
      // Crear FormData para manejar archivos
      const formData = new FormData();
      
      // Agregar campos de texto si están presentes
      if (clienteData.nombre) {
        formData.append('nombre', clienteData.nombre);
      }
      if (clienteData.razonSocial) {
        formData.append('razonSocial', clienteData.razonSocial);
      }
      if (clienteData.rfc) {
        formData.append('rfc', clienteData.rfc);
      }
      if (clienteData.telefono) {
        formData.append('telefono', clienteData.telefono);
      }
      if (clienteData.activo !== undefined) {
        formData.append('activo', clienteData.activo.toString());
      }
      
      // Agregar campos opcionales
      if (clienteData.constanciaFiscal) {
        formData.append('constanciaFiscal', clienteData.constanciaFiscal);
      }
      if (clienteData.representanteComercial) {
        formData.append('representanteComercial', clienteData.representanteComercial);
      }
      if (clienteData.tipoCliente) {
        formData.append('tipoCliente', clienteData.tipoCliente);
      }
      if (clienteData.correo) {
        formData.append('correo', clienteData.correo);
      }

      const response = await api.put<ClienteDTO>(`/Clientes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error en updateCliente(${id}):`, error);
      throw error;
    }
  },

  /**
   * Elimina un cliente por su ID
   * @param id - ID del cliente a eliminar
   * @returns Promise que se resuelve cuando el cliente es eliminado
   */
  async deleteCliente(id: number): Promise<void> {
    try {
      await api.delete(`/Clientes/${id}`);
    } catch (error) {
      console.error(`Error en deleteCliente(${id}):`, error);
      throw error;
    }
  }
}; 