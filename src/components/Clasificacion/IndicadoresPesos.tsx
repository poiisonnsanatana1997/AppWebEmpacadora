import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Scale, Target, TrendingUp } from 'lucide-react';

interface IndicadoresPesosProps {
  pesoXL: number;
  pesoL: number;
  pesoM: number;
  pesoS: number;
  pesoRetornos: number;
  pesoMermas: number;
  pesoTotalEsperado: number;
  showProgress?: boolean;
  title?: string;
  compact?: boolean;
}

export const IndicadoresPesos: React.FC<IndicadoresPesosProps> = ({
  pesoXL,
  pesoL,
  pesoM,
  pesoS,
  pesoRetornos,
  pesoMermas,
  pesoTotalEsperado,
  showProgress = true,
  title = "Indicadores de Pesos",
  compact = false
}) => {
  // Formateador de peso en kg
  const formatoKg = (valor: number) => `${valor.toFixed(2)} kg`;

  // Función para obtener colores del progreso según el porcentaje
  const getProgressColors = (progreso: number) => {
    if (progreso >= 95) {
      return {
        barColor: 'bg-green-500',
        textColor: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    } else if (progreso >= 80) {
      return {
        barColor: 'bg-blue-500',
        textColor: 'text-blue-600',
        bgColor: 'bg-blue-100'
      };
    } else if (progreso >= 60) {
      return {
        barColor: 'bg-yellow-500',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      };
    } else if (progreso >= 40) {
      return {
        barColor: 'bg-orange-500',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-100'
      };
    } else {
      return {
        barColor: 'bg-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-100'
      };
    }
  };

  // Peso total clasificado (SOLO tarimas por tipos, NO incluye retornos ni mermas)
  const pesoTotalClasificado = pesoXL + pesoL + pesoM + pesoS;

  // Peso total procesado (incluye tarimas + retornos + mermas)
  const pesoTotalProcesado = pesoTotalClasificado + pesoRetornos + pesoMermas;

  // Cálculo del progreso (incluye tarimas + retornos + mermas)
  const progreso = pesoTotalEsperado > 0 ? (pesoTotalProcesado / pesoTotalEsperado) * 100 : 0;

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-purple-600 font-bold text-lg">{formatoKg(pesoXL)}</div>
              <div className="text-xs text-gray-500 mt-1">🟣 XL</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-bold text-lg">{formatoKg(pesoL)}</div>
              <div className="text-xs text-gray-500 mt-1">🔵 L</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-green-600 font-bold text-lg">{formatoKg(pesoM)}</div>
              <div className="text-xs text-gray-500 mt-1">🟢 M</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-red-600 font-bold text-lg">{formatoKg(pesoS)}</div>
              <div className="text-xs text-gray-500 mt-1">🔴 S</div>
            </div>
          </div>
          {showProgress && (
            <div className="mt-4 pt-3 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progreso:</span>
                <span className={`font-bold ${getProgressColors(progreso).textColor}`}>
                  {progreso >= 99.95 && progreso < 100 
                    ? progreso.toFixed(2) 
                    : progreso.toFixed(1)
                  }%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${getProgressColors(progreso).barColor} h-2 rounded-full transition-all duration-500 ease-in-out`}
                  style={{ width: `${Math.min(progreso, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Procesado: {formatoKg(pesoTotalProcesado)}</span>
                <span>Esperado: {formatoKg(pesoTotalEsperado)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tarjeta de Pesos por Tipo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5" />
            <span>Pesos por Tipo</span>
            <span className="text-xs text-gray-400">(kg)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-purple-600 font-bold text-xl">{formatoKg(pesoXL)}</div>
              <div className="text-xs text-gray-500 mt-1">🟣 XL</div>
            </div>
            <div>
              <div className="text-blue-600 font-bold text-xl">{formatoKg(pesoL)}</div>
              <div className="text-xs text-gray-500 mt-1">🔵 L</div>
            </div>
            <div>
              <div className="text-green-600 font-bold text-xl">{formatoKg(pesoM)}</div>
              <div className="text-xs text-gray-500 mt-1">🟢 M</div>
            </div>
            <div>
              <div className="text-red-600 font-bold text-xl">{formatoKg(pesoS)}</div>
              <div className="text-xs text-gray-500 mt-1">🔴 S</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Resumen de Pesos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            <span>Resumen de Pesos</span>
            <span className="text-xs text-gray-400">(kg)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Clasificado:</span>
              <span className="font-bold text-blue-600">{formatoKg(pesoTotalClasificado)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Retornos:</span>
              <span className="font-medium text-orange-600">{formatoKg(pesoRetornos)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Mermas:</span>
              <span className="font-medium text-pink-600">{formatoKg(pesoMermas)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Peso Esperado:</span>
              <span className="font-medium text-gray-800">{formatoKg(pesoTotalEsperado)}</span>
            </div>
            {showProgress && (
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Progreso:</span>
                  <span className={`font-bold ${getProgressColors(progreso).textColor}`}>
                    {progreso >= 99.95 && progreso < 100 
                      ? progreso.toFixed(2) 
                      : progreso.toFixed(1)
                    }%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${getProgressColors(progreso).barColor} h-2 rounded-full transition-all duration-500 ease-in-out`}
                    style={{ width: `${Math.min(progreso, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Desglose */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span>Desglose</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Tipos:</span>
              <span className="font-medium text-gray-800">
                {formatoKg(pesoXL + pesoL + pesoM + pesoS)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Diferencia:</span>
              <span className={`font-medium ${pesoTotalProcesado >= pesoTotalEsperado ? 'text-green-600' : 'text-red-600'}`}>
                {formatoKg(Math.abs(pesoTotalProcesado - pesoTotalEsperado))}
                {pesoTotalProcesado >= pesoTotalEsperado ? ' (Sobrante)' : ' (Faltante)'}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="text-xs text-gray-500 space-y-1">
                <div>🟣 XL: {((pesoXL / pesoTotalClasificado) * 100).toFixed(1)}%</div>
                <div>🔵 L: {((pesoL / pesoTotalClasificado) * 100).toFixed(1)}%</div>
                <div>🟢 M: {((pesoM / pesoTotalClasificado) * 100).toFixed(1)}%</div>
                <div>🔴 S: {((pesoS / pesoTotalClasificado) * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 