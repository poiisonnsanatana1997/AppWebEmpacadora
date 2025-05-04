import { useState } from 'react';
import styled from 'styled-components';
import { BarChart2 as BarChartIcon, Download, Filter, Calendar } from 'lucide-react';

const ReportsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #F4F6F8;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  color: #4CAF50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &.primary {
    background: #4CAF50;
    color: white;
    border: none;
    &:hover {
      background: #388E3C;
    }
  }

  &.secondary {
    background: #E8F5E9;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    &:hover {
      background: #F4F6F8;
    }
  }
`;

const DateRange = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
`;

const DateInput = styled.input`
  border: none;
  outline: none;
  color: #111936;
  font-size: 0.875rem;
  width: 120px;

  &::placeholder {
    color: #94a3b8;
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ReportCard = styled.div`
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(76,175,80,0.06);
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ReportTitle = styled.h3`
  font-size: 1.125rem;
  color: #4CAF50;
  margin: 0;
`;

const ChartContainer = styled.div`
  height: 300px;
  background: #f8fafc;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.875rem;
`;

const ReportFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const ReportInfo = styled.div`
  color: #64748b;
  font-size: 0.875rem;
`;

export default function ReportsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Datos de ejemplo para los reportes
  const reports = [
    {
      id: 1,
      title: 'Producción Mensual',
      type: 'bar',
      lastUpdated: '2024-03-15'
    },
    {
      id: 2,
      title: 'Gastos por Categoría',
      type: 'pie',
      lastUpdated: '2024-03-14'
    },
    {
      id: 3,
      title: 'Rendimiento de Cultivos',
      type: 'line',
      lastUpdated: '2024-03-13'
    },
    {
      id: 4,
      title: 'Inventario vs Ventas',
      type: 'bar',
      lastUpdated: '2024-03-12'
    }
  ];

  return (
    <ReportsContainer>
      <Header>
        <Title>
          <BarChartIcon size={24} />
          Reportes
        </Title>
        <Actions>
          <DateRange>
            <Calendar size={18} color="#94a3b8" />
            <DateInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>a</span>
            <DateInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </DateRange>
          <Button className="secondary">
            <Filter size={18} />
            Filtros
          </Button>
          <Button className="primary">
            <Download size={18} />
            Exportar
          </Button>
        </Actions>
      </Header>

      <ReportsGrid>
        {reports.map((report) => (
          <ReportCard key={report.id}>
            <ReportHeader>
              <ReportTitle>{report.title}</ReportTitle>
              <Button className="secondary">
                <Download size={18} />
              </Button>
            </ReportHeader>
            <ChartContainer>
              Gráfico de {report.type} - {report.title}
            </ChartContainer>
            <ReportFooter>
              <ReportInfo>
                Última actualización: {report.lastUpdated}
              </ReportInfo>
              <Button className="secondary">
                Ver Detalles
              </Button>
            </ReportFooter>
          </ReportCard>
        ))}
      </ReportsGrid>
    </ReportsContainer>
  );
} 