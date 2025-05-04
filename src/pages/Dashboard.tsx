import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import {
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Bell,
  Filter,
  Download,
  HelpCircle,
  ChevronDown
} from "lucide-react"

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #F8FAFC;
  position: relative;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding: 0.75rem 1rem;
  }
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`

const IconButton = styled.button`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  width: 40px;
  height: 40px;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    color: #1E40AF;
    border-color: #1E40AF;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  h3 {
    color: #64748B;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    line-height: 20px;
    font-weight: 500;

    svg {
      width: 20px;
      height: 20px;
      stroke-width: 1.5;
    }
  }

  .value {
    font-size: 2rem;
    font-weight: 600;
    color: #1E293B;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  }

  .change {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;

    &.positive {
      color: #059669;
      background: #ECFDF5;
    }

    &.negative {
      color: #DC2626;
      background: #FEF2F2;
    }
  }
`

const ChartSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  border: 1px solid #E2E8F0;

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1E293B;
    margin-bottom: 1.5rem;
  }
`

const TableSection = styled(ChartSection)`
  h2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export default function Dashboard() {
  return (
    <DashboardContainer>
      <Header>
        <HeaderActions>
          <IconButton>
            <Bell />
          </IconButton>
          <IconButton>
            <Filter />
          </IconButton>
          <IconButton>
            <Download />
          </IconButton>
          <IconButton>
            <HelpCircle />
          </IconButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3><Droplets /> Humedad Promedio</h3>
          <div>
            <span className="value">75%</span>
            <span className="change positive">+2.5%</span>
          </div>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3><Thermometer /> Temperatura</h3>
          <div>
            <span className="value">24°C</span>
            <span className="change negative">-1.2°C</span>
          </div>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3><Wind /> Velocidad del Viento</h3>
          <div>
            <span className="value">12 km/h</span>
            <span className="change positive">+3 km/h</span>
          </div>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3><Sun /> Radiación Solar</h3>
          <div>
            <span className="value">850 W/m²</span>
            <span className="change positive">+50 W/m²</span>
          </div>
        </StatCard>
      </StatsGrid>

      <ChartSection>
        <h2>Tendencias de Cultivo</h2>
        {/* Aquí iría el componente del gráfico */}
      </ChartSection>

      <TableSection>
        <h2>
          Alertas Recientes
          <IconButton>
            <ChevronDown size={16} />
          </IconButton>
        </h2>
        {/* Aquí iría la tabla de alertas */}
      </TableSection>
    </DashboardContainer>
  )
} 