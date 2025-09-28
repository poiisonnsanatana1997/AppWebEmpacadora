/**
 * Componente de filtros para reporte de tarimas por cliente
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Users, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ConfiguracionReporteCliente } from '@/types/Inventario/reportesEspecificos.types';

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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FiltroGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

interface FiltrosClienteProps {
  onConfigurar: (configuracion: ConfiguracionReporteCliente) => void;
  onCancelar: () => void;
  clientes: Array<{ id: string; nombre: string }>;
}

/**
 * Componente de filtros para reporte por cliente
 */
export const FiltrosCliente: React.FC<FiltrosClienteProps> = ({
  onConfigurar,
  onCancelar,
  clientes
}) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('todos');
  const [formato, setFormato] = useState<'excel' | 'pdf'>('excel');

  const handleGenerar = () => {
    const configuracion: ConfiguracionReporteCliente = {
      nombre: clienteSeleccionado !== 'todos' 
        ? `Tarimas_Cliente_${clienteSeleccionado}`
        : 'Tarimas_Todos_Los_Clientes',
      tipo: 'cliente',
      filtros: {
        clienteId: clienteSeleccionado !== 'todos' ? clienteSeleccionado : undefined,
        incluirSinAsignar: true
      },
      columnas: ['cliente', 'cantidadTarimas', 'pesoTotal', 'tipos', 'porcentaje'],
      formato
    };

    onConfigurar(configuracion);
  };

  const getClienteNombre = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : clienteId;
  };

  return (
    <FiltrosContainer>
      <FiltrosHeader>
        <Users size={20} color="#10b981" />
        <FiltrosTitle>Configuración del Reporte por Cliente</FiltrosTitle>
      </FiltrosHeader>

      <FiltrosGrid>
        <FiltroGroup>
          <Label htmlFor="cliente">Cliente</Label>
          <Select value={clienteSeleccionado} onValueChange={setClienteSeleccionado}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar cliente (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los clientes</SelectItem>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </SelectItem>
              ))}
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


      <PreviewContainer>
        <PreviewTitle>Vista Previa de la Configuración</PreviewTitle>
        <PreviewText>
          <strong>Cliente:</strong> {clienteSeleccionado !== 'todos' ? getClienteNombre(clienteSeleccionado) : 'Todos los clientes'}
        </PreviewText>
        <PreviewText>
          <strong>Formato:</strong> {formato.toUpperCase()}
        </PreviewText>
        <PreviewText>
          <strong>Columnas:</strong> Cliente, Cantidad, Peso Total, Tipos (XL/L/M/S), Porcentaje
        </PreviewText>
      </PreviewContainer>

      <ActionsContainer>
        <Button variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button onClick={handleGenerar}>
          <Download size={16} className="mr-2" />
          Generar Reporte
        </Button>
      </ActionsContainer>
    </FiltrosContainer>
  );
};
