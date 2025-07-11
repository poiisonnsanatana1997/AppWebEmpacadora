import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  DollarSign,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import styled from 'styled-components';
import { EstadisticasPrecios } from '../../hooks/Clasificacion/useEditarPreciosClasificacion';

interface PanelAnalisisPreciosProps {
  estadisticas: EstadisticasPrecios;
  preciosActuales: {
    xl: number;
    l: number;
    m: number;
    s: number;
    retornos: number;
  };
  preciosOriginales: {
    xl: number;
    l: number;
    m: number;
    s: number;
    retornos: number;
  };
  onAplicarRecomendacion?: (tipo: string, valor: number) => void;
}

const MetricCard = styled.div<{ variant?: 'success' | 'warning' | 'danger' | 'info' }>`
  background: ${props => {
    switch (props.variant) {
      case 'success': return 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)';
      case 'warning': return 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
      case 'danger': return 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
      case 'info': return 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)';
      default: return '#f8fafc';
    }
  }};
  border: 2px solid ${props => {
    switch (props.variant) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#e2e8f0';
    }
  }};
  border-radius: 0.75rem;
  padding: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const ProgressBar = styled.div<{ progress: number; color: string }>`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => Math.min(props.progress, 100)}%;
    background: ${props => props.color};
    transition: width 0.3s ease;
  }
`;

const BarChart = styled.div`
  display: flex;
  align-items: end;
  gap: 0.5rem;
  height: 120px;
  margin-top: 1rem;
`;

const Bar = styled.div<{ height: number; color: string; isActive?: boolean }>`
  flex: 1;
  background: ${props => props.color};
  height: ${props => props.height}%;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
  opacity: ${props => props.isActive ? 1 : 0.6};
  
  &:hover {
    opacity: 1;
    transform: scaleY(1.05);
  }
  
  &::after {
    content: '${props => props.height.toFixed(0)}%';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
  }
