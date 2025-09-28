import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { DatosReporteCliente } from '@/types/Inventario/reportesEspecificos.types';

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
  clientInfo: {
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
  colCliente: { width: '25%' },
  colTipo: { width: '10%' },
  colCantidad: { width: '15%' },
  colPeso: { width: '20%' },
  colPorcentaje: { width: '15%' },
  
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

interface ReporteClientePDFProps {
  datos: DatosReporteCliente[];
  configuracion: any;
}

export const ReporteClientePDF: React.FC<ReporteClientePDFProps> = ({ 
  datos, 
  configuracion 
}) => {
  // Ordenar datos: cliente alfabético, luego peso descendente
  const datosOrdenados = [...datos].sort((a, b) => {
    if (a.cliente !== b.cliente) {
      return a.cliente.localeCompare(b.cliente);
    }
    return b.pesoTotal - a.pesoTotal;
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
          <Text style={styles.subtitle}>Reporte de Tarimas por Cliente</Text>
          <Text style={styles.clientInfo}>
            Total de registros: {datos.length}
          </Text>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Encabezados */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCellHeader, styles.colCliente]}>
              <Text style={styles.tableCellHeader}>Cliente</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.colTipo]}>
              <Text style={styles.tableCellHeader}>Tipo</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.colCantidad]}>
              <Text style={styles.tableCellHeader}>Cantidad Tarimas</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.colPeso]}>
              <Text style={styles.tableCellHeader}>Peso Total (kg)</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.colPorcentaje]}>
              <Text style={styles.tableCellHeader}>% Peso Global</Text>
            </View>
          </View>

          {/* Datos */}
          {datosPagina.map((item, index) => (
            <View 
              key={`${item.cliente}-${item.tipo}-${index}`} 
              style={[
                styles.tableRow, 
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}
            >
              <View style={[styles.tableCell, styles.colCliente]}>
                <Text style={styles.tableCell}>
                  {item.cliente}
                </Text>
              </View>
              <View style={[styles.tableCell, styles.colTipo]}>
                <Text style={styles.tableCell}>
                  {item.tipo}
                </Text>
              </View>
              <View style={[styles.tableCell, styles.colCantidad]}>
                <Text style={styles.tableCell}>
                  {item.cantidad}
                </Text>
              </View>
              <View style={[styles.tableCell, styles.colPeso]}>
                <Text style={styles.tableCell}>{item.pesoTotal.toFixed(1)}</Text>
              </View>
              <View style={[styles.tableCell, styles.colPorcentaje]}>
                <Text style={styles.tableCell}>
                  {item.porcentaje.toFixed(1)}%
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