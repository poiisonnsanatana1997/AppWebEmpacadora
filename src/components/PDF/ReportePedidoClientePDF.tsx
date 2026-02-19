import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PedidoClienteResponseDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import { ConfiguracionReporte } from '@/types/PedidoCliente/reportes.types';

// Estilos para el PDF - Diseño Minimalista y Profesional
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontSize: 9,
  },

  // Header - Minimalista
  header: {
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
  },
  fechaGeneracion: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 6,
  },

  // Secciones
  seccion: {
    marginBottom: 20,
  },
  tituloSeccion: {
    fontSize: 10,
    fontWeight: 700,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D1D5DB',
  },

  // Grids de información - Simplificados
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 8,
    color: '#9CA3AF',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 10,
    color: '#1F2937',
    fontWeight: 600,
  },

  // Estatus - Sin colores excesivos
  estatusText: {
    fontSize: 10,
    color: '#1F2937',
    fontWeight: 600,
  },

  // Tabla - Minimalista
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: '#374151',
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableHeaderCell: {
    color: '#374151',
    fontSize: 8,
    fontWeight: 700,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 8,
    minHeight: 28,
  },
  tableRowAlt: {
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    fontSize: 8,
    textAlign: 'center',
    color: '#4B5563',
    paddingHorizontal: 4,
  },

  // Columnas de la tabla
  colId: { width: '5%' },
  colTipo: { width: '8%' },
  colProducto: { width: '30%', textAlign: 'left' },
  colCodigo: { width: '12%' },
  colVariedad: { width: '15%' },
  colCantidad: { width: '10%' },
  colPeso: { width: '10%' },
  colUsuario: { width: '10%' },

  // Fila de totales
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderTopWidth: 1.5,
    borderTopColor: '#374151',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: 700,
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 700,
    color: '#111827',
  },

  // Observaciones
  observacionesBox: {
    backgroundColor: '#FAFAFA',
    borderWidth: 0.5,
    borderColor: '#D1D5DB',
    padding: 12,
    marginTop: 6,
  },
  observacionesText: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.6,
  },

  // Resumen - Simplificado
  resumenGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  resumenCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderWidth: 0.5,
    borderColor: '#D1D5DB',
    padding: 12,
  },
  resumenLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  resumenValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#111827',
  },

  // Desglose por tipo - Tabla simple
  desgloseTable: {
    marginTop: 8,
  },
  desgloseRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  desgloseTipo: {
    width: '30%',
    fontSize: 9,
    color: '#1F2937',
    fontWeight: 600,
  },
  desgloseCantidad: {
    width: '35%',
    fontSize: 9,
    color: '#4B5563',
  },
  desglosePeso: {
    width: '35%',
    fontSize: 9,
    color: '#4B5563',
  },

  // Progreso de surtido
  progresoContainer: {
    marginTop: 8,
  },
  progresoBarraFondo: {
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 12,
  },
  progresoBarraLleno: {
    height: 20,
    backgroundColor: '#374151',
  },
  progresoTexto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 700,
    paddingTop: 5,
  },
  progresoDetalle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progresoItem: {
    flex: 1,
  },
  progresoItemLabel: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  progresoItemValue: {
    fontSize: 11,
    color: '#1F2937',
    fontWeight: 600,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: '#D1D5DB',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: '#9CA3AF',
  },
  pageNumber: {
    fontSize: 7,
    color: '#9CA3AF',
  },
});

interface ReportePedidoClientePDFProps {
  pedido: PedidoClienteResponseDTO;
  configuracion: ConfiguracionReporte;
}

