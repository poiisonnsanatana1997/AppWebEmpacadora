import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  BarChart3,
  Users,
  Settings,
  Leaf,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Package,
  ClipboardList} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { colors } from "../styles/colors"

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.background.main};
  position: relative;
  overflow-x: hidden;
`

const Sidebar = styled(motion.div)<{ $isOpen: boolean; $isCompact: boolean }>`
  width: ${props => props.$isCompact ? '80px' : '280px'};
  background: ${colors.background.light};
  border-right: 1px solid ${colors.border.light};
  padding: 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  z-index: 100;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px ${colors.shadow.light};

  @media (max-width: 1024px) {
    width: ${props => props.$isCompact ? '80px' : '240px'};
  }

  @media (max-width: 768px) {
    width: 280px;
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.$isOpen ? `0 4px 12px ${colors.shadow.medium}` : 'none'};
  }
`

const Logo = styled.div<{ $isCompact: boolean }>`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${colors.border.light};
  margin-bottom: 1.5rem;
  justify-content: space-between;
  position: relative;
  height: 80px;
  background: ${colors.background.light};

  .logo-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
    height: 64px;
  }

  img {
    height: ${props => props.$isCompact ? '24px' : '32px'};
    width: auto;
    transition: all 0.2s;
  }
`

const CompactButton = styled.button<{ $isCompact: boolean }>`
  background: transparent;
  border: none;
  color: ${colors.text.secondary};
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover {
    background: ${colors.background.main};
    color: ${colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
    transform: ${props => props.$isCompact ? 'rotate(180deg)' : 'none'};
    transition: transform 0.3s ease;
    stroke-width: 1.5;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const Overlay = styled(motion.div)<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 768px) {
    opacity: ${props => props.$isOpen ? '1' : '0'};
    pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
    top: 4rem;
  }
`

const MainContent = styled.div<{ $sidebarOpen: boolean; $isCompact: boolean }>`
  flex: 1;
  padding: 2rem;
  margin-left: ${props => props.$sidebarOpen ? (props.$isCompact ? '80px' : '280px') : '0'};
  transition: margin-left 0.3s ease;
  width: 100%;
  position: relative;
  z-index: 1;
  overflow: auto;

  @media (max-width: 1024px) {
    margin-left: ${props => props.$sidebarOpen ? (props.$isCompact ? '80px' : '240px') : '0'};
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
    padding-top: 4.5rem;
  }
`

const MenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  color: #64748B;
  cursor: pointer;
  background: transparent;
  border: none;
  z-index: 1003;
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  border-radius: 0.5rem;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    color: #1E40AF;
    background: #F1F5F9;
  }

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 1.5;
  }
`

const NavSection = styled.div<{ $isCompact: boolean }>`
  margin-bottom: 2rem;
  padding: ${props => props.$isCompact ? '0 0.5rem' : '0 1rem'};

  h3 {
    color: #94A3B8;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 1rem;
    text-align: ${props => props.$isCompact ? 'center' : 'left'};
    display: ${props => props.$isCompact ? 'none' : 'block'};
    letter-spacing: 0.05em;
    padding: 0 0.75rem;
  }
`

const NavItem = styled.button<{ $isCompact: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: ${props => props.$active ? 'rgba(74, 107, 87, 0.08)' : 'transparent'};
  color: ${props => props.$active ? colors.primary : colors.text.secondary};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;

  &:hover {
    background: rgba(74, 107, 87, 0.08);
    color: ${colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 1.5;
  }

  span {
    display: ${props => props.$isCompact ? 'none' : 'inline'};
    line-height: 20px;
  }
`

const UserProfileSection = styled.div<{ $isCompact: boolean }>`
  padding: ${props => props.$isCompact ? '0.5rem' : '1rem'};
  border-top: 1px solid ${colors.border.light};
  margin-top: auto;
  background: ${colors.background.light};
  
  .user-info {
    display: ${props => props.$isCompact ? 'none' : 'block'};
    margin-bottom: 0.5rem;
    
    h4 {
      font-size: 0.875rem;
      color: ${colors.text.primary};
      margin: 0;
    }
    
    p {
      font-size: 0.75rem;
      color: ${colors.text.secondary};
      margin: 0;
    }
  }
`

const UserButton = styled(NavItem)`
  margin-bottom: 0;
  background: ${colors.background.light};
  border: 1px solid ${colors.border.light};
  
  &:hover {
    background: rgba(74, 107, 87, 0.08);
  }
`

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768)
  const [isCompact, setIsCompact] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isSidebarOpen])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleNavClick = (path: string) => {
    if (path === '/logout') {
      logout()
      navigate('/login')
      return
    }

    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false)
    }
    navigate(path)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSidebarOpen(false)
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <LayoutContainer>
      {isMobile && (
        <MenuButton onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </MenuButton>
      )}

      <Overlay 
        $isOpen={isSidebarOpen}
        onClick={handleOverlayClick}
      />

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar
            $isOpen={isSidebarOpen}
            $isCompact={isCompact}
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
          >
            <Logo $isCompact={isCompact}>
              <div className="logo-container">
                <img src="/images/deepsoft-logo.svg" alt="AgroSmart" />
              </div>
              <CompactButton 
                $isCompact={isCompact}
                onClick={() => setIsCompact(!isCompact)}
              >
                <ChevronLeft />
              </CompactButton>
            </Logo>

            <NavSection $isCompact={isCompact}>
              <h3>General</h3>
              <NavItem 
                $isCompact={isCompact} 
                $active={isActive('/dashboard')}
                onClick={() => handleNavClick('/dashboard')}
              >
                <BarChart3 /> <span>Dashboard</span>
              </NavItem>
              <NavItem 
                $isCompact={isCompact} 
                $active={isActive('/inventory')}
                onClick={() => handleNavClick('/inventory')}
              >
                <Leaf /> <span>Cultivos</span>
              </NavItem>
              <NavItem 
                $isCompact={isCompact} 
                $active={isActive('/products')}
                onClick={() => handleNavClick('/products')}
              >
                <Package /> <span>Productos</span>
              </NavItem>
              <NavItem 
                $isCompact={isCompact} 
                $active={isActive('/ordenes-entrada')}
                onClick={() => handleNavClick('/ordenes-entrada')}
              >
                <ClipboardList /> <span>Órdenes de Entrada</span>
              </NavItem>
              <NavItem 
                $isCompact={isCompact} 
                $active={isActive('/users')}
                onClick={() => handleNavClick('/users')}
              >
                <Users /> <span>Usuarios</span>
              </NavItem>
            </NavSection>

            <NavSection $isCompact={isCompact}>
              <h3>Herramientas</h3>
              <NavItem 
                $isCompact={isCompact} 
                $active={isActive('/calendar')}
                onClick={() => handleNavClick('/calendar')}
              >
                <Calendar /> <span>Calendario</span>
              </NavItem>
              <NavItem 
                $isCompact={isCompact} 
                $active={isActive('/reports')}
                onClick={() => handleNavClick('/reports')}
              >
                <BarChart3 /> <span>Reportes</span>
              </NavItem>
              <NavItem 
                $isCompact={isCompact} 
                $active={isActive('/settings')}
                onClick={() => handleNavClick('/settings')}
              >
                <Settings /> <span>Configuración</span>
              </NavItem>
            </NavSection>

            <UserProfileSection $isCompact={isCompact}>
              <div className="user-info">
                <h4>{user?.name || 'Usuario'}</h4>
                <p>{user?.roleName || 'Sin rol asignado'}</p>
              </div>
              <UserButton 
                $isCompact={isCompact} 
                onClick={() => handleNavClick('/logout')}
              >
                <LogOut /> <span>Cerrar sesión</span>
              </UserButton>
            </UserProfileSection>
          </Sidebar>
        )}
      </AnimatePresence>

      <MainContent $sidebarOpen={isSidebarOpen} $isCompact={isCompact}>
        {children}
      </MainContent>
    </LayoutContainer>
  )
} 