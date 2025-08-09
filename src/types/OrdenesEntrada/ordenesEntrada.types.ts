import { ProductoSimpleDto } from "../Productos/productos.types";

export enum ESTADO_ORDEN {
  PENDIENTE = 'Pendiente',
  PROCESANDO = 'Procesando',
  RECIBIDA = 'Recibida',
  CANCELADA = 'Cancelada',
  CLASIFICANDO = 'Clasificando',
  CLASIFICADO = 'Clasificado'
}

export type EstadoOrden = typeof ESTADO_ORDEN[keyof typeof ESTADO_ORDEN];

export interface CrearOrdenEntradaDto {
  proveedorId: number;
  productoId: number;
  fechaEstimada: string;
  fechaRegistro: string;
  estado: EstadoOrden;
  observaciones: string | null;
}

export interface ActualizarOrdenEntradaDto {
  proveedorId: number;
  productoId: number;
  fechaEstimada: string;
  fechaRecepcion: string | null;
  estado: EstadoOrden;
  observaciones: string | null;
}

export interface DetalleOrdenEntradaDto {
  ordenEntrada: OrdenEntradaDto;
  tarimas: PesajeTarimaDto[];
}

export interface ProveedorDto {
  id: number;
  nombre: string;
}

export interface ProductoDto {
  id: number;
  nombre: string;
  codigo: string;
  variedad: string;
}

export interface OrdenEntradaDto {
  id: number;
  codigo: string;
  proveedor: ProveedorDto;
  producto: ProductoDto;
  fechaEstimada: string;
  fechaRegistro: string;
  fechaRecepcion: string | null;
  estado: EstadoOrden;
  observaciones: string;
  usuarioRegistro: string;
  usuarioRecepcion: string | null;
}

export interface OrdenEntradaFormData {
  proveedor: {
    id: number;
    nombre: string;
  };
  producto: ProductoSimpleDto;
  fechaEstimada: string;
  estado: EstadoOrden;
  observaciones: string;
  fechaRegistro: string;
  fechaRecepcion: string | null;
  usuarioRegistro: string;
  usuarioRecepcion: string | null;
}

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

export const estadoOrdenUtils = {
  estaCompletada: (estado: EstadoOrden): boolean => {
    return estado === ESTADO_ORDEN.RECIBIDA || estado === ESTADO_ORDEN.CLASIFICADO;
  },
  puedeEditar: (estado: EstadoOrden): boolean => {
    return estado === ESTADO_ORDEN.PENDIENTE || estado === ESTADO_ORDEN.PROCESANDO;
  },
  esCancelable: (estado: EstadoOrden): boolean => {
    return estado === ESTADO_ORDEN.PENDIENTE || estado === ESTADO_ORDEN.PROCESANDO || estado === ESTADO_ORDEN.RECIBIDA;
  },
  puedeClasificar: (estado: EstadoOrden): boolean => {
    return estado === ESTADO_ORDEN.RECIBIDA;
  },
  puedeVerPesaje: (estado: EstadoOrden): boolean => {
    return estado !== ESTADO_ORDEN.CANCELADA;
  },
  puedeVerClasificacion: (estado: EstadoOrden): boolean => {
    return estado === ESTADO_ORDEN.CLASIFICANDO || estado === ESTADO_ORDEN.CLASIFICADO;
  },
  esValidaTransicion: (estadoActual: EstadoOrden, nuevoEstado: EstadoOrden): boolean => {
    const transicionesPermitidas: Record<EstadoOrden, EstadoOrden[]> = {
      [ESTADO_ORDEN.PENDIENTE]: [ESTADO_ORDEN.PROCESANDO, ESTADO_ORDEN.CANCELADA],
      [ESTADO_ORDEN.PROCESANDO]: [ESTADO_ORDEN.RECIBIDA, ESTADO_ORDEN.CANCELADA],
      [ESTADO_ORDEN.RECIBIDA]: [ESTADO_ORDEN.CLASIFICANDO, ESTADO_ORDEN.CANCELADA],
      [ESTADO_ORDEN.CANCELADA]: [], // No se puede reactivar
      [ESTADO_ORDEN.CLASIFICANDO]: [ESTADO_ORDEN.CLASIFICADO],
      [ESTADO_ORDEN.CLASIFICADO]: [],
    };
    return transicionesPermitidas[estadoActual].includes(nuevoEstado);
  },
  obtenerEstadosSiguientes: (estadoActual: EstadoOrden): EstadoOrden[] => {
    const transicionesPermitidas: Record<EstadoOrden, EstadoOrden[]> = {
      [ESTADO_ORDEN.PENDIENTE]: [ESTADO_ORDEN.PROCESANDO, ESTADO_ORDEN.CANCELADA],
      [ESTADO_ORDEN.PROCESANDO]: [ESTADO_ORDEN.RECIBIDA, ESTADO_ORDEN.CANCELADA],
      [ESTADO_ORDEN.RECIBIDA]: [ESTADO_ORDEN.CLASIFICANDO, ESTADO_ORDEN.CANCELADA],
      [ESTADO_ORDEN.CANCELADA]: [], // No se puede reactivar
      [ESTADO_ORDEN.CLASIFICANDO]: [ESTADO_ORDEN.CLASIFICADO],
      [ESTADO_ORDEN.CLASIFICADO]: [],
    };
    return transicionesPermitidas[estadoActual];
  }
}; 