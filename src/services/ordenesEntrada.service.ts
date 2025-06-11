import { ProveedorDto, ProductoDto, OrdenEntradaDto, PesajeTarimaDto, DetalleOrdenEntradaDto, CrearOrdenEntradaDto } from '../types/ordenesEntrada';
// @ts-ignore
import pdfMake from "pdfmake/build/pdfmake";
// @ts-ignore
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import api from '../api/axios';
if ((pdfFonts as any).pdfMake && (pdfFonts as any).pdfMake.vfs) {
  pdfMake.vfs = (pdfFonts as any).pdfMake.vfs;
} else if ((pdfFonts as any).default && (pdfFonts as any).default.pdfMake && (pdfFonts as any).default.pdfMake.vfs) {
  pdfMake.vfs = (pdfFonts as any).default.pdfMake.vfs;
} else {
  console.error('No se pudo asignar pdfMake.vfs correctamente. Revisa la importación de pdfFonts.');
}

// Datos de prueba
const proveedoresPrueba: ProveedorDto[] = [
  { id: 1, nombre: "AgroSupply S.A." },
  { id: 2, nombre: "Fertilizantes del Norte" },
  { id: 3, nombre: "Semillas Premium" },
  { id: 4, nombre: "Maquinaria Agrícola XYZ" },
  { id: 5, nombre: "Insumos Agrícolas del Sur" }
];

const productosPrueba: ProductoDto[] = [
  { id: 1, nombre: "Fertilizante NPK 15-15-15" },
  { id: 2, nombre: "Semillas de Maíz Híbrido" },
  { id: 3, nombre: "Herbicida Glifosato 5L" },
  { id: 4, nombre: "Pesticida Orgánico" },
  { id: 5, nombre: "Abono Orgánico 20kg" }
];

