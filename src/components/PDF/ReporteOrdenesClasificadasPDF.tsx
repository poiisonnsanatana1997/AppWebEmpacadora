import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { 
  OrdenClasificadaReporteDTO, 
  ParametrosReporteDTO 
} from '@/types/Reportes/reporteOrdenesClasificadas.types';
import { formatearMoneda } from '@/utils/formatters';

// Estilos para el PDF - Diseño horizontal profesional
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 15,
    fontSize: 8,
  },
  
  // Encabezado
  header: {
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 3,
  },
  
  
  // Tabla principal
  mainTable: {
    width: '100%',
    border: '1px solid #000000',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 25,
  },
  tableHeader: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  
  // Columnas de la tabla
  col1: { width: '8%' },    // Código
  col2: { width: '12%' },   // Proveedor
  col3: { width: '8%' },    // Fecha Recepción
  col4: { width: '6%' },    // Neto Recibido
  col5: { width: '5%' },    // XL (kg)
  col6: { width: '5%' },    // L (kg)
  col7: { width: '5%' },    // M (kg)
  col8: { width: '5%' },    // S (kg)
  col9: { width: '5%' },    // XL ($)
  col10: { width: '5%' },   // L ($)
  col11: { width: '5%' },   // M ($)
  col12: { width: '5%' },   // S ($)
  col13: { width: '6%' },   // Total XL ($)
  col14: { width: '6%' },   // Total L ($)
  col15: { width: '6%' },   // Total M ($)
  col16: { width: '6%' },   // Total S ($)
  col17: { width: '7%' },   // Total General ($)
  col18: { width: '5%' },   // Mermas (kg)
  col19: { width: '5%' },   // Retornos (kg)
  
  // Celdas
  tableCell: {
    padding: 4,
    fontSize: 7,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E0E0E0',
  },
  tableCellHeader: {
    padding: 4,
    fontSize: 7,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: '#2563EB',
    borderRight: '1px solid #E0E0E0',
  },
  
  // Filas alternadas
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#F8F9FA',
  },
  
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    textAlign: 'center',
    fontSize: 7,
    color: '#7F8C8D',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 5,
  },
});

interface ReporteOrdenesClasificadasPDFProps {
  ordenes: OrdenClasificadaReporteDTO[];
  parametros: ParametrosReporteDTO;
  fechaGeneracion: string;
  usuarioGeneracion: string;
}

