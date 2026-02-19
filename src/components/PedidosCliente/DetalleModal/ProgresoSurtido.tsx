import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Package,
  FileDown,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import type { PedidoClienteProgresoDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { ResumenProgreso } from '../ProgresoPedidoCliente/ResumenProgreso';
import { OrdenesConProgreso } from '../ProgresoPedidoCliente/OrdenesConProgreso';
import { TarimasAsignadas } from '../ProgresoPedidoCliente/TarimasAsignadas';
import { ReporteProgresoPedidoClientePDF } from '@/components/PDF/ReporteProgresoPedidoClientePDF';
import { ReporteProgresoPedidoClienteExcelService } from '@/services/reporteProgresoPedidoClienteExcel.service';

interface ProgresoSurtidoProps {
  progreso: PedidoClienteProgresoDTO;
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
  cajasSurtidasPorOrden: Map<number, number>;
}

export const ProgresoSurtido: React.FC<ProgresoSurtidoProps> = ({
  progreso,
  diferencias,
  cajasSurtidasPorOrden,
}) => {
  const [incluirTarimas, setIncluirTarimas] = useState(false);
  const [exportando, setExportando] = useState(false);

  const handleExportPDF = async () => {
    if (!progreso) {
      toast.error('No hay datos disponibles para exportar');
      return;
    }

    try {
      setExportando(true);
      toast.loading('Generando PDF...', { id: 'export-pdf' });

      const configuracion = {
        nombreEmpresa: 'AgroSmart - Sistema de Empacadora',
        mostrarFechaGeneracion: true,
        pie: 'Generado con AgroSmart',
      };

      // Convertir diferencias de array a formato esperado
      const diferenciasArray = diferencias.map(d => ({
        tipo: d.tipo,
        cantidadRequerida: d.cantidadRequerida,
        cantidadAsignada: d.cantidadAsignada,
        cantidadFaltante: d.cantidadFaltante,
        pesoRequerido: d.pesoRequerido,
        pesoAsignado: d.pesoAsignado,
        pesoFaltante: d.pesoFaltante,
        porcentajeCumplimiento: d.porcentajeCumplimiento,
      }));

      const blob = await pdf(
        <ReporteProgresoPedidoClientePDF
          progreso={progreso}
          diferencias={diferenciasArray}
          cajasSurtidasPorOrden={cajasSurtidasPorOrden}
          incluirTarimas={incluirTarimas}
          configuracion={configuracion}
        />
      ).toBlob();

      const fecha = new Date().toISOString().split('T')[0];
      saveAs(blob, `Reporte_Progreso_Pedido_${progreso.id}_${fecha}.pdf`);

      toast.success('PDF generado exitosamente', { id: 'export-pdf' });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('Error al generar el PDF', { id: 'export-pdf' });
    } finally {
      setExportando(false);
    }
  };

  const handleExportExcel = async () => {
    if (!progreso) {
      toast.error('No hay datos disponibles para exportar');
      return;
    }

    try {
      setExportando(true);
      toast.loading('Generando Excel...', { id: 'export-excel' });

      const configuracion = {
        nombreEmpresa: 'AgroSmart - Sistema de Empacadora',
        mostrarFechaGeneracion: true,
        pie: 'Generado con AgroSmart',
      };

      // Convertir diferencias de array a formato esperado
      const diferenciasArray = diferencias.map(d => ({
        tipo: d.tipo,
        cantidadRequerida: d.cantidadRequerida,
        cantidadAsignada: d.cantidadAsignada,
        cantidadFaltante: d.cantidadFaltante,
        pesoRequerido: d.pesoRequerido,
        pesoAsignado: d.pesoAsignado,
        pesoFaltante: d.pesoFaltante,
        porcentajeCumplimiento: d.porcentajeCumplimiento,
      }));

      await ReporteProgresoPedidoClienteExcelService.generarReporte(
        progreso,
        diferenciasArray,
        cajasSurtidasPorOrden,
        incluirTarimas,
        configuracion
      );

      toast.success('Excel generado exitosamente', { id: 'export-excel' });
    } catch (error) {
      console.error('Error al generar Excel:', error);
      toast.error('Error al generar el Excel', { id: 'export-excel' });
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Botones de exportación */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={exportando}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <FileDown className="h-4 w-4 mr-2" aria-hidden="true" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Opciones de Exportación</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Checkbox para incluir tarimas */}
            <div className="px-2 py-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="incluir-tarimas"
                  checked={incluirTarimas}
                  onChange={(e) => setIncluirTarimas(e.target.checked)}
                />
                <label
                  htmlFor="incluir-tarimas"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Incluir tarimas asignadas
                </label>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleExportPDF} disabled={exportando}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar como PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel} disabled={exportando}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exportar como Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Resumen */}
      <section aria-labelledby="resumen-heading">
        <h3 id="resumen-heading" className="sr-only">Resumen del progreso del pedido</h3>
        <ResumenProgreso progreso={progreso} />
      </section>

      {/* Órdenes con Progreso (fusiona diferencias y órdenes) */}
      <section aria-labelledby="ordenes-heading">
        <h3 id="ordenes-heading" className="sr-only">Órdenes del pedido con progreso de surtido</h3>
        <OrdenesConProgreso ordenes={progreso.ordenes} cajasSurtidasPorOrden={cajasSurtidasPorOrden} />
      </section>

      {/* Tarimas */}
      <section aria-labelledby="tarimas-heading">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              Tarimas Asignadas
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Detalle de las tarimas asignadas al pedido
            </p>
          </CardHeader>
          <CardContent>
            <TarimasAsignadas tarimas={progreso.tarimas} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
