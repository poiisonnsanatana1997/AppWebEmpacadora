/**
 * Componente para exportar reportes del inventario
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import styled, { keyframes } from 'styled-components';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle, FileDown, X } from 'lucide-react';
import { useReportesEspecificos } from '@/hooks/Inventario/useReportesEspecificos';
import { SelectorTipoReporte } from './Reportes/SelectorTipoReporte';
import { FiltrosPeriodo } from './Reportes/FiltrosPeriodo';
import { FiltrosCliente } from './Reportes/FiltrosCliente';
import { FiltrosDiario } from './Reportes/FiltrosDiario';
import type { InventarioTipoDTO } from '@/types/Inventario/inventario.types';
import type { ConfiguracionReporteEspecifico } from '@/types/Inventario/reportesEspecificos.types';

// Animación para la barra de progreso
const progressAnimation = keyframes`
  0% { width: 0%; }
  50% { width: 100%; }
  100% { width: 0%; }
`;



// Componentes estilizados para feedback
const FeedbackContainer = styled(motion.div)`
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const FeedbackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const FeedbackTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin: 0;
`;

const FeedbackMessage = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ProgressText = styled.span`
  font-size: 0.6875rem;
  color: #6b7280;
  text-align: center;
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
`;

const SuccessMessage = styled.p`
  font-size: 0.75rem;
  color: #059669;
  margin: 0;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ErrorMessage = styled.p`
  font-size: 0.75rem;
  color: #dc2626;
  margin: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: #6b7280;
  }
`;

const AnimatedProgress = styled.div`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: #6366f1;
    border-radius: 2px;
    animation: ${progressAnimation} 2s ease-in-out infinite;
  }
`;




interface ReportesExportablesProps {
  datos: InventarioTipoDTO[];
}

/**
 * Componente de reportes exportables
 */
export const ReportesExportables: React.FC<ReportesExportablesProps> = ({ datos }) => {

  const {
    estadoModal,
    opcionesFiltros,
    isGenerando,
    error,
    reporteGenerado,
    abrirModalConfiguracion,
    cerrarModalConfiguracion,
    cargarOpcionesFiltros,
    generarReporte: generarReporteEspecifico
  } = useReportesEspecificos();

  /**
   * Limpia el estado de éxito
   */
  const limpiarEstadoExito = () => {
    // Simular limpiar el estado (en un caso real, esto vendría del hook)
    window.location.reload();
  };


  /**
   * Carga las opciones de filtros al montar el componente
   */
  useEffect(() => {
    cargarOpcionesFiltros(datos);
  }, [cargarOpcionesFiltros, datos]);



  /**
   * Maneja la configuración de reporte específico
   */
  const handleConfigurarReporteEspecifico = async (configuracion: ConfiguracionReporteEspecifico) => {
    try {
      await generarReporteEspecifico(datos, configuracion);
    } catch (error) {
      console.error('Error al generar reporte específico:', error);
    }
  };


  return (
    <>
      {/* Selector de Reportes Específicos */}
      <SelectorTipoReporte onSeleccionarTipo={abrirModalConfiguracion} />

      {/* Feedback de Generación */}
      {isGenerando && (
        <FeedbackContainer
          initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FeedbackHeader>
            <Loader2 size={16} className="animate-spin" color="#6366f1" />
            <FeedbackTitle>Generando Reporte</FeedbackTitle>
          </FeedbackHeader>
          <FeedbackMessage>
            Procesando datos y generando archivo...
          </FeedbackMessage>
          <ProgressContainer>
            <Progress value={undefined} className="w-full" />
            <ProgressText>Esto puede tomar unos segundos</ProgressText>
          </ProgressContainer>
        </FeedbackContainer>
      )}

      {/* Feedback de Éxito */}
      {reporteGenerado && !isGenerando && !error && (
        <FeedbackContainer
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CloseButton onClick={limpiarEstadoExito}>
            <X size={14} />
          </CloseButton>
          <SuccessContainer>
            <CheckCircle size={20} color="#059669" />
            <SuccessMessage>Reporte generado exitosamente</SuccessMessage>
            <FeedbackMessage>
              El archivo se ha descargado automáticamente
            </FeedbackMessage>
          </SuccessContainer>
        </FeedbackContainer>
      )}

      {/* Feedback de Error */}
      {error && (
        <FeedbackContainer
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CloseButton onClick={limpiarEstadoExito}>
            <X size={14} />
          </CloseButton>
          <FeedbackHeader>
            <AlertCircle size={16} color="#dc2626" />
            <FeedbackTitle>Error al Generar Reporte</FeedbackTitle>
          </FeedbackHeader>
          <ErrorContainer>
            <ErrorMessage>{error}</ErrorMessage>
          </ErrorContainer>
        </FeedbackContainer>
      )}

      {/* Modal de Reportes Específicos */}
      <Dialog open={estadoModal.isOpen} onOpenChange={cerrarModalConfiguracion}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {estadoModal.tipoReporte === 'periodo' && 'Reporte de Inventario por Período'}
              {estadoModal.tipoReporte === 'cliente' && 'Reporte de Tarimas por Cliente'}
              {estadoModal.tipoReporte === 'diario' && 'Resumen Diario'}
            </DialogTitle>
            <DialogDescription>
              Configura los filtros y opciones para generar el reporte
            </DialogDescription>
          </DialogHeader>

          {estadoModal.tipoReporte === 'periodo' && (
            <FiltrosPeriodo
              onConfigurar={handleConfigurarReporteEspecifico}
              onCancelar={cerrarModalConfiguracion}
              fechasDisponibles={opcionesFiltros.fechasDisponibles}
            />
          )}

          {estadoModal.tipoReporte === 'cliente' && (
            <FiltrosCliente
              onConfigurar={handleConfigurarReporteEspecifico}
              onCancelar={cerrarModalConfiguracion}
              clientes={opcionesFiltros.clientes}
            />
          )}

          {estadoModal.tipoReporte === 'diario' && (
            <FiltrosDiario
              onConfigurar={handleConfigurarReporteEspecifico}
              onCancelar={cerrarModalConfiguracion}
              fechasDisponibles={opcionesFiltros.fechasDisponibles}
            />
          )}

          {/* Feedback de Generación dentro del Modal */}
          {isGenerando && (
            <div style={{ marginTop: '1rem' }}>
              <AnimatedProgress />
            </div>
          )}

          {/* Feedback de Error dentro del Modal */}
          {error && (
            <div style={{ 
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <AlertCircle size={16} color="#dc2626" />
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#dc2626', margin: 0 }}>
                  Error al Generar Reporte
                </h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>
                {error}
              </p>
          </div>
          )}

        </DialogContent>
      </Dialog>
    </>
  );
};
