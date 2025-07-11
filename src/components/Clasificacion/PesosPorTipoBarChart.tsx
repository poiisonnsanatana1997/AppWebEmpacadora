import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export type PesosPorTipo = {
  XL: number;
  L: number;
  M: number;
  S: number;
};

interface PesosPorTipoBarChartProps {
  pesosPorTipo: PesosPorTipo;
  total: number;
}

const dataColors = [
  { tipo: 'XL', color: '#a21caf' }, // morado
  { tipo: 'L', color: '#2563eb' }, // azul
  { tipo: 'M', color: '#22c55e' }, // verde
  { tipo: 'S', color: '#ef4444' }, // rojo
];

export const PesosPorTipoBarChart: React.FC<PesosPorTipoBarChartProps> = ({ pesosPorTipo, total }) => {
  const data = [
    { tipo: 'XL', peso: pesosPorTipo.XL, color: dataColors[0].color },
    { tipo: 'L', peso: pesosPorTipo.L, color: dataColors[1].color },
    { tipo: 'M', peso: pesosPorTipo.M, color: dataColors[2].color },
    { tipo: 'S', peso: pesosPorTipo.S, color: dataColors[3].color },
  ];

  const ResponsiveContainerAny = ResponsiveContainer as any;
  const BarChartAny = BarChart as any;
  const XAxisAny = XAxis as any;
  const YAxisAny = YAxis as any;
  const TooltipAny = Tooltip as any;
  const BarAny = Bar as any;
  const CellAny = Cell as any;

  return (
    <div className="bg-white rounded-lg shadow p-4" aria-label="Gráfica de pesos por tipo">
      <h2 className="font-bold text-lg mb-2">Pesos por Tipo</h2>
      <ResponsiveContainerAny width="100%" height={220}>
        <BarChartAny data={data} barCategoryGap={30}>
          <XAxisAny dataKey="tipo" axisLine={false} tickLine={false} />
          <YAxisAny unit=" kg" axisLine={false} tickLine={false} />
          <TooltipAny formatter={(value: any) => [`${value.toFixed(2)} kg`, 'Peso']} />
          <BarAny dataKey="peso" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <CellAny key={`cell-${index}`} fill={entry.color} />
            ))}
          </BarAny>
        </BarChartAny>
      </ResponsiveContainerAny>
      <div className="mt-4 text-center font-bold text-xl">
        <span>Total: </span>
        <span className="text-blue-600 font-extrabold">{total.toFixed(2)} kg</span>
      </div>
    </div>
  );
};

export default PesosPorTipoBarChart; 