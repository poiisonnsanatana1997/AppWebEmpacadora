import styled from "styled-components"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
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
import { redirectToLogin } from '../lib/utils'

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  background: #F8FAFC;
  position: relative;
`

const WelcomeBanner = styled(motion.div)`
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`

const WelcomeTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`

const WelcomeText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
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
  width: 100%;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding: 0.75rem 1rem;
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    margin-bottom: 1rem;
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
  
  @media (max-width: 480px) {
    gap: 0.25rem;
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
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  transition: all 0.2s;
  width: 100%;

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
    
    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
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
  width: 100%;

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1E293B;
    margin-bottom: 1.5rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 1rem;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    margin-bottom: 1rem;
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
  const { user, logout } = useAuth()

  const handleTestExpiration = () => {
    console.log('Probando redirección por expiración...')
    // Simular expiración limpiando el token
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('tokenExpiration')
    redirectToLogin(true)
  }

  return (
    <DashboardContainer>
      <WelcomeBanner
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WelcomeTitle>
          ¡Bienvenido, {user?.name || 'Usuario'}!
        </WelcomeTitle>
        <WelcomeText>
          Tu sistema está listo para ayudarte a gestionar y optimizar tus operaciones de empaque de manera eficiente.
        </WelcomeText>
      </WelcomeBanner>

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

      {/* Botón de prueba para expiración */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Prueba de Expiración</h3>
        <p className="text-sm text-yellow-700 mb-3">
          Usa este botón para probar la redirección por expiración de sesión
        </p>
        <button
          onClick={handleTestExpiration}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Probar Expiración de Sesión
        </button>
      </div>
    </DashboardContainer>
  )
} 