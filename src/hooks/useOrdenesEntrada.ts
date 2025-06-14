import { useState, useCallback } from 'react';
import { OrdenesEntradaService } from '../services/ordenesEntrada.service';
import { OrdenEntradaDto, CrearOrdenEntradaDto } from '../types/ordenesEntrada';

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
      const [data, pesoTotal, pendientes] = await Promise.all([
        OrdenesEntradaService.obtenerOrdenes(),
        OrdenesEntradaService.obtenerPesoTotalRecibidoHoy(),
        OrdenesEntradaService.obtenerOrdenesPendientesHoy()
      ]);
      setOrdenes(data);
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
      setOrdenes((prev) => [...prev, nuevaOrden]);
      return nuevaOrden;
    } catch (err) {
      setError('Error al crear la orden');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const actualizarOrden = useCallback(async (codigo: string, orden: CrearOrdenEntradaDto) => {
    try {
      setLoading(true);
      setError(null);
      const ordenActualizada = await OrdenesEntradaService.actualizarOrden(codigo, orden);
      if (ordenActualizada) {
        setOrdenes((prev) =>
          prev.map((o) => (o.codigo === codigo ? ordenActualizada : o))
        );
      }
      return ordenActualizada;
    } catch (err) {
      setError('Error al actualizar la orden');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const eliminarOrden = useCallback(async (codigo: string) => {
    try {
      setLoading(true);
      setError(null);
      await OrdenesEntradaService.eliminarOrden(codigo);
      setOrdenes((prev) => prev.filter((o) => o.codigo !== codigo));
    } catch (err) {
      setError('Error al eliminar la orden');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const importarOrdenes = useCallback(async (archivo: File) => {
    try {
      setLoading(true);
      setError(null);
      const ordenesImportadas = await OrdenesEntradaService.importarOrdenes(archivo);
      setOrdenes((prev) => [...prev, ...ordenesImportadas]);
      return ordenesImportadas;
    } catch (err) {
      setError('Error al importar las órdenes');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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