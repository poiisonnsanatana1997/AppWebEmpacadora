import { ProveedorDto, ProductoDto, OrdenEntradaDto, PesajeTarimaDto, DetalleOrdenEntradaDto, CrearOrdenEntradaDto, ActualizarOrdenEntradaDto, ESTADO_ORDEN } from '../types/OrdenesEntrada/ordenesEntrada.types';
import { PedidoCompletoDTO } from '../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { ResultadoImportacion } from '../types/OrdenesEntrada/importacion.types';
// @ts-ignore
import pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import api from '../api/axios';
import { imageToBase64 } from '@/utils/imageToBase64';
import logo from '/images/LogoEmpacadora.jpg';
if ((pdfFonts as any).pdfMake && (pdfFonts as any).pdfMake.vfs) {
  pdfMake.vfs = (pdfFonts as any).pdfMake.vfs;
} else if ((pdfFonts as any).default && (pdfFonts as any).default.pdfMake && (pdfFonts as any).default.pdfMake.vfs) {
  pdfMake.vfs = (pdfFonts as any).default.pdfMake.vfs;
} else {
  console.error('No se pudo asignar pdfMake.vfs correctamente. Revisa la importación de pdfFonts.');
}


// Función para asegurar que todos los valores sean números válidos
function safeNumber(val: any): number {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

/**
 * Servicio para gestionar las órdenes de entrada del sistema
 * @namespace OrdenesEntradaService
 */
export const OrdenesEntradaService = {
  /**
   * Obtiene todas las órdenes de entrada del sistema
   * Endpoint: GET /OrdenEntrada
   */
  async obtenerOrdenes(): Promise<OrdenEntradaDto[]> {
    const { data } = await api.get<OrdenEntradaDto[]>('/OrdenEntrada');
    // Normalizar el campo 'estado' para cada orden
    return data.map((orden) => ({
      ...orden,
      estado: normalizarEstadoOrden(orden.estado)
    }));
  },

  /**
   * Obtiene una orden de entrada por su código
   * Endpoint: GET /OrdenEntrada/{codigo}
   */
  async obtenerOrden(codigo: string): Promise<OrdenEntradaDto | undefined> {
    const { data } = await api.get<OrdenEntradaDto>(`/OrdenEntrada/${codigo}`);
    return data;
  },

  /**
   * Crea una nueva orden de entrada
   * Endpoint: POST /OrdenEntrada
   */
  async crearOrden(orden: CrearOrdenEntradaDto): Promise<OrdenEntradaDto> {
    const { data } = await api.post<OrdenEntradaDto>('/OrdenEntrada', orden);
    return data;
  },

  /**
   * Actualiza una orden de entrada existente
   * Endpoint: PUT /OrdenEntrada/{codigo}
   */
  async actualizarOrden(codigo: string, orden: ActualizarOrdenEntradaDto): Promise<OrdenEntradaDto | undefined> {
    const { data } = await api.put<OrdenEntradaDto>(`/OrdenEntrada/${codigo}`, orden);
    return data;
  },

  /**
   * Elimina una orden de entrada
   * Endpoint: DELETE /OrdenEntrada/{codigo}
   */
  async eliminarOrden(codigo: string): Promise<boolean> {
    await api.delete(`/OrdenEntrada/${codigo}`);
    return true;
  },

  /**
   * Obtiene todos los proveedores
   * Endpoint: GET /Proveedores
   */
  async obtenerProveedores(): Promise<ProveedorDto[]> {
    const { data } = await api.get<ProveedorDto[]>('/Proveedores');
    return data;
  },

  /**
   * Obtiene un proveedor por su ID
   * Endpoint: GET /Proveedores/{id}
   */
  async obtenerProveedor(id: number): Promise<ProveedorDto | undefined> {
    const { data } = await api.get<ProveedorDto>(`/Proveedores/${id}`);
    return data;
  },

  /**
   * Obtiene todos los productos
   * Endpoint: GET /Productos
   */
  async obtenerProductos(): Promise<ProductoDto[]> {
    const { data } = await api.get<ProductoDto[]>('/Productos');
    return data;
  },

  /**
   * Obtiene un producto por su ID
   * Endpoint: GET /Productos/{id}
   */
  async obtenerProducto(id: number): Promise<ProductoDto | undefined> {
    const { data } = await api.get<ProductoDto>(`/Productos/${id}`);
    return data;
  },

  /**
   * Importa órdenes de entrada desde un archivo Excel
   * @param {File} archivo - Archivo Excel a importar (.xlsx o .xls)
   * @returns {Promise<ResultadoImportacion>} Resultado de la importación con órdenes creadas y errores
   */
  async importarOrdenes(archivo: File): Promise<ResultadoImportacion> {
    try {
      // Validar extensión del archivo
      if (!archivo.name.match(/\.(xlsx|xls)$/i)) {
        throw {
          message: 'Formato de archivo no válido. Solo se aceptan archivos .xlsx o .xls',
          code: 'INVALID_FILE_FORMAT'
        };
      }

      // Validar tamaño del archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (archivo.size > maxSize) {
        throw {
          message: 'El archivo es demasiado grande. Tamaño máximo: 5MB',
          code: 'FILE_TOO_LARGE'
        };
      }

      // Validar que el archivo no esté vacío
      if (archivo.size === 0) {
        throw {
          message: 'El archivo está vacío',
          code: 'EMPTY_FILE'
        };
      }

      const formData = new FormData();
      formData.append('archivo', archivo);

      const { data } = await api.post<ResultadoImportacion>(
        '/OrdenEntrada/importar',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000, // 60 segundos
        }
      );

      return data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          throw {
            message: data.message || 'Formato de archivo inválido o datos incorrectos',
            code: data.code || 'INVALID_FILE',
            status
          };
        } else if (status === 413) {
          throw {
            message: 'El archivo es demasiado grande',
            code: 'FILE_TOO_LARGE',
            status
          };
        } else if (status === 422) {
          throw {
            message: data.message || 'El archivo contiene datos inválidos',
            code: 'UNPROCESSABLE_ENTITY',
            status
          };
        } else if (status >= 500) {
          throw {
            message: 'Error en el servidor. Por favor, intenta más tarde',
            code: 'SERVER_ERROR',
            status
          };
        } else {
          throw {
            message: data.message || 'Error al importar las órdenes',
            code: data.code || 'UNKNOWN_ERROR',
            status
          };
        }
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else if (error.code) {
        // Error lanzado por nuestras validaciones locales
        throw error;
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  },

  /**
   * Obtiene un detalle de una orden de entrada
   * Endpoint: GET /OrdenEntrada/{codigo}/detalle
   */
  async obtenerDetalleOrden(codigo: string): Promise<DetalleOrdenEntradaDto | undefined> {
    const { data } = await api.get<DetalleOrdenEntradaDto>(`/OrdenEntrada/${codigo}/detalle`);
    return data;
  },

  /**
   * Genera un documento imprimible de una orden de entrada
   * @param {string} codigo - Código de la orden a imprimir
   * @returns {Promise<Blob>} Documento en formato PDF
   */
  async imprimirOrden(codigo: string): Promise<Blob> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Obtener el detalle de la orden
    const detalleOrden = await this.obtenerDetalleOrden(codigo);
    if (!detalleOrden) throw new Error('Orden no encontrada');

    // Convertir la imagen del logo a Base64
    const logoBase64 = await imageToBase64(logo);

    const orden = detalleOrden.ordenEntrada;
    const tarimas = detalleOrden.tarimas;

    // Calcular totales asegurando que todos los valores sean números válidos
    const totales = tarimas.reduce((acc: { pesoBruto: number; pesoTara: number; pesoTarima: number; pesoPatin: number; pesoNeto: number; cantidadCajas: number }, t: PesajeTarimaDto) => ({
      pesoBruto: acc.pesoBruto + safeNumber(t.pesoBruto),
      pesoTara: acc.pesoTara + safeNumber(t.pesoTara),
      pesoTarima: acc.pesoTarima + safeNumber(t.pesoTarima),
      pesoPatin: acc.pesoPatin + safeNumber(t.pesoPatin),
      pesoNeto: acc.pesoNeto + safeNumber(t.pesoNeto),
      cantidadCajas: acc.cantidadCajas + safeNumber(t.cantidadCajas)
    }), {
      pesoBruto: 0,
      pesoTara: 0,
      pesoTarima: 0,
      pesoPatin: 0,
      pesoNeto: 0,
      cantidadCajas: 0
    });

    const docDefinition = {
      pageSize: 'LETTER',
      pageMargins: [40, 40, 40, 60],
      content: [
        // Encabezado
        {
          columns: [
            {
              image: logoBase64,
              width: 70,
              alignment: 'left',
              margin: [0, 0, 10, 0]
            },
            {
              width: '*',
              stack: [
                { text: 'EMPACADORA DEL VALLE DE SAN FRANCISCO', style: 'empresa', alignment: 'center' },
                { text: '"Fulgencio García Téllez"', style: 'responsable', alignment: 'center' },
                { text: 'Camino a San Francisco Núm. 101, Epazoyucan; Hidalgo. C.P. 43580', style: 'direccion', alignment: 'center' },
                { text: 'RFC: GATF580116P8A', style: 'direccion', alignment: 'center' },
                { text: 'RECEPCIÓN DE PRODUCTO', style: 'tituloRecepcion', alignment: 'center', margin: [0, 8, 0, 0] }
              ]
            },
            {
              width: 'auto',
              table: {
                body: [
                  [
                    { text: `No. ${orden.codigo}`, style: 'folioBox' }
                  ],
                  [
                    { text: formatearFecha(orden.fechaRecepcion).split(',')[0], style: 'fechaBox' }
                  ]
                ]
              },
              layout: {
                hLineWidth: () => 0,
                vLineWidth: () => 0,
                paddingLeft: () => 8,
                paddingRight: () => 8,
                paddingTop: () => 4,
                paddingBottom: () => 4
              },
              margin: [0, 0, 0, 0]
            }
          ],
          columnGap: 10,
          margin: [0, 0, 0, 10]
        },
        // Línea divisoria sutil
        {
          canvas: [
            { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#FBBF9D' }
          ],
          margin: [0, 0, 0, 10]
        },
        // Datos generales con fondo y borde
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'Productor:', style: 'label' }, { text: orden.proveedor.nombre, style: 'valor' },
                { text: 'Producto:', style: 'label' }, { text: orden.producto.nombre, style: 'valor' }
              ],
              [
                { text: 'Código Producto:', style: 'label' }, { text: orden.producto.codigo, style: 'valor' },
                { text: 'Variedad:', style: 'label' }, { text: orden.producto.variedad, style: 'valor' }
              ]
            ]
          },
          layout: {
            fillColor: function() {
              return '#f7f7f7';
            },
            hLineWidth: function(i: number, node: any) { return i === 0 || i === node.table.body.length ? 1 : 0; },
            vLineWidth: function(i: number, node: any) { return i === 0 || i === node.table.widths.length ? 1 : 0; },
            hLineColor: function() { return '#333'; },
            vLineColor: function() { return '#333'; },
            paddingLeft: function() { return 8; },
            paddingRight: function() { return 8; },
            paddingTop: function() { return 4; },
            paddingBottom: function() { return 4; }
          },
          margin: [0, 0, 0, 18]
        },
        {
          text: 'Detalle de Tarimas',
          style: 'subtitulo',
          margin: [0, 0, 0, 8]
        },
        {
          columns: [
            { width: '*', text: '' },
            {
              width: '100%',
              table: {
                headerRows: 1,
                widths: ['*', '*', '*', '*', '*', '*', '*'],
                body: [
                  [
                    { text: 'Número Tarima', style: 'tableHeaderTarima' },
                    { text: 'Peso Bruto', style: 'tableHeaderTarima' },
                    { text: 'Peso Tara', style: 'tableHeaderTarima' },
                    { text: 'Peso Tarima', style: 'tableHeaderTarima' },
                    { text: 'Peso Patín', style: 'tableHeaderTarima' },
                    { text: 'Peso Neto', style: 'tableHeaderTarima' },
                    { text: 'Cajas Tara', style: 'tableHeaderTarima' }
                  ],
                  ...tarimas.map((t, i) => [
                    { text: t.numero, fontSize: 9, color: '#222', alignment: 'center', margin: [0, 0, 0, 0] },
                    { text: `${safeNumber(t.pesoBruto).toFixed(2)} kg`, fontSize: 9, color: '#222', alignment: 'right' },
                    { text: `${safeNumber(t.pesoTara).toFixed(2)} kg`, fontSize: 9, color: '#222', alignment: 'right' },
                    { text: `${safeNumber(t.pesoTarima).toFixed(2)} kg`, fontSize: 9, color: '#222', alignment: 'right' },
                    { text: `${safeNumber(t.pesoPatin).toFixed(2)} kg`, fontSize: 9, color: '#222', alignment: 'right' },
                    { text: `${safeNumber(t.pesoNeto).toFixed(2)} kg`, fontSize: 9, color: '#222', alignment: 'right' },
                    { text: t.cantidadCajas || '0', fontSize: 9, color: '#222', alignment: 'right' }
                  ]),
                  [
                    { text: 'TOTAL', style: 'totalRowTarima', alignment: 'center', margin: [0, 0, 0, 0] },
                    { text: `${safeNumber(totales.pesoBruto).toFixed(2)} kg`, style: 'totalRowTarima', alignment: 'right' },
                    { text: `${safeNumber(totales.pesoTara).toFixed(2)} kg`, style: 'totalRowTarima', alignment: 'right' },
                    { text: `${safeNumber(totales.pesoTarima).toFixed(2)} kg`, style: 'totalRowTarima', alignment: 'right' },
                    { text: `${safeNumber(totales.pesoPatin).toFixed(2)} kg`, style: 'totalRowTarima', alignment: 'right' },
                    { text: `${safeNumber(totales.pesoNeto).toFixed(2)} kg`, style: 'totalRowTarima', alignment: 'right' },
                    { text: `${totales.cantidadCajas || 0}`, style: 'totalRowTarima', alignment: 'right' }
                  ]
                ]
              },
              layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                  if (rowIndex === 0) return null; // encabezado ya tiene color
                  if (rowIndex === node.table.body.length - 1) return '#E6F4EA'; // total
                  return rowIndex % 2 === 0 ? '#FFFFFF' : '#FDE6DC'; // alternancia
                },
                hLineWidth: function (i, node) { return i === 0 || i === node.table.body.length ? 1.2 : 0.5; },
                vLineWidth: function () { return 0.5; },
                hLineColor: function () { return '#FBBF9D'; },
                vLineColor: function () { return '#E0E0E0'; },
                paddingLeft: function () { return 8; },
                paddingRight: function () { return 8; },
                paddingTop: function () { return 6; },
                paddingBottom: function () { return 6; }
              }
            },
            { width: '*', text: '' }
          ],
          columnGap: 0,
          margin: [0, 0, 0, 12]
        },
        // Observaciones con borde sutil
        {
          text: 'Observaciones:',
          style: 'label',
          margin: [0, 0, 0, 2]
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                { text: orden.observaciones || 'N/A', style: 'observaciones', border: [false, false, false, false] }
              ]
            ]
          },
          layout: {
            hLineWidth: function() { return 1; },
            vLineWidth: function() { return 0; },
            hLineColor: function() { return '#e0e0e0'; },
            paddingLeft: function() { return 8; },
            paddingRight: function() { return 8; },
            paddingTop: function() { return 4; },
            paddingBottom: function() { return 4; }
          },
          margin: [0, 0, 0, 10]
        },
        // Sección de firmas
        {
          columns: [
            {
              width: '45%',
              stack: [
                { text: '________________________', alignment: 'center' },
                { text: 'Firma del Productor', alignment: 'center', style: 'firma' },
                { text: orden.proveedor.nombre, alignment: 'center', style: 'nombreFirma' }
              ]
            },
            {
              width: '10%',
              text: ''
            },
            {
              width: '45%',
              stack: [
                { text: '________________________', alignment: 'center' },
                { text: 'Firma de Recepción', alignment: 'center', style: 'firma' },
                { text: orden.usuarioRecepcion || 'Usuario de Recepción', alignment: 'center', style: 'nombreFirma' }
              ]
            }
          ],
          margin: [0, 20, 0, 0]
        }
      ],
      images: {
        logo: logoBase64
      },
      styles: {
        empresa: { fontSize: 16, bold: true, color: '#333333' },
        responsable: { fontSize: 11, italics: true, color: '#C97B63' },
        direccion: { fontSize: 9, color: '#888888' },
        tituloRecepcion: { fontSize: 16, bold: true, color: '#F15A24', alignment: 'center', margin: [0, 10, 0, 10] },
        folioBox: { fontSize: 11, bold: true, color: '#F15A24', fillColor: '#FDE6DC', alignment: 'center', margin: [0, 2, 0, 2] },
        fechaBox: { fontSize: 11, bold: true, color: '#F15A24', fillColor: '#FDE6DC', alignment: 'center', margin: [0, 2, 0, 2] },
        label: { bold: true, color: '#333', fontSize: 9 },
        valor: { color: '#333', fontSize: 9 },
        valorDestacado: { color: '#C62828', fontSize: 11, bold: true },
        tableHeader: { bold: true, fontSize: 10, color: 'white', fillColor: '#333', alignment: 'center' },
        tableHeaderSmall: { bold: true, fontSize: 8, color: 'white', fillColor: '#333', alignment: 'center' },
        observaciones: { fontSize: 10, color: '#333', italics: true, margin: [0, 0, 0, 10] },
        footer: { fontSize: 8, color: '#888' },
        firma: { fontSize: 10, color: '#333', margin: [0, 5, 0, 0] },
        nombreFirma: { fontSize: 9, color: '#888', margin: [0, 2, 0, 0] },
        folioLabel: { fontSize: 9, bold: true, color: 'white', alignment: 'center', margin: [0, 2, 0, 2] },
        folioValue: { fontSize: 11, bold: true, color: '#C62828', alignment: 'center', margin: [0, 2, 0, 2] },
        tableHeaderTarima: { bold: true, fontSize: 10, color: 'white', fillColor: '#F15A24', alignment: 'center' },
        totalRowTarima: { bold: true, fillColor: '#E6F4EA', fontSize: 9, color: '#4BB543', alignment: 'right' },
      },
      footer: function(currentPage: number, pageCount: number) {
        return {
          columns: [
            { text: `Documento generado automáticamente por EMPACADORA DEL VALLE DE SAN FRANCISCO | Página ${currentPage} de ${pageCount} | Generado: ${new Date().toLocaleString('es-MX')}` , alignment: 'center', style: 'footer' }
          ],
          margin: [0, 10, 0, 0]
        };
      }
    };

    // Función auxiliar para formatear fechas
    function formatearFecha(fecha: string | null | undefined): string {
      if (!fecha) return 'No disponible';
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(fecha));
    }

    return new Promise<Blob>((resolve) => {
      pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
        resolve(blob);
      });
    });
  },

  /**
   * Carga el logo del proyecto y lo convierte a base64
   * @returns {Promise<string>} Logo en formato base64
   */
  async cargarLogoBase64(): Promise<string> {
    try {
      const response = await fetch('/images/LogoEmpacadora.jpg');
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error al cargar el logo:', error);
      // Retornar un logo por defecto en caso de error
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDItMTNUMTU6NDc6NDctMDY6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQtMDItMTNUMTU6NDc6NDctMDY6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTAyLTEzVDE1OjQ3OjQ3LTA2OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY5ZDM4ZjM5LTM4ZTAtNDZiZi1hMzA2LTNmZjM4ZjM5M2Y2ZiIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjY5ZDM4ZjM5LTM4ZTAtNDZiZi1hMzA2LTNmZjM4ZjM5M2Y2ZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjY5ZDM4ZjM5LTM4ZTAtNDZiZi1hMzA2LTNmZjM4ZjM5M2Y2ZiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY5ZDM4ZjM5LTM4ZTAtNDZiZi1hMzA2LTNmZjM4ZjM5M2Y2ZiIgc3RFdnQ6d2hlbj0iMjAyNC0wMi0xM1QxNTo0Nzo0Ny0wNjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+';
    }
  },

  /**
   * Agrega una nueva tarima a una orden de entrada
   * @param {string} codigoOrden - Código de la orden
   * @param {Omit<PesajeTarimaDto, 'numero'>} tarima - Datos de la tarima a agregar
   * @returns {Promise<PesajeTarimaDto>} Tarima agregada
   */
  async agregarTarima(
    codigoOrden: string,
    tarima: Omit<PesajeTarimaDto, 'numero'>
  ): Promise<PesajeTarimaDto> {
    try {
      const response = await api.post<PesajeTarimaDto>(
        `/OrdenEntrada/${codigoOrden}/tarimas`,
        tarima,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (!response.data) {
        throw {
          message: 'No se recibió respuesta del servidor',
          code: 'NO_RESPONSE'
        };
      }
      console.log('response.data', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) {
          throw {
            message: data.message || 'Datos inválidos. Por favor, verifica la información proporcionada',
            code: 'INVALID_DATA',
            status
          };
        } else if (status === 404) {
          throw {
            message: 'Orden no encontrada',
            code: 'NOT_FOUND',
            status
          };
        } else if (status === 409) {
          throw {
            message: 'Ya existe una tarima con ese número',
            code: 'DUPLICATE_TARIMA',
            status
          };
        } else if (status >= 500) {
          throw {
            message: 'Error en el servidor. Por favor, intenta más tarde',
            code: 'SERVER_ERROR',
            status
          };
        } else {
          throw {
            message: data.message || 'Error al agregar la tarima',
            code: data.code || 'UNKNOWN_ERROR',
            status
          };
        }
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  },

  /**
   * Actualiza los pesajes de una tarima específica
   * @param {string} codigoOrden - Código de la orden
   * @param {string} numeroTarima - Número de la tarima a actualizar
   * @param {Partial<PesajeTarimaDto>} pesajes - Datos de pesaje a actualizar
   * @returns {Promise<PesajeTarimaDto | undefined>} Tarima actualizada
   */
  async actualizarPesajesTarima(
    codigoOrden: string, 
    numeroTarima: string, 
    pesajes: Partial<PesajeTarimaDto>
  ): Promise<PesajeTarimaDto | undefined> {
    try {
      const { data } = await api.put<PesajeTarimaDto>(
        `/OrdenEntrada/${codigoOrden}/tarimas/${numeroTarima}`,
        pesajes,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) {
          throw {
            message: data.message || 'Datos inválidos. Por favor, verifica la información proporcionada',
            code: 'INVALID_DATA',
            status
          };
        } else if (status === 404) {
          throw {
            message: 'Tarima u orden no encontrada',
            code: 'NOT_FOUND',
            status
          };
        } else if (status >= 500) {
          throw {
            message: 'Error en el servidor. Por favor, intenta más tarde',
            code: 'SERVER_ERROR',
            status
          };
        } else {
          throw {
            message: data.message || 'Error al actualizar la tarima',
            code: data.code || 'UNKNOWN_ERROR',
            status
          };
        }
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  },

  /**
   * Elimina una tarima de una orden de entrada
   * @param {string} codigoOrden - Código de la orden
   * @param {string} numeroTarima - Número de la tarima a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  async eliminarPesajeTarima(codigoOrden: string, numeroTarima: string): Promise<boolean> {
    try {
      await api.delete(`/OrdenEntrada/${codigoOrden}/tarimas/${numeroTarima}`);
      return true;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 404) {
          throw {
            message: 'Tarima u orden no encontrada',
            code: 'NOT_FOUND',
            status
          };
        } else if (status >= 500) {
          throw {
            message: 'Error en el servidor. Por favor, intenta más tarde',
            code: 'SERVER_ERROR',
            status
          };
        } else {
          throw {
            message: data.message || 'Error al eliminar la tarima',
            code: data.code || 'UNKNOWN_ERROR',
            status
          };
        }
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  },

  /**
   * Obtiene el peso total de las órdenes recibidas hoy
   * Endpoint: GET /OrdenEntrada/peso-total-hoy
   */
  async obtenerPesoTotalRecibidoHoy(): Promise<number> {
    try {
      const { data } = await api.get<{ pesoTotal: number }>('/OrdenEntrada/peso-total-hoy');
      return data.pesoTotal;
    } catch (error) {
      console.error('Error al obtener el peso total recibido hoy:', error);
      return 0;
    }
  },

  /**
   * Obtiene la cantidad de órdenes pendientes para hoy
   * Endpoint: GET /OrdenEntrada/estadisticas/pendientes-hoy
   */
  async obtenerOrdenesPendientesHoy(): Promise<number> {
    try {
      const { data } = await api.get<{ cantidadPendientes: number }>('/OrdenEntrada/estadisticas/pendientes-hoy');
      return data.cantidadPendientes;
    } catch (error) {
      console.error('Error al obtener órdenes pendientes hoy:', error);
      return 0;
    }
  },

  /**
   * Obtiene la información completa de un pedido de entrada por su ID de pedido proveedor
   * Endpoint: GET /OrdenEntrada/pedido/{idPedidoProveedor}/completo
   */
  async obtenerPedidoCompleto(idPedidoProveedor: number): Promise<PedidoCompletoDTO> {
    try {
      const { data } = await api.get<PedidoCompletoDTO>(`/OrdenEntrada/pedido/${idPedidoProveedor}/completo`);
      return data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400) {
          throw {
            message: data.message || 'Datos inválidos. Por favor, verifica la información proporcionada',
            code: 'INVALID_DATA',
            status
          };
        } else if (status === 404) {
          throw {
            message: 'Pedido no encontrado',
            code: 'NOT_FOUND',
            status
          };
        } else if (status >= 500) {
          throw {
            message: 'Error en el servidor. Por favor, intenta más tarde',
            code: 'SERVER_ERROR',
            status
          };
        } else {
          throw {
            message: data.message || 'Error al obtener el pedido completo',
            code: data.code || 'UNKNOWN_ERROR',
            status
          };
        }
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet',
          code: 'NETWORK_ERROR'
        };
      } else {
        throw {
          message: 'Error al procesar la solicitud',
          code: 'REQUEST_ERROR'
        };
      }
    }
  },


}; 

// Función para normalizar el campo 'estado' de una orden
function normalizarEstadoOrden(estado: string): ESTADO_ORDEN {
  const estadoLimpio = estado.trim().toLowerCase();
  switch (estadoLimpio) {
    case 'pendiente':
      return ESTADO_ORDEN.PENDIENTE;
    case 'procesando':
      return ESTADO_ORDEN.PROCESANDO;
    case 'recibida':
      return ESTADO_ORDEN.RECIBIDA;
    case 'cancelada':
      return ESTADO_ORDEN.CANCELADA;
    case 'clasificando':
      return ESTADO_ORDEN.CLASIFICANDO;
    case 'clasificado':
      return ESTADO_ORDEN.CLASIFICADO;
    default:
      // Si no coincide, devolver el valor original (o podrías lanzar un error/log)
      return estado as ESTADO_ORDEN;
  }
} 