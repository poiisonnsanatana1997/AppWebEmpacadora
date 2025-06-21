import { rankItem } from '@tanstack/match-sorter-utils';

/**
 * Función de filtrado personalizada para búsqueda difusa en columnas de la tabla
 * Utiliza @tanstack/match-sorter-utils para una coincidencia eficiente de cadenas
 */
export const fuzzyFilter = (row: any, columnId: string, value: string, addMeta: (meta: any) => void): boolean => {
  // Si no hay valor de filtro, mostrar todas las filas
  if (!value) {
    return true;
  }

  // Obtener el valor de la celda
  const itemValue = row.getValue(columnId);
  
  // Si el valor es nulo o indefinido, no mostrar la fila
  if (!itemValue) {
    return false;
  }

  // Convertir a string para la búsqueda
  const itemString = String(itemValue).toLowerCase();
  const searchString = String(value).toLowerCase();

  // Realizar la búsqueda difusa
  const itemRank = rankItem(itemString, searchString);
  addMeta({
    itemRank,
  });

  return itemRank.passed;
}; 