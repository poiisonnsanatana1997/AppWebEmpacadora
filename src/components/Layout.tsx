import { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styled from "styled-components"
import { motion } from "framer-motion"
import {
  Users,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Package,
  ClipboardList
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { colors } from "../styles/colors"
import Tooltip from "./Tooltip"

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${colors.background.main};
  position: relative;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
`

const Sidebar = styled.div<{ $isOpen: boolean; $isCompact: boolean }>`
  width: ${props => props.$isCompact ? '80px' : '280px'};
  background: ${colors.background.light};
  border-right: 1px solid ${colors.border.light};
  padding: 0;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1200;
  box-shadow: 0 4px 12px ${colors.shadow.light};
  transition: transform 0.18s cubic-bezier(0.4,0,0.2,1), opacity 0.18s cubic-bezier(0.4,0,0.2,1);
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};

  @media (max-width: 1024px) {
    width: ${props => props.$isCompact ? '80px' : '240px'};
  }

  @media (max-width: 768px) {
    width: 280px;
    height: 100vh;
    max-height: 100vh;
    z-index: 1200;
    display: block;
  }
`

const SidebarHeader = styled.div<{ $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem 0.5rem 1.5rem;
  border-bottom: 1px solid ${colors.border.light};
  height: 65px;
  background: ${colors.background.light};

  .logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .close-btn {
    display: ${props => props.$isMobile ? 'block' : 'none'};
    background: transparent;
    border: none;
    color: #64748b;
    font-size: 1.5rem;
    cursor: pointer;
    margin-left: 1rem;
    padding: 0.25rem;
    border-radius: 4px;
    transition: background 0.2s;
    &:hover {
      background: #f1f5f9;
      color: ${colors.primary};
    }
  }
`

const Logo = styled.div<{ $isCompact: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.border.light};
  margin-bottom: 1rem;
  justify-content: space-between;
  position: relative;
  height: 60px;
  background: ${colors.background.light};

  .logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .brand-name {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .brand-title {
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 1.1rem;
    color: #1a365d;
    margin: 0;
  }

  .brand-subtitle {
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    color: #64748b;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 1px;
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.25rem;
    margin-bottom: 0.875rem;
    height: 55px;

    .brand-title {
      font-size: 1rem;
    }
  }

  img {
    max-height: 32px;
    max-width: ${props => props.$isCompact ? '32px' : '85px'};
    height: auto;
    width: auto;
    object-fit: contain;
    transition: all 0.2s;
  }
`

const CompactButton = styled.button<{ $isCompact: boolean }>`
  background: ${props => props.$isCompact ? '#f8fafc' : 'transparent'};
  border: 1px solid ${colors.border.light};
  color: ${props => props.$isCompact ? colors.primary : '#64748b'};
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  transition: all 0.18s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e0;
    color: ${colors.primary};
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 107, 87, 0.1);
  }

  &:active {
    background: #f1f5f9;
  }

  svg {
    width: 18px;
    height: 18px;
    transform: ${props => props.$isCompact ? 'rotate(180deg)' : 'rotate(0)'};
    transition: transform 0.18s ease;
    stroke-width: 2;
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
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 768px) {
    opacity: ${props => props.$isOpen ? '1' : '0'};
    pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
    top: 0;
    display: ${props => props.$isOpen ? 'block' : 'none'};
  }
