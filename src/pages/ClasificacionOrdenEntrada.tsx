import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { ClasificacionHeader } from '../components/Clasificacion/ClasificacionHeader';
import { ClasificacionDetalle } from '../components/Clasificacion/ClasificacionDetalle';
import { TarimasTable } from '../components/Clasificacion/TarimasTable';
import { TarimaForm } from '../components/Clasificacion/TarimaForm';
import { TarimaDetalleModal } from '../components/Clasificacion/TarimaDetalleModal';
import { CrearMermaModal } from '../components/Clasificacion/CrearMermaModal';
import { CrearRetornoModal } from '../components/Clasificacion/CrearRetornoModal';
import { CajasForm } from '../components/Clasificacion/CajasForm';
import { PedidoCompletoDTO, TarimaClasificacionDTO, ClasificacionCompletaDTO } from '../types/OrdenesEntrada/ordenesEntradaCompleto.types';
import { OrdenesEntradaService } from '../services/ordenesEntrada.service';
import { ClasificacionService } from '../services/clasificacion.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Package, RotateCcw, AlertTriangle, Download, ChevronDown } from 'lucide-react';
import { useClasificacionValidation } from '../hooks/Clasificacion/useClasificacionValidation';
import { useClasificacionFinalizada } from '../hooks/Clasificacion/useClasificacionFinalizada';
import { FinalizarClasificacionButton } from '../components/Clasificacion/FinalizarClasificacionButton';
import { MensajeClasificacionFinalizada } from '../components/Clasificacion/MensajeClasificacionFinalizada';
import { TarimasParcialesModal } from '../components/Clasificacion/TarimasParcialesModal';
import { AjustarPesosModal } from '../components/Clasificacion/AjustarPesosModal';
import { useIndicadoresPesos } from '../hooks/Clasificacion/useIndicadoresPesos';
import { ExcelExportService } from '../services/excelExport.service';
import { PDFExportService } from '../services/pdfExport.service';

