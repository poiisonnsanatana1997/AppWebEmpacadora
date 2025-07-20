import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { ClasificacionHeader } from '../components/Clasificacion/ClasificacionHeader';
import { ClasificacionDetalle } from '../components/Clasificacion/ClasificacionDetalle';
import { TarimasTable } from '../components/Clasificacion/TarimasTable';
import { TarimaForm } from '../components/Clasificacion/TarimaForm';
import { TarimaDetalleModal } from '../components/Clasificacion/TarimaDetalleModal';
import { MermasModal } from '../components/Clasificacion/MermasModal';
import { RetornosModal } from '../components/Clasificacion/RetornosModal';
import { CrearMermaModal } from '../components/Clasificacion/CrearMermaModal';
import { CrearRetornoModal } from '../components/Clasificacion/CrearRetornoModal';
import { PedidoCompletoDTO, TarimaClasificacionDTO, ClasificacionCompletaDTO } from '../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { OrdenesEntradaService } from '../services/ordenesEntrada.service';
import { ClasificacionService } from '../services/clasificacion.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Package, RotateCcw, AlertTriangle } from 'lucide-react';
import { useClasificacionValidation } from '../hooks/Clasificacion/useClasificacionValidation';
import { useClasificacionFinalizada } from '../hooks/Clasificacion/useClasificacionFinalizada';
import { FinalizarClasificacionButton } from '../components/Clasificacion/FinalizarClasificacionButton';
import { MensajeClasificacionFinalizada } from '../components/Clasificacion/MensajeClasificacionFinalizada';
import ReporteClasificacionFinalizada from '../components/Clasificacion/ReporteClasificacionFinalizada';
import { TarimasParcialesModal } from '../components/Clasificacion/TarimasParcialesModal';
import { AjustarPesosModal } from '../components/Clasificacion/AjustarPesosModal';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import PesosPorTipoBarChart from '../components/Clasificacion/PesosPorTipoBarChart';
import { useIndicadoresPesos } from '../hooks/Clasificacion/useIndicadoresPesos';