const ordenesPrueba: OrdenEntradaDto[] = [
  {
    codigo: "OE-670824",
    proveedor: proveedoresPrueba[0],
    producto: productosPrueba[0],
    fechaEstimada: "2024-03-15",
    fechaRegistro: "2024-03-15",
    fechaRecepcion: "2024-03-15",
    estado: "Pendiente",
    observaciones: "Nueva orden importada"
  },
  {
    codigo: "OE-670825",
    proveedor: proveedoresPrueba[1],
    producto: productosPrueba[1],
    fechaEstimada: "2024-03-16",
    fechaRegistro: "2024-03-16",
    fechaRecepcion: "2024-03-16",
    estado: "Pendiente",
    observaciones: "Nueva orden importada"
  },
  {
    codigo: "OE-670826",
    proveedor: proveedoresPrueba[2],
    producto: productosPrueba[2],
    fechaEstimada: "2024-03-17",
    fechaRegistro: "2024-03-17",
    fechaRecepcion: "2024-03-17",
    estado: "Pendiente",
    observaciones: "Nueva orden importada"
  },
  {
    codigo: "OE-670827",
    proveedor: proveedoresPrueba[3],
    producto: productosPrueba[3],
    fechaEstimada: "2024-03-18",
    fechaRegistro: "2024-03-18",
    fechaRecepcion: "2024-03-18",
    estado: "Pendiente",
    observaciones: "Nueva orden importada"
  },
  {
    codigo: "OE-670828",
    proveedor: proveedoresPrueba[4],
    producto: productosPrueba[4],
    fechaEstimada: "2024-03-19",
    fechaRegistro: "2024-03-19",
    fechaRecepcion: "2024-03-19",
    estado: "Pendiente",
    observaciones: "Nueva orden importada"
  },
  {
    codigo: "OE-670829",
    proveedor: proveedoresPrueba[0],
    producto: productosPrueba[0],
    fechaEstimada: "2024-03-20",
    fechaRegistro: "2024-03-20",
    fechaRecepcion: "2024-03-20",
    estado: "Pendiente",
    observaciones: "Nueva orden importada"
  }
];

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
    return data;
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
  async actualizarOrden(codigo: string, orden: CrearOrdenEntradaDto): Promise<OrdenEntradaDto | undefined> {
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
   * Importa órdenes de entrada desde un archivo
   * @param {File} _archivo - Archivo a importar (formato soportado: Excel, CSV)
   * @returns {Promise<OrdenEntradaDto[]>} Lista de órdenes importadas
   */
  async importarOrdenes(_archivo: File): Promise<OrdenEntradaDto[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular importación de 2 órdenes
    const ordenesImportadas: OrdenEntradaDto[] = [
      {
        codigo: `OE-${Date.now().toString().slice(-6)}`,
        proveedor: proveedoresPrueba[2],
        fechaEstimada: new Date().toISOString().split('T')[0],
        estado: "Pendiente",
        observaciones: "Nueva orden importada",
        producto: productosPrueba[2],
        fechaRegistro: new Date().toISOString().split('T')[0],
        fechaRecepcion: new Date().toISOString().split('T')[0],
      },
      {
        codigo: `OE-${Date.now().toString().slice(-6)}`,
        proveedor: proveedoresPrueba[3],
        fechaEstimada: new Date().toISOString().split('T')[0],
        estado: "Pendiente",
        observaciones: "Nueva orden importada",
        producto: productosPrueba[3],
        fechaRegistro: new Date().toISOString().split('T')[0],
        fechaRecepcion: new Date().toISOString().split('T')[0],
      }
    ];
    
    ordenesPrueba.push(...ordenesImportadas);
    return ordenesImportadas;
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

    const orden = detalleOrden.ordenEntrada;
    const tarimas = detalleOrden.tarimas;

    // Calcular totales asegurando que todos los valores sean números válidos
    const totales = tarimas.reduce((acc: { pesoBruto: number; pesoTara: number; pesoTarima: number; pesoPatin: number; pesoNeto: number }, t: PesajeTarimaDto) => ({
      pesoBruto: acc.pesoBruto + safeNumber(t.pesoBruto),
      pesoTara: acc.pesoTara + safeNumber(t.pesoTara),
      pesoTarima: acc.pesoTarima + safeNumber(t.pesoTarima),
      pesoPatin: acc.pesoPatin + safeNumber(t.pesoPatin),
      pesoNeto: acc.pesoNeto + safeNumber(t.pesoNeto)
    }), {
      pesoBruto: 0,
      pesoTara: 0,
      pesoTarima: 0,
      pesoPatin: 0,
      pesoNeto: 0
    });

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 40],
      content: [
        {
          columns: [
            [
              { text: 'EMPACADORA DEL VALLE DE SAN FRANCISCO', style: 'empresa' },
              { text: '"Fulgencio García Téllez"', style: 'responsable' },
              { text: 'Camino a San Francisco Núm. 101, Epazoyucan; Hidalgo. C.P. 43580', style: 'direccion' },
              { text: 'RFC: GATF580116P8A', style: 'direccion' }
            ],
            [
              { text: `Folio: ${orden.codigo}`, style: 'folio', alignment: 'right' },
              { text: `Fecha: ${orden.fechaRecepcion}`, style: 'folio', alignment: 'right' }
            ]
          ]
        },
        { text: 'RECEPCIÓN DE PRODUCTO', style: 'titulo', margin: [0, 18, 0, 12] },
        {
          style: 'datosPrincipales',
          table: {
            widths: [90, '*'],
            body: [
              [{ text: 'Productor:', bold: true }, orden.proveedor.nombre],
              [{ text: 'Producto:', bold: true }, orden.producto.nombre],
              [{ text: 'Observaciones:', bold: true }, orden.observaciones || 'Sin observaciones']
            ]
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 18]
        },
        {
          table: {
            headerRows: 1,
            widths: [50, 65, 65, 65, 65, 75, '*'],
            body: [
              [
                { text: 'Número', style: 'tableHeader' },
                { text: 'Peso Bruto', style: 'tableHeader' },
                { text: 'Peso Tara', style: 'tableHeader' },
                { text: 'Peso Tarima', style: 'tableHeader' },
                { text: 'Peso Patín', style: 'tableHeader' },
                { text: 'Peso Neto', style: 'tableHeader' },
                { text: 'Observaciones', style: 'tableHeader' }
              ],
              ...tarimas.map((t: PesajeTarimaDto) => [
                t.numero,
                `${safeNumber(t.pesoBruto)} kg`,
                `${safeNumber(t.pesoTara)} kg`,
                `${safeNumber(t.pesoTarima)} kg`,
                `${safeNumber(t.pesoPatin)} kg`,
                `${safeNumber(t.pesoNeto)} kg`,
                t.observaciones || ''
              ]),
              [
                { text: 'TOTAL', bold: true },
                { text: `${safeNumber(totales.pesoBruto).toFixed(2)} kg`, bold: true },
                { text: `${safeNumber(totales.pesoTara).toFixed(2)} kg`, bold: true },
                { text: `${safeNumber(totales.pesoTarima).toFixed(2)} kg`, bold: true },
                { text: `${safeNumber(totales.pesoPatin).toFixed(2)} kg`, bold: true },
                { text: `${safeNumber(totales.pesoNeto).toFixed(2)} kg`, bold: true },
                ''
              ]
            ]
          },
          layout: {
            fillColor: function (rowIndex: number, node: any, columnIndex: number) {
              if (rowIndex === 0) return '#388E3C'; // Encabezado
              if (rowIndex === node.table.body.length - 1) return '#e8f5e9'; // Totales
              return null;
            },
            hLineWidth: function () { return 0.7; },
            vLineWidth: function () { return 0.7; },
            hLineColor: function () { return '#c8e6c9'; },
            vLineColor: function () { return '#c8e6c9'; },
            paddingLeft: function() { return 6; },
            paddingRight: function() { return 6; },
            paddingTop: function() { return 5; },
            paddingBottom: function() { return 5; }
          }
        }
      ],
      styles: {
        empresa: { fontSize: 16, bold: true, color: '#388E3C' },
        responsable: { fontSize: 11, italics: true, color: '#444' },
        direccion: { fontSize: 9, color: '#555' },
        folio: { fontSize: 10, color: '#444', margin: [0, 2, 0, 0] },
        titulo: { fontSize: 18, bold: true, color: '#2980b9', alignment: 'center', margin: [0, 10, 0, 10] },
        datosPrincipales: { fontSize: 11, margin: [0, 10, 0, 10] },
        tableHeader: { bold: true, fontSize: 10, color: 'white', fillColor: '#388E3C', alignment: 'center' },
        footer: { fontSize: 8, color: '#636e72' }
      },
      footer: function(currentPage: number, pageCount: number) {
        return {
          columns: [
            { text: 'Documento generado automáticamente por AgroSmart', alignment: 'center', style: 'footer' }
          ],
          margin: [0, 10, 0, 0]
        };
      }
    };

    return new Promise<Blob>((resolve) => {
      pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
        resolve(blob);
      });
    });
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
    const { data } = await api.get<{ pesoTotal: number }>('/OrdenEntrada/peso-total-hoy');
    return data.pesoTotal;
  },

  /**
   * Obtiene la cantidad de órdenes pendientes para hoy
   * Endpoint: GET /OrdenEntrada/estadisticas/pendientes-hoy
   */
  async obtenerOrdenesPendientesHoy(): Promise<number> {
    const { data } = await api.get<{ cantidadPendientes: number }>('/OrdenEntrada/estadisticas/pendientes-hoy');
    return data.cantidadPendientes;
  },
}; 