`;

export const PanelAnalisisPrecios: React.FC<PanelAnalisisPreciosProps> = ({
  estadisticas,
  preciosActuales,
  preciosOriginales,
  onAplicarRecomendacion
}) => {
  // Calcular diferencias porcentuales
  const calcularDiferencias = () => {
    const tipos = ['xl', 'l', 'm', 's', 'retornos'] as const;
    return tipos.map(tipo => {
      const actual = preciosActuales[tipo];
      const original = preciosOriginales[tipo];
      const diferencia = actual - original;
      const porcentaje = original > 0 ? (diferencia / original) * 100 : 0;
      
      return {
        tipo: tipo.toUpperCase(),
        actual,
        original,
        diferencia,
        porcentaje,
        esIncremento: diferencia > 0,
        esDecremento: diferencia < 0,
      };
    });
  };

  // Calcular recomendaciones
  const calcularRecomendaciones = () => {
    const recomendaciones = [];
    
    // Verificar si hay mucha variación entre precios
    if (estadisticas.desviacionEstandar > estadisticas.promedio * 0.3) {
      recomendaciones.push({
        tipo: 'warning',
        titulo: 'Alta variación de precios',
        descripcion: 'Los precios tienen mucha variación. Considera ajustar para mantener consistencia.',
        icono: AlertTriangle,
      });
    }
    
    // Verificar si hay precios muy bajos
    if (estadisticas.minimo < estadisticas.promedio * 0.5) {
      recomendaciones.push({
        tipo: 'danger',
        titulo: 'Precios muy bajos detectados',
        descripcion: 'Algunos precios están muy por debajo del promedio. Revisa si es correcto.',
        icono: TrendingDown,
      });
    }
    
    // Verificar si hay precios muy altos
    if (estadisticas.maximo > estadisticas.promedio * 2) {
      recomendaciones.push({
        tipo: 'warning',
        titulo: 'Precios muy altos detectados',
        descripcion: 'Algunos precios están muy por encima del promedio. Verifica si es necesario.',
        icono: TrendingUp,
      });
    }
    
    // Si no hay problemas, mostrar mensaje positivo
    if (recomendaciones.length === 0) {
      recomendaciones.push({
        tipo: 'success',
        titulo: 'Precios bien distribuidos',
        descripcion: 'Los precios están bien distribuidos y son consistentes.',
        icono: CheckCircle,
      });
    }
    
    return recomendaciones;
  };

  // Calcular distribución porcentual para el gráfico de barras
  const calcularDistribucion = () => {
    const total = Object.values(preciosActuales).reduce((a, b) => a + b, 0);
    return Object.entries(preciosActuales).map(([tipo, valor]) => ({
      tipo: tipo.toUpperCase(),
      valor,
      porcentaje: total > 0 ? (valor / total) * 100 : 0,
      color: {
        xl: '#8b5cf6',
        l: '#10b981',
        m: '#f59e0b',
        s: '#ef4444',
        retornos: '#f97316',
      }[tipo as keyof typeof preciosActuales] || '#6b7280',
    }));
  };

  const diferencias = calcularDiferencias();
  const recomendaciones = calcularRecomendaciones();
  const distribucion = calcularDistribucion();

  const getIconForChange = (porcentaje: number) => {
    if (porcentaje > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (porcentaje < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getColorForChange = (porcentaje: number) => {
    if (porcentaje > 0) return 'text-green-600';
    if (porcentaje < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard variant="info">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio</p>
              <p className="text-2xl font-bold text-blue-600">${estadisticas.promedio.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </MetricCard>

        <MetricCard variant="success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Máximo</p>
              <p className="text-2xl font-bold text-green-600">${estadisticas.maximo.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </MetricCard>

        <MetricCard variant="warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mínimo</p>
              <p className="text-2xl font-bold text-yellow-600">${estadisticas.minimo.toFixed(2)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-600" />
          </div>
        </MetricCard>

        <MetricCard variant="danger">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rango</p>
              <p className="text-2xl font-bold text-red-600">${estadisticas.rango.toFixed(2)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-red-600" />
          </div>
        </MetricCard>
      </div>

      {/* Gráfico de distribución */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribución de Precios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart>
            {distribucion.map((item, index) => (
              <Bar
                key={item.tipo}
                height={item.porcentaje}
                color={item.color}
                isActive={true}
              />
            ))}
          </BarChart>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {distribucion.map(item => (
              <span key={item.tipo} className="text-center flex-1">
                {item.tipo}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis de cambios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Análisis de Cambios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {diferencias.map((diferencia) => (
              <div key={diferencia.tipo} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="font-medium">
                    {diferencia.tipo}
                  </Badge>
                  {getIconForChange(diferencia.porcentaje)}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      ${diferencia.original.toFixed(2)}
                    </span>
                    <span className={`font-bold ${getColorForChange(diferencia.porcentaje)}`}>
                      ${diferencia.actual.toFixed(2)}
                    </span>
                  </div>
                  <div className={`text-sm font-medium ${getColorForChange(diferencia.porcentaje)}`}>
                    {diferencia.porcentaje > 0 ? '+' : ''}{diferencia.porcentaje.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recomendaciones.map((recomendacion, index) => {
              const IconComponent = recomendacion.icono;
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                    recomendacion.tipo === 'success' ? 'border-green-200 bg-green-50' :
                    recomendacion.tipo === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    recomendacion.tipo === 'danger' ? 'border-red-200 bg-red-50' :
                    'border-blue-200 bg-blue-50'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 mt-0.5 ${
                    recomendacion.tipo === 'success' ? 'text-green-600' :
                    recomendacion.tipo === 'warning' ? 'text-yellow-600' :
                    recomendacion.tipo === 'danger' ? 'text-red-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {recomendacion.titulo}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {recomendacion.descripcion}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas adicionales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estadísticas Detalladas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {estadisticas.desviacionEstandar.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Desv. Estándar</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${estadisticas.total.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {diferencias.filter(d => d.esIncremento).length}
              </div>
              <div className="text-sm text-gray-500">Incrementos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {diferencias.filter(d => d.esDecremento).length}
              </div>
              <div className="text-sm text-gray-500">Decrementos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 