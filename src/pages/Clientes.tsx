/**
 * Página principal de gestión de clientes
 * Permite crear, actualizar, eliminar y gestionar clientes con sus sucursales y cajas
 */

// Importaciones de React y librerías externas
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { Toaster, toast } from 'sonner';

// Importaciones de componentes personalizados
import { ClienteTable } from '../components/Clientes/ClienteTable';
import { TableHeader } from '../components/Clientes/TableHeader';
import { CrearClienteModal } from '../components/Clientes/CrearClienteModal';
import { ActualizarClienteModal } from '../components/Clientes/ActualizarClienteModal';
import { DetalleClienteModal } from '../components/Clientes/DetalleClienteModal';
import { SucursalModal } from '../components/Clientes/Sucursales/SucursalModal';
import { CajaClienteModal } from '../components/Clientes/CajasCliente/CajaClienteModal';



// Importaciones de hooks y servicios
import { useClientes } from '../hooks/Clientes/useClientes';
import { SucursalesService } from '../services/sucursales.service';
import { CajaClienteService } from '../services/cajaCliente.service';


// Importaciones de tipos
import { ClienteDTO, CreateClienteDTO, UpdateClienteDTO } from '../types/Cliente/cliente.types';
import { SucursalDTO, CreateSucursalDTO, UpdateSucursalDTO } from '../types/Sucursales/sucursales.types';
import { CrearSucursalFormData, ActualizarSucursalFormData } from '../schemas/sucursalFormSchema';
import { CajaClienteDTO, CreateCajaClienteDTO, UpdateCajaClienteDTO } from '../types/Cajas/cajaCliente.types';

// Importaciones de UI
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

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

