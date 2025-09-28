import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { PedidoCompletoDTO, ClasificacionCompletaDTO } from '@/types/OrdenesEntrada/ordenesEntradaCompleto.types';

// Estilos para el PDF - Diseño horizontal profesional igual al Excel
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 15,
    fontSize: 7,
  },
  
  // Encabezado
  header: {
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: '#7F8C8D',
    marginBottom: 3,
  },
  dateInfo: {
    fontSize: 8,
    color: '#34495E',
    marginBottom: 10,
  },
  
  // Información básica (como en Excel)
  basicInfo: {
    marginBottom: 10,
  },
  basicInfoRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  basicInfoLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#34495E',
    width: '20%',
  },
  basicInfoValue: {
    fontSize: 7,
    color: '#2C3E50',
    width: '30%',
  },
  
  // Tabla principal de clasificación (como Excel)
  mainTable: {
    width: '100%',
    border: '1px solid #000000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 20,
  },
  tableHeader: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  
  // Columnas principales (18 columnas como en Excel)
  col1: { width: '8%' },   // Fecha Recepción
  col2: { width: '8%' },   // No Remisión
  col3: { width: '12%' },  // Productor
  col4: { width: '8%' },   // Peso Neto
  col5: { width: '6%' },   // Merma
  col6: { width: '6%' },   // XL (Kg)
  col7: { width: '6%' },   // L (Kg)
  col8: { width: '6%' },   // M (Kg)
  col9: { width: '6%' },   // S (Kg)
  col10: { width: '6%' },  // $ XL
  col11: { width: '6%' },  // $ L
  col12: { width: '6%' },  // $ M
  col13: { width: '6%' },  // $ S
  col14: { width: '8%' },  // $ SUMA
  col15: { width: '6%' },  // Precio Emb XL
  col16: { width: '6%' },  // Precio Emb L
  col17: { width: '6%' },  // Precio Emb M
  col18: { width: '6%' },  // Precio Emb S
  
  // Celdas con colores profesionales
  tableCell: {
    padding: 3,
    fontSize: 7,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
  },
  tableCellHeader: {
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: '#2C3E50',
  },
  
  // Filas alternadas profesionales
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#F8F9FA',
  },
  
  // Sección de mermas
  mermasSection: {
    marginBottom: 10,
  },
  mermasTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  mermasTable: {
    width: '100%',
    border: '1px solid #000000',
    marginBottom: 10,
  },
  mermasHeader: {
    backgroundColor: '#E74C3C',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mermasHeaderCell: {
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: '#E74C3C',
  },
  colMerma1: { width: '25%' },
  colMerma2: { width: '15%' },
  colMerma3: { width: '20%' },
  colMerma4: { width: '40%' },
  
  // Sección de retornos
  retornosSection: {
    marginBottom: 10,
  },
  retornosTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  retornosTable: {
    width: '100%',
    border: '1px solid #000000',
    marginBottom: 10,
  },
  retornosHeader: {
    backgroundColor: '#F39C12',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  retornosHeaderCell: {
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: '#F39C12',
  },
  colRetorno1: { width: '25%' },
  colRetorno2: { width: '15%' },
  colRetorno3: { width: '20%' },
  colRetorno4: { width: '40%' },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    textAlign: 'center',
    fontSize: 6,
    color: '#7F8C8D',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 5,
  },
});

interface ReporteClasificacionPDFProps {
  orden: PedidoCompletoDTO;
  clasificaciones: ClasificacionCompletaDTO[];
}

