/**
 * Página principal de gestión de inventario de tarimas
 * Permite visualizar y gestionar el inventario de tarimas en el sistema
 */

// Importaciones de React y librerías externas
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { toast, Toaster } from 'sonner';

// Importaciones de componentes personalizados
import { InventarioTable } from '@/components/Inventario/InventarioTable';
import { DetalleTarimaModal } from '@/components/Inventario/DetalleTarimaModal';
import { TableHeader } from '@/components/Inventario/TableHeader';
import { AnalyticsDashboard } from '@/components/Inventario/AnalyticsDashboard';
import { ReportesExportables } from '@/components/Inventario/ReportesExportables';

// Importaciones de hooks y servicios
import { useInventarioUnificado } from '@/hooks/Inventario/useInventarioUnificado';
import type { InventarioTipoDTO } from '@/types/Inventario/inventario.types';

// Componentes estilizados para la interfaz
const PageContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: rgba(255, 255, 255, 0);
  width: 100%;
`;



const ProductsTableContainer = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #E2E8F0;
  overflow: hidden;
  width: 100%;
  
  @media (max-width: 768px) {
    border-radius: 0.75rem;
  }
  
  @media (max-width: 480px) {
    border-radius: 0.5rem;
  }
`;

const TableContentSection = styled(motion.div)`
  padding: 0.5rem;
  overflow-x: auto;
  background: #fff;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0;
  }
  
  @media (max-width: 480px) {
    padding: 0;
  }
`;

const StyledTable = styled(motion.table)`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 1.08rem;
  border-radius: 1rem;
  overflow: hidden;

  th, td {
    padding: 1.1rem 1rem;
  }

  th {
    background: #f1f5f9;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 2;
  }

  tr:hover td {
    background: #f8fafc;
    transition: background 0.2s;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    
    th, td {
      padding: 0.75rem 0.5rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 0.875rem;
    
    th, td {
      padding: 0.5rem 0.25rem;
    }
  }
`;

/**
 * Componente principal de la página de Inventario
 */
export default function Inventario() {
  // Hook unificado para manejar todos los datos de inventario
  const {
    datos,
    indicadores,
    isLoading,
    error,
    selectedTarima,
    isDetailModalOpen,
    abrirDetalleTarima,
    cerrarDetalleTarima,
    refrescar,
    actualizarTarimasAsignadas,
    actualizarTarimasDesasignadas,
    hayDatos,
    totalRegistros,
    // Datos para AnalyticsDashboard
    datosFormateados,
    analyticsData,
    filtrosTarimas,
    filtrosAnalytics,
    isRefreshing,
    actualizarFiltrosTarimas,
    actualizarFiltrosAnalytics
  } = useInventarioUnificado();

  /**
   * Maneja la acción de ver detalles de una tarima
   */
  const handleVerDetalle = (item: InventarioTipoDTO) => {
    abrirDetalleTarima(item.tarimaOriginal);
  };

  /**
   * Maneja la asignación exitosa y actualiza localmente las tarimas
   */
  const handleAsignacionExitosa = (pedidoAsignado: { id: number; cliente: string; sucursal: string }, tarimasAsignadas: InventarioTipoDTO[]) => {
    // Si el pedidoAsignado tiene id 0, es una desasignación
    if (pedidoAsignado.id === 0) {
      // Actualizar localmente las tarimas desasignadas
      actualizarTarimasDesasignadas(tarimasAsignadas);
    } else {
      // Actualizar localmente las tarimas asignadas
      actualizarTarimasAsignadas(pedidoAsignado, tarimasAsignadas);
    }
  };





  // Mostrar error si existe
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Renderizado del componente
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster richColors position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mensaje de error si existe */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 mb-4"
          >
            Error: {error}
          </motion.div>
        )}

        {/* Dashboard de Analytics con Indicadores Integrados */}
        <AnalyticsDashboard 
          indicadores={indicadores}
          loading={isLoading}
          // Datos del hook unificado
          datosFormateados={datosFormateados}
          analyticsData={analyticsData}
          // Filtros
          filtrosTarimas={filtrosTarimas}
          filtrosAnalytics={filtrosAnalytics}
          // Estados
          isLoading={isLoading}
          error={error}
          isRefreshing={isRefreshing}
          // Acciones
          actualizarFiltrosTarimas={actualizarFiltrosTarimas}
          actualizarFiltrosAnalytics={actualizarFiltrosAnalytics}
          refrescar={refrescar}
        />

        {/* Reportes Exportables */}
        <ReportesExportables datos={datos} />

        {/* Contenedor principal de la tabla de inventario */}
        <ProductsTableContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TableHeader 
            loading={isLoading}
          />

          <TableContentSection
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
                                    <InventarioTable
                          datos={datos}
                          onVerDetalle={handleVerDetalle}
                          loading={isLoading}
                          onAsignacionExitosa={handleAsignacionExitosa}
                        />
          </TableContentSection>
        </ProductsTableContainer>
      </motion.div>

      {/* Modal de Detalles */}
                        <DetalleTarimaModal
                    tarima={selectedTarima}
                    isOpen={isDetailModalOpen}
                    onClose={cerrarDetalleTarima}
                  />


    </PageContainer>
  );
}
