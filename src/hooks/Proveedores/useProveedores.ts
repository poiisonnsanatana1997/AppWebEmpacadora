import { useState, useCallback } from "react";
import { ProveedoresService } from "@/services/proveedores.service";
import type { ProveedorCompletoDto, CrearProveedorDto, ActualizarProveedorDto } from "@/types/Proveedores/proveedores.types";

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<ProveedorCompletoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los proveedores
  const cargarProveedores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ProveedoresService.obtenerProveedores();
      setProveedores(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener proveedor por ID
  const obtenerProveedor = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await ProveedoresService.obtenerProveedor(id);
    } catch (err: any) {
      setError(err.message || "Error al obtener proveedor");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear proveedor
  const crearProveedor = useCallback(async (data: CrearProveedorDto) => {
    setLoading(true);
    setError(null);
    try {
      const nuevo = await ProveedoresService.crearProveedor(data);
      setProveedores(prev => [...prev, nuevo]);
      return nuevo;
    } catch (err: any) {
      setError(err.message || "Error al crear proveedor");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar proveedor
  const actualizarProveedor = useCallback(async (id: number, data: ActualizarProveedorDto) => {
    setLoading(true);
    setError(null);
    try {
      const actualizado = await ProveedoresService.actualizarProveedor(id, data);
      setProveedores(prev => prev.map(p => p.id === id ? actualizado : p));
      return actualizado;
    } catch (err: any) {
      setError(err.message || "Error al actualizar proveedor");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar proveedor
  const eliminarProveedor = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await ProveedoresService.eliminarProveedor(id);
      setProveedores(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Error al eliminar proveedor");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cambiar estado del proveedor (activar/desactivar)
  const cambiarEstadoProveedor = useCallback(async (id: number, activo: boolean) => {
    try {
      // Obtener el proveedor actual
      const proveedorActual = proveedores.find(p => p.id === id);
      if (!proveedorActual) {
        throw new Error('Proveedor no encontrado');
      }

      // Crear objeto con todos los datos del proveedor y el nuevo estado
      const datosActualizados = {
        nombre: proveedorActual.nombre,
        rfc: proveedorActual.rfc,
        telefono: proveedorActual.telefono,
        correo: proveedorActual.correo,
        direccionFiscal: proveedorActual.direccionFiscal,
        activo: activo,
        situacionFiscal: null // No enviamos archivo en cambio de estado
      };

      // Llamar directamente al servicio sin cambiar el estado de loading
      const proveedorActualizado = await ProveedoresService.actualizarProveedor(id, datosActualizados);
      
      // Actualizar el estado local directamente
      setProveedores(prev => prev.map(p => p.id === id ? proveedorActualizado : p));
      
      return proveedorActualizado;
    } catch (err: any) {
      setError(err.message || "Error al cambiar estado del proveedor");
      throw err;
    }
  }, [proveedores]);

  return {
    proveedores,
    loading,
    error,
    cargarProveedores,
    obtenerProveedor,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
    cambiarEstadoProveedor,
    setProveedores // Útil para recarga manual o importación masiva
  };
}; 