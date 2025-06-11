// Dto de producto
export interface ProductoDto {
  id: number;
  nombre: string;
}

// Dto de proveedor
export interface ProveedorDto {
  id: number;
  nombre: string;
}

// Dto de orden de entrada
export interface OrdenEntradaDto {
  codigo: string;
  proveedor: ProveedorDto;
  producto: ProductoDto;
  fechaEstimada: string;
  fechaRegistro: string | null;
  fechaRecepcion: string | null;
  estado: EstadoOrden;
  observaciones: string;
}

// Dto detalle de orden de entrada
export interface DetalleOrdenEntradaDto {
  ordenEntrada: OrdenEntradaDto;
  tarimas: PesajeTarimaDto[];
}

// Dto de pesaje de tarima
export interface PesajeTarimaDto {
  numero: string;
  pesoBruto: number;
  pesoTara: number;
  pesoTarima: number;
  pesoPatin: number;
  pesoNeto: number;
  cantidadCajas: number;
  pesoPorCaja: number;
  observaciones: string;
}


// Tipos de Orden de Entrada
export type EstadoOrden = 'Pendiente' | 'Procesando' | 'Recibida' | 'Cancelada';

// Constantes para los estados
export const ESTADO_ORDEN = {
  PENDIENTE: 'Pendiente',
  PROCESANDO: 'Procesando',
  RECIBIDA: 'Recibida',
  CANCELADA: 'Cancelada'
} as const;

// Funciones de utilidad para validar estados
export const estadoOrdenUtils = {
  puedeEditar: (estado: EstadoOrden): boolean => {
    return estado === ESTADO_ORDEN.PENDIENTE || estado === ESTADO_ORDEN.PROCESANDO;
  },
  estaCompletada: (estado: EstadoOrden): boolean => {
    return estado === ESTADO_ORDEN.RECIBIDA || estado === ESTADO_ORDEN.CANCELADA;
  },
  esProcesando: (estado: EstadoOrden): boolean => {
    return estado === ESTADO_ORDEN.PROCESANDO;
  }
};

export type OrdenEntradaFormData = Omit<OrdenEntradaDto, 'codigo'>;

// DTO para crear una orden de entrada (compatible con la API)
export interface CrearOrdenEntradaDto {
  proveedorId: number;
  productoId: number;
  fechaEstimada: string;
  estado: EstadoOrden;
  observaciones: string;
} 