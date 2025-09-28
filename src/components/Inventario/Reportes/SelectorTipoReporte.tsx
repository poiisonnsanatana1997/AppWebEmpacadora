/**
 * Componente selector de tipo de reporte específico
 */

import React from 'react';
import { motion } from 'motion/react';
import styled from 'styled-components';
import { Calendar, Users, BarChart3, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Componentes estilizados
const SelectorContainer = styled(motion.div)`
  background: #fafbfc;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
`;

const SelectorHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SelectorTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin: 0;
`;

const SelectorSubtitle = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`;

const ReportesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
`;

const ReporteCard = styled(motion.div)`
  background: white;
  border-radius: 0.375rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &:hover {
    border-color: #d1d5db;
    background: #f9fafb;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CardIcon = styled.div<{ color: string }>`
  background: ${props => props.color}10;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin: 0 0 0.25rem 0;
`;

const CardDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
`;

const CardFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
  font-size: 0.6875rem;
  color: #6b7280;
`;

const CardFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.125rem;

  &::before {
    content: '•';
    color: #9ca3af;
    font-weight: bold;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

const CardBadge = styled.span`
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 400;
`;

interface SelectorTipoReporteProps {
  onSeleccionarTipo: (tipo: 'periodo' | 'cliente' | 'diario') => void;
}

/**
 * Componente selector de tipo de reporte
 */
export const SelectorTipoReporte: React.FC<SelectorTipoReporteProps> = ({
  onSeleccionarTipo
}) => {
  const tiposReporte = [
    {
      tipo: 'periodo' as const,
      titulo: 'Reporte de Inventario por Período',
      descripcion: 'Análisis detallado del inventario en un rango de fechas específico',
      icono: Calendar,
      color: '#6366f1',
      caracteristicas: [
        'Filtros por fecha inicio y fin',
        'Agrupación por día, semana o mes',
        'Análisis de tendencias temporales',
        'Exportación a Excel y CSV'
      ]
    },
    {
      tipo: 'cliente' as const,
      titulo: 'Reporte de Tarimas por Cliente',
      descripcion: 'Distribución y análisis de tarimas asignadas por cliente',
      icono: Users,
      color: '#10b981',
      caracteristicas: [
        'Filtros por cliente específico',
        'Incluir o excluir tarimas sin asignar',
        'Resumen de tipos por cliente',
        'Análisis de distribución'
      ]
    },
    {
      tipo: 'diario' as const,
      titulo: 'Resumen Diario',
      descripcion: 'Resumen ejecutivo del estado del inventario en una fecha específica',
      icono: BarChart3,
      color: '#f59e0b',
      caracteristicas: [
        'Resumen por fecha específica',
        'Agrupación por tipo y estatus',
        'Métricas clave del día',
        'Vista ejecutiva'
      ]
    }
  ];

  return (
    <SelectorContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SelectorHeader>
        <HeaderLeft>
          <Settings size={16} color="#6b7280" />
          <div>
            <SelectorTitle>Reportes</SelectorTitle>
            <SelectorSubtitle>Generar reportes específicos</SelectorSubtitle>
          </div>
        </HeaderLeft>
      </SelectorHeader>

      <ReportesGrid>
        {tiposReporte.map((reporte, index) => {
          const IconComponent = reporte.icono;
          
          return (
            <ReporteCard
              key={reporte.tipo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onSeleccionarTipo(reporte.tipo)}
            >
              <CardHeader>
                <CardIcon color={reporte.color}>
                  <IconComponent size={18} />
                </CardIcon>
                <CardContent>
                  <CardTitle>{reporte.titulo}</CardTitle>
                  <CardDescription>{reporte.descripcion}</CardDescription>
                </CardContent>
              </CardHeader>

              <CardFeatures>
                {reporte.caracteristicas.slice(0, 2).map((caracteristica, idx) => (
                  <CardFeature key={idx}>{caracteristica}</CardFeature>
                ))}
              </CardFeatures>

              <CardFooter>
                <CardBadge>Disponible</CardBadge>
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                  <Settings size={12} />
                  Configurar
                </Button>
              </CardFooter>
            </ReporteCard>
          );
        })}
      </ReportesGrid>
    </SelectorContainer>
  );
};
