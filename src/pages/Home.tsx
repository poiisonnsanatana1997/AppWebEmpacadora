import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home as HomeIcon, 
  Package, 
  Users, 
  ShoppingCart, 
  Warehouse,
  Plus,
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight,
  Calendar,
  BarChart3,
  Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: clamp(1rem, 4vw, 2rem);
  max-width: 1400px;
  margin: 0 auto;
  background: #F8FAFC;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  border-radius: clamp(0.75rem, 2vw, 1rem);
  margin-bottom: clamp(1.5rem, 4vw, 2rem);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem;
    margin-bottom: 1rem;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const WelcomeText = styled.p`
  font-size: clamp(1rem, 3vw, 1.125rem);
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
`;

const DateTimeText = styled.p`
  font-size: clamp(0.75rem, 2.5vw, 0.875rem);
  opacity: 0.8;
  margin: 0;
  display: flex;
  align-items: center;
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1rem, 3vw, 1.5rem);
  margin-bottom: clamp(1.5rem, 4vw, 2rem);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const MetricCard = styled(Card)`
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 480px) {
    &:hover {
      transform: none;
    }
  }
`;

const QuickActionsSection = styled.div`
  background: white;
  border-radius: clamp(0.75rem, 2vw, 1rem);
  padding: clamp(1.5rem, 4vw, 2rem);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: clamp(1.5rem, 4vw, 2rem);
  border: 1px solid #E2E8F0;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(0.75rem, 2vw, 1rem);
  margin-top: clamp(1rem, 3vw, 1.5rem);
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
`;

const ActionButton = styled(Button)`
  height: auto;
  padding: clamp(1rem, 3vw, 1.5rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.875rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.8rem;
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
  }
`;

const RecentActivitySection = styled.div`
  background: white;
  border-radius: clamp(0.75rem, 2vw, 1rem);
  padding: clamp(1.5rem, 4vw, 2rem);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #E2E8F0;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(0.75rem, 2vw, 1rem) 0;
  border-bottom: 1px solid #F1F5F9;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 0;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem 0;
  }
`;

const ActivityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1rem);
  flex: 1;
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ActivityIcon = styled.div<{ $color: string }>`
  width: clamp(32px, 8vw, 40px);
  height: clamp(32px, 8vw, 40px);
  border-radius: 50%;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

const ActivityDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityTitle = styled.h4`
  font-size: clamp(0.8rem, 2.5vw, 0.875rem);
  font-weight: 600;
  color: #1E293B;
  margin: 0 0 0.25rem 0;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ActivityDescription = styled.p`
  font-size: clamp(0.7rem, 2vw, 0.75rem);
  color: #64748B;
  margin: 0;
  line-height: 1.4;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const ActivityTime = styled.span`
  font-size: clamp(0.7rem, 2vw, 0.75rem);
  color: #94A3B8;
  white-space: nowrap;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    align-self: flex-end;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  
  h2 {
    font-size: clamp(1.125rem, 3vw, 1.25rem);
    font-weight: 600;
    color: #1E293B;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
  }
`;

const SectionHeaderWithAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ViewAllButton = styled(Button)`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  
  @media (max-width: 480px) {
    align-self: flex-end;
  }
`;

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Actualizar fecha y hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Datos de ejemplo - en una implementación real vendrían de la API
  const metrics = {
    ordenesEntrada: { total: 156, pendientes: 12 },
    productos: { total: 89, activos: 76 },
    clientes: { total: 45, activos: 42 },
    inventario: { total: 1250, alertas: 3 }
  };

  const recentActivity = [
    {
      id: 1,
      type: 'orden',
      title: 'Nueva Orden de Entrada',
      description: 'Orden #OE-2024-001 recibida de Proveedor ABC',
      time: 'Hace 2 horas',
      icon: <Package size={20} />,
      color: '#3B82F6'
    },
    {
      id: 2,
      type: 'pedido',
      title: 'Pedido de Cliente',
      description: 'Pedido #PC-2024-045 procesado para Cliente XYZ',
      time: 'Hace 4 horas',
      icon: <ShoppingCart size={20} />,
      color: '#10B981'
    },
    {
      id: 3,
      type: 'inventario',
      title: 'Actualización de Inventario',
      description: 'Stock actualizado para Producto DEF',
      time: 'Hace 6 horas',
      icon: <Warehouse size={20} />,
      color: '#F59E0B'
    },
    {
      id: 4,
      type: 'alerta',
      title: 'Alerta de Stock Bajo',
      description: 'Producto GHI requiere reabastecimiento',
      time: 'Hace 8 horas',
      icon: <AlertCircle size={20} />,
      color: '#EF4444'
    }
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'orden-entrada':
        navigate('/ordenes-entrada');
        break;
      case 'pedido-cliente':
        navigate('/pedidos-cliente/crear');
        break;
      case 'inventario':
        navigate('/inventario');
        break;
      case 'productos':
        navigate('/productos');
        break;
      default:
        break;
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <HomeContainer>
      {/* Sección de Bienvenida */}
      <WelcomeSection>
        <WelcomeTitle>
          <HomeIcon size={28} />
          ¡Bienvenido, {user?.name || 'Usuario'}!
        </WelcomeTitle>
        <WelcomeText>
          Tu plataforma integral para la gestión de la empacadora está lista para ayudarte 
          a optimizar todas tus operaciones de manera eficiente.
        </WelcomeText>
        <DateTimeText>
          <Calendar size={14} style={{ marginRight: '0.5rem' }} />
          {formatDateTime(currentDateTime)}
        </DateTimeText>
      </WelcomeSection>

      {/* Métricas Principales */}
      <MetricsGrid>
        <MetricCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes de Entrada</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.ordenesEntrada.total}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="mr-2">
                {metrics.ordenesEntrada.pendientes} pendientes
              </Badge>
            </p>
          </CardContent>
        </MetricCard>

        <MetricCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.productos.total}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="mr-2">
                {metrics.productos.activos} activos
              </Badge>
            </p>
          </CardContent>
        </MetricCard>

        <MetricCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.clientes.total}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="mr-2">
                {metrics.clientes.activos} activos
              </Badge>
            </p>
          </CardContent>
        </MetricCard>

        <MetricCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventario</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.inventario.total}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="destructive" className="mr-2">
                {metrics.inventario.alertas} alertas
              </Badge>
            </p>
          </CardContent>
        </MetricCard>
      </MetricsGrid>

      {/* Acciones Rápidas */}
      <QuickActionsSection>
        <SectionHeader>
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2>Acciones Rápidas</h2>
        </SectionHeader>
        <ActionsGrid>
          <ActionButton 
            onClick={() => handleQuickAction('orden-entrada')}
            variant="outline"
          >
            <Plus className="h-6 w-6" />
            <span>Nueva Orden de Entrada</span>
          </ActionButton>
          
          <ActionButton 
            onClick={() => handleQuickAction('pedido-cliente')}
            variant="outline"
          >
            <ShoppingCart className="h-6 w-6" />
            <span>Crear Pedido Cliente</span>
          </ActionButton>
          
          <ActionButton 
            onClick={() => handleQuickAction('inventario')}
            variant="outline"
          >
            <Warehouse className="h-6 w-6" />
            <span>Ver Inventario</span>
          </ActionButton>
          
          <ActionButton 
            onClick={() => handleQuickAction('productos')}
            variant="outline"
          >
            <Package className="h-6 w-6" />
            <span>Gestionar Productos</span>
          </ActionButton>
        </ActionsGrid>
      </QuickActionsSection>

      {/* Actividad Reciente */}
      <RecentActivitySection>
        <SectionHeaderWithAction>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <h2>Actividad Reciente</h2>
          </div>
          <ViewAllButton variant="ghost" size="sm" className="text-blue-600">
            Ver todo <ArrowRight className="h-4 w-4 ml-1" />
          </ViewAllButton>
        </SectionHeaderWithAction>
        
        <div>
          {recentActivity.map((activity) => (
            <ActivityItem key={activity.id}>
              <ActivityInfo>
                <ActivityIcon $color={activity.color}>
                  {activity.icon}
                </ActivityIcon>
                <ActivityDetails>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                  <ActivityDescription>{activity.description}</ActivityDescription>
                </ActivityDetails>
              </ActivityInfo>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityItem>
          ))}
        </div>
      </RecentActivitySection>
    </HomeContainer>
  );
}