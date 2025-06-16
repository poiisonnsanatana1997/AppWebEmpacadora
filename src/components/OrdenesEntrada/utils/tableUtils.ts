/**
 * Función de filtrado difuso para búsquedas en la tabla
 * @param row Fila de la tabla
 * @param columnId ID de la columna
 * @param value Valor a buscar
 * @param addMeta Información adicional
 */
export const fuzzyFilter = (row: any, columnId: string, value: string, addMeta: any) => {
  const itemValue = row.getValue(columnId);
  if (itemValue == null) {
    return false;
  }

  const searchValue = value.toLowerCase();
  const itemValueStr = String(itemValue).toLowerCase();

  return itemValueStr.includes(searchValue);
}; 