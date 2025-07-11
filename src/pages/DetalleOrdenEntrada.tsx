import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { OrdenesEntradaService } from '../services/ordenesEntrada.service';
import { TarimasTableEditable } from '../components/OrdenesEntrada/TarimasTableEditable';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import styled from 'styled-components';
import { Package, Calendar, User, ClipboardList, StickyNote, Boxes, FileDown, Hash } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ESTADO_ORDEN, OrdenEntradaDto, PesajeTarimaDto } from '../types/OrdenesEntrada/ordenesEntrada.types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

const PageContainer = styled.div`
  width: 100%;
  padding: 0;
  margin: 0;
  min-height: 100vh;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 0.5rem;
  width: 100%;
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    margin-bottom: 1.5rem;
  }
`;

const BackButton = styled(Button)`
  width: 100%;
  
  @media (min-width: 640px) {
    width: auto;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
  
  @media (min-width: 640px) {
    width: auto;
    justify-content: flex-end;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  font-size: 0.9rem;
  width: 100%;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #ffffff;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  width: 100%;
  
  b {
    color: #374151;
    font-weight: 500;
    min-width: 80px;
    
    @media (min-width: 640px) {
      min-width: 100px;
    }
  }

  svg {
    color: #6B7280;
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
  }
`;

const InfoItemFull = styled(InfoItem)`
  grid-column: 1 / -1;
  background-color: #F9FAFB;
`;

const InfoGroup = styled.div`
  display: contents;
`;

const InfoGroupHeader = styled(InfoItemFull)`
  background-color: #F3F4F6;
  font-weight: 600;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-left: 3px solid #3B82F6;
  
  svg {
    color: #3B82F6;
  }
`;

const CardContainer = styled(Card)`
  margin-bottom: 1rem;
  width: 100%;
  
  @media (min-width: 640px) {
    margin-bottom: 1.5rem;
  }
`;

const CardHeaderStyled = styled(CardHeader)`
  padding: 1rem;
  
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

const CardContentStyled = styled(CardContent)`
  padding: 1rem;
  padding-top: 0;
  
  @media (min-width: 640px) {
    padding: 1.5rem;
    padding-top: 0;
  }