export const ReportePedidoClientePDF: React.FC<ReportePedidoClientePDFProps> = ({
  pedido,
  configuracion
}) => {
  // Funciones auxiliares
  const formatearFecha = (fecha: Date | string): string => {
    try {
      const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
      return fechaObj.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  // Formateadores numéricos (ES-MX)
  const nfInt = new Intl.NumberFormat('es-MX');
  const nf2 = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Calcular totales
  const totalOrdenes = pedido.ordenes.length;
  const totalCajas = pedido.ordenes.reduce((sum, ord) => sum + (ord.cantidad || 0), 0);
  const pesoTotal = pedido.ordenes.reduce((sum, ord) => sum + (ord.peso || 0), 0);

  // Calcular desglose por tipo
  const desglosePorTipo = calcularDesglosePorTipo(pedido);

  // Calcular información de surtido
  const porcentajeSurtido = Math.max(0, Math.min(100, pedido.porcentajeSurtido || 0));
  const cajasSurtidas = Math.floor((totalCajas * porcentajeSurtido) / 100);
  const cajasPendientes = totalCajas - cajasSurtidas;
  const pesoSurtido = Math.round(((pesoTotal * porcentajeSurtido) / 100) * 100) / 100;
  const pesoPendiente = Math.round((pesoTotal - pesoSurtido) * 100) / 100;

  // Estado textual del pedido
  const estadoPedido = porcentajeSurtido >= 100 ? 'Completado' : porcentajeSurtido <= 0 ? 'Pendiente' : 'En progreso';

  // Progreso por tipo (estimado)
  const progresoPorTipo = desglosePorTipo.map((item) => {
    const cajasSurtidasEst = Math.floor((item.cantidad * porcentajeSurtido) / 100);
    const cajasPendientesEst = item.cantidad - cajasSurtidasEst;
    const pesoTotalTipo = item.peso || 0;
    const pesoSurtidoEst = Math.round(((pesoTotalTipo * porcentajeSurtido) / 100) * 100) / 100;
    const pesoPendienteEst = Math.round((pesoTotalTipo - pesoSurtidoEst) * 100) / 100;
    return {
      tipo: item.tipo,
      cajasTotales: item.cantidad,
      cajasSurtidas: cajasSurtidasEst,
      cajasPendientes: cajasPendientesEst,
      pesoTotal: pesoTotalTipo,
      pesoSurtido: pesoSurtidoEst,
      pesoPendiente: pesoPendienteEst,
    };
  });

  // Contribución por usuario (actividad)
  const contribucionPorUsuario = Array.from(
    pedido.ordenes.reduce((acc, ord) => {
      const usuario = ord.usuarioRegistro || 'Sin usuario';
      if (!acc.has(usuario)) acc.set(usuario, { usuario, cajas: 0, peso: 0 });
      const cur = acc.get(usuario)!;
      cur.cajas += ord.cantidad || 0;
      cur.peso += ord.peso || 0;
      return acc;
    }, new Map<string, { usuario: string; cajas: number; peso: number }>() ).values()
  ).sort((a, b) => b.cajas - a.cajas);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titulo}>{configuracion.nombreEmpresa}</Text>
          <Text style={styles.subtitulo}>Reporte de Pedido Cliente #{pedido.id}</Text>
          {configuracion.mostrarFechaGeneracion && (
            <Text style={styles.fechaGeneracion}>
              Generado el: {new Date().toLocaleString('es-MX')}
            </Text>
          )}
        </View>

        {/* Información General */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Información General</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>ID del Pedido</Text>
              <Text style={styles.infoValue}>#{pedido.id}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Estatus</Text>
              <Text style={styles.estatusText}>{pedido.estatus}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha de Registro</Text>
              <Text style={styles.infoValue}>{formatearFecha(pedido.fechaRegistro)}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Fecha de Embarque</Text>
              <Text style={styles.infoValue}>
                {pedido.fechaEmbarque ? formatearFecha(pedido.fechaEmbarque) : 'No definida'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Usuario Registro</Text>
              <Text style={styles.infoValue}>{pedido.usuarioRegistro}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Progreso Surtido</Text>
              <Text style={styles.infoValue}>{(pedido.porcentajeSurtido || 0).toFixed(1)}%</Text>
            </View>
          </View>
        </View>

        {/* Cliente y Sucursal */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Información del Cliente</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Cliente</Text>
              <Text style={styles.infoValue}>{pedido.cliente}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Sucursal de Destino</Text>
              <Text style={styles.infoValue}>{pedido.sucursal}</Text>
            </View>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Resumen del Pedido</Text>
          <View style={styles.resumenGrid}>
            <View style={styles.resumenCard}>
              <Text style={styles.resumenLabel}>Total Órdenes</Text>
              <Text style={styles.resumenValue}>{nfInt.format(totalOrdenes)}</Text>
            </View>

            <View style={styles.resumenCard}>
              <Text style={styles.resumenLabel}>Total Cajas</Text>
              <Text style={styles.resumenValue}>{nfInt.format(totalCajas)}</Text>
            </View>

            <View style={styles.resumenCard}>
              <Text style={styles.resumenLabel}>Peso Total (kg)</Text>
              <Text style={styles.resumenValue}>{nf2.format(pesoTotal || 0)}</Text>
            </View>
          </View>
        </View>

        {/* Progreso de Surtido */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Progreso de Surtido</Text>
          <View style={styles.progresoContainer}>
            {/* Barra de progreso */}
            <View style={styles.progresoBarraFondo}>
              <View style={[styles.progresoBarraLleno, { width: `${porcentajeSurtido}%` }]} />
              <Text style={styles.progresoTexto}>
                {porcentajeSurtido.toFixed(1)}% Completado
              </Text>
            </View>

            {/* Detalles del progreso */}
            <View style={styles.progresoDetalle}>
              <View style={styles.progresoItem}>
                <Text style={styles.progresoItemLabel}>Cajas Surtidas</Text>
                <Text style={styles.progresoItemValue}>{nfInt.format(cajasSurtidas)} de {nfInt.format(totalCajas)}</Text>
              </View>

              <View style={styles.progresoItem}>
                <Text style={styles.progresoItemLabel}>Cajas Pendientes</Text>
                <Text style={styles.progresoItemValue}>{nfInt.format(cajasPendientes)}</Text>
              </View>

              <View style={styles.progresoItem}>
                <Text style={styles.progresoItemLabel}>Peso Surtido (kg)</Text>
                <Text style={styles.progresoItemValue}>{nf2.format(pesoSurtido)}</Text>
              </View>

              <View style={styles.progresoItem}>
                <Text style={styles.progresoItemLabel}>Peso Pendiente (kg)</Text>
                <Text style={styles.progresoItemValue}>{nf2.format(pesoPendiente)}</Text>
              </View>
            </View>

            {/* Estado textual del pedido */}
            <View style={{ marginTop: 6 }}>
              <Text style={styles.infoLabel}>Estado del Pedido</Text>
              <Text style={styles.estatusText}>{estadoPedido}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {configuracion.pie || 'AppWebEmpacadora - Sistema de Gestión'}
          </Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Página ${pageNumber} de ${totalPages}`
          )} fixed />
        </View>
      </Page>

      {/* Segunda página: Detalle de Órdenes */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titulo}>{configuracion.nombreEmpresa}</Text>
          <Text style={styles.subtitulo}>Detalle de Órdenes - Pedido #{pedido.id}</Text>
        </View>

        {/* Desglose por Tipo */}
        {desglosePorTipo.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Desglose por Tipo</Text>
            <View style={styles.desgloseTable}>
              {/* Encabezado de tabla */}
              <View style={[styles.desgloseRow, { borderBottomWidth: 1, borderBottomColor: '#374151', paddingBottom: 8, marginBottom: 6 }]}>
                <Text style={[styles.desgloseTipo, { fontWeight: 700, textTransform: 'uppercase', fontSize: 8 }]}>Tipo</Text>
                <Text style={[styles.desgloseCantidad, { fontWeight: 700, textTransform: 'uppercase', fontSize: 8 }]}>Cajas</Text>
                <Text style={[styles.desglosePeso, { fontWeight: 700, textTransform: 'uppercase', fontSize: 8 }]}>Peso (kg)</Text>
              </View>
              {/* Filas de datos */}
              {desglosePorTipo.map((item, index) => (
                <View key={index} style={styles.desgloseRow}>
                  <Text style={styles.desgloseTipo}>{item.tipo}</Text>
                  <Text style={styles.desgloseCantidad}>{nfInt.format(item.cantidad)}</Text>
                  <Text style={styles.desglosePeso}>{nf2.format(item.peso || 0)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Progreso por Tipo (Estimado) */}
        {progresoPorTipo.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Progreso por Tipo (Estimado)</Text>
            <View style={styles.desgloseTable}>
              {/* Header */}
              <View style={[styles.desgloseRow, { borderBottomWidth: 1, borderBottomColor: '#374151', paddingBottom: 8, marginBottom: 6 }]}>
                <Text style={{ width: '20%', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', color: '#1F2937' }}>Tipo</Text>
                <Text style={{ width: '14%', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right', color: '#1F2937' }}>Cajas Totales</Text>
                <Text style={{ width: '14%', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right', color: '#1F2937' }}>Cajas Surtidas</Text>
                <Text style={{ width: '14%', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right', color: '#1F2937' }}>Cajas Pendientes</Text>
                <Text style={{ width: '12%', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right', color: '#1F2937' }}>Peso Total (kg)</Text>
                <Text style={{ width: '13%', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right', color: '#1F2937' }}>Peso Surtido</Text>
                <Text style={{ width: '13%', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right', color: '#1F2937' }}>Peso Pendiente</Text>
              </View>
              {/* Rows */}
              {progresoPorTipo.map((row, idx) => (
                <View key={idx} style={styles.desgloseRow}>
                  <Text style={{ width: '20%', fontSize: 9, color: '#1F2937' }}>{row.tipo}</Text>
                  <Text style={{ width: '14%', fontSize: 9, color: '#4B5563', textAlign: 'right' }}>{nfInt.format(row.cajasTotales)}</Text>
                  <Text style={{ width: '14%', fontSize: 9, color: '#4B5563', textAlign: 'right' }}>{nfInt.format(row.cajasSurtidas)}</Text>
                  <Text style={{ width: '14%', fontSize: 9, color: '#4B5563', textAlign: 'right' }}>{nfInt.format(row.cajasPendientes)}</Text>
                  <Text style={{ width: '12%', fontSize: 9, color: '#4B5563', textAlign: 'right' }}>{nf2.format(row.pesoTotal)}</Text>
                  <Text style={{ width: '13%', fontSize: 9, color: '#4B5563', textAlign: 'right' }}>{nf2.format(row.pesoSurtido)}</Text>
                  <Text style={{ width: '13%', fontSize: 9, color: '#4B5563', textAlign: 'right' }}>{nf2.format(row.pesoPendiente)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contribución por Usuario */}
        {contribucionPorUsuario.length > 0 && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Contribución por Usuario</Text>
            <View style={styles.desgloseTable}>
              <View style={[styles.desgloseRow, { borderBottomWidth: 1, borderBottomColor: '#374151', paddingBottom: 8, marginBottom: 6 }]}>
                <Text style={{ width: '34%', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', color: '#1F2937' }}>Usuario</Text>
                <Text style={{ width: '33%', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right', color: '#1F2937' }}>Cajas</Text>
                <Text style={{ width: '33%', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', textAlign: 'right', color: '#1F2937' }}>Peso (kg)</Text>
              </View>
              {contribucionPorUsuario.map((u, idx) => (
                <View key={idx} style={styles.desgloseRow}>
                  <Text style={{ width: '34%', fontSize: 9, color: '#1F2937' }}>{u.usuario}</Text>
                  <Text style={{ width: '33%', fontSize: 9, color: '#4B5563', textAlign: 'right' }}>{nfInt.format(u.cajas)}</Text>
                  <Text style={{ width: '33%', fontSize: 9, color: '#4B5563', textAlign: 'right' }}>{nf2.format(u.peso)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Observaciones */}
        {pedido.observaciones && (
          <View style={styles.seccion}>
            <Text style={styles.tituloSeccion}>Observaciones</Text>
            <View style={styles.observacionesBox}>
              <Text style={styles.observacionesText}>{pedido.observaciones}</Text>
            </View>
          </View>
        )}

        {/* Tabla de Órdenes */}
        <View style={styles.table}>
          {/* Header de tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colId]}>ID</Text>
            <Text style={[styles.tableHeaderCell, styles.colTipo]}>TIPO</Text>
            <Text style={[styles.tableHeaderCell, styles.colProducto, { textAlign: 'left' }]}>PRODUCTO</Text>
            <Text style={[styles.tableHeaderCell, styles.colCodigo]}>CÓDIGO</Text>
            <Text style={[styles.tableHeaderCell, styles.colVariedad]}>VARIEDAD</Text>
            <Text style={[styles.tableHeaderCell, styles.colCantidad]}>CAJAS</Text>
            <Text style={[styles.tableHeaderCell, styles.colPeso]}>PESO (KG)</Text>
            <Text style={[styles.tableHeaderCell, styles.colUsuario]}>USUARIO</Text>
          </View>

          {/* Filas de datos */}
          {pedido.ordenes.map((orden, index) => (
            <View
              key={orden.id}
              style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
            >
              <Text style={[styles.tableCell, styles.colId]}>{orden.id}</Text>
              <Text style={[styles.tableCell, styles.colTipo]}>{orden.tipo}</Text>
              <Text style={[styles.tableCell, styles.colProducto, { textAlign: 'left' }]}>
                {orden.producto?.nombre || 'Sin producto'}
              </Text>
              <Text style={[styles.tableCell, styles.colCodigo]}>
                {orden.producto?.codigo || '-'}
              </Text>
              <Text style={[styles.tableCell, styles.colVariedad]}>
                {orden.producto?.variedad || '-'}
              </Text>
              <Text style={[styles.tableCell, styles.colCantidad]}>
                {orden.cantidad || 0}
              </Text>
              <Text style={[styles.tableCell, styles.colPeso]}>
                {orden.peso ? orden.peso.toFixed(2) : '0.00'}
              </Text>
              <Text style={[styles.tableCell, styles.colUsuario]}>
                {orden.usuarioRegistro}
              </Text>
            </View>
          ))}

          {/* Fila de totales */}
          <View style={styles.totalRow}>
            <View style={{ width: '70%', paddingRight: 10 }}>
              <Text style={[styles.totalLabel, { textAlign: 'right' }]}>TOTALES:</Text>
            </View>
            <View style={{ width: '10%' }}>
              <Text style={[styles.totalValue, { textAlign: 'center' }]}>{nfInt.format(totalCajas)}</Text>
            </View>
            <View style={{ width: '10%' }}>
              <Text style={[styles.totalValue, { textAlign: 'center' }]}>{nf2.format(pesoTotal || 0)}</Text>
            </View>
            <View style={{ width: '10%' }} />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {configuracion.pie || 'AppWebEmpacadora - Sistema de Gestión'}
          </Text>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Página ${pageNumber} de ${totalPages}`
          )} fixed />
        </View>
      </Page>
    </Document>
  );
};

// Función auxiliar para calcular desglose por tipo
function calcularDesglosePorTipo(pedido: PedidoClienteResponseDTO): Array<{ tipo: string; cantidad: number; peso: number }> {
  const desglose = new Map<string, { cantidad: number; peso: number }>();

  pedido.ordenes.forEach(orden => {
    const tipo = orden.tipo;
    if (!desglose.has(tipo)) {
      desglose.set(tipo, { cantidad: 0, peso: 0 });
    }

    const actual = desglose.get(tipo)!;
    actual.cantidad += orden.cantidad || 0;
    actual.peso += orden.peso || 0;
  });

  return Array.from(desglose.entries())
    .map(([tipo, valores]) => ({ tipo, ...valores }))
    .sort((a, b) => {
      const orden = ['XL', 'L', 'M', 'S', 'XS'];
      return orden.indexOf(a.tipo) - orden.indexOf(b.tipo);
    });
}
