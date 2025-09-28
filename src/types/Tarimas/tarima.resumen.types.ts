export interface TarimaDashboardDTO {
  /**
   * Total de tarimas del día
   */
  totalTarimasHoy: number;

  /**
   * Eficiencia general
   */
  eficienciaGeneral: number;

  /**
   * Distribución por tipos
   * Ejemplo: { "XL": 10, "L": 5 }
   */
  distribucionPorTipos: Record<string, number>;

  /**
   * Análisis de eficiencia por tipo
   * Ejemplo: { "XL": 0.95, "L": 0.87 }
   */
  eficienciaPorTipo: Record<string, number>;
}

export interface TarimaPesoDiarioDTO {
  /**
   * Fecha del registro (formato ISO string)
   */
  fecha: string;

  /**
   * Peso total por tipo de tarima.
   * Ejemplo: { "XL": 1200.5, "L": 800.25 }
   */
  pesoPorTipo: Record<string, number>;

  /**
   * Peso total de todas las tarimas en la fecha.
   */
  pesoTotal: number;
}

export interface TarimaEvolucionDTO {
  /**
   * Fecha del registro (formato ISO string)
   */
  fecha: string;

  /**
   * Total de tarimas en la fecha
   */
  totalTarimas: number;

  /**
   * Eficiencia general en la fecha
   */
  eficienciaGeneral: number;

  /**
   * Tarimas por tipo
   * Ejemplo: { "XL": 10, "L": 5 }
   */
  tarimasPorTipo: Record<string, number>;

  /**
   * Peso por tipo de tarima
   * Ejemplo: { "XL": 1200.5, "L": 800.25 }
   */
  pesoPorTipo: Record<string, number>;

  /**
   * Peso total de todas las tarimas en la fecha
   */
  pesoTotal: number;
}