import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Menu, X, ChevronLeft, LogOut, Package, ClipboardList } from "lucide-react";
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
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
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
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
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
      ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" 
      : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
  };
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  z-index: 1200;
  display: flex;
  flex-direction: column;
  box-shadow: ${({ $isMobile }) => 
    $isMobile 
      ? "0 4px 20px rgba(0, 0, 0, 0.15)" 
      : "0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
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
    $isMobile ? "1.25rem 1rem" : ($compact ? "1.25rem 0.75rem" : "1.5rem 1.5rem")
  };
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  min-height: 72px;
  background: ${({ $isMobile }) => 
    $isMobile 
      ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" 
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)"
  };
  position: relative;
  
  /* Solo aplicar backdrop-filter en desktop */
  ${({ $isMobile }) => !$isMobile && `
    backdrop-filter: blur(10px);
  `}
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(226, 232, 240, 0.8) 50%, transparent 100%);
  }
`;

const LogoBox = styled.div<{ $compact: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ $compact }) => ($compact ? "0.75rem" : "1.25rem")};
  
  img {
    height: 42px;
    width: auto;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: ${({ $compact }) => ($compact ? "42px" : "90px")};
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  
  .brand-title {
    font-weight: 700;
    font-size: 1.2rem;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.025em;
  }
  
  .brand-subtitle {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.75px;
    margin-top: 2px;
  }
`;

const CompactBtn = styled(Button)<{ $compact: boolean }>`
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 8px;
  background: ${({ $compact }) => 
    $compact 
      ? "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" 
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)"
  };
  color: ${({ $compact }) => ($compact ? "#1e293b" : "#64748b")};
  border: 1px solid rgba(226, 232, 240, 0.8);
  margin-left: 0.75rem;
  backdrop-filter: blur(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    color: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  padding: 1.75rem 0.75rem 0 0.75rem;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuItem = styled.li<{ $active: boolean; $compact: boolean; $isMobile: boolean }>`
  button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${({ $compact, $isMobile }) => ($compact && !$isMobile ? "0" : "0.875rem")};
    justify-content: ${({ $compact, $isMobile }) => ($compact && !$isMobile ? "center" : "flex-start")};
    padding: ${({ $compact, $isMobile }) => 
      $isMobile ? "0.875rem 1rem" : ($compact ? "0.875rem 0.5rem" : "0.875rem 1rem")
    };
    background: ${({ $active, $isMobile }) => 
      $active 
        ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)" 
        : $isMobile 
          ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" 
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(248, 250, 252, 0.6) 100%)"
    };
    color: ${({ $active }) => ($active ? "#1e40af" : "#475569")};
    border: 1px solid ${({ $active }) => 
      $active ? "rgba(59, 130, 246, 0.2)" : "rgba(226, 232, 240, 0.6)"
    };
    border-radius: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
    position: relative;
    overflow: hidden;
    
    /* Solo aplicar backdrop-filter en desktop */
    ${({ $isMobile }) => !$isMobile && `
      backdrop-filter: blur(10px);
    `}
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      transition: left 0.5s;
    }
    
    &:hover {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #1e40af;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      border-color: rgba(59, 130, 246, 0.3);
      
      &::before {
        left: 100%;
      }
    }
    
    &:active {
      transform: translateY(0);
    }
    
    span {
      display: ${({ $compact, $isMobile }) => ($compact && !$isMobile ? "none" : "inline")};
      transition: opacity 0.2s;
      font-weight: 600;
    }
    
    svg {
      transition: all 0.2s;
      ${({ $active }) => $active && `
        transform: scale(1.1);
        filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
      `}
    }
  }
`;

const UserSection = styled.div<{ $compact: boolean; $isMobile: boolean }>`
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  padding: ${({ $compact, $isMobile }) => 
    $isMobile ? "1rem 1rem" : ($compact ? "0.75rem 0.5rem" : "1.25rem 1rem")
  };
  background: ${({ $isMobile }) => 
    $isMobile 
      ? "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)" 
      : "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)"
  };
  position: relative;
  
  /* Solo aplicar backdrop-filter en desktop */
  ${({ $isMobile }) => !$isMobile && `
    backdrop-filter: blur(10px);
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(226, 232, 240, 0.8) 50%, transparent 100%);
  }
  
  .user-info {
    display: ${({ $compact, $isMobile }) => ($compact && !$isMobile ? "none" : "block")};
    margin-bottom: 0.75rem;
    
    h4 {
      font-size: 1rem;
      font-weight: 700;
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
      letter-spacing: -0.025em;
    }
    
    p {
      font-size: 0.85rem;
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
  top: 1.25rem;
  left: 1.25rem;
  z-index: 1400;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    display: flex;
  }
`;

const LogoutButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  font-weight: 600;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    color: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
  }
  
  svg {
    transition: transform 0.2s;
  }
  
  &:hover svg {
    transform: translateX(-2px);
  }
`;

const navItems = [
  { label: "Productos", icon: <Package />, path: "/productos" },
  { label: "Órdenes de Entrada", icon: <ClipboardList />, path: "/ordenes-entrada" },
  { label: "Usuarios", icon: <Users className="h-5 w-5" />, path: "/usuarios" },
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
    navigate("/login");
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
              <LogoBox $compact={isCompact && !isMobile}>
                <img src={logo} alt="Empacadora del Valle de San Francisco" />
                {!(isCompact && !isMobile) && (
                  <Brand>
                    <span className="brand-title">Empacadora</span>
                    <span className="brand-subtitle">Valle de San Francisco</span>
                  </Brand>
                )}
              </LogoBox>
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