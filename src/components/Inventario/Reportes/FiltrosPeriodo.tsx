/**
 * Componente de filtros para reporte de inventario por período
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ConfiguracionReportePeriodo } from '@/types/Inventario/reportesEspecificos.types';

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

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

interface FiltrosPeriodoProps {
  onConfigurar: (configuracion: ConfiguracionReportePeriodo) => void;
  onCancelar: () => void;
  fechasDisponibles: string[];
}

/**
 * Componente de filtros para reporte por período
 */
export const FiltrosPeriodo: React.FC<FiltrosPeriodoProps> = ({
  onConfigurar,
  onCancelar,
  fechasDisponibles
}) => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [agruparPor, setAgruparPor] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [formato, setFormato] = useState<'excel' | 'pdf'>('excel');

  // Establecer fechas por defecto
  useEffect(() => {
    if (fechasDisponibles.length > 0) {
      const fechaMasAntigua = fechasDisponibles[0];
      const fechaMasReciente = fechasDisponibles[fechasDisponibles.length - 1];
      
      setFechaInicio(fechaMasAntigua);
      setFechaFin(fechaMasReciente);
    }
  }, [fechasDisponibles]);

  const handleGenerar = () => {
    if (!fechaInicio || !fechaFin) {
      alert('Por favor selecciona las fechas de inicio y fin');
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      alert('La fecha de inicio no puede ser mayor a la fecha de fin');
      return;
    }

    const configuracion: ConfiguracionReportePeriodo = {
      nombre: `Inventario_Periodo_${fechaInicio}_${fechaFin}`,
      tipo: 'periodo',
      filtros: {
        fechaInicio,
        fechaFin,
        agruparPor
      },
      columnas: ['fecha', 'codigo', 'tipo', 'pesoTotal', 'cliente', 'fechaRegistro'],
      formato
    };

    onConfigurar(configuracion);
  };

  const calcularDias = () => {
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      const diffTime = Math.abs(fin.getTime() - inicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const dias = calcularDias();

  return (
    <FiltrosContainer>
      <FiltrosHeader>
        <Calendar size={20} color="#6366f1" />
        <FiltrosTitle>Configuración del Reporte por Período</FiltrosTitle>
      </FiltrosHeader>

      <FiltrosGrid>
        <FiltroGroup>
          <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
          <Input
            id="fechaInicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            min={fechasDisponibles[0]}
            max={fechasDisponibles[fechasDisponibles.length - 1]}
          />
        </FiltroGroup>

        <FiltroGroup>
          <Label htmlFor="fechaFin">Fecha de Fin</Label>
          <Input
            id="fechaFin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            min={fechaInicio || fechasDisponibles[0]}
            max={fechasDisponibles[fechasDisponibles.length - 1]}
          />
        </FiltroGroup>

        <FiltroGroup>
          <Label htmlFor="agruparPor">Agrupar Por</Label>
          <Select value={agruparPor} onValueChange={(value: 'dia' | 'semana' | 'mes') => setAgruparPor(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dia">Día</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mes</SelectItem>
            </SelectContent>
          </Select>
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

      {fechaInicio && fechaFin && (
        <PreviewContainer>
          <PreviewTitle>Vista Previa de la Configuración</PreviewTitle>
          <PreviewText>
            <strong>Período:</strong> {new Date(fechaInicio).toLocaleDateString('es-MX')} - {new Date(fechaFin).toLocaleDateString('es-MX')}
          </PreviewText>
          <PreviewText>
            <strong>Duración:</strong> {dias} días
          </PreviewText>
          <PreviewText>
            <strong>Agrupación:</strong> Por {agruparPor}
          </PreviewText>
          <PreviewText>
            <strong>Formato:</strong> {formato.toUpperCase()}
          </PreviewText>
        </PreviewContainer>
      )}

      <ActionsContainer>
        <Button variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button onClick={handleGenerar} disabled={!fechaInicio || !fechaFin}>
          <Download size={16} className="mr-2" />
          Generar Reporte
        </Button>
      </ActionsContainer>
    </FiltrosContainer>
  );
};
