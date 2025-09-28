import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Menu, 
  X, 
  ChevronLeft, 
  LogOut, 
  Package, 
  ClipboardList, 
  Truck, 
  ShoppingCart, 
  Warehouse, 
  Building2,
  UserCheck,
  FileText,
  Box,
  BarChart3,
  Store,
  ShoppingBag,
  Settings,
  Home as HomeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import logo from '/images/LogoEmpacadora.jpg';

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COMPACT = 80;
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 25% 75%, rgba(71, 85, 105, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 75% 25%, rgba(100, 116, 139, 0.02) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
`;

const Sidebar = styled(motion.aside)<{ $compact: boolean; $isMobile: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${({ $compact, $isMobile }) => 
    $isMobile ? SIDEBAR_WIDTH : ($compact ? SIDEBAR_COMPACT : SIDEBAR_WIDTH)
  }px;
  background: ${({ $isMobile }) => 
    $isMobile 
      ? "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)" 
      : "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)"
  };
  border-right: 1px solid rgba(226, 232, 240, 0.6);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ $isMobile }) => 
    $isMobile 
      ? "0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)" 
      : "0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)"
  };
  
  /* Optimizaciones para móvil */
  ${({ $isMobile }) => $isMobile && `
    will-change: transform;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  `}
  
  /* Remover transiciones CSS para evitar conflictos con Framer Motion */
  ${({ $isMobile }) => !$isMobile && `
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  `}
  
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    width: 100%;
    max-width: ${SIDEBAR_WIDTH}px;
    position: fixed;
    z-index: 1300;
    /* Remover backdrop-filter en móvil para mejor rendimiento */
    backdrop-filter: none;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1100;
  @media (min-width: ${MOBILE_BREAKPOINT + 1}px) {
    display: none;
  }
`;

const Main = styled.main<{ $sidebar: boolean; $compact: boolean }>`
  flex: 1;
  min-width: 0;
  width: 100%;
  margin-left: ${({ $sidebar, $compact }) =>
    $sidebar ? ($compact ? SIDEBAR_COMPACT : SIDEBAR_WIDTH) : 0}px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 2rem 1.5rem 1rem 1.5rem;
  position: relative;
  
  @media (max-width: ${TABLET_BREAKPOINT}px) {
    padding: 1.5rem 1rem 1rem 1rem;
  }
  
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    margin-left: 0;
    padding-top: 5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    width: 100%;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.75rem 0.75rem 0.75rem;
    padding-top: 4.5rem;
  }
`;

const SidebarHeader = styled.div<{ $compact: boolean; $isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $compact, $isMobile }) => 
    $isMobile ? "1.5rem 1.25rem" : ($compact ? "1.5rem 1rem" : "1.75rem 1.75rem")
  };
  border-bottom: 1px solid rgba(226, 232, 240, 0.4);
  min-height: 76px;
  background: ${({ $isMobile }) => 
    $isMobile 
      ? "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)" 
      : "linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)"
  };
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(226, 232, 240, 0.4) 50%, transparent 100%);
  }
`;

const LogoBox = styled.div<{ $compact: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $compact }) => ($compact ? "0.75rem" : "1.5rem")};
  
  img {
    height: 44px;
    width: auto;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: ${({ $compact }) => ($compact ? "44px" : "95px")};
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  
  .brand-title {
    font-weight: 600;
    font-size: 1.25rem;
    color: #1e293b;
    letter-spacing: -0.02em;
  }
  
  .brand-subtitle {
    font-size: 0.7rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 2px;
  }
`;

const CompactBtn = styled(Button)<{ $compact: boolean }>`
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
  background: ${({ $compact }) => 
    $compact 
      ? "#f1f5f9" 
      : "#ffffff"
  };
  color: ${({ $compact }) => ($compact ? "#475569" : "#64748b")};
  border: 1px solid rgba(226, 232, 240, 0.6);
  margin-left: 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: #f8fafc;
    color: #475569;
    border-color: rgba(226, 232, 240, 0.8);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  
  svg {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${({ $compact }) => ($compact ? "rotate(180deg)" : "none")};
  }
  
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: none;
  }
`;

