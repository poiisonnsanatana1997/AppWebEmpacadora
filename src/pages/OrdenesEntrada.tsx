import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OrdenEntradaModal } from '@/components/OrdenesEntrada/OrdenEntradaModal';
import { OrdenesEntradaTable } from '@/components/OrdenesEntrada/OrdenesEntradaTable';
import { ImportarOrdenesModal } from '@/components/OrdenesEntrada/ImportarOrdenesModal';
import { useOrdenesEntrada } from '@/hooks/useOrdenesEntrada';
import { ClipboardList, CloudUpload, Plus, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { ESTADO_ORDEN, OrdenEntradaDto, OrdenEntradaFormData, CrearOrdenEntradaDto } from '@/types/ordenesEntrada';
import { OrdenesEntradaService } from '@/services/ordenesEntrada.service';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background:rgba(255, 255, 255, 0);
`;

const ProductsTableContainer = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #E2E8F0;
  overflow: hidden;
`;

const TableHeaderSection = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #E2E8F0;
  background: #F8FAFC;
`;

const TableContentSection = styled.div`
  padding: 1.5rem;
  overflow-x: auto;
  background: #fff;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 1.08rem;
  border-radius: 1rem;
  overflow: hidden;

  th, td {
    padding: 1.1rem 1rem;
  }

  th {
    background: #f1f5f9;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  tr:hover td {
    background: #f8fafc;
    transition: background 0.2s;
  }
`;

const IndicatorsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const IndicatorCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IndicatorIcon = styled.div`
  background: #EFF6FF;
  padding: 0.75rem;
  border-radius: 0.5rem;
  color: #3B82F6;
`;

const IndicatorContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const IndicatorValue = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1E293B;
`;

const IndicatorLabel = styled.span`
  font-size: 0.875rem;
  color: #64748B;
`;

export default function OrdenesEntrada() {
  const {
    ordenes,
    error,
    pesoTotalRecibidoHoy,
    ordenesPendientesHoy,
    cargarOrdenes,
    crearOrden,
    actualizarOrden,
    eliminarOrden,
    importarOrdenes,
  } = useOrdenesEntrada();

  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<{ codigo?: string; data: OrdenEntradaFormData } | undefined>();

  useEffect(() => {
    cargarOrdenes();
  }, [cargarOrdenes]);

  const handleOpenModal = (codigo?: string) => {
    if (codigo) {
      const orden = ordenes.find(o => o.codigo === codigo);
      if (orden) {
        if (orden.estado !== ESTADO_ORDEN.PENDIENTE) {
          toast.error('Solo se pueden editar órdenes en estado Pendiente');
          return;
        }
        setOrdenSeleccionada({
          codigo: orden.codigo,
          data: convertirOrdenAFormData(orden)
        });
      }
    } else {
      setOrdenSeleccionada(undefined);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setOrdenSeleccionada(undefined);
  };

  const handleSubmit = async (orden: OrdenEntradaFormData) => {
    try {
      const ordenParaAPI: CrearOrdenEntradaDto = {
        proveedorId: Number(orden.proveedor.id),
        productoId: Number(orden.producto.id),
        fechaEstimada: orden.fechaEstimada,
        estado: orden.estado,
        observaciones: orden.observaciones
      };

      if (ordenSeleccionada?.codigo) {
        await actualizarOrden(ordenSeleccionada.codigo, ordenParaAPI);
        toast.success('Orden actualizada correctamente');
      } else {
        await crearOrden(ordenParaAPI);
        toast.success('Orden creada correctamente');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Error al guardar la orden');
    }
  };

  const handleEliminar = async (codigo: string) => {
    try {
      const orden = ordenes.find(o => o.codigo === codigo);
      if (!orden) return;

      if (orden.estado !== ESTADO_ORDEN.PENDIENTE) {
        toast.error('Solo se pueden cancelar órdenes en estado Pendiente');
        return;
      }

      const ordenParaAPI: CrearOrdenEntradaDto = {
        proveedorId: orden.proveedor.id,
        productoId: orden.producto.id,
        fechaEstimada: orden.fechaEstimada,
        estado: ESTADO_ORDEN.CANCELADA,
        observaciones: orden.observaciones
      };

      await actualizarOrden(codigo, ordenParaAPI);
      toast.success('Orden cancelada exitosamente');
    } catch (error) {
      console.error('Error al cancelar la orden:', error);
      toast.error('Error al cancelar la orden');
    }
  };

  const handleReactivate = async (codigo: string) => {
    try {
      const orden = ordenes.find(o => o.codigo === codigo);
      if (!orden) return;

      if (orden.estado !== ESTADO_ORDEN.CANCELADA) {
        toast.error('Solo se pueden reactivar órdenes en estado Cancelada');
        return;
      }

      const ordenParaAPI: CrearOrdenEntradaDto = {
        proveedorId: orden.proveedor.id,
        productoId: orden.producto.id,
        fechaEstimada: orden.fechaEstimada,
        estado: ESTADO_ORDEN.PENDIENTE,
        observaciones: orden.observaciones
      };

      await actualizarOrden(codigo, ordenParaAPI);
      toast.success('Orden reactivada exitosamente');
    } catch (error) {
      console.error('Error al reactivar la orden:', error);
      toast.error('Error al reactivar la orden');
    }
  };

  const handleImportar = async (file: File) => {
    try {
      await importarOrdenes(file);
      toast.success('Órdenes importadas correctamente');
      setImportModalOpen(false);
    } catch (error) {
      toast.error('Error al importar las órdenes');
    }
  };

  const convertirOrdenAFormData = (orden: OrdenEntradaDto): OrdenEntradaFormData => {
    return {
      proveedor: orden.proveedor,
      producto: orden.producto,
      fechaEstimada: orden.fechaEstimada,
      fechaRegistro: orden.fechaRegistro,
      fechaRecepcion: orden.fechaRecepcion,
      estado: orden.estado,
      observaciones: orden.observaciones,
    };
  };

  const getOrdenesRecibidasHoy = async (): Promise<string> => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const ordenesRecibidasHoy = ordenes.filter(orden => {
      const fechaOrden = new Date(orden.fechaEstimada);
      fechaOrden.setHours(0, 0, 0, 0);
        return fechaOrden.getTime() === hoy.getTime() && orden.estado === ESTADO_ORDEN.RECIBIDA;
    });

    let pesoTotalNeto = 0;
    
    for (const orden of ordenesRecibidasHoy) {
      try {
        const detalleOrden = await OrdenesEntradaService.obtenerDetalleOrden(orden.codigo);
        if (detalleOrden) {
          const pesoNetoOrden = detalleOrden.tarimas.reduce((total: number, tarima: { pesoNeto: number }) => total + tarima.pesoNeto, 0);
          pesoTotalNeto += pesoNetoOrden;
        }
      } catch (error) {
        console.error(`Error al obtener detalle de orden ${orden.codigo}:`, error);
      }
    }

    return pesoTotalNeto.toFixed(2);
  };

  return (
    <PageContainer>
      <Toaster richColors position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <IndicatorsContainer>
          <IndicatorCard>
            <IndicatorIcon>
              <Calendar className="w-6 h-6" />
            </IndicatorIcon>
            <IndicatorContent>
              <IndicatorValue>{ordenesPendientesHoy}</IndicatorValue>
              <IndicatorLabel>Órdenes pendientes para hoy</IndicatorLabel>
            </IndicatorContent>
          </IndicatorCard>

          <IndicatorCard>
            <IndicatorIcon>
              <CheckCircle className="w-6 h-6" />
            </IndicatorIcon>
            <IndicatorContent>
              <IndicatorValue>{pesoTotalRecibidoHoy} kg</IndicatorValue>
              <IndicatorLabel>Peso total recibido hoy</IndicatorLabel>
            </IndicatorContent>
          </IndicatorCard>
        </IndicatorsContainer>

        <ProductsTableContainer>
          <TableHeaderSection>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <h2 className="text-xl font-semibold text-gray-900" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClipboardList className="w-6 h-6 text-blue-700" />
                Lista de Órdenes de Entrada
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="outline" onClick={() => setImportModalOpen(true)}>
                  <CloudUpload className="w-4 h-4 mr-2" />
                  Importar
                </Button>
                <Button onClick={() => handleOpenModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Orden
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-2">
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
          </TableHeaderSection>

          <TableContentSection>
            <StyledTable>
              <OrdenesEntradaTable
                ordenes={ordenes}
                onEdit={handleOpenModal}
                onDelete={handleEliminar}
                onReactivate={handleReactivate}
              />
            </StyledTable>
          </TableContentSection>
        </ProductsTableContainer>
      </motion.div>

      <OrdenEntradaModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSubmit}
        orden={ordenSeleccionada ? {
          codigo: ordenSeleccionada.codigo!,
          ...ordenSeleccionada.data
        } : null}
      />

      <ImportarOrdenesModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportar}
      />
    </PageContainer>
  );
} 