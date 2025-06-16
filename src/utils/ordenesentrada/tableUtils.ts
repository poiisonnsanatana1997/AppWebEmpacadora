import { FilterFn } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

/**
 * Función de filtrado personalizada para búsqueda difusa en columnas de la tabla
 * Utiliza @tanstack/match-sorter-utils para una coincidencia eficiente de cadenas
 */
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
}; 