import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { DatosReportePeriodo } from '@/types/Inventario/reportesEspecificos.types';

// Estilos para el PDF - Diseño horizontal desde cero
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontSize: 8,
  },
  
  // Encabezado
  header: {
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#7F8C8D',
    marginBottom: 3,
  },
  periodInfo: {
    fontSize: 8,
    color: '#34495E',
    marginBottom: 10,
  },
  
  // Tabla principal
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 20,
  },
  tableHeader: {
    backgroundColor: '#2C3E50',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  
  // Columnas con anchos fijos para orientación horizontal
  colFecha: { width: '12%' },
  colCodigo: { width: '20%' },
  colTipo: { width: '8%' },
  colPeso: { width: '12%' },
  colCliente: { width: '35%' },
  colFechaRegistro: { width: '13%' },
  
  // Celdas
  tableCell: {
    padding: 3,
    fontSize: 7,
    textAlign: 'center',
  },
  tableCellHeader: {
    padding: 3,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: '#2C3E50',
  },
  
  // Filas alternadas
  evenRow: {
    backgroundColor: '#F8F9FA',
  },
  oddRow: {
    backgroundColor: '#FFFFFF',
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
    textAlign: 'center',
    fontSize: 7,
    color: '#7F8C8D',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 5,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    fontSize: 7,
    color: '#7F8C8D',
  },
});

interface ReportePeriodoPDFProps {
  datos: DatosReportePeriodo[];
  configuracion: any;
}

export const ReportePeriodoPDF: React.FC<ReportePeriodoPDFProps> = ({ 
  datos, 
  configuracion 
}) => {
  // Ordenar datos: fecha descendente, luego código ascendente
  const datosOrdenados = [...datos].sort((a, b) => {
    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();
    if (fechaA !== fechaB) return fechaB - fechaA;
    return a.codigo.localeCompare(b.codigo);
  });

  // Dividir datos en páginas (30 filas por página para orientación horizontal)
  const filasPorPagina = 30;
  const totalPaginas = Math.ceil(datosOrdenados.length / filasPorPagina);
  
  const paginas = [];
  for (let i = 0; i < totalPaginas; i++) {
    const inicio = i * filasPorPagina;
    const fin = Math.min(inicio + filasPorPagina, datosOrdenados.length);
    const datosPagina = datosOrdenados.slice(inicio, fin);
    
    paginas.push(
      <Page key={i} size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{configuracion.nombre}</Text>
          <Text style={styles.subtitle}>Reporte de Inventario por Período</Text>
          <Text style={styles.periodInfo}>
            Período: {configuracion.filtros.fechaInicio} - {configuracion.filtros.fechaFin} | 
            Total de registros: {datos.length}
          </Text>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Encabezados */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCellHeader, styles.colFecha]}>
              <Text style={styles.tableCellHeader}>Fecha</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.colCodigo]}>
              <Text style={styles.tableCellHeader}>Código</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.colTipo]}>
              <Text style={styles.tableCellHeader}>Tipo</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.colPeso]}>
              <Text style={styles.tableCellHeader}>Peso (kg)</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.colCliente]}>
              <Text style={styles.tableCellHeader}>Cliente</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.colFechaRegistro]}>
              <Text style={styles.tableCellHeader}>Registro</Text>
            </View>
          </View>

          {/* Datos */}
          {datosPagina.map((item, index) => (
            <View 
              key={`${item.codigo}-${index}`} 
              style={[
                styles.tableRow, 
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <View style={[styles.tableCell, styles.colFecha]}>
                <Text style={styles.tableCell}>
                  {new Date(item.fecha).toLocaleDateString('es-ES')}
                </Text>
              </View>
              <View style={[styles.tableCell, styles.colCodigo]}>
                <Text style={styles.tableCell}>
                  {item.codigo}
                </Text>
              </View>
              <View style={[styles.tableCell, styles.colTipo]}>
                <Text style={styles.tableCell}>{item.tipo}</Text>
              </View>
              <View style={[styles.tableCell, styles.colPeso]}>
                <Text style={styles.tableCell}>{item.pesoTotal.toFixed(1)}</Text>
              </View>
              <View style={[styles.tableCell, styles.colCliente]}>
                <Text style={styles.tableCell}>
                  {item.cliente}
                </Text>
              </View>
              <View style={[styles.tableCell, styles.colFechaRegistro]}>
                <Text style={styles.tableCell}>
                  {new Date(item.fechaRegistro).toLocaleDateString('es-ES')}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Generado el {new Date().toLocaleDateString('es-ES')} a las {new Date().toLocaleTimeString('es-ES')}
          </Text>
        </View>

        {/* Número de página */}
        <Text style={styles.pageNumber}>
          Página {i + 1} de {totalPaginas}
        </Text>
      </Page>
    );
  }

  return (
    <Document>
      {paginas}
    </Document>
  );
};