`

const MainContent = styled.div<{ $sidebarOpen: boolean; $isCompact: boolean }>`
  flex: 1;
  padding: 2rem;
  margin-left: ${props => props.$sidebarOpen ? (props.$isCompact ? '80px' : '280px') : '0'};
  transition: margin-left 0.3s ease;
  width: calc(100% - ${props => props.$sidebarOpen ? (props.$isCompact ? '80px' : '280px') : '0'});
  position: relative;
  z-index: 1;
  overflow-x: hidden;
  max-width: 100vw;

  @media (max-width: 1024px) {
    margin-left: ${props => props.$sidebarOpen ? (props.$isCompact ? '80px' : '240px') : '0'};
    width: calc(100% - ${props => props.$sidebarOpen ? (props.$isCompact ? '80px' : '240px') : '0'});
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100vw;
    padding: 1rem;
    padding-top: 4.5rem;
    max-width: 100vw;
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen')
    return saved ? JSON.parse(saved) : window.innerWidth > 768
  })
  
  const [isCompact, setIsCompact] = useState(() => {
    const saved = localStorage.getItem('sidebarCompact')
    return saved ? JSON.parse(saved) : false
  })
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  // Persistir estados en localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen))
  }, [isSidebarOpen])

  useEffect(() => {
    localStorage.setItem('sidebarCompact', JSON.stringify(isCompact))
  }, [isCompact])

  const handleResize = useCallback(() => {
    const mobile = window.innerWidth <= 768
    setIsMobile(mobile)
    if (!mobile && !isSidebarOpen) {
      setIsSidebarOpen(true)
    }
  }, [isSidebarOpen])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev: boolean) => !prev)
  }, [])

  const handleNavClick = useCallback((path: string) => {
    if (path === '/logout') {
      logout()
      navigate('/login')
      return
    }

    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false)
    }
    navigate(path)
  }, [logout, navigate])

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSidebarOpen(false)
  }, [])

  const isActive = useCallback((path: string) => {
    return location.pathname === path
  }, [location.pathname])

  // Bloquear scroll del body cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isSidebarOpen]);

  return (
    <LayoutContainer>
      {isMobile && (
        <MenuButton 
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </MenuButton>
      )}

      <Overlay 
        $isOpen={isSidebarOpen}
        onClick={handleOverlayClick}
        aria-hidden={!isSidebarOpen}
      />

      <Sidebar
        $isOpen={isSidebarOpen}
        $isCompact={isCompact}
        role="navigation"
        aria-label="Menú principal"
      >
        <SidebarHeader $isMobile={isMobile}>
          <div className="logo-container">
            <img src="/images/LogoEmpacadora.jpg" alt="Empacadora del Valle de San Francisco" style={{ maxHeight: 38, maxWidth: isCompact ? 38 : 95 }} />
            {!isCompact && (
              <div className="brand-name">
                <h1 className="brand-title" style={{ fontSize: '1.1rem', color: '#1a365d', fontWeight: 600, margin: 0 }}>Empacadora</h1>
                <span className="brand-subtitle" style={{ fontSize: '0.7rem', color: '#1a365d', fontWeight: 400, marginTop: 2 }}>Valle de San Francisco</span>
              </div>
            )}
          </div>
          {isMobile && (
            <button
              className="close-btn"
              aria-label="Cerrar menú"
              onClick={toggleSidebar}
            >
              <X size={24} />
            </button>
          )}
          {!isMobile && (
            <Tooltip content={isCompact ? "Expandir menú" : "Compactar menú"}>
              <CompactButton
                $isCompact={isCompact}
                onClick={() => setIsCompact(!isCompact)}
                aria-label={isCompact ? "Expandir menú" : "Compactar menú"}
              >
                <ChevronLeft />
              </CompactButton>
            </Tooltip>
          )}
        </SidebarHeader>

        <NavSection $isCompact={isCompact} style={{ marginTop: '1.5rem' }}>
          <h3>Menú Principal</h3>
          <Tooltip content="Productos" disabled={!isCompact}>
            <NavItem
              $isCompact={isCompact}
              $active={isActive('/productos')}
              onClick={() => handleNavClick('/productos')}
              aria-current={isActive('/productos') ? 'page' : undefined}
            >
              <Package /> <span>Productos</span>
            </NavItem>
          </Tooltip>
          <Tooltip content="Órdenes de Entrada" disabled={!isCompact}>
            <NavItem
              $isCompact={isCompact}
              $active={isActive('/ordenes-entrada')}
              onClick={() => handleNavClick('/ordenes-entrada')}
              aria-current={isActive('/ordenes-entrada') ? 'page' : undefined}
            >
              <ClipboardList /> <span>Órdenes de Entrada</span>
            </NavItem>
          </Tooltip>
          <Tooltip content="Usuarios" disabled={!isCompact}>
            <NavItem
              $isCompact={isCompact}
              $active={isActive('/users')}
              onClick={() => handleNavClick('/users')}
              aria-current={isActive('/users') ? 'page' : undefined}
            >
              <Users /> <span>Usuarios</span>
            </NavItem>
          </Tooltip>
        </NavSection>

        <div style={{ flex: 1 }} />

        <UserProfileSection $isCompact={isCompact}>
          <div className="user-info">
            <h4>{user?.name || 'Usuario'}</h4>
            <p>{user?.roleName || 'Sin rol asignado'}</p>
          </div>
          <Tooltip content="Cerrar sesión" disabled={!isCompact}>
            <UserButton
              $isCompact={isCompact}
              onClick={() => handleNavClick('/logout')}
              aria-label="Cerrar sesión"
            >
              <LogOut /> <span>Cerrar sesión</span>
            </UserButton>
          </Tooltip>
        </UserProfileSection>
      </Sidebar>

      <MainContent $sidebarOpen={isSidebarOpen} $isCompact={isCompact}>
        {children}
      </MainContent>
    </LayoutContainer>
  )
} 