const MenuList = styled.ul<{ $compact: boolean }>`
  list-style: none;
  padding: 1.5rem 1rem 0 1rem;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const MenuItem = styled.li<{ $active: boolean; $compact: boolean; $isMobile: boolean }>`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${({ $compact, $isMobile }) => ($compact && !$isMobile ? "0" : "0.875rem")};
    justify-content: ${({ $compact, $isMobile }) => ($compact && !$isMobile ? "center" : "flex-start")};
    padding: ${({ $compact, $isMobile }) => 
      $isMobile ? "0.75rem 1rem" : ($compact ? "0.75rem 0.5rem" : "0.75rem 1rem")
    };
    background: ${({ $active, $isMobile }) => 
      $active 
        ? "#f1f5f9" 
        : $isMobile 
          ? "#ffffff" 
          : "transparent"
    };
    color: ${({ $active }) => ($active ? "#1e293b" : "#64748b")};
    border: 1px solid ${({ $active }) => 
      $active ? "rgba(226, 232, 240, 0.8)" : "transparent"
    };
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
    position: relative;
    
    &:hover {
      background: #f8fafc;
      color: #475569;
      border-color: rgba(226, 232, 240, 0.6);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    }
    
    &:active {
      background: #f1f5f9;
    }
    
    span {
      display: ${({ $compact, $isMobile }) => ($compact && !$isMobile ? "none" : "inline")};
      transition: opacity 0.2s;
      font-weight: 500;
    }
    
    svg {
      transition: all 0.2s;
      ${({ $active }) => $active && `
        color: #1e293b;
      `}
    }
  }
`;

const UserSection = styled.div<{ $compact: boolean; $isMobile: boolean }>`
  border-top: 1px solid rgba(226, 232, 240, 0.4);
  padding: ${({ $compact, $isMobile }) => 
    $isMobile ? "1.25rem 1.25rem" : ($compact ? "1rem 0.75rem" : "1.5rem 1.25rem")
  };
  background: ${({ $isMobile }) => 
    $isMobile 
      ? "#ffffff" 
      : "#ffffff"
  };
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(226, 232, 240, 0.4) 50%, transparent 100%);
  }
  
  .user-info {
    display: ${({ $compact, $isMobile }) => ($compact && !$isMobile ? "none" : "block")};
    margin-bottom: 1rem;
    
    h4 {
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
      letter-spacing: -0.01em;
    }
    
    p {
      font-size: 0.8rem;
      color: #64748b;
      margin: 0;
      font-weight: 500;
      margin-top: 2px;
    }
  }
`;

const MobileMenuBtn = styled(Button)`
  display: none;
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 1400;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.03);
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: #f8fafc;
    border-color: rgba(226, 232, 240, 0.8);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
  }
  
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: flex;
  }
`;

const LogoutButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  background: #ffffff;
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #dc2626;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0.75rem;
  
  &:hover {
    background: #fef2f2;
    color: #b91c1c;
    border-color: rgba(239, 68, 68, 0.25);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.08);
  }
  
  svg {
    transition: transform 0.2s;
  }
  
  &:hover svg {
    transform: translateX(-2px);
  }
`;