`;

const formatearFecha = (fecha: string | null | undefined) => {
  if (!fecha) return null;
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(fecha));
};

export default function DetalleOrdenEntrada() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const [orden, setOrden] = useState<OrdenEntradaDto | null>(null);
  const [tarimas, setTarimas] = useState<PesajeTarimaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (codigo) {
      console.log('Obteniendo detalle de la orden:', codigo); 
      OrdenesEntradaService.obtenerDetalleOrden(codigo)
        .then((orden) => {
          console.log('Respuesta de obtenerDetalleOrden:', orden);
          setOrden(orden?.ordenEntrada || null);
          setTarimas(orden?.tarimas || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener detalle:', error);
          setLoading(false);
        });
    }
  }, [codigo]);

  const handleFinalizarPesaje = async () => {
    if (!codigo || !orden) return;
    
    // Validar que exista al menos una tarima pesada
    const tarimasPesadas = tarimas.filter(tarima => tarima.pesoBruto > 0);
    if (tarimasPesadas.length === 0) {
      toast.error('Debe haber al menos una tarima pesada para finalizar');
      return;
    }
    
    setShowConfirmDialog(true);
  };

  const confirmarFinalizarPesaje = async () => {
    if (!codigo || !orden) return;
    
    try {
      setGuardando(true);
      
      // Actualizar la orden con las tarimas y cambiar estado a "Recibida"
      const ordenActualizada = await OrdenesEntradaService.actualizarOrden(codigo, {
        proveedorId: orden.proveedor.id,
        productoId: orden.producto.id,
        fechaEstimada: orden.fechaEstimada,
        fechaRecepcion: new Date().toISOString(),
        estado: ESTADO_ORDEN.RECIBIDA,
        observaciones: orden.observaciones
      });

      if (ordenActualizada) {
        setOrden(ordenActualizada);
        toast.success('Pesaje finalizado correctamente');
      }
    } catch (error) {
      toast.error('Error al finalizar el pesaje');
      console.error(error);
    } finally {
      setGuardando(false);
      setShowConfirmDialog(false);
    }
  };

  const handleGenerarPDF = async () => {
    if (!codigo) return;
    
    try {
      const pdfBlob = await OrdenesEntradaService.imprimirOrden(codigo);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orden-entrada-${codigo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Error al generar el PDF');
      console.error(error);
    }
  };

  const handlePrimerPesaje = async () => {
    if (!codigo || !orden) return;
    
    try {
      setGuardando(true);
      
      // Actualizar la orden con el nuevo estado
      const ordenActualizada = await OrdenesEntradaService.actualizarOrden(codigo, {
        proveedorId: orden.proveedor.id,
        productoId: orden.producto.id,
        fechaEstimada: orden.fechaEstimada,
        fechaRecepcion: null,
        estado: ESTADO_ORDEN.PROCESANDO,
        observaciones: orden.observaciones
      });

      if (ordenActualizada) {
        setOrden(ordenActualizada);
        toast.success('Estado actualizado a Pesando');
      }
    } catch (error) {
      toast.error('Error al actualizar el estado');
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <div className="text-center py-10">Cargando...</div>;
  if (!orden) return <div className="text-center py-10 text-red-500">No se encontró la orden.</div>;

  return (
    <PageContainer>
      <Toaster richColors position="top-right" />
      
      {/* Encabezado compacto */}
      <HeaderContainer>
        <BackButton onClick={() => navigate(-1)} variant="outline" size="sm">
          ← Regresar
        </BackButton>
        <TitleContainer>
          <ClipboardList className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Orden #{orden.codigo}</span>
          <Badge className={`ml-2 text-sm px-2 py-1.5 ${
            orden.estado === ESTADO_ORDEN.PENDIENTE ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300 font-semibold' :
            orden.estado === ESTADO_ORDEN.PROCESANDO ? 'bg-blue-200 text-blue-800 hover:bg-blue-300 font-semibold' :
            orden.estado === ESTADO_ORDEN.RECIBIDA ? 'bg-green-200 text-green-800 hover:bg-green-300 font-semibold' :
            orden.estado === ESTADO_ORDEN.CLASIFICANDO ? 'bg-purple-200 text-purple-800 hover:bg-purple-300 font-semibold' :
            orden.estado === ESTADO_ORDEN.CLASIFICADO ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300 font-semibold' :
            orden.estado === ESTADO_ORDEN.CANCELADA ? 'bg-red-200 text-red-800 hover:bg-red-300 font-semibold' :
            'bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold'
          }`} variant="secondary">{orden.estado}</Badge>
        </TitleContainer>
      </HeaderContainer>

      {/* Tarimas primero */}
      <CardContainer>
        <CardHeaderStyled>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Boxes className="h-5 w-5 text-muted-foreground" /> 
            <span className="text-base sm:text-lg">Tarimas (Pesaje por Tarima)</span>
          </CardTitle>
        </CardHeaderStyled>
        <CardContentStyled>
          <div className="mb-4 text-sm text-muted-foreground">
            <p className="hidden sm:block">
              Aquí puedes ver y editar el pesaje de cada tarima asociada a esta orden. 
              Utiliza los campos para modificar los valores y el botón <span className="font-bold">➕</span> para agregar nuevas tarimas.
            </p>
            <p className="sm:hidden">
              Edita el pesaje de cada tarima. Usa <span className="font-bold">➕</span> para agregar nuevas.
            </p>
          </div>
          <TarimasTableEditable 
            tarimas={tarimas} 
            setTarimas={setTarimas} 
            estado={orden.estado}
            codigoOrden={orden.codigo}
            onPrimerPesaje={handlePrimerPesaje}
          />
          <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
            {(orden.estado === ESTADO_ORDEN.PENDIENTE || orden.estado === ESTADO_ORDEN.PROCESANDO) && (
              <Button 
                onClick={handleFinalizarPesaje} 
                disabled={guardando}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
              >
                {guardando ? 'Guardando...' : 'Finalizar Pesaje'}
              </Button>
            )}
            {orden.estado === ESTADO_ORDEN.RECIBIDA && (
              <Button 
                onClick={handleGenerarPDF}
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Generar PDF
              </Button>
            )}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {(orden.estado === ESTADO_ORDEN.PENDIENTE || orden.estado === ESTADO_ORDEN.PROCESANDO) ? (
              <>
                <p className="hidden sm:block">
                  Los cambios en las tarimas se guardan automáticamente en esta vista.<br/>
                  Una vez finalizado el pesaje, no se podrán realizar más cambios.
                </p>
                <p className="sm:hidden">
                  Los cambios se guardan automáticamente. No se podrán modificar después de finalizar.
                </p>
              </>
            ) : (
              <>
                <p className="hidden sm:block">
                  Esta orden ya ha sido finalizada. No se pueden realizar más cambios en el pesaje.<br/>
                  Para ver los detalles, descarga el PDF de la orden.
                </p>
                <p className="sm:hidden">
                  Orden finalizada. Descarga el PDF para ver los detalles.
                </p>
              </>
            )}
          </div>
        </CardContentStyled>
      </CardContainer>

      {/* Información general compacta */}
      <CardContainer>
        <CardHeaderStyled>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5 text-muted-foreground" /> 
            <span className="text-sm sm:text-base">Información general</span>
          </CardTitle>
        </CardHeaderStyled>
        <CardContentStyled>
          <InfoGrid>
            <InfoGroup>
              <InfoGroupHeader>
                <ClipboardList className="h-4 w-4" />
                Información de la Orden
              </InfoGroupHeader>
              <InfoItem>
                <Hash className="h-4 w-4" />
                <b>Código:</b> {orden.codigo}
              </InfoItem>
              <InfoItem>
                <Calendar className="h-4 w-4" />
                <b>Fecha Est.:</b> {formatearFecha(orden.fechaEstimada)}
              </InfoItem>
              <InfoItem>
                <Calendar className="h-4 w-4" />
                <b>Fecha Reg.:</b> {formatearFecha(orden.fechaRegistro) || <span className="italic text-muted-foreground">No registrada</span>}
              </InfoItem>
              <InfoItem>
                <User className="h-4 w-4" />
                <b>Usuario:</b> {orden.usuarioRegistro || <span className="italic text-muted-foreground">No registrado</span>}
              </InfoItem>
            </InfoGroup>

            <InfoGroup>
              <InfoGroupHeader>
                <Package className="h-4 w-4" />
                Proveedor y Producto
              </InfoGroupHeader>
              <InfoItem>
                <User className="h-4 w-4" />
                <b>Proveedor:</b> {orden.proveedor.nombre}
              </InfoItem>
              <InfoItem>
                <Package className="h-4 w-4" />
                <b>Producto:</b> {orden.producto.nombre}
              </InfoItem>
              <InfoItem>
                <Hash className="h-4 w-4" />
                <b>Cod. Prod.:</b> {orden.producto.codigo}
              </InfoItem>
              <InfoItem>
                <Package className="h-4 w-4" />
                <b>Variedad:</b> {orden.producto.variedad}
              </InfoItem>
            </InfoGroup>

            <InfoGroup>
              <InfoGroupHeader>
                <Boxes className="h-4 w-4" />
                Recepción y Pesaje
              </InfoGroupHeader>
              <InfoItem>
                <Calendar className="h-4 w-4" />
                <b>Fecha Rec.:</b> {formatearFecha(orden.fechaRecepcion) || <span className="italic text-muted-foreground">No recibida</span>}
              </InfoItem>
              <InfoItem>
                <User className="h-4 w-4" />
                <b>Usuario Rec.:</b> {orden.usuarioRecepcion || <span className="italic text-muted-foreground">No recibido</span>}
              </InfoItem>
              <InfoItem>
                <Boxes className="h-4 w-4" />
                <b>Tarimas:</b> {tarimas.length}
              </InfoItem>
            </InfoGroup>

            <InfoGroup>
              <InfoGroupHeader>
                <StickyNote className="h-4 w-4" />
                Observaciones
              </InfoGroupHeader>
              <InfoItemFull>
                <div className="flex items-start gap-2">
                  <StickyNote className="h-4 w-4 mt-1" />
                  <div>
                    <p className="text-muted-foreground">
                      {orden.observaciones || <span className="italic">Sin observaciones</span>}
                    </p>
                  </div>
                </div>
              </InfoItemFull>
            </InfoGroup>
          </InfoGrid>
        </CardContentStyled>
      </CardContainer>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="w-[95%] sm:w-[500px] max-w-[95vw]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">¿Finalizar pesaje?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Esta acción cambiará el estado de la orden a "Recibida" y no se podrán realizar más cambios en el pesaje. ¿Estás seguro de continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarFinalizarPesaje} 
              disabled={guardando}
              className="w-full sm:w-auto"
            >
              {guardando ? 'Finalizando...' : 'Sí, finalizar pesaje'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
} 