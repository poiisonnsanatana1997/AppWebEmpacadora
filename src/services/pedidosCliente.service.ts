import type { 
  CreatePedidoClienteDTO, 
  UpdatePedidoClienteDTO, 
  PedidoClienteResponseDTO, 
  PedidoClienteConDetalleDTO,
  PedidoClienteFilters,
  PedidoClientePagedResponse,
  PedidoClienteEstatus,
  PedidoClientePorAsignarDTO,
  PedidoClienteProgresoDTO,
  DesasignarTarimaDTO
} from '@/types/PedidoCliente/pedidoCliente.types';
import api from '@/api/axios';
import { AxiosError } from 'axios';

/**
 * Custom error class for pedido cliente service errors
 */
export class PedidoClienteServiceError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'PedidoClienteServiceError';
  }
}

/**
 * Servicio para gestionar los pedidos de cliente del sistema
 * @namespace PedidosClienteService
 */
export const PedidosClienteService = {
  /**
   * Obtiene todos los pedidos de cliente desde la API
   * @param {AbortSignal} signal - Señal para cancelar la petición
   * @returns {Promise<PedidoClienteResponseDTO[]>} Lista de pedidos de cliente
   * @throws {PedidoClienteServiceError} Si hay un error al obtener los pedidos
   */
  async obtenerPedidosCliente(signal?: AbortSignal): Promise<PedidoClienteResponseDTO[]> {
    try {
      const response = await api.get<PedidoClienteResponseDTO[]>('/PedidoCliente', {
        signal
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // Silenciar cancelaciones para no mostrar error en UI
        if (error.code === 'ERR_CANCELED' || error.message === 'canceled' || (error as any)?.name === 'CanceledError') {
          const abortErr = new Error('Request canceled');
          abortErr.name = 'AbortError';
          throw abortErr;
        }
        throw new PedidoClienteServiceError(
          `Error al obtener pedidos de cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al obtener pedidos de cliente', error);
    }
  },

  /**
   * Obtiene pedidos de cliente con detalles simplificados
   * @returns {Promise<PedidoClienteConDetalleDTO[]>} Lista de pedidos con detalles
   * @throws {PedidoClienteServiceError} Si hay un error al obtener los pedidos con detalles
   */
  async obtenerPedidosClienteConDetalles(): Promise<PedidoClienteConDetalleDTO[]> {
    try {
      const response = await api.get<PedidoClienteConDetalleDTO[]>('/PedidoCliente/con-detalles');
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new PedidoClienteServiceError(
          `Error al obtener pedidos de cliente con detalles: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al obtener pedidos de cliente con detalles', error);
    }
  },

  /**
   * Obtiene un pedido de cliente por su ID desde la API
   * @param {number} id - ID del pedido de cliente
   * @returns {Promise<PedidoClienteResponseDTO>} Pedido de cliente encontrado
   * @throws {PedidoClienteServiceError} Si hay un error al obtener el pedido o si no se encuentra
   */
  async obtenerPedidoCliente(id: number): Promise<PedidoClienteResponseDTO> {
    try {
      const response = await api.get<PedidoClienteResponseDTO>(`/PedidoCliente/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new PedidoClienteServiceError(`Pedido de cliente con ID ${id} no encontrado`, error);
        }
        throw new PedidoClienteServiceError(
          `Error al obtener el pedido de cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al obtener el pedido de cliente', error);
    }
  },

  /**
   * Crea un nuevo pedido de cliente según la especificación de la API
   * @param {CreatePedidoClienteDTO} data - Datos del pedido de cliente
   * @returns {Promise<PedidoClienteResponseDTO>} Pedido de cliente creado
   * @throws {PedidoClienteServiceError} Si hay un error al crear el pedido
   */
  async crearPedidoCliente(data: CreatePedidoClienteDTO): Promise<PedidoClienteResponseDTO> {
    try {
      const response = await api.post<PedidoClienteResponseDTO>('/PedidoCliente/con-ordenes', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new PedidoClienteServiceError(
          `Error al crear el pedido de cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al crear el pedido de cliente', error);
    }
  },

  /**
   * Actualiza un pedido de cliente existente usando la API
   * @param {number} id - ID del pedido de cliente
   * @param {UpdatePedidoClienteDTO} data - Datos a actualizar
   * @returns {Promise<PedidoClienteResponseDTO>} Pedido de cliente actualizado
   * @throws {PedidoClienteServiceError} Si hay un error al actualizar el pedido
   */
  async actualizarPedidoCliente(id: number, data: UpdatePedidoClienteDTO): Promise<PedidoClienteResponseDTO> {
    try {
      const response = await api.put<PedidoClienteResponseDTO>(`/PedidoCliente/${id}`, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new PedidoClienteServiceError(`Pedido de cliente con ID ${id} no encontrado`, error);
        }
        throw new PedidoClienteServiceError(
          `Error al actualizar el pedido de cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al actualizar el pedido de cliente', error);
    }
  },

  /**
   * Elimina un pedido de cliente (marca como inactivo) usando la API
   * @param {number} id - ID del pedido de cliente
   * @returns {Promise<void>} Sin retorno en caso de éxito
   * @throws {PedidoClienteServiceError} Si hay un error al eliminar el pedido
   */
  async eliminarPedidoCliente(id: number): Promise<void> {
    try {
      await api.delete(`/PedidoCliente/${id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new PedidoClienteServiceError(`Pedido de cliente con ID ${id} no encontrado`, error);
        }
        throw new PedidoClienteServiceError(
          `Error al eliminar el pedido de cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al eliminar el pedido de cliente', error);
    }
  },

  /**
   * Actualiza el estatus de un pedido de cliente usando la API
   * @param {number} id - ID del pedido de cliente
   * @param {string} estatus - Nuevo estatus del pedido
   * @returns {Promise<void>} Sin retorno en caso de éxito
   * @throws {PedidoClienteServiceError} Si hay un error al actualizar el estatus
   */
  async actualizarEstatusPedidoCliente(id: number, estatus: string): Promise<void> {
    try {
      await api.patch(`/PedidoCliente/${id}/estatus`, { estatus });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new PedidoClienteServiceError(`Pedido de cliente con ID ${id} no encontrado`, error);
        }
        throw new PedidoClienteServiceError(
          `Error al actualizar el estatus del pedido de cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al actualizar el estatus del pedido de cliente', error);
    }
  },



  /**
   * Filtra pedidos de cliente según los criterios especificados
   * @param {PedidoClienteFilters} filters - Filtros a aplicar
   * @returns {Promise<PedidoClienteResponseDTO[]>} Lista de pedidos filtrados
   * @throws {PedidoClienteServiceError} Si hay un error al filtrar los pedidos
   */
  async filtrarPedidosCliente(filters: PedidoClienteFilters): Promise<PedidoClienteResponseDTO[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.estatus) params.append('estatus', filters.estatus);
      if (filters.idCliente) params.append('idCliente', filters.idCliente.toString());
      if (filters.idSucursal) params.append('idSucursal', filters.idSucursal.toString());
      if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde.toISOString());
      if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta.toISOString());
      if (filters.activo !== undefined) params.append('activo', filters.activo.toString());

      const response = await api.get<PedidoClienteResponseDTO[]>(`/PedidoCliente?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new PedidoClienteServiceError(
          `Error al filtrar pedidos de cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al filtrar pedidos de cliente', error);
    }
  },

  /**
   * Obtiene pedidos de cliente por estatus específico
   * @param {PedidoClienteEstatus} estatus - Estatus a filtrar
   * @returns {Promise<PedidoClienteResponseDTO[]>} Lista de pedidos con el estatus especificado
   * @throws {PedidoClienteServiceError} Si hay un error al obtener los pedidos por estatus
   */
  async obtenerPedidosClientePorEstatus(estatus: PedidoClienteEstatus): Promise<PedidoClienteResponseDTO[]> {
    try {
      const response = await api.get<PedidoClienteResponseDTO[]>(`/PedidoCliente?estatus=${estatus}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new PedidoClienteServiceError(
          `Error al obtener pedidos de cliente por estatus: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al obtener pedidos de cliente por estatus', error);
    }
  },

  /**
   * Obtiene pedidos de cliente por cliente específico
   * @param {number} idCliente - ID del cliente
   * @returns {Promise<PedidoClienteResponseDTO[]>} Lista de pedidos del cliente especificado
   * @throws {PedidoClienteServiceError} Si hay un error al obtener los pedidos del cliente
   */
  async obtenerPedidosClientePorCliente(idCliente: number): Promise<PedidoClienteResponseDTO[]> {
    try {
      const response = await api.get<PedidoClienteResponseDTO[]>(`/PedidoCliente?idCliente=${idCliente}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new PedidoClienteServiceError(
          `Error al obtener pedidos de cliente por cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al obtener pedidos de cliente por cliente', error);
    }
  },

  /**
   * Obtiene pedidos de cliente paginados
   * @param {number} page - Número de página (base 1)
   * @param {number} pageSize - Tamaño de la página
   * @param {PedidoClienteFilters} filters - Filtros opcionales
   * @returns {Promise<PedidoClientePagedResponse>} Respuesta paginada de pedidos
   * @throws {PedidoClienteServiceError} Si hay un error al obtener los pedidos paginados
   */
  async obtenerPedidosClientePaginados(
    page: number, 
    pageSize: number, 
    filters?: PedidoClienteFilters
  ): Promise<PedidoClientePagedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (filters) {
        if (filters.estatus) params.append('estatus', filters.estatus);
        if (filters.idCliente) params.append('idCliente', filters.idCliente.toString());
        if (filters.idSucursal) params.append('idSucursal', filters.idSucursal.toString());
        if (filters.fechaDesde) params.append('fechaDesde', filters.fechaDesde.toISOString());
        if (filters.fechaHasta) params.append('fechaHasta', filters.fechaHasta.toISOString());
        if (filters.activo !== undefined) params.append('activo', filters.activo.toString());
      }

      const response = await api.get<PedidoClientePagedResponse>(`/PedidoCliente/paginados?${params.toString()}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new PedidoClienteServiceError(
          `Error al obtener pedidos de cliente paginados: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al obtener pedidos de cliente paginados', error);
    }
  },

  /**
   * Obtiene pedidos de cliente disponibles por tipo y producto desde la API
   * @param {string} tipo - Tipo de pedido (ej: 'S')
   * @param {number} idProducto - ID del producto (opcional)
   * @returns {Promise<PedidoClientePorAsignarDTO[]>} Lista de pedidos de cliente disponibles
   * @throws {PedidoClienteServiceError} Si hay un error al obtener los pedidos disponibles
   */
  async obtenerPedidosClienteDisponibles(tipo: string, idProducto?: number): Promise<PedidoClientePorAsignarDTO[]> {
    try {
      const params = new URLSearchParams();
      if (idProducto) {
        params.append('idProducto', idProducto.toString());
      }

      const url = `/PedidoCliente/disponibles/${tipo}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get<PedidoClientePorAsignarDTO[]>(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new PedidoClienteServiceError(
          `Error al obtener pedidos de cliente disponibles: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al obtener pedidos de cliente disponibles', error);
    }
  },

  /**
   * Obtiene el progreso de un pedido de cliente específico
   * @param {number} id - ID del pedido de cliente
   * @returns {Promise<PedidoClienteProgresoDTO>} Progreso del pedido de cliente
   * @throws {PedidoClienteServiceError} Si hay un error al obtener el progreso del pedido
   */
  async obtenerPedidoClienteProgreso(id: number): Promise<PedidoClienteProgresoDTO> {
    try {
      const response = await api.get<PedidoClienteProgresoDTO>(`/PedidoCliente/${id}/progreso`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new PedidoClienteServiceError(`Pedido de cliente con ID ${id} no encontrado`, error);
        }
        throw new PedidoClienteServiceError(
          `Error al obtener el progreso del pedido de cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al obtener el progreso del pedido de cliente', error);
    }
  },

  /**
   * Obtiene la disponibilidad de cajas para un pedido específico
   * @param {number} idPedido - ID del pedido de cliente
   * @param {string} tipo - Tipo de clasificación
   * @param {number} idProducto - ID del producto (opcional)
   * @returns {Promise<PedidoClientePorAsignarDTO>} Información de disponibilidad del pedido
   * @throws {PedidoClienteServiceError} Si hay un error al obtener la disponibilidad
   */
  async obtenerDisponibilidadCajas(
    idPedido: number, 
    tipo: string, 
    idProducto?: number
  ): Promise<PedidoClientePorAsignarDTO> {
    try {
      const params = new URLSearchParams();
      params.append('tipo', tipo);
      if (idProducto) {
        params.append('idProducto', idProducto.toString());
      }

      const url = `/PedidoCliente/${idPedido}/disponibilidad-cajas?${params.toString()}`;
      const response = await api.get<PedidoClientePorAsignarDTO>(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new PedidoClienteServiceError(
          `Error al obtener disponibilidad de cajas: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al obtener disponibilidad de cajas', error);
    }
  },

  /**
   * Asigna multiples tarimas a un pedido de cliente
   * @param {number} idPedido - ID del pedido de cliente
   * @param {number[]} idsTarimas - IDs de las tarimas a asignar
   * @returns {Promise<PedidoClienteResponseDTO>} Pedido de cliente actualizado
   * @throws {PedidoClienteServiceError} Si hay un error al asignar las tarimas
   */
  async asignarTarimasPedidoCliente(idPedido: number, idsTarimas: number[]): Promise<PedidoClienteResponseDTO> {
    try {
      const response = await api.post<PedidoClienteResponseDTO>(`/PedidoCliente/${idPedido}/asignar-tarimas`, idsTarimas);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new PedidoClienteServiceError(
          `Error al asignar tarimas al pedido de cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al asignar tarimas al pedido de cliente', error);
    }
  },

  /**
   * Desasigna tarimas de un pedido de cliente
   * @param {DesasignarTarimaDTO[]} datos - Datos de la desasignación
   * @throws {PedidoClienteServiceError} Si hay un error al desasignar las tarimas
   */
  async desasignarTarimasPedidoCliente(datos: DesasignarTarimaDTO[]): Promise<void> {
    try {
      await api.delete(`/PedidoCliente/desasignar-tarimas`, { data: datos });
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new PedidoClienteServiceError(
          `Error al desasignar tarimas al pedido de cliente: ${error.response?.data?.message || error.message}`,
          error
        );
      }
      throw new PedidoClienteServiceError('Error desconocido al desasignar tarimas al pedido de cliente', error);
    }
  },
}; 