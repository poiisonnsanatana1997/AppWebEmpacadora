import { useState, useCallback } from 'react';
import { OrdenesEntradaService } from '../../services/ordenesEntrada.service';
import { OrdenEntradaDto, CrearOrdenEntradaDto, ActualizarOrdenEntradaDto } from '../../types/OrdenesEntrada/ordenesEntrada.types';

export const useOrdenesEntrada = () => {
  const [ordenes, setOrdenes] = useState<OrdenEntradaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pesoTotalRecibidoHoy, setPesoTotalRecibidoHoy] = useState<number>(0);
  const [ordenesPendientesHoy, setOrdenesPendientesHoy] = useState<number>(0);

  const cargarOrdenes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar órdenes y estadísticas en paralelo
      const [ordenesData, pesoTotal, pendientes] = await Promise.all([
        OrdenesEntradaService.obtenerOrdenes(),
        OrdenesEntradaService.obtenerPesoTotalRecibidoHoy(),
        OrdenesEntradaService.obtenerOrdenesPendientesHoy()
      ]);

      // Ordenar las órdenes por fecha de registro (más recientes primero)
      const ordenesOrdenadas = ordenesData.sort((a, b) => 
        new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
      );

      setOrdenes(ordenesOrdenadas);
      setPesoTotalRecibidoHoy(pesoTotal);
      setOrdenesPendientesHoy(pendientes);
    } catch (err: any) {
      console.error('Error al cargar las órdenes:', err);
      // No establecer error si es un error de autenticación (401)
      // ya que el interceptor de axios se encargará de manejar la sesión
      if (err?.response?.status !== 401) {
        setError('Error al cargar las órdenes. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const crearOrden = useCallback(async (orden: CrearOrdenEntradaDto) => {
    try {
      setLoading(true);
      setError(null);
      const nuevaOrden = await OrdenesEntradaService.crearOrden(orden);
      setOrdenes((prev) => {
        const ordenesActualizadas = [...prev, nuevaOrden];
        // Mantener el ordenamiento por fecha de registro
        return ordenesActualizadas.sort((a, b) => 
          new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
        );
      });
      // Actualizar indicadores después de crear
      await cargarOrdenes();
      return nuevaOrden;
    } catch (err: any) {
      console.error('Error al crear la orden:', err);
      // No establecer error si es un error de autenticación (401)
      if (err?.response?.status !== 401) {
        setError('Error al crear la orden. Por favor, intenta nuevamente.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cargarOrdenes]);

  const actualizarOrden = useCallback(async (codigo: string, orden: ActualizarOrdenEntradaDto) => {
    try {
      setLoading(true);
      setError(null);
      const ordenActualizada = await OrdenesEntradaService.actualizarOrden(codigo, orden);
      if (ordenActualizada) {
        setOrdenes((prev) => {
          const ordenesActualizadas = prev.map((o) => (o.codigo === codigo ? ordenActualizada : o));
          // Mantener el ordenamiento por fecha de registro
          return ordenesActualizadas.sort((a, b) => 
            new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
          );
        });
        // Actualizar indicadores después de actualizar
        await cargarOrdenes();
      }
      return ordenActualizada;
    } catch (err: any) {
      console.error('Error al actualizar la orden:', err);
      // No establecer error si es un error de autenticación (401)
      if (err?.response?.status !== 401) {
        setError('Error al actualizar la orden. Por favor, intenta nuevamente.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cargarOrdenes]);

  const eliminarOrden = useCallback(async (codigo: string) => {
    try {
      setLoading(true);
      setError(null);
      await OrdenesEntradaService.eliminarOrden(codigo);
      setOrdenes((prev) => {
        const ordenesFiltradas = prev.filter((o) => o.codigo !== codigo);
        // Mantener el ordenamiento por fecha de registro
        return ordenesFiltradas.sort((a, b) => 
          new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
        );
      });
      // Actualizar indicadores después de eliminar
      await cargarOrdenes();
    } catch (err: any) {
      console.error('Error al eliminar la orden:', err);
      // No establecer error si es un error de autenticación (401)
      if (err?.response?.status !== 401) {
        setError('Error al eliminar la orden. Por favor, intenta nuevamente.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cargarOrdenes]);

  const importarOrdenes = useCallback(async (archivo: File) => {
    try {
      setLoading(true);
      setError(null);
      const ordenesImportadas = await OrdenesEntradaService.importarOrdenes(archivo);
      setOrdenes((prev) => {
        const ordenesActualizadas = [...prev, ...ordenesImportadas];
        // Mantener el ordenamiento por fecha de registro
        return ordenesActualizadas.sort((a, b) => 
          new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
        );
      });
      // Actualizar indicadores después de importar
      await cargarOrdenes();
      return ordenesImportadas;
    } catch (err: any) {
      console.error('Error al importar las órdenes:', err);
      // No establecer error si es un error de autenticación (401)
      if (err?.response?.status !== 401) {
        setError('Error al importar las órdenes. Por favor, intenta nuevamente.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cargarOrdenes]);

  const imprimirOrden = useCallback(async (codigo: string) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await OrdenesEntradaService.imprimirOrden(codigo);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orden-${codigo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error al imprimir la orden:', err);
      // No establecer error si es un error de autenticación (401)
      if (err?.response?.status !== 401) {
        setError('Error al imprimir la orden. Por favor, intenta nuevamente.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ordenes,
    loading,
    error,
    pesoTotalRecibidoHoy,
    ordenesPendientesHoy,
    cargarOrdenes,
    crearOrden,
    actualizarOrden,
    eliminarOrden,
    importarOrdenes,
    imprimirOrden,
  };
}; 