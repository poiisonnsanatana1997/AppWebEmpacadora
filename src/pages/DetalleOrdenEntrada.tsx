import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { OrdenesEntradaService } from '../services/ordenesEntrada.service';
import { TarimasTableEditable } from '../components/OrdenesEntrada/TarimasTableEditable';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import styled from 'styled-components';
import { Package, Calendar, User, ClipboardList, StickyNote, Boxes, FileDown } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { ESTADO_ORDEN, OrdenEntradaDto, PesajeTarimaDto } from '../types/ordenesEntrada';
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem 1.5rem;
  font-size: 0.98rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
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

  const handleEliminarUltimoPesaje = async () => {
    if (!codigo || !orden) return;
    
    try {
      setGuardando(true);
      
      // Actualizar la orden con el estado Pendiente
      const ordenActualizada = await OrdenesEntradaService.actualizarOrden(codigo, {
        proveedorId: orden.proveedor.id,
        productoId: orden.producto.id,
        fechaEstimada: orden.fechaEstimada,
        estado: ESTADO_ORDEN.PENDIENTE,
        observaciones: orden.observaciones
      });

      if (ordenActualizada) {
        setOrden(ordenActualizada);
        toast.success('Estado actualizado a Pendiente');
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
    <div className="w-full p-0 m-0">
      <Toaster richColors position="top-right" />
      
      {/* Encabezado compacto */}
      <div className="flex items-center justify-between mb-2">
        <Button onClick={() => navigate(-1)} variant="outline" size="sm">
          ← Regresar
        </Button>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Orden #{orden.codigo}</span>
          <Badge className={`ml-2 text-sm px-2 py-1.5 ${
            orden.estado === ESTADO_ORDEN.PENDIENTE ? 'bg-black text-white' :
            orden.estado === ESTADO_ORDEN.PROCESANDO ? 'bg-blue-600 text-white' :
            orden.estado === ESTADO_ORDEN.RECIBIDA ? 'bg-green-600 text-white' :
            'bg-red-600 text-white'
          }`} variant="secondary">{orden.estado}</Badge>
        </div>
      </div>

      {/* Tarimas primero */}
      <Card className="mb-6 w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Boxes className="h-5 w-5 text-muted-foreground" /> Tarimas (Pesaje por Tarima)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-sm text-muted-foreground">
            Aquí puedes ver y editar el pesaje de cada tarima asociada a esta orden. Utiliza los campos para modificar los valores y el botón <span className="font-bold">➕</span> para agregar nuevas tarimas.
          </div>
          <TarimasTableEditable 
            tarimas={tarimas} 
            setTarimas={setTarimas} 
            estado={orden.estado}
            codigoOrden={orden.codigo}
            onPrimerPesaje={handlePrimerPesaje}
            onEliminarUltimoPesaje={handleEliminarUltimoPesaje}
          />
          <div className="mt-4 flex justify-end gap-2">
            {(orden.estado === ESTADO_ORDEN.PENDIENTE || orden.estado === ESTADO_ORDEN.PROCESANDO ) && (
              <Button 
                onClick={handleFinalizarPesaje} 
                disabled={guardando}
                className="bg-green-600 hover:bg-green-700"
              >
                {guardando ? 'Guardando...' : 'Finalizar Pesaje'}
              </Button>
            )}
            {orden.estado === ESTADO_ORDEN.RECIBIDA && (
              <Button 
                onClick={handleGenerarPDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Generar PDF
              </Button>
            )}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {(orden.estado === ESTADO_ORDEN.PENDIENTE || orden.estado === ESTADO_ORDEN.PROCESANDO) ? (
              <>
                Los cambios en las tarimas se guardan automáticamente en esta vista.<br/>
                Una vez finalizado el pesaje, no se podrán realizar más cambios.
              </>
            ) : (
              <>
                Esta orden ya ha sido finalizada. No se pueden realizar más cambios en el pesaje.<br/>
                Para ver los detalles, descarga el PDF de la orden.
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información general compacta */}
      <Card className="mb-4 w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-5 w-5 text-muted-foreground" /> Información general
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoGrid>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><b>Fecha:</b> {formatearFecha(orden.fechaEstimada)}</div>
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><b>Proveedor:</b> {orden.proveedor.nombre}</div>
            <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /><b>Producto:</b> {orden.producto.nombre}</div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><b>Fecha de Registro:</b> {formatearFecha(orden.fechaRegistro) || <span className="italic text-muted-foreground">No registrada</span>}</div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><b>Fecha de Recepción:</b> {formatearFecha(orden.fechaRecepcion) || <span className="italic text-muted-foreground">No recibida</span>}</div>
            <div className="flex items-center gap-2 col-span-3"><StickyNote className="h-4 w-4 text-muted-foreground" /><b>Observaciones:</b> <span className="ml-1 text-muted-foreground">{orden.observaciones || <span className="italic">Sin observaciones</span>}</span></div>
          </InfoGrid>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Finalizar pesaje?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción cambiará el estado de la orden a "Recibida" y no se podrán realizar más cambios en el pesaje. ¿Estás seguro de continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarFinalizarPesaje} disabled={guardando}>
              {guardando ? 'Finalizando...' : 'Sí, finalizar pesaje'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 