const navItems = [
  { label: "Inicio", icon: <HomeIcon className="h-5 w-5" />, path: "/home" },
  { label: "Proveedores", icon: <Truck className="h-5 w-5" />, path: "/proveedores" },
  { label: "Órdenes de Entrada", icon: <FileText className="h-5 w-5" />, path: "/ordenes-entrada" },
  { label: "Productos", icon: <Box className="h-5 w-5" />, path: "/productos" },
  { label: "Inventario", icon: <BarChart3 className="h-5 w-5" />, path: "/inventario" },
  { label: "Clientes", icon: <Store className="h-5 w-5" />, path: "/clientes" },
  { label: "Pedidos Cliente", icon: <ShoppingBag className="h-5 w-5" />, path: "/pedidos-cliente" },
  { label: "Usuarios", icon: <UserCheck className="h-5 w-5" />, path: "/usuarios" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Responsividad
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Bloquear scroll en móvil cuando sidebar abierto
  useEffect(() => {
    if (isMobile && isSidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, isSidebarOpen]);

  // Navegación
  const handleNav = useCallback((path: string) => {
    if (isMobile) setIsSidebarOpen(false);
    navigate(path);
  }, [isMobile, navigate]);

  // Logout
  const handleLogout = useCallback(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

  // Animaciones sidebar optimizadas para móvil
  const sidebarVariants = {
    open: { 
      x: 0, 
      opacity: 1, 
      transition: { 
        type: "tween", 
        duration: isMobile ? 0.2 : 0.3,
        ease: "easeOut"
      } 
    },
    closed: { 
      x: "-100%", 
      opacity: 0, 
      transition: { 
        type: "tween", 
        duration: isMobile ? 0.15 : 0.3,
        ease: "easeIn"
      } 
    },
  };

  // Overlay optimizado para móvil
  const overlayVariants = {
    open: { 
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    closed: { 
      opacity: 0,
      transition: { duration: 0.15, ease: "easeIn" }
    },
  };

  return (
    <LayoutContainer>
      {/* Botón menú móvil */}
      <MobileMenuBtn
        variant="outline"
        size="icon"
        aria-label="Abrir menú"
        onClick={() => setIsSidebarOpen(true)}
        style={{ display: isMobile && !isSidebarOpen ? "flex" : "none" }}
      >
        <Menu size={24} />
      </MobileMenuBtn>

      {/* Overlay móvil */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <Overlay
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Cerrar menú"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <Sidebar
            $compact={isCompact && !isMobile}
            $isMobile={isMobile}
            variants={sidebarVariants}
            initial={isMobile ? "closed" : false}
            animate={isSidebarOpen ? "open" : "closed"}
            exit="closed"
            role="navigation"
            aria-label="Menú principal"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Escape" && isMobile) setIsSidebarOpen(false);
            }}
          >
            <SidebarHeader $compact={isCompact && !isMobile} $isMobile={isMobile}>
              <button
                onClick={() => handleNav('/home')}
                aria-label="Ir al inicio"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogoBox $compact={isCompact && !isMobile}>
                  <img src={logo} alt="Empacadora del Valle de San Francisco" />
                  {!(isCompact && !isMobile) && (
                    <Brand>
                      <span className="brand-title">Empacadora</span>
                      <span className="brand-subtitle">Valle de San Francisco</span>
                    </Brand>
                  )}
                </LogoBox>
              </button>
              {isMobile ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  aria-label="Cerrar menú" 
                  onClick={() => setIsSidebarOpen(false)}
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    borderRadius: "8px",
                    backdropFilter: "blur(10px)"
                  }}
                >
                  <X size={24} />
                </Button>
              ) : (
                <CompactBtn
                  $compact={isCompact}
                  variant="outline"
                  size="icon"
                  aria-label={isCompact ? "Expandir menú" : "Compactar menú"}
                  onClick={() => setIsCompact(c => !c)}
                >
                  <ChevronLeft size={20} />
                </CompactBtn>
              )}
            </SidebarHeader>

            <MenuList $compact={isCompact && !isMobile}>
              {navItems.map(item => (
                <MenuItem
                  key={item.path}
                  $active={location.pathname === item.path}
                  $compact={isCompact && !isMobile}
                  $isMobile={isMobile}
                >
                  <button
                    aria-label={item.label}
                    tabIndex={0}
                    onClick={() => handleNav(item.path)}
                    aria-current={location.pathname === item.path ? "page" : undefined}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </MenuItem>
              ))}
            </MenuList>

            <UserSection $compact={isCompact && !isMobile} $isMobile={isMobile}>
              <div className="user-info">
                <h4>{user?.name || "Usuario"}</h4>
                <p>{user?.roleName || "Sin rol asignado"}</p>
              </div>
              <LogoutButton
                variant="outline"
                size="sm"
                aria-label="Cerrar sesión"
                onClick={handleLogout}
                style={{ 
                  justifyContent: isCompact && !isMobile ? "center" : "flex-start",
                  marginTop: 4,
                  background: isMobile 
                    ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" 
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)",
                  backdropFilter: isMobile ? "none" : "blur(10px)"
                }}
              >
                <LogOut size={18} style={{ marginRight: isCompact && !isMobile ? 0 : 8 }} />
                {!(isCompact && !isMobile) && <span>Cerrar sesión</span>}
              </LogoutButton>
            </UserSection>
          </Sidebar>
        )}
      </AnimatePresence>

      {/* Contenido principal */}
      <Main $sidebar={isSidebarOpen && !isMobile} $compact={isCompact && !isMobile}>
        {children}
      </Main>
    </LayoutContainer>
  );
} 