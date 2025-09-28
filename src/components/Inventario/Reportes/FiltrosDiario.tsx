/**
 * Componente de filtros para resumen diario
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart3, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ConfiguracionReporteDiario } from '@/types/Inventario/reportesEspecificos.types';

// Componentes estilizados
const FiltrosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FiltrosHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const FiltrosTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const FiltrosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FiltroGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const PreviewContainer = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  margin-top: 1rem;
`;

const PreviewTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const PreviewText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`;

const InfoContainer = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
`;

const InfoTitle = styled.h6`
  font-size: 0.875rem;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoText = styled.p`
  font-size: 0.75rem;
  color: #92400e;
  margin: 0;
  line-height: 1.4;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

interface FiltrosDiarioProps {
  onConfigurar: (configuracion: ConfiguracionReporteDiario) => void;
  onCancelar: () => void;
  fechasDisponibles: string[];
}

/**
 * Componente de filtros para resumen diario
 */
export const FiltrosDiario: React.FC<FiltrosDiarioProps> = ({
  onConfigurar,
  onCancelar,
  fechasDisponibles
}) => {
  const [fecha, setFecha] = useState('');
  const [formato, setFormato] = useState<'excel' | 'pdf'>('excel');

  // Establecer fecha por defecto (la más reciente)
  useEffect(() => {
    if (fechasDisponibles.length > 0) {
      const fechaMasReciente = fechasDisponibles[fechasDisponibles.length - 1];
      setFecha(fechaMasReciente);
    }
  }, [fechasDisponibles]);

  const handleGenerar = () => {
    if (!fecha) {
      alert('Por favor selecciona una fecha');
      return;
    }

    const configuracion: ConfiguracionReporteDiario = {
      nombre: `Resumen_Diario_${fecha}`,
      tipo: 'diario',
      filtros: {
        fecha
      },
      columnas: ['tipo', 'cantidad', 'pesoTotal', 'estatus', 'porcentaje'],
      formato
    };

    onConfigurar(configuracion);
  };

  const getDiaSemana = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-MX', { weekday: 'long' });
  };

  return (
    <FiltrosContainer>
      <FiltrosHeader>
        <BarChart3 size={20} color="#f59e0b" />
        <FiltrosTitle>Configuración del Resumen Diario</FiltrosTitle>
      </FiltrosHeader>

      <FiltrosGrid>
        <FiltroGroup>
          <Label htmlFor="fecha">Fecha del Resumen</Label>
          <Input
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={fechasDisponibles[0]}
            max={fechasDisponibles[fechasDisponibles.length - 1]}
          />
        </FiltroGroup>

        <FiltroGroup>
          <Label htmlFor="formato">Formato de Exportación</Label>
          <Select value={formato} onValueChange={(value: 'excel' | 'pdf') => setFormato(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel (.xlsx)</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
        </FiltroGroup>
      </FiltrosGrid>

      {fecha && (
        <PreviewContainer>
          <PreviewTitle>Vista Previa de la Configuración</PreviewTitle>
          <PreviewText>
            <strong>Fecha:</strong> {new Date(fecha).toLocaleDateString('es-MX')} ({getDiaSemana(fecha)})
          </PreviewText>
          <PreviewText>
            <strong>Formato:</strong> {formato.toUpperCase()}
          </PreviewText>
          <PreviewText>
            <strong>Agrupación:</strong> Por tipo y estatus
          </PreviewText>
          <PreviewText>
            <strong>Columnas:</strong> Tipo, Cantidad, Peso Total, Estatus, Porcentaje
          </PreviewText>
        </PreviewContainer>
      )}

      <InfoContainer>
        <InfoTitle>
          <Calendar size={16} />
          Información del Resumen Diario
        </InfoTitle>
        <InfoText>
          Este reporte genera un resumen ejecutivo del estado del inventario para la fecha seleccionada, 
          incluyendo métricas clave como totales por tipo, distribución por estatus y porcentajes de ocupación.
        </InfoText>
      </InfoContainer>

      <ActionsContainer>
        <Button variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button onClick={handleGenerar} disabled={!fecha}>
          <Download size={16} className="mr-2" />
          Generar Resumen
        </Button>
      </ActionsContainer>
    </FiltrosContainer>
  );
};