export default function ClasificacionOrdenEntrada() {
  const { idOrdenEntrada } = useParams();
  const [orden, setOrden] = useState<PedidoCompletoDTO | null>(null);
  const [clasificaciones, setClasificaciones] = useState<ClasificacionCompletaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalizando, setFinalizando] = useState(false);

  // Estado para modales y selección
  const [tarimaFormOpen, setTarimaFormOpen] = useState(false);
  const [tarimaToEdit, setTarimaToEdit] = useState<TarimaClasificacionDTO | null>(null);
  const [tarimaDetalleModalOpen, setTarimaDetalleModalOpen] = useState(false);
  const [tarimaParaDetalle, setTarimaParaDetalle] = useState<TarimaClasificacionDTO | null>(null);
  const [crearMermaModalOpen, setCrearMermaModalOpen] = useState(false);
  const [crearRetornoModalOpen, setCrearRetornoModalOpen] = useState(false);
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

  // Handlers para eliminación de mermas y retornos
  const handleDeleteMerma = async (mermaId: number) => {
    try {
      // Actualizar el estado local removiendo la merma eliminada
      setClasificaciones(prev => {
        return prev.map(clasificacion => ({
          ...clasificacion,
          mermas: clasificacion.mermas?.filter(m => m.id !== mermaId) || []
        }));
      });
      
      // Recargar datos para asegurar consistencia
      await handleRefreshData();
    } catch (error: any) {
      toast.error(error?.message || 'Error al actualizar los datos después de eliminar la merma');
    }
  };

  const handleDeleteRetorno = async (retornoId: number) => {
    try {
      // Actualizar el estado local removiendo el retorno eliminado
      setClasificaciones(prev => {
        return prev.map(clasificacion => ({
          ...clasificacion,
          retornosDetalle: clasificacion.retornosDetalle?.filter(r => r.id !== retornoId) || []
        }));
      });
      
      // Recargar datos para asegurar consistencia
      await handleRefreshData();
    } catch (error: any) {
      toast.error(error?.message || 'Error al actualizar los datos después de eliminar el retorno');
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
    }
  };

  // Hook para validaciones de clasificación
  const { validateClasificacionLimit } = useClasificacionValidation();
  
  // Usar el hook para calcular los indicadores de pesos (DEBE ir antes de los returns condicionales)
  const indicadores = useIndicadoresPesos(clasificaciones || []);

  // Hook para verificar si la clasificación está finalizada
  const { estaFinalizada, puedeFinalizar, progreso, mensajeEstado, errores, detallesValidacion, tiposClasificados, tiposNoClasificados } = useClasificacionFinalizada(
    orden ? { ...orden, clasificaciones } : null, 
    indicadores.progreso
  );

  // Unificar todas las tarimas de todas las clasificaciones
  const tarimas: TarimaClasificacionDTO[] = clasificaciones?.flatMap(c => c.tarimasClasificaciones || []) || [];

  // Verificar si la orden está en estado "Clasificando"
  const ordenEnClasificacion = orden?.estado === 'Clasificando';


  // Formateador de peso en kg
  const formatoKg = (valor: number) => `${valor.toFixed(2)} kg`;

    // Handler para exportar a PDF
  const handleExportPDF = async () => {
    try {
      await PDFExportService.exportClasificacion(orden!, clasificaciones);
      toast.success('PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  // Handler para exportar a Excel
  const handleExportExcel = async () => {
    try {
      await ExcelExportService.exportClasificacion(orden!, clasificaciones);
      toast.success('Excel generado exitosamente');
    } catch (error) {
      console.error('Error al generar Excel:', error);
      toast.error('Error al generar el Excel');
    }
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
          proveedor: { razonSocial: orden.proveedor?.nombre },
          producto: {
            nombre: orden.producto?.nombre,
            codigo: orden.producto?.codigo,
            variedad: orden.producto?.variedad
          }
        }}
        clasificaciones={clasificaciones}
      />

      {/* Errores de validación para finalización - Compacto y responsivo */}
      {!estaFinalizada && errores.length > 0 && (
        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-red-800">Validaciones pendientes:</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {errores.map((error, index) => (
              <Badge key={index} variant="destructive" className="text-xs break-words">
                {error}
              </Badge>
            ))}
          </div>
          {tiposClasificados.length > 0 && (
            <div className="mt-2 text-xs sm:text-sm text-gray-600">
              <span className="font-medium">Tipos clasificados:</span>{' '}
              <span className="break-words">{tiposClasificados.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Mensaje de clasificación finalizada */}
      {estaFinalizada && (
        <div className="mb-6">
                      <MensajeClasificacionFinalizada>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-white border border-green-600 text-green-600 hover:bg-green-50 px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Descargar Reporte
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleExportExcel()}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">X</div>
                      <span>Descargar Excel</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportPDF()}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-600 rounded-sm flex items-center justify-center text-white text-xs font-bold">P</div>
                      <span>Descargar PDF</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </MensajeClasificacionFinalizada>
        </div>
      )}

      {/* Formulario de Registro de Cajas */}
      <CajasForm
        clasificacionId={clasificaciones[0]?.id || 0}
        onSuccess={handleRefreshData}
        disabled={estaFinalizada}
      />

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
            onDeleteMerma={handleDeleteMerma}
            onDeleteRetorno={handleDeleteRetorno}
            ordenEnClasificacion={ordenEnClasificacion}
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
                {/* Botones de gestión según el estado */}
                {estaFinalizada ? (
                  <div className="text-sm text-gray-500 italic">
                    Clasificación finalizada - No se pueden agregar más elementos
                  </div>
                ) : progreso >= 99.9 && puedeFinalizar ? (
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
            {!estaFinalizada && progreso >= 99.9 && puedeFinalizar && (
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
              clasificacionFinalizada={estaFinalizada}
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
        idProducto={orden?.producto.id}
        onSuccess={handleRefreshData}
        clasificaciones={clasificaciones}
        onValidate={(peso) => validateClasificacionLimit({
          cantidadAAgregar: peso,
          tipoOperacion: 'tarima',
          clasificacionId: clasificaciones[0]?.id || 0,
          clasificaciones
        })}
      />
      <TarimaDetalleModal
        open={tarimaDetalleModalOpen}
        onClose={() => setTarimaDetalleModalOpen(false)}
        tarima={tarimaParaDetalle}
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