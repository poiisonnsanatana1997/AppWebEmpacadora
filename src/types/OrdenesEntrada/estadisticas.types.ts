/**
 * Tipos para las estadísticas y métricas del dashboard de Órdenes de Entrada
 */

/**
 * Tendencia de una métrica comparada con periodo anterior
 */
export type TrendDirection = 'up' | 'down' | 'stable';

/**
 * Nivel de alerta para métricas críticas
 */
export type AlertLevel = 'success' | 'warning' | 'danger' | 'info';

/**
 * Estadísticas de órdenes clasificadas
 */
export interface OrdenesClasificadasHoyDto {
  cantidadClasificadas: number;
  porcentajeCumplimiento: number;
  comparacionAyer: number; // diferencia
  tendencia: TrendDirection;
}

/**
 * Estadísticas de órdenes retrasadas
 */
export interface OrdenesRetrasadasDto {
  cantidadRetrasadas: number;
  ordenesRetrasadas: {
    codigo: string;
    proveedor: string;
    diasRetraso: number;
  }[];
  alertLevel: AlertLevel;
}

/**
 * Estadísticas de órdenes en clasificación
 */
export interface OrdenesEnClasificacionDto {
  cantidadEnClasificacion: number;
  tiempoPromedioEnProceso: number; // minutos
}

/**
 * Tasa de cumplimiento del día
 */
export interface TasaCumplimientoHoyDto {
  tasaCumplimiento: number; // porcentaje 0-100
  ordenesATiempo: number;
  totalEsperadas: number;
  comparacionMesAnterior: number;
  tendencia: TrendDirection;
  alertLevel: AlertLevel;
}

/**
 * Proveedores activos del día
 */
export interface ProveedoresActivosHoyDto {
  cantidadProveedores: number;
  nombresProveedores: string[];
  comparacionAyer: number;
}

/**
 * Estadísticas de peso recibido con comparación
 */
export interface PesoRecibidoHoyDto {
  pesoTotal: number;
  comparacionAyer: number;
  tendencia: TrendDirection;
  unidad: 'kg' | 'ton';
}

/**
 * Estadísticas de órdenes pendientes con comparación
 */
export interface OrdenesPendientesHoyDto {
  cantidadPendientes: number;
  comparacionAyer: number;
  tendencia: TrendDirection;
}

/**
 * Datos completos para el dashboard de indicadores
 */
export interface DashboardEstadisticasDto {
  ordenesPendientes: OrdenesPendientesHoyDto;
  pesoRecibido: PesoRecibidoHoyDto;
  ordenesClasificadas: OrdenesClasificadasHoyDto;
  ordenesRetrasadas: OrdenesRetrasadasDto;
  ordenesEnClasificacion: OrdenesEnClasificacionDto;
  tasaCumplimiento: TasaCumplimientoHoyDto;
  proveedoresActivos?: ProveedoresActivosHoyDto; // opcional
  ultimaActualizacion: string; // ISO timestamp
}

/**
 * Props para un indicador individual
 */
export interface IndicatorCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    direction: TrendDirection;
    label: string;
  };
  alertLevel?: AlertLevel;
  loading?: boolean;
  onClick?: () => void;
  tooltip?: string;
  colorScheme: 'pending' | 'weight' | 'completed' | 'alert' | 'inProgress' | 'kpi';
  ariaLabel?: string;
}