export const ReporteClasificacionPDF: React.FC<ReporteClasificacionPDFProps> = ({ 
  orden, 
  clasificaciones 
}) => {
  const clasificacion = clasificaciones[0];
  
  // Procesar datos exactamente como en el Excel
  const proveedor = orden?.proveedor?.nombre || '/';
  const producto = orden?.producto?.nombre || '/';
  let fechaRaw = orden?.fechaRecepcion || orden?.fechaRegistro;
  let fecha: string = '/';
  if (fechaRaw) {
    const d = new Date(fechaRaw);
    if (!isNaN(d.getTime())) {
      fecha = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  }
  const noRemision = orden?.codigo || '/';
  const noProd = clasificacion?.id?.toString() || '/';
  const pesoNetoRecibido = (clasificacion?.pesoTotal || 0).toFixed(2);
  
  // Calcular pesos por tipo
  const pesosPorTipo = { XL: 0, L: 0, M: 0, S: 0 };
  clasificacion?.tarimasClasificaciones?.forEach(tarima => {
    if (pesosPorTipo[tarima.tipo] !== undefined) {
      pesosPorTipo[tarima.tipo] += tarima.peso || 0;
    }
  });
  
  // Precios por tipo
  const preciosPorTipo = {
    XL: clasificacion?.xl || 0,
    L: clasificacion?.l || 0,
    M: clasificacion?.m || 0,
    S: clasificacion?.s || 0,
  };
  
  // Totales por tipo
  const totalesPorTipo = {
    XL: pesosPorTipo.XL * preciosPorTipo.XL,
    L: pesosPorTipo.L * preciosPorTipo.L,
    M: pesosPorTipo.M * preciosPorTipo.M,
    S: pesosPorTipo.S * preciosPorTipo.S,
  };
  
  // Totales generales
  const sumaTotal = Object.values(totalesPorTipo).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);
  const totalMermas = (clasificacion?.mermas?.reduce((acc, m) => acc + (m.peso || 0), 0) || 0).toFixed(2);
  const totalRetornos = (clasificacion?.retornosDetalle?.reduce((acc, r) => acc + (r.peso || 0), 0) || 0).toFixed(2);

  // Datos de mermas (como en Excel)
  const mermas = clasificacion?.mermas && clasificacion.mermas.length > 0
    ? clasificacion.mermas.map(m => ({ tipo: m.tipo || '/', peso: (m.peso || 0).toFixed(2), observaciones: m.observaciones || '/' }))
    : [{ tipo: '/', peso: '0.00', observaciones: '/' }];

  // Datos de retornos (como en Excel)
  const retornos = clasificacion?.retornosDetalle && clasificacion.retornosDetalle.length > 0
    ? clasificacion.retornosDetalle.map(r => ({ numero: r.numero || '/', peso: (r.peso || 0).toFixed(2), observaciones: r.observaciones || '/' }))
    : [{ numero: '/', peso: '0.00', observaciones: '/' }];

  // Funciones de formato (como en Excel)
  const formatNumberAsText = (num: number): string => num.toFixed(2);
  const formatCurrencyAsText = (num: number): string => `$${num.toFixed(2)}`;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE DE CLASIFICACIÓN</Text>
          <Text style={styles.subtitle}>Sistema de Gestión Empacadora</Text>
          <Text style={styles.dateInfo}>
            Generado el {new Date().toLocaleDateString('es-ES')} a las {new Date().toLocaleTimeString('es-ES')}
          </Text>
        </View>

        {/* Información Básica (como en Excel) */}
        <View style={styles.basicInfo}>
          <View style={styles.basicInfoRow}>
            <Text style={styles.basicInfoLabel}>Proveedor</Text>
            <Text style={styles.basicInfoValue}>{proveedor}</Text>
          </View>
          <View style={styles.basicInfoRow}>
            <Text style={styles.basicInfoLabel}>Producto</Text>
            <Text style={styles.basicInfoValue}>{producto}</Text>
          </View>
          <View style={styles.basicInfoRow}>
            <Text style={styles.basicInfoLabel}>Fecha de Recepción</Text>
            <Text style={styles.basicInfoValue}>{fecha}</Text>
          </View>
          <View style={styles.basicInfoRow}>
            <Text style={styles.basicInfoLabel}>No. de Remisión</Text>
            <Text style={styles.basicInfoValue}>{noRemision}</Text>
          </View>
          <View style={styles.basicInfoRow}>
            <Text style={styles.basicInfoLabel}>No. de Productor</Text>
            <Text style={styles.basicInfoValue}>{noProd}</Text>
          </View>
        </View>

        {/* Tabla Principal de Clasificación (exactamente como Excel) */}
        <View style={styles.mainTable}>
          {/* Fila 1 - Encabezados principales */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCellHeader, styles.col1]}>
              <Text style={styles.tableCellHeader}>FECHA DE RECEPCIÓN</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col2]}>
              <Text style={styles.tableCellHeader}>NO DE REMISIÓN</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col3]}>
              <Text style={styles.tableCellHeader}>PRODUCTOR</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col4]}>
              <Text style={styles.tableCellHeader}>PESO NETO RECIBIDO</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col5]}>
              <Text style={styles.tableCellHeader}>MERMA</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col6]}>
              <Text style={styles.tableCellHeader}>XL (Kg)</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col7]}>
              <Text style={styles.tableCellHeader}>L (Kg)</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col8]}>
              <Text style={styles.tableCellHeader}>M (Kg)</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col9]}>
              <Text style={styles.tableCellHeader}>S (Kg)</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col10]}>
              <Text style={styles.tableCellHeader}>$ XL</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col11]}>
              <Text style={styles.tableCellHeader}>$ L</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col12]}>
              <Text style={styles.tableCellHeader}>$ M</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col13]}>
              <Text style={styles.tableCellHeader}>$ S</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col14]}>
              <Text style={styles.tableCellHeader}>$ SUMA</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col15]}>
              <Text style={styles.tableCellHeader}>XL</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col16]}>
              <Text style={styles.tableCellHeader}>L</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col17]}>
              <Text style={styles.tableCellHeader}>M</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col18]}>
              <Text style={styles.tableCellHeader}>S</Text>
            </View>
          </View>

          {/* Fila 2 - Precio de Embarque */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCellHeader, styles.col1]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col2]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col3]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col4]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col5]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col6]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col7]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col8]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col9]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col10]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col11]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col12]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col13]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col14]}>
              <Text style={styles.tableCellHeader}>Precio de Embarque</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col15]}>
              <Text style={styles.tableCellHeader}>XL</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col16]}>
              <Text style={styles.tableCellHeader}>L</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col17]}>
              <Text style={styles.tableCellHeader}>M</Text>
            </View>
            <View style={[styles.tableCellHeader, styles.col18]}>
              <Text style={styles.tableCellHeader}>S</Text>
            </View>
          </View>

          {/* Fila 3 - Datos */}
          <View style={[styles.tableRow, styles.evenRow]}>
            <View style={[styles.tableCell, styles.col1]}>
              <Text style={styles.tableCell}>{fecha}</Text>
            </View>
            <View style={[styles.tableCell, styles.col2]}>
              <Text style={styles.tableCell}>{noRemision}</Text>
            </View>
            <View style={[styles.tableCell, styles.col3]}>
              <Text style={styles.tableCell}>{proveedor}</Text>
            </View>
            <View style={[styles.tableCell, styles.col4]}>
              <Text style={styles.tableCell}>{pesoNetoRecibido}</Text>
            </View>
            <View style={[styles.tableCell, styles.col5]}>
              <Text style={styles.tableCell}>{totalMermas}</Text>
            </View>
            <View style={[styles.tableCell, styles.col6]}>
              <Text style={styles.tableCell}>{formatNumberAsText(pesosPorTipo.XL)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col7]}>
              <Text style={styles.tableCell}>{formatNumberAsText(pesosPorTipo.L)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col8]}>
              <Text style={styles.tableCell}>{formatNumberAsText(pesosPorTipo.M)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col9]}>
              <Text style={styles.tableCell}>{formatNumberAsText(pesosPorTipo.S)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col10]}>
              <Text style={styles.tableCell}>{formatCurrencyAsText(totalesPorTipo.XL)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col11]}>
              <Text style={styles.tableCell}>{formatCurrencyAsText(totalesPorTipo.L)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col12]}>
              <Text style={styles.tableCell}>{formatCurrencyAsText(totalesPorTipo.M)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col13]}>
              <Text style={styles.tableCell}>{formatCurrencyAsText(totalesPorTipo.S)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col14]}>
              <Text style={styles.tableCell}>{formatCurrencyAsText(sumaTotal)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col15]}>
              <Text style={styles.tableCell}>{formatCurrencyAsText(preciosPorTipo.XL)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col16]}>
              <Text style={styles.tableCell}>{formatCurrencyAsText(preciosPorTipo.L)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col17]}>
              <Text style={styles.tableCell}>{formatCurrencyAsText(preciosPorTipo.M)}</Text>
            </View>
            <View style={[styles.tableCell, styles.col18]}>
              <Text style={styles.tableCell}>{formatCurrencyAsText(preciosPorTipo.S)}</Text>
            </View>
          </View>
        </View>

        {/* Sección de Mermas (como en Excel) */}
        <View style={styles.mermasSection}>
          <Text style={styles.mermasTitle}>MERMAS</Text>
          <View style={styles.mermasTable}>
            {/* Encabezado de mermas */}
            <View style={[styles.tableRow, styles.mermasHeader]}>
              <View style={[styles.mermasHeaderCell, styles.colMerma1]}>
                <Text style={styles.mermasHeaderCell}>MERMA</Text>
              </View>
              <View style={[styles.mermasHeaderCell, styles.colMerma2]}>
                <Text style={styles.mermasHeaderCell}>TIPO</Text>
              </View>
              <View style={[styles.mermasHeaderCell, styles.colMerma3]}>
                <Text style={styles.mermasHeaderCell}>PESO (kg)</Text>
              </View>
              <View style={[styles.mermasHeaderCell, styles.colMerma4]}>
                <Text style={styles.mermasHeaderCell}>OBSERVACIONES</Text>
              </View>
            </View>
            
            {/* Datos de mermas */}
            {mermas.map((merma, index) => (
              <View 
                key={index}
                style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
              >
                <View style={[styles.tableCell, styles.colMerma1]}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={[styles.tableCell, styles.colMerma2]}>
                  <Text style={styles.tableCell}>{merma.tipo}</Text>
                </View>
                <View style={[styles.tableCell, styles.colMerma3]}>
                  <Text style={styles.tableCell}>{merma.peso}</Text>
                </View>
                <View style={[styles.tableCell, styles.colMerma4]}>
                  <Text style={styles.tableCell}>{merma.observaciones}</Text>
                </View>
              </View>
            ))}
            
            {/* Total de mermas */}
            <View style={[styles.tableRow, styles.oddRow]}>
              <View style={[styles.tableCell, styles.colMerma1]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCell, styles.colMerma2]}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL MERMA</Text>
              </View>
              <View style={[styles.tableCell, styles.colMerma3]}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{totalMermas}</Text>
              </View>
              <View style={[styles.tableCell, styles.colMerma4]}>
                <Text style={styles.tableCell}></Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sección de Retornos (como en Excel) */}
        <View style={styles.retornosSection}>
          <Text style={styles.retornosTitle}>RETORNOS</Text>
          <View style={styles.retornosTable}>
            {/* Encabezado de retornos */}
            <View style={[styles.tableRow, styles.retornosHeader]}>
              <View style={[styles.retornosHeaderCell, styles.colRetorno1]}>
                <Text style={styles.retornosHeaderCell}>RETORNOS</Text>
              </View>
              <View style={[styles.retornosHeaderCell, styles.colRetorno2]}>
                <Text style={styles.retornosHeaderCell}>NÚMERO</Text>
              </View>
              <View style={[styles.retornosHeaderCell, styles.colRetorno3]}>
                <Text style={styles.retornosHeaderCell}>PESO (kg)</Text>
              </View>
              <View style={[styles.retornosHeaderCell, styles.colRetorno4]}>
                <Text style={styles.retornosHeaderCell}>OBSERVACIONES</Text>
              </View>
            </View>
            
            {/* Datos de retornos */}
            {retornos.map((retorno, index) => (
              <View 
                key={index}
                style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
              >
                <View style={[styles.tableCell, styles.colRetorno1]}>
                  <Text style={styles.tableCell}></Text>
                </View>
                <View style={[styles.tableCell, styles.colRetorno2]}>
                  <Text style={styles.tableCell}>{retorno.numero}</Text>
                </View>
                <View style={[styles.tableCell, styles.colRetorno3]}>
                  <Text style={styles.tableCell}>{retorno.peso}</Text>
                </View>
                <View style={[styles.tableCell, styles.colRetorno4]}>
                  <Text style={styles.tableCell}>{retorno.observaciones}</Text>
                </View>
              </View>
            ))}
            
            {/* Total de retornos */}
            <View style={[styles.tableRow, styles.oddRow]}>
              <View style={[styles.tableCell, styles.colRetorno1]}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={[styles.tableCell, styles.colRetorno2]}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>TOTAL RETORNOS</Text>
              </View>
              <View style={[styles.tableCell, styles.colRetorno3]}>
                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{totalRetornos}</Text>
              </View>
              <View style={[styles.tableCell, styles.colRetorno4]}>
                <Text style={styles.tableCell}></Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Reporte generado automáticamente por el Sistema de Gestión Empacadora
          </Text>
        </View>
      </Page>
    </Document>
  );
};