export const Clientes: React.FC = () => {
  // Hook personalizado para gestionar los clientes
  const {
    clientes,
    loading: clientesLoading,
    error: clientesError,
    createCliente,
    updateCliente,
    clearError: clearClientesError
  } = useClientes();





  // Estados para modales y operaciones
  const [crearModalOpen, setCrearModalOpen] = React.useState(false);
  const [editarModalOpen, setEditarModalOpen] = React.useState(false);
  const [detalleModalOpen, setDetalleModalOpen] = React.useState(false);
  const [sucursalesModalOpen, setSucursalesModalOpen] = React.useState(false);
  const [cajasModalOpen, setCajasModalOpen] = React.useState(false);
  const [sucursalFormModalOpen, setSucursalFormModalOpen] = React.useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = React.useState<SucursalDTO | null>(null);
  const [cajaFormModalOpen, setCajaFormModalOpen] = React.useState(false);
  const [cajaSeleccionada, setCajaSeleccionada] = React.useState<CajaClienteDTO | null>(null);
  const [clienteActual, setClienteActual] = React.useState<ClienteDTO | null>(null);

  const [sucursalAEliminar, setSucursalAEliminar] = React.useState<number | null>(null);
  const [deleteSucursalDialogOpen, setDeleteSucursalDialogOpen] = React.useState(false);
  const [cajaAEliminar, setCajaAEliminar] = React.useState<number | null>(null);
  const [deleteCajaDialogOpen, setDeleteCajaDialogOpen] = React.useState(false);


  // Estados de loading
  const [sucursalesLoading, setSucursalesLoading] = React.useState(false);
  const [cajasLoading, setCajasLoading] = React.useState(false);

  // Estados de datos
  const [clienteSeleccionado, setClienteSeleccionado] = React.useState<ClienteDTO | null>(null);


  // Los datos se cargan automáticamente con el hook useClientes

  // Manejador para crear cliente
  const handleCrearCliente = useCallback(async (data: CreateClienteDTO) => {
    try {
      const resultado = await createCliente(data);
      if (resultado) {
        setCrearModalOpen(false);
        toast.success('Cliente creado correctamente');
      }
    } catch (error) {
      console.error('Error al crear cliente:', error);
      toast.error('Error al crear el cliente');
    }
  }, [createCliente]);

  // Manejador para actualizar cliente
  const handleActualizarCliente = useCallback(async (data: UpdateClienteDTO) => {
    if (!clienteSeleccionado) return;
    
    try {
      const resultado = await updateCliente(clienteSeleccionado.id, data);
      if (resultado) {
        setEditarModalOpen(false);
        setClienteSeleccionado(null);
        toast.success('Cliente actualizado correctamente');
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      toast.error('Error al actualizar el cliente');
    }
  }, [updateCliente, clienteSeleccionado]);

  // Manejador para abrir modal de creación
  const handleOpenModalNuevoCliente = useCallback(() => {
    setCrearModalOpen(true);
  }, []);

  // Manejador para editar cliente
  const handleEditarCliente = useCallback((cliente: ClienteDTO) => {
    setClienteSeleccionado(cliente);
    setEditarModalOpen(true);
  }, []);

  // Manejador para ver detalle
  const handleVerDetalle = useCallback((cliente: ClienteDTO) => {
    setClienteSeleccionado(cliente);
    setDetalleModalOpen(true);
  }, []);

  // Manejador para ver sucursales
  const handleVerSucursales = useCallback((cliente: ClienteDTO) => {
    setClienteActual(cliente);
    setSucursalesModalOpen(true);
    // No necesitamos cargar sucursales porque ya vienen con el cliente
  }, []);





  // Manejador unificado para crear/editar sucursal
  const handleSubmitSucursal = useCallback(async (data: CrearSucursalFormData | ActualizarSucursalFormData) => {
    setSucursalesLoading(true);
    try {
      if (sucursalSeleccionada) {
        // Modo editar
        const resultado = await SucursalesService.actualizarSucursal(sucursalSeleccionada.id, data as UpdateSucursalDTO);
        if (resultado) {
          setTimeout(() => {
            setSucursalFormModalOpen(false);
            setSucursalSeleccionada(null);
          }, 100);
          toast.success('Sucursal actualizada correctamente');
          
          // Actualizar el estado local del cliente actual
          if (clienteActual) {
            const sucursalesActualizadas = clienteActual.sucursales?.map(sucursal =>
              sucursal.id === sucursalSeleccionada.id ? resultado : sucursal
            ) || [];
            
            setClienteActual({
              ...clienteActual,
              sucursales: sucursalesActualizadas
            });
          }
        }
      } else {
        // Modo crear
        const createData = {
          ...data,
          idCliente: clienteActual?.id
        } as CreateSucursalDTO;
        
        const resultado = await SucursalesService.crearSucursal(createData);
        if (resultado) {
          setTimeout(() => {
            setSucursalFormModalOpen(false);
          }, 100);
          toast.success('Sucursal creada correctamente');
          
          // Actualizar el estado local del cliente actual
          if (clienteActual) {
            const sucursalesActualizadas = [
              ...(clienteActual.sucursales || []),
              resultado
            ];
            
            setClienteActual({
              ...clienteActual,
              sucursales: sucursalesActualizadas
            });
          }
        }
      }
    } catch (error) {
      console.error('Error al procesar sucursal:', error);
      toast.error(sucursalSeleccionada ? 'Error al actualizar la sucursal' : 'Error al crear la sucursal');
    } finally {
      setSucursalesLoading(false);
    }
  }, [clienteActual, sucursalSeleccionada]);



  // Manejador para crear caja cliente
  const handleCrearCajaCliente = useCallback(async (data: CreateCajaClienteDTO) => {
    if (!clienteActual) return;
    
    setCajasLoading(true);
    try {
      const createData = {
        ...data,
        idCliente: clienteActual.id
      };
      
      const resultado = await CajaClienteService.crearCajaCliente(createData);
      if (resultado) {
        toast.success('Caja cliente creada correctamente');
        
        // Actualizar el estado local del cliente actual
        const cajasActualizadas = [
          ...(clienteActual.cajasCliente || []),
          resultado
        ];
        
        setClienteActual({
          ...clienteActual,
          cajasCliente: cajasActualizadas
        });
      }
    } catch (error) {
      console.error('Error al crear caja cliente:', error);
      toast.error('Error al crear la caja cliente');
    } finally {
      setCajasLoading(false);
    }
  }, [clienteActual]);

  // Manejador para abrir diálogo de confirmación de eliminación de caja
  const handleEliminarCajaCliente = useCallback((id: number) => {
    setCajaAEliminar(id);
    setDeleteCajaDialogOpen(true);
  }, []);

  // Manejador para confirmar eliminación de caja
  const confirmarEliminarCaja = useCallback(async () => {
    if (!clienteActual || !cajaAEliminar) return;
    
    setCajasLoading(true);
    try {
      await CajaClienteService.eliminarCajaCliente(cajaAEliminar);
      toast.success('Caja cliente eliminada correctamente');
      
      // Actualizar el estado local del cliente actual
      const cajasActualizadas = clienteActual.cajasCliente?.filter(
        caja => caja.id !== cajaAEliminar
      ) || [];
      
      setClienteActual({
        ...clienteActual,
        cajasCliente: cajasActualizadas
      });
    } catch (error) {
      console.error('Error al eliminar caja cliente:', error);
      toast.error('Error al eliminar la caja cliente');
    } finally {
      setCajasLoading(false);
      setDeleteCajaDialogOpen(false);
      setCajaAEliminar(null);
    }
  }, [clienteActual, cajaAEliminar]);

  // Manejador para cancelar eliminación de caja
  const handleCancelEliminarCaja = useCallback(() => {
    setDeleteCajaDialogOpen(false);
    setCajaAEliminar(null);
  }, []);

  // Manejador para editar caja
  const handleEditarCajaCliente = useCallback((caja: CajaClienteDTO) => {
    setCajaSeleccionada(caja); // objeto = modo editar
    setCajaFormModalOpen(true);
  }, []);

  // Manejador para submit del formulario de caja
  const handleSubmitCaja = useCallback(async (data: CreateCajaClienteDTO | UpdateCajaClienteDTO) => {
    setCajasLoading(true);
    try {
      if (cajaSeleccionada) {
        // Modo editar
        const resultado = await CajaClienteService.actualizarCajaCliente(cajaSeleccionada.id, data as UpdateCajaClienteDTO);
        if (resultado) {
          setTimeout(() => {
            setCajaFormModalOpen(false);
            setCajaSeleccionada(null);
          }, 100);
          toast.success('Caja actualizada correctamente');
          
          // Actualizar el estado local del cliente actual
          if (clienteActual) {
            const cajasActualizadas = clienteActual.cajasCliente?.map(caja =>
              caja.id === cajaSeleccionada.id ? { ...caja, ...resultado } : caja
            ) || [];
            setClienteActual({ ...clienteActual, cajasCliente: cajasActualizadas });
          }
        }
      } else {
        // Modo crear
        if (!clienteActual) return;
        const createData = {
          ...data,
          idCliente: clienteActual.id
        };
        const resultado = await CajaClienteService.crearCajaCliente(createData as CreateCajaClienteDTO);
        if (resultado) {
          setTimeout(() => {
            setCajaFormModalOpen(false);
            setCajaSeleccionada(null);
          }, 100);
          toast.success('Caja creada correctamente');
          
          // Actualizar el estado local del cliente actual
          const cajasActualizadas = [...(clienteActual.cajasCliente || []), resultado];
          setClienteActual({ ...clienteActual, cajasCliente: cajasActualizadas });
        }
      }
    } catch (error) {
      console.error('Error al procesar caja:', error);
      toast.error('Error al procesar la caja');
    } finally {
      setCajasLoading(false);
    }
  }, [cajaSeleccionada, clienteActual]);

  // Manejador para ver cajas
  const handleVerCajas = useCallback((cliente: ClienteDTO) => {
    setClienteActual(cliente);
    setCajasModalOpen(true);
  }, []);



  // Manejador para cerrar modal de detalle
  const handleCloseDetalleModal = useCallback(() => {
    setDetalleModalOpen(false);
    setClienteSeleccionado(null);
  }, []);

  // Manejador para editar sucursal
  const handleEditarSucursal = useCallback((sucursal: SucursalDTO) => {
    setSucursalSeleccionada(sucursal); // objeto = modo editar
    setSucursalFormModalOpen(true);
  }, []);

  // Manejador para eliminar sucursal
  const handleEliminarSucursal = useCallback((id: number) => {
    setSucursalAEliminar(id);
    setDeleteSucursalDialogOpen(true);
  }, []);

  // Manejador para confirmar eliminación de sucursal
  const confirmarEliminarSucursal = useCallback(async () => {
    if (sucursalAEliminar && clienteActual) {
      setSucursalesLoading(true);
      try {
        await SucursalesService.eliminarSucursal(sucursalAEliminar);
        setDeleteSucursalDialogOpen(false);
        setSucursalAEliminar(null);
        toast.success('Sucursal eliminada correctamente');
        
        // Actualizar el estado local del cliente actual
        if (clienteActual) {
          const sucursalesActualizadas = clienteActual.sucursales?.filter(
            sucursal => sucursal.id !== sucursalAEliminar
          ) || [];
          
          setClienteActual({
            ...clienteActual,
            sucursales: sucursalesActualizadas
          });
        }
      } catch (error) {
        console.error('Error al eliminar sucursal:', error);
        toast.error('Error al eliminar la sucursal');
      } finally {
        setSucursalesLoading(false);
      }
    }
  }, [sucursalAEliminar, clienteActual]);

  // Manejador para cancelar eliminación de sucursal
  const handleCancelEliminarSucursal = useCallback(() => {
    setDeleteSucursalDialogOpen(false);
    setSucursalAEliminar(null);
  }, []);

  // Manejador para actualizar sucursal
  const handleActualizarSucursal = useCallback(async (data: UpdateSucursalDTO) => {
    if (!sucursalSeleccionada) return;
    
    setSucursalesLoading(true);
    try {
      const resultado = await SucursalesService.actualizarSucursal(sucursalSeleccionada.id, data);
      if (resultado) {
        setSucursalFormModalOpen(false);
        setSucursalSeleccionada(null);
        toast.success('Sucursal actualizada correctamente');
        
        // Actualizar el estado local del cliente actual
        if (clienteActual) {
          const sucursalesActualizadas = clienteActual.sucursales?.map(sucursal => 
            sucursal.id === sucursalSeleccionada.id 
              ? { ...sucursal, ...data }
              : sucursal
          ) || [];
          
          setClienteActual({
            ...clienteActual,
            sucursales: sucursalesActualizadas
          });
        }
      }
    } catch (error) {
      console.error('Error al actualizar sucursal:', error);
      toast.error('Error al actualizar la sucursal');
    } finally {
      setSucursalesLoading(false);
    }
  }, [sucursalSeleccionada, clienteActual]);

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
        {clientesError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            Error: {clientesError}
          </motion.div>
        )}

        {/* Contenedor principal de la tabla de clientes */}
        <ProductsTableContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <TableHeader 
            onNewClienteClick={handleOpenModalNuevoCliente}
          />

          <TableContentSection
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ClienteTable
              clientes={clientes}
              onEdit={handleEditarCliente}
              onView={handleVerDetalle}
              onViewSucursales={handleVerSucursales}
              onViewCajas={handleVerCajas}
              loading={clientesLoading}
            />
          </TableContentSection>
        </ProductsTableContainer>
      </motion.div>

      {/* Modal Crear Cliente */}
      <CrearClienteModal
        open={crearModalOpen}
        onOpenChange={setCrearModalOpen}
        onSubmit={handleCrearCliente}
        loading={clientesLoading}
      />

      {/* Modal Editar Cliente */}
      <ActualizarClienteModal
        cliente={clienteSeleccionado}
        open={editarModalOpen}
        onOpenChange={setEditarModalOpen}
        onSubmit={handleActualizarCliente}
        loading={clientesLoading}
      />

      {/* Modal Detalle Cliente */}
      <DetalleClienteModal
        cliente={clienteSeleccionado}
        open={detalleModalOpen}
        onOpenChange={handleCloseDetalleModal}
        onEdit={() => {
          handleCloseDetalleModal();
          if (clienteSeleccionado) {
            handleEditarCliente(clienteSeleccionado);
          }
        }}
        onViewSucursales={() => {
          handleCloseDetalleModal();
          if (clienteSeleccionado) {
            handleVerSucursales(clienteSeleccionado);
          }
        }}
        onViewCajas={() => {
          handleCloseDetalleModal();
          if (clienteSeleccionado) {
            handleVerCajas(clienteSeleccionado);
          }
        }}
      />

      {/* MODAL UNIFICADO DE SUCURSALES */}
      <SucursalModal
        open={sucursalesModalOpen}
        onOpenChange={setSucursalesModalOpen}
        clienteNombre={clienteActual?.nombre}
        sucursales={clienteActual?.sucursales || []}
        sucursalSeleccionada={sucursalSeleccionada}
        showForm={sucursalFormModalOpen}
        loading={sucursalesLoading}
        onCrearSucursal={() => {
          setSucursalSeleccionada(null);
          setSucursalFormModalOpen(true);
        }}
        onEditarSucursal={handleEditarSucursal}
        onEliminarSucursal={handleEliminarSucursal}
        onSubmitForm={handleSubmitSucursal}
        onCancelForm={() => setSucursalFormModalOpen(false)}
      />

      {/* MODAL UNIFICADO DE CAJAS CLIENTE */}
      <CajaClienteModal
        open={cajasModalOpen}
        onOpenChange={setCajasModalOpen}
        clienteNombre={clienteActual?.nombre}
        cajasCliente={clienteActual?.cajasCliente || []}
        cajaSeleccionada={cajaSeleccionada}
        showForm={cajaFormModalOpen}
        loading={cajasLoading}
        onCrearCajaCliente={() => {
          setCajaSeleccionada(null);
          setCajaFormModalOpen(true);
        }}
        onEditarCajaCliente={handleEditarCajaCliente}
        onEliminarCajaCliente={handleEliminarCajaCliente}
        onSubmitForm={handleSubmitCaja}
        onCancelForm={() => setCajaFormModalOpen(false)}
      />





      {/* Dialog de confirmación de eliminación de sucursal */}
      <AlertDialog open={deleteSucursalDialogOpen} onOpenChange={setDeleteSucursalDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar sucursal?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la sucursal
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelEliminarSucursal}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarEliminarSucursal}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de confirmación de eliminación de caja */}
      <AlertDialog open={deleteCajaDialogOpen} onOpenChange={setDeleteCajaDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar caja?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la caja cliente
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelEliminarCaja}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmarEliminarCaja}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toaster para notificaciones */}
      <Toaster position="top-right" richColors />
    </PageContainer>
  );
};