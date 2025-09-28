/**
 * Utilidades de formateo para la aplicación
 */

/**
 * Formatea el peso en kg con separadores de miles
 */
export const formatearPeso = (peso: number): string => {
  return `${peso.toLocaleString('es-MX', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })} kg`;
};

/**
 * Formatea números enteros con separadores de miles
 */
export const formatearNumero = (numero: number): string => {
  return numero.toLocaleString('es-MX');
};

/**
 * Formatea peso en toneladas
 */
export const formatearToneladas = (peso: number): string => {
  return `${(peso / 1000).toFixed(1)} ton`;
};

/**
 * Formatea peso de manera inteligente (kg o toneladas según la cantidad)
 */
export const formatearPesoInteligente = (peso: number): string => {
  // Si el peso es mayor a 10,000 kg (10 toneladas), mostrar en toneladas
  if (peso >= 10000) {
    const toneladas = peso / 1000;
    return `${toneladas.toLocaleString('es-MX', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    })} ton`;
  }
  
  // Si el peso es menor a 10,000 kg, mostrar en kg
  return `${peso.toLocaleString('es-MX', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  })} kg`;
};

/**
 * Formatea fechas para mostrar en gráficos
 */
export const formatearFechaGrafico = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-MX', {
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Formatea fechas completas
 */
export const formatearFechaCompleta = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatea moneda en pesos mexicanos
 */
export const formatearMoneda = (valor: number): string => {
  return valor.toLocaleString('es-MX', { 
    style: 'currency', 
    currency: 'MXN' 
  });
};

/**
 * Formatea porcentajes
 */
export const formatearPorcentaje = (valor: number, decimales: number = 1): string => {
  return `${valor.toFixed(decimales)}%`;
};