export const ReporteOrdenesClasificadasPDF: React.FC<ReporteOrdenesClasificadasPDFProps> = ({ 
  ordenes, 
  parametros,
  fechaGeneracion,
  usuarioGeneracion
}) => {
  // Calcular totales consolidados
  
  // Calcular totales por tipo usando la nueva estructura
  let totalXL = 0, totalL = 0, totalM = 0, totalS = 0;
  let totalPesoXL = 0, totalPesoL = 0, totalPesoM = 0, totalPesoS = 0;
  let totalMermas = 0, totalRetornos = 0;
  let totalPesoNeto = 0;

  ordenes.forEach(orden => {
    totalPesoNeto += orden.pesoNetoRecibido;
    totalMermas += orden.totalMermas;
    totalRetornos += orden.totalRetornos;
    
    // Usar informacionTipos en lugar de clasificaciones
    if (orden.informacionTipos && orden.informacionTipos.length > 0) {
      orden.informacionTipos.forEach(infoTipo => {
        const tipo = infoTipo.tipo.toUpperCase();
        const peso = infoTipo.peso;
        const precio = infoTipo.precio;

        // Acumular pesos por tipo
        if (tipo === 'XL') {
          totalPesoXL += peso;
          totalXL += peso * precio;
        } else if (tipo === 'L') {
          totalPesoL += peso;
          totalL += peso * precio;
        } else if (tipo === 'M') {
          totalPesoM += peso;
          totalM += peso * precio;
        } else if (tipo === 'S') {
          totalPesoS += peso;
          totalS += peso * precio;
        }
      });
    }
  });

  const totalGeneral = totalXL + totalL + totalM + totalS;

  // Formatear fecha
  const fechaFormateada = new Date(fechaGeneracion).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>REPORTE DE ÓRDENES CLASIFICADAS</Text>
          <Text style={styles.subtitle}>Sistema de Gestión Empacadora</Text>
        </View>


        {/* Tabla Principal */}
        <View style={styles.mainTable}>
          {/* Encabezado de la tabla */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellHeader, styles.col1]}>Código</Text>
            <Text style={[styles.tableCellHeader, styles.col2]}>Proveedor</Text>
            <Text style={[styles.tableCellHeader, styles.col3]}>Fecha Rec.</Text>
            <Text style={[styles.tableCellHeader, styles.col4]}>Neto (kg)</Text>
            <Text style={[styles.tableCellHeader, styles.col5]}>XL (kg)</Text>
            <Text style={[styles.tableCellHeader, styles.col6]}>L (kg)</Text>
            <Text style={[styles.tableCellHeader, styles.col7]}>M (kg)</Text>
            <Text style={[styles.tableCellHeader, styles.col8]}>S (kg)</Text>
            <Text style={[styles.tableCellHeader, styles.col9]}>XL ($)</Text>
            <Text style={[styles.tableCellHeader, styles.col10]}>L ($)</Text>
            <Text style={[styles.tableCellHeader, styles.col11]}>M ($)</Text>
            <Text style={[styles.tableCellHeader, styles.col12]}>S ($)</Text>
            <Text style={[styles.tableCellHeader, styles.col13]}>Total XL ($)</Text>
            <Text style={[styles.tableCellHeader, styles.col14]}>Total L ($)</Text>
            <Text style={[styles.tableCellHeader, styles.col15]}>Total M ($)</Text>
            <Text style={[styles.tableCellHeader, styles.col16]}>Total S ($)</Text>
            <Text style={[styles.tableCellHeader, styles.col17]}>Total General ($)</Text>
            <Text style={[styles.tableCellHeader, styles.col18]}>Mermas (kg)</Text>
            <Text style={[styles.tableCellHeader, styles.col19]}>Retornos (kg)</Text>
          </View>

          {/* Filas de datos - Una fila por orden */}
          {ordenes.map((orden, ordenIndex) => {
            // Inicializar valores por tipo
            const pesos = { XL: 0, L: 0, M: 0, S: 0 };
            const precios = { XL: 0, L: 0, M: 0, S: 0 };
            const totales = { XL: 0, L: 0, M: 0, S: 0 };
            
            // Procesar cada tipo de la orden
            if (orden.informacionTipos && orden.informacionTipos.length > 0) {
              orden.informacionTipos.forEach(infoTipo => {
                const tipo = infoTipo.tipo.toUpperCase();
                if (tipo in pesos) {
                  pesos[tipo] = infoTipo.peso;
                  precios[tipo] = infoTipo.precio;
                  totales[tipo] = infoTipo.peso * infoTipo.precio;
                }
              });
            }
            
            // Calcular total general
            const totalGeneral = Object.values(totales).reduce((sum, val) => sum + val, 0);
            const fechaRecepcion = orden.fechaRecepcion || 'N/A';

            const isEven = ordenIndex % 2 === 0;

            return (
              <View key={orden.id} style={[styles.tableRow, isEven ? styles.evenRow : styles.oddRow]}>
                <Text style={[styles.tableCell, styles.col1]}>{orden.codigo}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{orden.proveedor.nombre}</Text>
                <Text style={[styles.tableCell, styles.col3]}>{fechaRecepcion}</Text>
                <Text style={[styles.tableCell, styles.col4]}>{orden.pesoNetoRecibido.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.col5]}>{pesos.XL.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.col6]}>{pesos.L.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.col7]}>{pesos.M.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.col8]}>{pesos.S.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.col9]}>{formatearMoneda(precios.XL)}</Text>
                <Text style={[styles.tableCell, styles.col10]}>{formatearMoneda(precios.L)}</Text>
                <Text style={[styles.tableCell, styles.col11]}>{formatearMoneda(precios.M)}</Text>
                <Text style={[styles.tableCell, styles.col12]}>{formatearMoneda(precios.S)}</Text>
                <Text style={[styles.tableCell, styles.col13]}>{formatearMoneda(totales.XL)}</Text>
                <Text style={[styles.tableCell, styles.col14]}>{formatearMoneda(totales.L)}</Text>
                <Text style={[styles.tableCell, styles.col15]}>{formatearMoneda(totales.M)}</Text>
                <Text style={[styles.tableCell, styles.col16]}>{formatearMoneda(totales.S)}</Text>
                <Text style={[styles.tableCell, styles.col17]}>{formatearMoneda(totalGeneral)}</Text>
                <Text style={[styles.tableCell, styles.col18]}>{orden.totalMermas.toFixed(2)}</Text>
                <Text style={[styles.tableCell, styles.col19]}>{orden.totalRetornos.toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        {/* Fila de totales */}
        <View style={[styles.tableRow, { backgroundColor: '#E8F4FD' }]}>
          <Text style={[styles.tableCell, styles.col1, { fontWeight: 'bold' }]}>TOTALES</Text>
          <Text style={[styles.tableCell, styles.col2, { fontWeight: 'bold' }]}></Text>
          <Text style={[styles.tableCell, styles.col3, { fontWeight: 'bold' }]}></Text>
          <Text style={[styles.tableCell, styles.col4, { fontWeight: 'bold' }]}>{totalPesoNeto.toFixed(2)}</Text>
          <Text style={[styles.tableCell, styles.col5, { fontWeight: 'bold' }]}>{totalPesoXL.toFixed(2)}</Text>
          <Text style={[styles.tableCell, styles.col6, { fontWeight: 'bold' }]}>{totalPesoL.toFixed(2)}</Text>
          <Text style={[styles.tableCell, styles.col7, { fontWeight: 'bold' }]}>{totalPesoM.toFixed(2)}</Text>
          <Text style={[styles.tableCell, styles.col8, { fontWeight: 'bold' }]}>{totalPesoS.toFixed(2)}</Text>
          <Text style={[styles.tableCell, styles.col9, { fontWeight: 'bold' }]}></Text>
          <Text style={[styles.tableCell, styles.col10, { fontWeight: 'bold' }]}></Text>
          <Text style={[styles.tableCell, styles.col11, { fontWeight: 'bold' }]}></Text>
          <Text style={[styles.tableCell, styles.col12, { fontWeight: 'bold' }]}></Text>
          <Text style={[styles.tableCell, styles.col13, { fontWeight: 'bold' }]}>{formatearMoneda(totalXL)}</Text>
          <Text style={[styles.tableCell, styles.col14, { fontWeight: 'bold' }]}>{formatearMoneda(totalL)}</Text>
          <Text style={[styles.tableCell, styles.col15, { fontWeight: 'bold' }]}>{formatearMoneda(totalM)}</Text>
          <Text style={[styles.tableCell, styles.col16, { fontWeight: 'bold' }]}>{formatearMoneda(totalS)}</Text>
          <Text style={[styles.tableCell, styles.col17, { fontWeight: 'bold' }]}>{formatearMoneda(totalGeneral)}</Text>
          <Text style={[styles.tableCell, styles.col18, { fontWeight: 'bold' }]}>{totalMermas.toFixed(2)}</Text>
          <Text style={[styles.tableCell, styles.col19, { fontWeight: 'bold' }]}>{totalRetornos.toFixed(2)}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Reporte generado automáticamente por el Sistema de Gestión Empacadora</Text>
          <Text>Generado el {fechaFormateada} por {usuarioGeneracion}</Text>
        </View>
      </Page>
    </Document>
  );
};
