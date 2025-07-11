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
    } catch (err) {
      setError('Error al cargar las órdenes');
      console.error(err);
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
    } catch (err) {
      setError('Error al crear la orden');
      console.error(err);
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
    } catch (err) {
      setError('Error al actualizar la orden');
      console.error(err);
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
    } catch (err) {
      setError('Error al eliminar la orden');
      console.error(err);
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
    } catch (err) {
      setError('Error al importar las órdenes');
      console.error(err);
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
    } catch (err) {
      setError('Error al imprimir la orden');
      console.error(err);
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