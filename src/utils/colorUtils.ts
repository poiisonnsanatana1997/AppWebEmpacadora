/**
 * Utilidades para colores estándar de tipos de tarimas
 * Basado en los colores utilizados en la tabla de inventarios (Tailwind CSS)
 */

/**
 * Colores estándar para tipos de tarimas
 * Estos colores coinciden con los utilizados en la tabla de inventarios
 */
export const COLORES_TIPOS_TARIMAS = {
  XL: '#6b21a8', // purple-800
  L: '#1e40af',  // blue-800
  M: '#166534',  // green-800
  S: '#9a3412',  // orange-800
} as const;

/**
 * Obtiene el color estándar para un tipo de tarima
 * @param tipo - El tipo de tarima (XL, L, M, S)
 * @returns El color hexadecimal correspondiente
 */
export const obtenerColorPorTipo = (tipo: string): string => {
  return COLORES_TIPOS_TARIMAS[tipo as keyof typeof COLORES_TIPOS_TARIMAS] || '#6b7280'; // gray-500 como fallback
};

/**
 * Obtiene todos los colores estándar como array
 * @returns Array de colores en orden XL, L, M, S
 */
export const obtenerColoresEstándar = (): string[] => {
  return Object.values(COLORES_TIPOS_TARIMAS);
};