export default function ClasificacionOrdenEntrada() {
  const { idOrdenEntrada } = useParams();
  const [orden, setOrden] = useState<PedidoCompletoDTO | null>(null);
  const [clasificaciones, setClasificaciones] = useState<ClasificacionCompletaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [finalizando, setFinalizando] = useState(false);

  // Estado para modales y selección
  const [tarimaFormOpen, setTarimaFormOpen] = useState(false);
  const [tarimaToEdit, setTarimaToEdit] = useState<TarimaClasificacionDTO | null>(null);
  const [tarimaDetalleModalOpen, setTarimaDetalleModalOpen] = useState(false);
  const [tarimaParaDetalle, setTarimaParaDetalle] = useState<TarimaClasificacionDTO | null>(null);
  const [mermasModalOpen, setMermasModalOpen] = useState(false);
  const [retornosModalOpen, setRetornosModalOpen] = useState(false);
  const [crearMermaModalOpen, setCrearMermaModalOpen] = useState(false);
  const [crearRetornoModalOpen, setCrearRetornoModalOpen] = useState(false);
  const [tarimaSeleccionada, setTarimaSeleccionada] = useState<TarimaClasificacionDTO | null>(null);
  const [clasificacionSeleccionada, setClasificacionSeleccionada] = useState<ClasificacionCompletaDTO | null>(null);
  const [tarimasParcialesModalOpen, setTarimasParcialesModalOpen] = useState(false);
  const [ajustePesosModalOpen, setAjustePesosModalOpen] = useState(false);
  const [clasificacionParaAjuste, setClasificacionParaAjuste] = useState<number | null>(null);
  const [tarimasParaAjuste, setTarimasParaAjuste] = useState<TarimaClasificacionDTO[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (!idOrdenEntrada) throw new Error('ID de orden no especificado');
        const ordenData = await OrdenesEntradaService.obtenerPedidoCompleto(Number(idOrdenEntrada));
        setOrden(ordenData);
        setClasificaciones(ordenData.clasificaciones);
      } catch (error: any) {
        toast.error(error?.message || 'No se pudo cargar la información del pedido completo');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [idOrdenEntrada]);

  // Función para obtener la clasificación correspondiente a una tarima
  const obtenerClasificacionPorTarima = (tarima: TarimaClasificacionDTO): ClasificacionCompletaDTO | null => {
    return clasificaciones?.find(c => c.id === tarima.idClasificacion) || null;
  };

  // Handlers para acciones de la tabla
  const handleShowTarimaDetail = (tarima: TarimaClasificacionDTO) => {
    setTarimaParaDetalle(tarima);
    setTarimaDetalleModalOpen(true);
  };

  const handleAddTarima = () => {
    if (estaFinalizada) {
      toast.error('No se pueden agregar tarimas cuando la clasificación está finalizada');
      return;
    }
    setTarimaToEdit(null);
    setTarimaFormOpen(true);
  };

  const handleShowMermas = (tarima: TarimaClasificacionDTO) => {
    setTarimaSeleccionada(tarima);
    const clasificacion = obtenerClasificacionPorTarima(tarima);
    setClasificacionSeleccionada(clasificacion);
    setMermasModalOpen(true);
  };

  const handleShowRetornos = (tarima: TarimaClasificacionDTO) => {
    setTarimaSeleccionada(tarima);
    const clasificacion = obtenerClasificacionPorTarima(tarima);
    setClasificacionSeleccionada(clasificacion);
    setRetornosModalOpen(true);
  };

  const handleCrearMerma = () => {
    if (estaFinalizada) {
      toast.error('No se pueden agregar mermas cuando la clasificación está finalizada');
      return;
    }
    setCrearMermaModalOpen(true);
  };

  const handleCrearRetorno = () => {
    if (estaFinalizada) {
      toast.error('No se pueden agregar retornos cuando la clasificación está finalizada');
      return;
    }
    setCrearRetornoModalOpen(true);
  };

  const handleGestionarTarimasParciales = () => {
    setTarimasParcialesModalOpen(true);
  };

  const handleAjustarPesos = (clasificacionId: number) => {
    if (estaFinalizada) {
      toast.error('No se pueden ajustar pesos cuando la clasificación está finalizada');
      return;
    }
    
    const clasificacion = clasificaciones.find(c => c.id === clasificacionId);
    if (clasificacion) {
      setClasificacionParaAjuste(clasificacionId);
      setTarimasParaAjuste(clasificacion.tarimasClasificaciones || []);
      setAjustePesosModalOpen(true);
    }
  };

  const handleRefreshData = async () => {
    try {
      if (!idOrdenEntrada) return;
      const ordenData = await OrdenesEntradaService.obtenerPedidoCompleto(Number(idOrdenEntrada));
      setOrden(ordenData);
      setClasificaciones(ordenData.clasificaciones);
    } catch (error: any) {
      toast.error(error?.message || 'Error al actualizar los datos');
    }
  };

  // Función para finalizar la clasificación
  const handleFinalizarClasificacion = async () => {
    if (!idOrdenEntrada || !puedeFinalizar || !orden) return;
    
    setFinalizando(true);
    try {
      // Crear el objeto de actualización con el nuevo estado
      const actualizacion = {
        proveedorId: orden.proveedor.id,
        productoId: orden.producto.id,
        fechaEstimada: orden.fechaEstimada,
        fechaRecepcion: orden.fechaRecepcion,
        estado: 'Clasificado' as any,
        observaciones: orden.observaciones
      };

      // Actualizar la orden usando actualizarOrden
      await OrdenesEntradaService.actualizarOrden(orden.codigo, actualizacion);
      
      // Recargar los datos actualizados
      const ordenActualizada = await OrdenesEntradaService.obtenerPedidoCompleto(Number(idOrdenEntrada));
      setOrden(ordenActualizada);
      setClasificaciones(ordenActualizada.clasificaciones);
      toast.success('Clasificación finalizada exitosamente');
    } catch (error: any) {
      toast.error(error?.message || 'Error al finalizar la clasificación');
    } finally {
      setFinalizando(false);
    }
  };

  // Actualización de clasificación (precios)
  const handleUpdateClasificacion = async (clasificacionActualizada: ClasificacionCompletaDTO) => {
    if (estaFinalizada) {
      toast.error('No se pueden editar precios cuando la clasificación está finalizada');
      return;
    }
    
    setSaving(true);
    try {
      await ClasificacionService.update(clasificacionActualizada.id, clasificacionActualizada);
      
      // Actualizar el estado de las clasificaciones de forma inmutable
      setClasificaciones(prev => {
        const nuevasClasificaciones = prev.map(c => 
          c.id === clasificacionActualizada.id 
            ? { ...c, ...clasificacionActualizada }
            : c
        );
        return nuevasClasificaciones;
      });
      
      toast.success('Clasificación actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la clasificación');
    } finally {
      setSaving(false);
    }
  };

  // Hook para validaciones de clasificación
  const { validateClasificacionLimit, getProgressInfo } = useClasificacionValidation();
  
  // Usar el hook para calcular los indicadores de pesos (DEBE ir antes de los returns condicionales)
  const indicadores = useIndicadoresPesos(clasificaciones || []);

  // Hook para verificar si la clasificación está finalizada
  const { estaFinalizada, puedeFinalizar, progreso, mensajeEstado, errores, detallesValidacion, tiposClasificados, tiposNoClasificados } = useClasificacionFinalizada(
    orden ? { ...orden, clasificaciones } : null, 
    indicadores.progreso
  );

  // Unificar todas las tarimas de todas las clasificaciones
  const tarimas: TarimaClasificacionDTO[] = clasificaciones?.flatMap(c => c.tarimasClasificaciones || []) || [];

  // Formateador de peso en kg
  const formatoKg = (valor: number) => `${valor.toFixed(2)} kg`;

  // Handler para exportar a Excel (reutilizado de ReporteClasificacionFinalizada)
  const handleExportExcel = async () => {
    if (!orden || !clasificaciones.length) return;
    const clasificacion = clasificaciones[0];
    const proveedor = orden?.proveedor?.nombre || '/';
    const producto = orden?.producto?.nombre || '/';
    let fechaRaw = orden?.fechaRecepcion || orden?.fechaRegistro;
    let fecha: string = '/';
    if (fechaRaw) {
      const d = new Date(fechaRaw);
      if (!isNaN(d.getTime())) {
        fecha = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
    }
    const noRemision = orden?.codigo || '/';
    const noProd = clasificacion?.id?.toString() || '/';
    const pesoNetoRecibido = (clasificacion?.pesoTotal || 0).toFixed(2);
    const pesosPorTipo = { XL: 0, L: 0, M: 0, S: 0 };
    clasificacion?.tarimasClasificaciones?.forEach(tarima => {
      if (pesosPorTipo[tarima.tipo] !== undefined) {
        pesosPorTipo[tarima.tipo] += tarima.peso || 0;
      }
    });
    const preciosPorTipo = {
      XL: clasificacion?.xl || 0,
      L: clasificacion?.l || 0,
      M: clasificacion?.m || 0,
      S: clasificacion?.s || 0,
    };
    const totalesPorTipo = {
      XL: pesosPorTipo.XL * preciosPorTipo.XL,
      L: pesosPorTipo.L * preciosPorTipo.L,
      M: pesosPorTipo.M * preciosPorTipo.M,
      S: pesosPorTipo.S * preciosPorTipo.S,
    };
    const sumaTotal = Object.values(totalesPorTipo).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);
    const mermas = clasificacion?.mermas && clasificacion.mermas.length > 0
      ? clasificacion.mermas.map(m => [m.tipo || '/', (m.peso || 0).toFixed(2), m.observaciones || '/'])
      : [['/', '0.00', '/']];
    const totalMermas = (clasificacion?.mermas?.reduce((acc, m) => acc + (m.peso || 0), 0) || 0).toFixed(2);
    const retornos = clasificacion?.retornosDetalle && clasificacion.retornosDetalle.length > 0
      ? clasificacion.retornosDetalle.map(r => [r.numero || '/', (r.peso || 0).toFixed(2), r.observaciones || '/'])
      : [['/', '0.00', '/']];
    const totalRetornos = (clasificacion?.retornosDetalle?.reduce((acc, r) => acc + (r.peso || 0), 0) || 0).toFixed(2);
    const preciosEmbarque = ['/', '/', '/', '/'];
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Reporte Clasificación');
    const borderStyle: Partial<ExcelJS.Border> = { style: 'thin' };
    const headerStyle: Partial<ExcelJS.Style> = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
    };
    const subHeaderStyle: Partial<ExcelJS.Style> = {
      font: { bold: true },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
    };
    const cellStyle: Partial<ExcelJS.Style> = {
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle }
    };
    const boldCell: Partial<ExcelJS.Style> = { font: { bold: true }, alignment: { vertical: 'middle', horizontal: 'center' } };
    
    // Función auxiliar para convertir números a texto con formato
    const formatNumberAsText = (num: number): string => {
      return num.toFixed(2);
    };
    
    const formatCurrencyAsText = (num: number): string => {
      return `$${num.toFixed(2)}`;
    };
    
    sheet.addRow(['Proveedor', proveedor]);
    sheet.addRow(['Producto', producto]);
    sheet.addRow(['Fecha de Recepción', fecha]);
    sheet.addRow(['No. de Remisión', noRemision]);
    sheet.addRow(['No. de Productor', noProd]);
    sheet.addRow([]);
    const headerRow1 = [
      'FECHA DE RECEPCIÓN', 'NO DE REMISIÓN', 'PRODUCTOR', 'PESO NETO RECIBIDO', 'MERMA',
      'XL (Kg)', 'L (Kg)', 'M (Kg)', 'S (Kg)',
      '$ XL', '$ L', '$ M', '$ S',
      '$ SUMA',
      'Precio de Embarque', '', '', ''
    ];
    const headerRow2 = [
      '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      'XL', 'L', 'M', 'S'
    ];
    const rowHeader1 = sheet.addRow(headerRow1);
    rowHeader1.eachCell((cell, colNumber) => {
      cell.style = headerStyle;
      if (colNumber === 14) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC288' } };
        cell.font = { bold: true, italic: true, color: { argb: 'FF2563EB' } };
      }
    });
    sheet.getRow(sheet.lastRow.number).height = 28;
    const rowHeader2 = sheet.addRow(headerRow2);
    rowHeader2.eachCell((cell, colNumber) => {
      if (colNumber >= 15 && colNumber <= 18) {
        cell.style = headerStyle;
      } else {
        cell.style = { ...headerStyle, fill: undefined, font: { bold: true, color: { argb: 'FFFFFFFF' } }, alignment: { vertical: 'middle', horizontal: 'center' }, border: { top: borderStyle, left: borderStyle, bottom: borderStyle, right: borderStyle } };
      }
    });
    sheet.getRow(sheet.lastRow.number).height = 22;
    sheet.mergeCells(7, 15, 7, 18);
    sheet.getCell('O7').alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Convertir todos los valores numéricos a texto
    const dataRow = [
      fecha,
      noRemision,
      proveedor,
      pesoNetoRecibido,
      totalMermas,
      formatNumberAsText(pesosPorTipo.XL),
      formatNumberAsText(pesosPorTipo.L),
      formatNumberAsText(pesosPorTipo.M),
      formatNumberAsText(pesosPorTipo.S),
      formatCurrencyAsText(totalesPorTipo.XL),
      formatCurrencyAsText(totalesPorTipo.L),
      formatCurrencyAsText(totalesPorTipo.M),
      formatCurrencyAsText(totalesPorTipo.S),
      formatCurrencyAsText(sumaTotal),
      formatCurrencyAsText(preciosPorTipo.XL),
      formatCurrencyAsText(preciosPorTipo.L),
      formatCurrencyAsText(preciosPorTipo.M),
      formatCurrencyAsText(preciosPorTipo.S)
    ];
    const rowData = sheet.addRow(dataRow);
    rowData.eachCell((cell) => {
      cell.style = cellStyle;
    });
    sheet.getRow(sheet.lastRow.number).height = 22;
    sheet.addRow([]);
    const mermaHeader = sheet.addRow(['MERMA', 'TIPO', 'PESO (kg)', 'OBSERVACIONES']);
    mermaHeader.eachCell(cell => cell.style = subHeaderStyle);
    mermas.forEach(m => {
      const row = sheet.addRow(['', ...m]);
      row.eachCell(cell => cell.style = cellStyle);
    });
    const totalMermaRow = sheet.addRow(['', '', 'TOTAL MERMA', totalMermas]);
    totalMermaRow.eachCell(cell => cell.style = boldCell);
    sheet.addRow([]);
    const retornoHeader = sheet.addRow(['RETORNOS', 'NÚMERO', 'PESO (kg)', 'OBSERVACIONES']);
    retornoHeader.eachCell(cell => cell.style = subHeaderStyle);
    retornos.forEach(r => {
      const row = sheet.addRow(['', ...r]);
      row.eachCell(cell => cell.style = cellStyle);
    });
    const totalRetornoRow = sheet.addRow(['', '', 'TOTAL RETORNOS', totalRetornos]);
    totalRetornoRow.eachCell(cell => cell.style = boldCell);
    sheet.columns.forEach(col => {
      let max = 10;
      col.eachCell({ includeEmpty: true }, cell => {
        max = Math.max(max, (cell.value ? cell.value.toString().length : 0) + 2);
      });
      col.width = max;
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `ReporteClasificacion_Lote${noRemision}_Clasificacion${noProd}.xlsx`;
    saveAs(new Blob([buffer]), fileName);
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!orden) return <div className="p-8 text-center">No se encontró la información del pedido.</div>;
  if (!clasificaciones || clasificaciones.length === 0) {
    return <div className="p-8 text-center">No hay clasificaciones disponibles para esta orden.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Toaster richColors position="top-right" />
      {/* Header con información del pedido */}
      <ClasificacionHeader 
        orden={{
          codigo: orden.codigo,
          estatus: orden.estado,
          proveedor: { razonSocial: orden.proveedor?.nombre }
        }}
        clasificaciones={clasificaciones}
      />

      {/* Mensaje de clasificación finalizada */}
      {estaFinalizada && (
        <div className="mb-6">
          <MensajeClasificacionFinalizada>
            <Button onClick={handleExportExcel} className="bg-green-600 text-white hover:bg-green-700" aria-label="Descargar Excel">
              Descargar Excel
            </Button>
          </MensajeClasificacionFinalizada>
        </div>
      )}

      {/* Errores de validación para finalización */}
      {!estaFinalizada && errores.length > 0 && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800 flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" />
              Validaciones Pendientes para Finalizar
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {errores.map((error, index) => (
                <div key={index} className="flex items-center gap-2 text-red-700">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span className="text-sm">{error}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-white rounded border border-red-200">
              <h4 className="font-medium text-red-800 mb-1 text-sm">Detalles de Validación:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${detallesValidacion.tiposClasificados ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={detallesValidacion.tiposClasificados ? 'text-green-700' : 'text-red-700'}>
                    Al menos un tipo clasificado
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${detallesValidacion.preciosEstablecidos ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={detallesValidacion.preciosEstablecidos ? 'text-green-700' : 'text-red-700'}>
                    Precios de tipos clasificados
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${detallesValidacion.progresoCompleto ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={detallesValidacion.progresoCompleto ? 'text-green-700' : 'text-red-700'}>
                    Progreso 100%
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-red-200">
                <div className="text-xs text-gray-600 mb-1">
                  <strong>Nota:</strong> Solo se requieren precios para los tipos que han sido clasificados (tienen tarimas). No es obligatorio clasificar todos los tipos.
                </div>
                {tiposClasificados.length > 0 && (
                  <div className="text-xs">
                    <span className="text-green-700 font-medium">Tipos clasificados:</span>
                    <span className="text-green-600 ml-1">{tiposClasificados.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sección de Clasificaciones */}
      <div className="space-y-6 mb-8">
        <div className="space-y-6">
                  {clasificaciones.map((clasificacion) => (
          <ClasificacionDetalle
            key={clasificacion.id}
            clasificacion={clasificacion}
            onUpdateClasificacion={handleUpdateClasificacion}
            onAjustarPesos={handleAjustarPesos}
            estaFinalizada={estaFinalizada}
          />
        ))}
        </div>
      </div>

      {/* Sección de Indicadores de Pesos (Gráfica de Barras) */}


      {/* Sección de Gestión */}
      <div className="space-y-6 mb-8">
        {/* Gestión de Tarimas */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Gestión de Tarimas</CardTitle>
              <div className="flex flex-wrap gap-4">
                {estaFinalizada ? (
                  <div className="text-sm text-gray-500 italic">
                    Clasificación finalizada - No se pueden agregar más elementos
                  </div>
                ) : progreso >= 100 && puedeFinalizar ? (
                  <FinalizarClasificacionButton
                    onFinalizar={handleFinalizarClasificacion}
                    isSubmitting={finalizando}
                  />
                ) : (
                  <>
                    <Button
                      onClick={handleAddTarima}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-green-500 text-green-700 hover:bg-green-50 hover:border-green-600 font-medium text-sm transition-colors duration-200"
                    >
                      <Package className="h-4 w-4" />
                      Agregar Tarima
                    </Button>
                    <Button
                      onClick={handleGestionarTarimasParciales}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium text-sm transition-colors duration-200"
                    >
                      <Package className="h-4 w-4" />
                      Tarimas Parciales
                    </Button>
                    <Button
                      onClick={handleCrearMerma}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium text-sm transition-colors duration-200"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Agregar Merma
                    </Button>
                    <Button
                      onClick={handleCrearRetorno}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium text-sm transition-colors duration-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Agregar Retorno
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mensajes de validación */}
            {!estaFinalizada && progreso >= 100 && puedeFinalizar && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-700 font-medium flex items-center gap-2">
                  <span>✓</span>
                  <span>Clasificación completa - Puede finalizar el proceso</span>
                </div>
              </div>
            )}
            
            <TarimasTable
              tarimas={tarimas}
              onShowDetail={handleShowTarimaDetail}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modales */}
      <TarimaForm
        open={tarimaFormOpen && !estaFinalizada}
        onClose={() => setTarimaFormOpen(false)}
        tarima={tarimaToEdit || undefined}
        clasificacionId={clasificaciones[0]?.id || 0}
        onSuccess={handleRefreshData}
        clasificaciones={clasificaciones}
        onValidate={(peso) => validateClasificacionLimit({
          cantidadAAgregar: peso,
          tipoOperacion: 'tarima',
          clasificacionId: clasificaciones[0]?.id || 0,
          clasificaciones
        })}
      />
      <MermasModal
        open={mermasModalOpen}
        onClose={() => setMermasModalOpen(false)}
        mermas={clasificacionSeleccionada?.mermas || []}
        onAddMerma={() => {}}
      />
      <TarimaDetalleModal
        open={tarimaDetalleModalOpen}
        onClose={() => setTarimaDetalleModalOpen(false)}
        tarima={tarimaParaDetalle}
      />
      <RetornosModal
        open={retornosModalOpen}
        onClose={() => setRetornosModalOpen(false)}
        retornos={clasificacionSeleccionada?.retornosDetalle || []}
        onAddRetorno={() => {}}
      />
      <CrearMermaModal
        open={crearMermaModalOpen && !estaFinalizada}
        onClose={() => setCrearMermaModalOpen(false)}
        clasificacionId={clasificaciones[0]?.id || 0}
        onSuccess={handleRefreshData}
        clasificaciones={clasificaciones}
        onValidate={(peso) => validateClasificacionLimit({
          cantidadAAgregar: peso,
          tipoOperacion: 'merma',
          clasificacionId: clasificaciones[0]?.id || 0,
          clasificaciones
        })}
      />
      <CrearRetornoModal
        open={crearRetornoModalOpen && !estaFinalizada}
        onClose={() => setCrearRetornoModalOpen(false)}
        clasificacionId={clasificaciones[0]?.id || 0}
        onSuccess={handleRefreshData}
        clasificaciones={clasificaciones}
        onValidate={(peso) => validateClasificacionLimit({
          cantidadAAgregar: peso,
          tipoOperacion: 'retorno',
          clasificacionId: clasificaciones[0]?.id || 0,
          clasificaciones
        })}
      />
      <TarimasParcialesModal
        open={tarimasParcialesModalOpen}
        onClose={() => setTarimasParcialesModalOpen(false)}
        clasificacionId={clasificaciones[0]?.id || 0}
        clasificaciones={clasificaciones}
        onValidate={(cantidad) => validateClasificacionLimit({
          cantidadAAgregar: cantidad,
          tipoOperacion: 'tarima',
          clasificacionId: clasificaciones[0]?.id || 0,
          clasificaciones
        })}
        onSuccess={handleRefreshData}
      />
      <AjustarPesosModal
        open={ajustePesosModalOpen}
        onClose={() => setAjustePesosModalOpen(false)}
        clasificacionId={clasificacionParaAjuste || 0}
        tarimas={tarimasParaAjuste}
        clasificaciones={clasificaciones}
        onSuccess={handleRefreshData}
      />
    </div>
  );
} 