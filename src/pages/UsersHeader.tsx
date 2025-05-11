import { motion } from 'framer-motion';
import { 
  Menu, 
  UserPlus, 
  Users, 
  Settings, 
  Bell, 
  Download, 
  Filter, 
  Search,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import styled from 'styled-components';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to right, #1E40AF, #3B82F6);
    opacity: 0.8;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 2.5rem;
  }

  @media (max-width: 640px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1.25rem;

  svg {
    color: #1E40AF;
    background: #F8FAFC;
    padding: 1.25rem;
    border-radius: 1rem;
    border: 1px solid #E2E8F0;
    width: 64px;
    height: 64px;
  }

  @media (min-width: 768px) {
    font-size: 1.75rem;

    svg {
      width: 72px;
      height: 72px;
      padding: 1.5rem;
    }
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
  max-width: 600px;
  line-height: 1.5;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  width: 100%;

  @media (min-width: 768px) {
    width: auto;
    gap: 0.75rem;
    flex-wrap: nowrap;
  }
`;

const QuickActions = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid #E2E8F0;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: #F1F5F9;
    color: #1E293B;
    border-color: #CBD5E1;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  &[data-badge]:after {
    content: attr(data-badge);
    position: absolute;
    top: -2px;
    right: -2px;
    background: #EF4444;
    color: white;
    font-size: 0.75rem;
    padding: 0.125rem 0.375rem;
    border-radius: 1rem;
    min-width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 640px) {
    padding: 0.375rem;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: flex;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  padding: 0.5rem;
  cursor: pointer;
  color: #64748B;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #F1F5F9;
    color: #1E293B;
    border-color: #CBD5E1;
  }

  @media (min-width: 768px) {
    display: none;
  }

  @media (max-width: 640px) {
    padding: 0.375rem;
  }
`;

interface UsersHeaderProps {
  onNewUser: () => void;
  onToggleMenu: () => void;
  showMobileMenu: boolean;
  onExport?: () => void;
  onFilter?: () => void;
  onSearch?: () => void;
  onHelp?: () => void;
  notificationCount?: number;
}

export function UsersHeader({ 
  onNewUser, 
  onToggleMenu, 
  showMobileMenu,
  onExport,
  onFilter,
  onSearch,
  onHelp,
  notificationCount = 0
}: UsersHeaderProps) {
  return (
    <Header>
      <HeaderContent>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HeaderTitle>
            <Users size={24} />
            Gestión de Usuarios
          </HeaderTitle>
          <HeaderSubtitle>
            Administra los usuarios del sistema, sus roles y permisos. Crea nuevos usuarios, modifica sus datos o gestiona su acceso.
          </HeaderSubtitle>
        </motion.div>
      </HeaderContent>
      <HeaderActions>
        <QuickActions>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionButton
                  onClick={onSearch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search />
                </ActionButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Búsqueda avanzada</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionButton
                  onClick={onFilter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter />
                </ActionButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filtros</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <ActionButton
                  onClick={onExport}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download />
                </ActionButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exportar datos</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </QuickActions>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <ActionButton
                data-badge={notificationCount > 0 ? notificationCount : undefined}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell />
              </ActionButton>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notificaciones</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <ActionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Settings />
                    <ChevronDown className="h-4 w-4" />
                  </ActionButton>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configuración</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración general</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              <span>Gestión de roles</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Ayuda y soporte</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <MobileMenuButton
          onClick={onToggleMenu}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: showMobileMenu ? 90 : 0 }}
        >
          <Menu />
        </MobileMenuButton>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onNewUser}
                className="w-full md:w-auto"
                size="default"
                variant="default"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Crear un nuevo usuario</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </HeaderActions>
    </Header>
  );
}
export default UsersHeader; 