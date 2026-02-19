import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Home as HomeIcon,
  Truck,
  FileText,
  Box,
  BarChart3,
  Store,
  ShoppingBag,
  UserCheck,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import logo from '/images/LogoEmpacadora.jpg';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Datos de navegación
const navigationItems = [
  { label: "Inicio", icon: HomeIcon, path: "/home" },
  { label: "Proveedores", icon: Truck, path: "/proveedores" },
  { label: "Órdenes de Entrada", icon: FileText, path: "/ordenes-entrada" },
  { label: "Productos", icon: Box, path: "/productos" },
  { label: "Inventario", icon: BarChart3, path: "/inventario" },
  { label: "Clientes", icon: Store, path: "/clientes" },
  { label: "Pedidos Cliente", icon: ShoppingBag, path: "/pedidos-cliente" },
  { label: "Usuarios", icon: UserCheck, path: "/usuarios" },
];

export function SidebarApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { state } = useSidebar();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="Empacadora del Valle de San Francisco" 
            className="h-8 w-8 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-semibold truncate">Empacadora</span>
            <span className="text-xs text-muted-foreground truncate">Valle de San Francisco</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.path)}
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`flex w-full items-center gap-2 rounded-lg text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${state === "expanded" ? "p-2" : "p-1 justify-center"}`}>
                  {state === "expanded" ? (
                    <>
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <span className="text-sm font-bold leading-none">
                          {user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.name || "Usuario"}</span>
                        <span className="truncate text-xs text-muted-foreground">{user?.roleName || "Sin rol"}</span>
                      </div>
                      <ChevronDown className="ml-auto size-4" />
                    </>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <span className="text-sm font-bold leading-none">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={state === "expanded" ? "top" : "right"}
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                sideOffset={4}
                align="end"
                avoidCollisions={true}
                collisionPadding={8}
                onCloseAutoFocus={(e) => {
                  console.log("Dropdown cerrado");
                  e.preventDefault();
                }}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <span className="text-sm font-bold leading-none">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name || "Usuario"}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.roleName || "Sin rol"}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log("Ir a perfil")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Ir a configuración")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
