// Tipos para generación de reportes de pedidos cliente

import { PedidoClienteResponseDTO } from './pedidoCliente.types';

/**
 * Configuración para la generación de reportes
 */
export interface ConfiguracionReporte {
  nombreEmpresa: string;
  logoUrl?: string;
  pie?: string;
  mostrarFechaGeneracion: boolean;
}

/**
 * Datos procesados para el reporte de pedido cliente
 */
export interface DatosReportePedidoCliente {
  pedido: PedidoClienteResponseDTO;
  configuracion: ConfiguracionReporte;
  totales: TotalesReportePedido;
}

/**
 * Totales calculados para el reporte
 */
export interface TotalesReportePedido {
  totalOrdenes: number;
  totalCajas: number;
  pesoTotal: number;
  // Agrupación por tipo
  desglosePorTipo: {
    tipo: string;
    cantidad: number;
    peso: number;
  }[];
}

/**
 * Opciones para la exportación de reportes
 */
export interface OpcionesExportacionReporte {
  nombreArchivo?: string;
  incluirObservaciones?: boolean;
  incluirDetalleOrdenes?: boolean;
  orientacion?: 'portrait' | 'landscape';
}
