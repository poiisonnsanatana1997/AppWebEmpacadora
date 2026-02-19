import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { PedidoClienteProgresoDTO } from '@/types/PedidoCliente/pedidoCliente.types';
import type { ConfiguracionReporte } from '@/types/PedidoCliente/reportes.types';

interface ReporteProgresoPedidoClientePDFProps {
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
  incluirTarimas: boolean;
  configuracion?: ConfiguracionReporte;
}

const styles = StyleSheet.create({
  // Página
  page: {
    padding: 40,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  pageLandscape: {
    padding: 30,
    fontSize: 8,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #2563EB',
    paddingBottom: 15,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 9,
    color: '#6B7280',
  },

  // Sección
  seccion: {
    marginBottom: 20,
  },
  seccionTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '1px solid #E5E7EB',
  },

  // Métricas del Resumen (4 cards)
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    border: '1px solid #E5E7EB',
  },
  metricLabel: {
    fontSize: 7,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  metricSubtext: {
    fontSize: 6,
    color: '#9CA3AF',
    marginTop: 2,
  },

  // Barra de Progreso
  progresoContainer: {
    marginTop: 8,
  },
  progresoBarraFondo: {
    width: '100%',
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    position: 'relative',
  },
  progresoBarraLleno: {
    height: '100%',
    borderRadius: 4,
  },
  progresoTexto: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    top: 5,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Tabla
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderBottom: '2px solid #E5E7EB',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #E5E7EB',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #E5E7EB',
    backgroundColor: '#F9FAFB',
  },

  // Columnas de tabla - Órdenes y Progreso
  colId: { width: '8%', fontSize: 8 },
  colTipo: { width: '8%', fontSize: 8 },
  colProducto: { width: '30%', fontSize: 8 },
  colRequeridas: { width: '11%', fontSize: 8, textAlign: 'right' },
  colSurtidas: { width: '11%', fontSize: 8, textAlign: 'right' },
  colFaltantes: { width: '11%', fontSize: 8, textAlign: 'right' },
  colProgreso: { width: '11%', fontSize: 8, textAlign: 'center' },
  colEstado: { width: '10%', fontSize: 8, textAlign: 'center' },

  // Columnas de tabla - Tarimas
  colCodigo: { width: '12%', fontSize: 8 },
  colUPC: { width: '12%', fontSize: 8 },
  colProductoTarima: { width: '32%', fontSize: 8 },
  colTipoTarima: { width: '10%', fontSize: 8, textAlign: 'center' },
  colCantidadTarima: { width: '12%', fontSize: 8, textAlign: 'right' },
  colPesoTarima: { width: '12%', fontSize: 8, textAlign: 'right' },
  colEstadoTarima: { width: '10%', fontSize: 8, textAlign: 'center' },

  // Badges
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    fontSize: 7,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  badgeTipoXL: { backgroundColor: '#F3E8FF', color: '#7C3AED' },
  badgeTipoL: { backgroundColor: '#DBEAFE', color: '#2563EB' },
  badgeTipoM: { backgroundColor: '#D1FAE5', color: '#059669' },
  badgeTipoS: { backgroundColor: '#FED7AA', color: '#EA580C' },
  badgeCompleto: { backgroundColor: '#D1FAE5', color: '#059669' },
  badgeEnProceso: { backgroundColor: '#FEF3C7', color: '#D97706' },
  badgePendiente: { backgroundColor: '#FEE2E2', color: '#DC2626' },

  // Producto info
  productoNombre: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  productoDetalle: {
    fontSize: 7,
    color: '#6B7280',
  },

  // Valores numéricos con colores
  valorAzul: { color: '#2563EB', fontWeight: 'bold' },
  valorVerde: { color: '#059669', fontWeight: 'bold' },
  valorRojo: { color: '#DC2626', fontWeight: 'bold' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#6B7280',
    borderTop: '1px solid #E5E7EB',
    paddingTop: 10,
  },

  // Totales
  totalesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid #E5E7EB',
  },
  totalItem: {
    flexDirection: 'row',
    gap: 5,
  },
  totalLabel: {
    fontSize: 8,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export const ReporteProgresoPedidoClientePDF: React.FC<ReporteProgresoPedidoClientePDFProps> = ({
  progreso,
  diferencias,
  cajasSurtidasPorOrden,
  incluirTarimas,
  configuracion,
}) => {
  // Calcular totales para el resumen
  const totalCantidadRequerida = progreso.ordenes.reduce((sum, orden) => sum + (orden.cantidad || 0), 0);
  const totalCantidadAsignada = progreso.tarimas.reduce((sum, tarima) => {
    return sum + tarima.tarimasClasificaciones.reduce((sumClas, clas) => sumClas + (clas.cantidad || 0), 0);
  }, 0);
  const totalCantidadFaltante = Math.max(0, totalCantidadRequerida - totalCantidadAsignada);
  const porcentajeCumplimiento = progreso.porcentajeSurtido ?? (
    totalCantidadRequerida > 0
      ? Math.round((totalCantidadAsignada / totalCantidadRequerida) * 100)
      : 100
  );

  // Función para obtener badge de tipo
  const getTipoBadgeStyle = (tipo: string) => {
    switch (tipo) {
      case 'XL': return styles.badgeTipoXL;
      case 'L': return styles.badgeTipoL;
      case 'M': return styles.badgeTipoM;
      case 'S': return styles.badgeTipoS;
      default: return styles.badgeTipoM;
    }
  };

  // Función para obtener badge de estado
  const getEstadoBadgeStyle = (cajasSurtidas: number, cantidadRequerida: number) => {
    if (cajasSurtidas >= cantidadRequerida) return styles.badgeCompleto;
    if (cajasSurtidas > 0) return styles.badgeEnProceso;
    return styles.badgePendiente;
  };

  const getEstadoTexto = (cajasSurtidas: number, cantidadRequerida: number) => {
    if (cajasSurtidas >= cantidadRequerida) return 'Completo';
    if (cajasSurtidas > 0) return 'En Proceso';
    return 'Pendiente';
  };

  // Color de barra de progreso
  const getProgresoColor = (porcentaje: number) => {
    if (porcentaje >= 100) return '#059669';
    if (porcentaje >= 70) return '#2563EB';
    if (porcentaje >= 50) return '#F59E0B';
    if (porcentaje > 0) return '#EA580C';
    return '#DC2626';
  };

  return (
    <Document>
      {/* PÁGINA 1: Resumen y Órdenes con Progreso */}
      <Page size="A4" orientation="landscape" style={styles.pageLandscape}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titulo}>
            Reporte de Progreso - Pedido #{progreso.id}
          </Text>
          <Text style={styles.subtitulo}>
            {configuracion?.nombreEmpresa || 'Sistema de Empacadora'}
            {configuracion?.mostrarFechaGeneracion && ` • Generado: ${new Date().toLocaleDateString('es-MX')}`}
          </Text>
        </View>

        {/* Sección 1: Resumen (4 métricas) */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Resumen del Pedido</Text>
          <View style={styles.metricsContainer}>
            {/* Porcentaje de Surtido */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Porcentaje de Surtido</Text>
              <Text style={styles.metricValue}>{porcentajeCumplimiento}%</Text>
              <View style={styles.progresoContainer}>
                <View style={styles.progresoBarraFondo}>
                  <View style={[
                    styles.progresoBarraLleno,
                    {
                      width: `${Math.min(porcentajeCumplimiento, 100)}%`,
                      backgroundColor: getProgresoColor(porcentajeCumplimiento)
                    }
                  ]} />
                </View>
              </View>
            </View>

            {/* Cajas Surtidas */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Cajas Surtidas</Text>
              <Text style={[styles.metricValue, styles.valorVerde]}>
                {totalCantidadAsignada.toLocaleString('es-MX')}
              </Text>
              <Text style={styles.metricSubtext}>
                de {totalCantidadRequerida.toLocaleString('es-MX')} requeridas
              </Text>
            </View>

            {/* Cajas por Surtir */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Cajas por Surtir</Text>
              <Text style={[styles.metricValue, styles.valorRojo]}>
                {totalCantidadFaltante.toLocaleString('es-MX')}
              </Text>
              <Text style={styles.metricSubtext}>
                {totalCantidadFaltante === 0 ? 'Pedido completo' : 'Pendientes'}
              </Text>
            </View>

            {/* Tarimas Asignadas */}
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Tarimas Asignadas</Text>
              <Text style={[styles.metricValue, styles.valorAzul]}>
                {progreso.tarimas.length}
              </Text>
              <Text style={styles.metricSubtext}>
                {progreso.tarimas.length === 1 ? 'tarima' : 'tarimas'}
              </Text>
            </View>
          </View>
        </View>

        {/* Sección 2: Órdenes y Progreso de Surtido */}
        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>Órdenes y Progreso de Surtido</Text>
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.colId}>ID</Text>
              <Text style={styles.colTipo}>Tipo</Text>
              <Text style={styles.colProducto}>Producto</Text>
              <Text style={styles.colRequeridas}>Requeridas</Text>
              <Text style={styles.colSurtidas}>Surtidas</Text>
              <Text style={styles.colFaltantes}>Faltantes</Text>
              <Text style={styles.colProgreso}>Progreso</Text>
              <Text style={styles.colEstado}>Estado</Text>
            </View>

            {/* Filas */}
            {progreso.ordenes.map((orden, index) => {
              const cajasSurtidas = cajasSurtidasPorOrden.get(orden.id) || 0;
              const cantidadRequerida = orden.cantidad || 0;
              const cajasFaltantes = Math.max(0, cantidadRequerida - cajasSurtidas);
              const porcentajeSurtido = cantidadRequerida > 0
                ? Math.round((cajasSurtidas / cantidadRequerida) * 100)
                : 0;

              return (
                <View key={orden.id} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={styles.colId}>#{orden.id}</Text>
                  <View style={styles.colTipo}>
                    <Text style={[styles.badge, getTipoBadgeStyle(orden.tipo)]}>{orden.tipo}</Text>
                  </View>
                  <View style={styles.colProducto}>
                    {orden.producto ? (
                      <>
                        <Text style={styles.productoNombre}>{orden.producto.nombre}</Text>
                        <Text style={styles.productoDetalle}>
                          {orden.producto.codigo} - {orden.producto.variedad}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.productoDetalle}>Sin producto</Text>
                    )}
                  </View>
                  <Text style={styles.colRequeridas}>{cantidadRequerida.toLocaleString()}</Text>
                  <Text style={[styles.colSurtidas, styles.valorVerde]}>{cajasSurtidas.toLocaleString()}</Text>
                  <Text style={[styles.colFaltantes, styles.valorRojo]}>{cajasFaltantes.toLocaleString()}</Text>
                  <Text style={styles.colProgreso}>{porcentajeSurtido}%</Text>
                  <View style={styles.colEstado}>
                    <Text style={[styles.badge, getEstadoBadgeStyle(cajasSurtidas, cantidadRequerida)]}>
                      {getEstadoTexto(cajasSurtidas, cantidadRequerida)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{configuracion?.pie || 'Sistema de Gestión de Empacadora'}</Text>
        </View>
      </Page>

      {/* PÁGINA 2: Tarimas Asignadas (Condicional) */}
      {incluirTarimas && progreso.tarimas.length > 0 && (
        <Page size="A4" orientation="landscape" style={styles.pageLandscape}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.titulo}>
              Tarimas Asignadas - Pedido #{progreso.id}
            </Text>
            <Text style={styles.subtitulo}>
              Detalle de las tarimas asignadas al pedido
            </Text>
          </View>

          {/* Tabla de Tarimas */}
          <View style={styles.seccion}>
            <View style={styles.table}>
              {/* Header */}
              <View style={styles.tableHeader}>
                <Text style={styles.colCodigo}>Código</Text>
                <Text style={styles.colUPC}>UPC</Text>
                <Text style={styles.colProductoTarima}>Producto</Text>
                <Text style={styles.colTipoTarima}>Tipo</Text>
                <Text style={styles.colCantidadTarima}>Cantidad</Text>
                <Text style={styles.colPesoTarima}>Peso (kg)</Text>
                <Text style={styles.colEstadoTarima}>Estado</Text>
              </View>

              {/* Filas */}
              {progreso.tarimas.flatMap((tarima, tarimaIndex) =>
                tarima.tarimasClasificaciones.length > 0
                  ? tarima.tarimasClasificaciones.map((clasificacion, clasIndex) => (
                      <View
                        key={`${tarima.id}-${clasIndex}`}
                        style={tarimaIndex % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                      >
                        <Text style={styles.colCodigo}>{tarima.codigo}</Text>
                        <Text style={styles.colUPC}>{tarima.upc || '-'}</Text>
                        <View style={styles.colProductoTarima}>
                          {clasificacion.producto ? (
                            <>
                              <Text style={styles.productoNombre}>{clasificacion.producto.nombre}</Text>
                              <Text style={styles.productoDetalle}>
                                {clasificacion.producto.codigo} - {clasificacion.producto.variedad}
                              </Text>
                            </>
                          ) : (
                            <Text style={styles.productoDetalle}>Sin producto</Text>
                          )}
                        </View>
                        <View style={styles.colTipoTarima}>
                          <Text style={[styles.badge, getTipoBadgeStyle(clasificacion.tipo)]}>
                            {clasificacion.tipo}
                          </Text>
                        </View>
                        <Text style={[styles.colCantidadTarima, styles.valorAzul]}>
                          {(clasificacion.cantidad || 0).toLocaleString()}
                        </Text>
                        <Text style={[styles.colPesoTarima, styles.valorVerde]}>
                          {clasificacion.peso ? clasificacion.peso.toFixed(2) : '-'}
                        </Text>
                        <Text style={styles.colEstadoTarima}>{tarima.estatus}</Text>
                      </View>
                    ))
                  : [
                      <View
                        key={`${tarima.id}-empty`}
                        style={tarimaIndex % 2 === 0 ? styles.tableRow : styles.tableRowAlt}
                      >
                        <Text style={styles.colCodigo}>{tarima.codigo}</Text>
                        <Text style={styles.colUPC}>{tarima.upc || '-'}</Text>
                        <Text style={styles.colProductoTarima}>Sin producto</Text>
                        <Text style={styles.colTipoTarima}>-</Text>
                        <Text style={styles.colCantidadTarima}>-</Text>
                        <Text style={styles.colPesoTarima}>-</Text>
                        <Text style={styles.colEstadoTarima}>{tarima.estatus}</Text>
                      </View>
                    ]
              )}
            </View>

            {/* Totales */}
            <View style={styles.totalesContainer}>
              <View style={styles.totalItem}>
                <Text style={styles.totalLabel}>Total Cajas:</Text>
                <Text style={[styles.totalValue, styles.valorAzul]}>
                  {progreso.tarimas.reduce((sum, t) =>
                    sum + t.tarimasClasificaciones.reduce((s, c) => s + (c.cantidad || 0), 0), 0
                  ).toLocaleString()}
                </Text>
              </View>
              <View style={styles.totalItem}>
                <Text style={styles.totalLabel}>Total Peso:</Text>
                <Text style={[styles.totalValue, styles.valorVerde]}>
                  {progreso.tarimas.reduce((sum, t) =>
                    sum + t.tarimasClasificaciones.reduce((s, c) => s + (c.peso || 0), 0), 0
                  ).toFixed(2)} kg
                </Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>{configuracion?.pie || 'Sistema de Gestión de Empacadora'}</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};
