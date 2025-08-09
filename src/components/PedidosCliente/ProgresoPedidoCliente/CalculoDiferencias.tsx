import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Calculator, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface CalculoDiferenciasProps {
  diferencias: Array<{
    tipo: string;
    cantidadRequerida: number;
    cantidadAsignada: number;
    cantidadFaltante: number;
    pesoRequerido: number;
    pesoAsignado: number;
    pesoFaltante: number;
    porcentajeCumplimiento: number;
  }>;
}

export const CalculoDiferencias: React.FC<CalculoDiferenciasProps> = ({ diferencias }) => {
  const getTipoBadge = (tipo: string) => {
    const tipoConfig = {
      'S': { variant: 'default' as const, className: 'bg-blue-100 text-blue-800' },
      'M': { variant: 'secondary' as const, className: 'bg-green-100 text-green-800' },
      'L': { variant: 'outline' as const, className: 'bg-orange-100 text-orange-800' },
      'XL': { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
    };

    const config = tipoConfig[tipo as keyof typeof tipoConfig] || tipoConfig['S'];

    return (
      <Badge variant={config.variant} className={config.className}>
        {tipo}
      </Badge>
    );
  };

  const getCumplimientoIcon = (porcentaje: number) => {
    if (porcentaje >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (porcentaje >= 70) return <TrendingUp className="h-4 w-4 text-blue-600" />;
    if (porcentaje >= 50) return <Clock className="h-4 w-4 text-yellow-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const getFaltanteBadge = (faltante: number) => {
    if (faltante === 0) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completado</Badge>;
    }
    return (
      <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
        Faltan {faltante.toLocaleString()}
      </Badge>
    );
  };

  if (diferencias.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Cálculo de Diferencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No hay datos para calcular diferencias
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Diferencias por Tipo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Requerido</TableHead>
              <TableHead className="text-right">Asignado</TableHead>
              <TableHead className="text-right">Faltante</TableHead>
              <TableHead className="text-center">Cumplimiento</TableHead>
              <TableHead className="text-center">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diferencias.map((diferencia) => (
              <TableRow key={diferencia.tipo}>
                <TableCell>
                  {getTipoBadge(diferencia.tipo)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {diferencia.cantidadRequerida.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-medium text-green-600">
                  {diferencia.cantidadAsignada.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-medium text-red-600">
                  {diferencia.cantidadFaltante.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {getCumplimientoIcon(diferencia.porcentajeCumplimiento)}
                    <span className="text-sm font-medium">{diferencia.porcentajeCumplimiento}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {getFaltanteBadge(diferencia.cantidadFaltante)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}; 