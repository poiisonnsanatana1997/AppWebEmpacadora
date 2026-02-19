import * as XLSX from 'xlsx';

/**
 * Genera y descarga una plantilla Excel para importar órdenes de entrada
 */
export function generarPlantillaOrdenesEntrada(): void {
  // Definir los datos de la plantilla
  const datos = [
    // Encabezados
    ['Proveedor', 'Producto', 'Fecha Estimada', 'Observaciones'],
    // Ejemplos de datos
    ['Productor San Juan', 'AGU001', '2025-10-15', 'Entrega matutina'],
    ['Rancho El Paraíso', 'Aguacate Hass', '2025-10-16', ''],
    ['Agrícola Los Pinos', 'TOM002', '2025-10-17', 'Verificar calidad'],
  ];

  // Crear un libro de trabajo
  const workbook = XLSX.utils.book_new();

  // Crear hoja de datos
  const worksheet = XLSX.utils.aoa_to_sheet(datos);

  // Configurar anchos de columna
  worksheet['!cols'] = [
    { wch: 25 }, // Proveedor
    { wch: 20 }, // Producto
    { wch: 18 }, // Fecha Estimada
    { wch: 30 }, // Observaciones
  ];

  // Aplicar estilo a los encabezados (primera fila)
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:D1');
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellAddress]) continue;

    // Aplicar formato bold (esto es limitado en xlsx, pero funciona para la estructura)
    worksheet[cellAddress].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: '1F4788' } },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
  }

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Órdenes de Entrada');

  // Crear hoja de instrucciones
  const instrucciones = [
    ['INSTRUCCIONES PARA IMPORTAR ÓRDENES DE ENTRADA'],
    [''],
    ['1. ESTRUCTURA DEL ARCHIVO'],
    ['   - Columna A: Proveedor (requerido)'],
    ['   - Columna B: Producto (requerido)'],
    ['   - Columna C: Fecha Estimada (requerido)'],
    ['   - Columna D: Observaciones (opcional)'],
    [''],
    ['2. VALIDACIONES'],
    ['   - Proveedor: Debe existir en el sistema'],
    ['   - Producto: Puede ser el código (ej: AGU001) o nombre completo'],
    ['   - Fecha: Formato YYYY-MM-DD o DD/MM/YYYY, no puede ser fecha pasada'],
    ['   - Observaciones: Máximo 500 caracteres'],
    [''],
    ['3. LÍMITES'],
    ['   - Tamaño máximo de archivo: 5MB'],
    ['   - Máximo de órdenes por importación: 1000'],
    [''],
    ['4. CONSEJOS'],
    ['   - Elimine las filas de ejemplo antes de importar sus datos'],
    ['   - Asegúrese de que los proveedores y productos estén registrados'],
    ['   - Use fechas en formato correcto'],
    ['   - Revise que no haya celdas vacías en columnas requeridas'],
    [''],
    ['5. RESULTADO'],
    ['   - Si todo es correcto: Verá "X órdenes importadas exitosamente"'],
    ['   - Si hay errores parciales: Verá cuántas se importaron y los errores'],
    ['   - Si hay error crítico: Revise el formato del archivo'],
  ];

  const worksheetInstrucciones = XLSX.utils.aoa_to_sheet(instrucciones);

  // Configurar ancho de columna para instrucciones
  worksheetInstrucciones['!cols'] = [{ wch: 80 }];

  XLSX.utils.book_append_sheet(workbook, worksheetInstrucciones, 'Instrucciones');

  // Generar archivo Excel y descargarlo
  XLSX.writeFile(workbook, 'plantilla_ordenes_entrada.xlsx', {
    bookType: 'xlsx',
    type: 'binary'
  });
}
