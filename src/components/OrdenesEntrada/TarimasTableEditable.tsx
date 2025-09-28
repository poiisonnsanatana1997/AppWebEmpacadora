import styled from 'styled-components';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { NumericFormat } from 'react-number-format';
import { Search, ChevronLeft, ChevronRight, Plus, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { ESTADO_ORDEN, EstadoOrden, PesajeTarimaDto, estadoOrdenUtils } from '../../types/OrdenesEntrada/ordenesEntrada.types';
import { OrdenesEntradaService } from '@/services/ordenesEntrada.service';
import { toast } from 'sonner';
import React, { useCallback } from 'react';
import debounce from 'lodash/debounce';

const TableContainer = styled.div`
  position: relative;
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
`;

const Th = styled.th<{ $isPesoBruto?: boolean }>`
  background: ${({ $isPesoBruto }) => $isPesoBruto ? '#f0f9ff' : '#f1f5f9'};
  padding: 12px 16px;
  min-width: 120px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1.5px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;
  color: ${({ $isPesoBruto }) => $isPesoBruto ? '#0369a1' : 'inherit'};
  border-right: ${({ $isPesoBruto }) => $isPesoBruto ? '2px solid #0ea5e9' : 'none'};
  border-left: ${({ $isPesoBruto }) => $isPesoBruto ? '2px solid #0ea5e9' : 'none'};

  &:first-child {
    position: sticky;
    left: 0;
    background: #f1f5f9;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
`;

const Td = styled.td<{ $even?: boolean; $isAction?: boolean; $isPesoBruto?: boolean }>`
  padding: 8px 12px;
  background: ${({ $even, $isPesoBruto }) => {
    if ($isPesoBruto) return '#f0f9ff';
    return $even ? '#f9fafb' : '#fff';
  }};
  border-bottom: 1px solid #e5e7eb;
  border-right: ${({ $isPesoBruto }) => $isPesoBruto ? '2px solid #0ea5e9' : 'none'};
  border-left: ${({ $isPesoBruto }) => $isPesoBruto ? '2px solid #0ea5e9' : 'none'};
  vertical-align: middle;
  white-space: nowrap;

  ${({ $isAction }) => $isAction && `
    position: sticky;
    left: 0;
    background: inherit;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    z-index: 5;
  `}
`;

const TotalTd = styled.td<{ $isPesoBruto?: boolean }>`
  background: ${({ $isPesoBruto }) => $isPesoBruto ? '#e0f2fe' : '#e0e7ef'};
  font-weight: bold;
  padding: 8px 12px;
  position: sticky;
  bottom: 0;
  z-index: 10;
  color: ${({ $isPesoBruto }) => $isPesoBruto ? '#0369a1' : 'inherit'};
  border-right: ${({ $isPesoBruto }) => $isPesoBruto ? '2px solid #0ea5e9' : 'none'};
  border-left: ${({ $isPesoBruto }) => $isPesoBruto ? '2px solid #0ea5e9' : 'none'};
`;

const ActionButton = styled(Button)`
  margin-left: 4px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 500;

  &.add {
    background: #10b981;
    color: white;
    border: 1px solid #10b981;
    
    &:hover {
      background: #059669;
      border-color: #059669;
      color: white;
    }

    &:disabled {
      background: #d1fae5;
      color: #6b7280;
      border-color: #a7f3d0;
      cursor: not-allowed;
    }
  }

  &.delete {
    background: white;
    color: #6b7280;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #f9fafb;
      border-color: #9ca3af;
      color: #374151;
    }

    &:disabled {
      background: #f9fafb;
      color: #9ca3af;
      border-color: #e5e7eb;
      cursor: not-allowed;
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e2e8f0;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ValidationMessage = styled.div`
  position: absolute;
  bottom: -1.25rem;
  left: 0;
  font-size: 0.75rem;
  color: #ef4444;
`;

interface TarimasTableEditableProps {
  tarimas: PesajeTarimaDto[];
  setTarimas: (tarimas: PesajeTarimaDto[]) => void;
  estado: EstadoOrden;
  codigoOrden: string;
  onPrimerPesaje?: () => void;
}

// Calcular el peso neto
const calcNeto = (bruto: number | null | undefined, tara: number | null | undefined, tarima: number | null | undefined, patin: number | null | undefined) => {
  const pesoBruto = bruto || 0;
  const pesoTara = tara || 0;
  const pesoTarima = tarima || 0;
  const pesoPatin = patin || 0;
  return Math.max(0, pesoBruto - pesoTara - pesoTarima - pesoPatin);
};


export const TarimasTableEditable: React.FC<TarimasTableEditableProps> = ({ tarimas, setTarimas, estado, codigoOrden, onPrimerPesaje }) => {
  const [newTarima, setNewTarima] = React.useState<Omit<PesajeTarimaDto, 'numero' | 'pesoNeto'>>({
    pesoBruto: 0,
    pesoTara: 0,
    pesoTarima: 0,
    pesoPatin: 0,
    cantidadCajas: 42,
    pesoPorCaja: 1.6,
    observaciones: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const itemsPerPage = 10;
  const [editStatus, setEditStatus] = React.useState<Record<string, 'saving' | 'success' | 'error' | 'idle'>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [tarimaToDelete, setTarimaToDelete] = React.useState<PesajeTarimaDto | null>(null);

  const isDisabled = estadoOrdenUtils.estaCompletada(estado);
  const canAddTarimas = estadoOrdenUtils.puedeEditar(estado);

  // Calcular el siguiente número de tarima disponible
  // Esta función encuentra el primer número disponible en la secuencia
  // considerando que pueden existir tarimas eliminadas o números no secuenciales
  const getNextNumero = () => {
    if (tarimas.length === 0) {
      return 'T-001';
    }
    
    // Extraer todos los números de tarima existentes
    const numerosExistentes = tarimas
      .map(t => t.numero)
      .filter(numero => numero && numero.startsWith('T-'))
      .map(numero => {
        const match = numero.match(/T-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(numero => numero > 0)
      .sort((a, b) => a - b);
    
    // Encontrar el siguiente número disponible
    // Si tenemos T-001, T-002, T-004, el siguiente será T-003
    let siguienteNumero = 1;
    for (const numero of numerosExistentes) {
      if (numero === siguienteNumero) {
        siguienteNumero++;
      } else {
        break; // Encontramos un hueco, usamos este número
      }
    }
    
    return `T-${siguienteNumero.toString().padStart(3, '0')}`;
  };

  const nextNumero = getNextNumero();

  // Filtrar tarimas basado en el término de búsqueda
  const filteredTarimas = tarimas.filter(tarima => 
    tarima.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tarima.observaciones.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular paginación
  const totalPages = Math.ceil(filteredTarimas.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredTarimas.length);
  const currentTarimas = filteredTarimas.slice(startIndex, endIndex);

  // Formatear número a dos decimales
  const formatNumber = (value: number | null | undefined): string => {
    const numero = value || 0;
    return numero.toFixed(2);
  };

  // Calcular tara automáticamente
  const calcTara = (cantidadCajas: number | null | undefined, pesoPorCaja: number | null | undefined) => {
    const cajas = cantidadCajas || 0;
    const pesoCaja = pesoPorCaja || 0;
    return cajas * pesoCaja;
  };

  // Función para manejar cambios inmediatos en el estado local
  const handleLocalChange = (idx: number, field: keyof Omit<PesajeTarimaDto, 'numero' | 'pesoNeto'>, value: number | string) => {
    const tarimaActual = currentTarimas[idx];
    if (!tarimaActual) return;
    const realIndex = tarimas.findIndex(t => t.numero === tarimaActual.numero);
    if (realIndex === -1) return;
    // Spinner por tarima
    setEditStatus(prev => ({ ...prev, [tarimaActual.numero]: 'saving' }));
    const tarimaActualizada = { ...tarimas[realIndex] };
    if (field === 'observaciones') {
      tarimaActualizada[field] = value as string;
    } else {
      tarimaActualizada[field] = value as number;
    }
    if (field === 'cantidadCajas' || field === 'pesoPorCaja') {
      tarimaActualizada.pesoTara = calcTara(
        tarimaActualizada.cantidadCajas,
        tarimaActualizada.pesoPorCaja
      );
    }
    tarimaActualizada.pesoNeto = calcNeto(
      tarimaActualizada.pesoBruto,
      tarimaActualizada.pesoTara,
      tarimaActualizada.pesoTarima,
      tarimaActualizada.pesoPatin
    );
    const nuevasTarimas = tarimas.map((t, i) => 
      i === realIndex ? tarimaActualizada : t
    );
    setTarimas(nuevasTarimas);
    debouncedHandleEdit(tarimaActual.numero, field, value);
  };

  // Al inicio del componente:
  const tarimasRef = React.useRef(tarimas);
  React.useEffect(() => { tarimasRef.current = tarimas; }, [tarimas]);
  const currentTarimasRef = React.useRef(currentTarimas);
  React.useEffect(() => { currentTarimasRef.current = currentTarimas; }, [currentTarimas]);

  // Crear una versión debounceada de handleEdit
  const debouncedHandleEdit = useCallback(
    debounce(async (numero: string, field: keyof Omit<PesajeTarimaDto, 'numero' | 'pesoNeto'>, value: number | string) => {
      try {
        // Obtener la tarima actualizada del estado local
        const tarimaActualizada = tarimasRef.current.find(t => t.numero === numero);
        if (!tarimaActualizada) {
          throw new Error('Tarima no encontrada');
        }

        // Crear el payload completo con todos los datos de la tarima
        const payload: Omit<PesajeTarimaDto, 'numero'> = {
          pesoBruto: tarimaActualizada.pesoBruto || 0,
          pesoTara: tarimaActualizada.pesoTara || 0,
          pesoTarima: tarimaActualizada.pesoTarima || 0,
          pesoPatin: tarimaActualizada.pesoPatin || 0,
          cantidadCajas: tarimaActualizada.cantidadCajas || 0,
          pesoPorCaja: tarimaActualizada.pesoPorCaja || 0,
          observaciones: tarimaActualizada.observaciones || '',
          pesoNeto: tarimaActualizada.pesoNeto || 0
        };

        const updated = await OrdenesEntradaService.actualizarPesajesTarima(
          codigoOrden,
          numero,
          payload
        );

        // Si no hay error, la operación fue exitosa (updated puede ser undefined o el objeto actualizado)
        setEditStatus(prev => ({ ...prev, [numero]: 'success' }));
        
        // Mostrar mensaje de éxito
        toast.success(`Tarima ${numero} actualizada correctamente`);
        
        // Si el servidor devolvió datos actualizados, usarlos para actualizar el estado local
        // pero preservar el peso bruto si no se está editando ese campo específicamente
        if (updated) {
          const realIndex = tarimasRef.current.findIndex(t => t.numero === numero);
          if (realIndex !== -1) {
            const nuevasTarimas = [...tarimasRef.current];
            const pesoBrutoOriginal = tarimaActualizada.pesoBruto;
            nuevasTarimas[realIndex] = { 
              ...tarimaActualizada, 
              ...updated,
              // Preservar el peso bruto original si no se está editando ese campo
              pesoBruto: field === 'pesoBruto' ? updated.pesoBruto : pesoBrutoOriginal
            };
            setTarimas(nuevasTarimas);
          }
        }
        
        // Limpiar el estado de éxito después de 3 segundos
        setTimeout(() => {
          setEditStatus(prev => ({ ...prev, [numero]: 'idle' }));
        }, 3000);
      } catch (error: any) {
        console.error('Error al actualizar tarima:', error);
        setEditStatus(prev => ({ ...prev, [numero]: 'error' }));
        
        // Mostrar mensaje de error más específico
        const errorMessage = error?.message || 'Error al actualizar la tarima';
        toast.error(errorMessage);
        
        // Revertir el cambio local si hay error
        const tarimaOriginal = tarimasRef.current.find(t => t.numero === numero);
        if (tarimaOriginal) {
          const realIndex = tarimasRef.current.findIndex(t => t.numero === numero);
          if (realIndex !== -1) {
            const nuevasTarimas = [...tarimasRef.current];
            const pesoBrutoActual = tarimasRef.current[realIndex].pesoBruto;
            nuevasTarimas[realIndex] = {
              ...tarimaOriginal,
              // Preservar el peso bruto actual si no se está editando ese campo
              pesoBruto: field === 'pesoBruto' ? tarimaOriginal.pesoBruto : pesoBrutoActual
            };
            setTarimas(nuevasTarimas);
          }
        }
      }
    }, 500),
    [codigoOrden]
  );

  // Validaciones
  const validate = (tarima: Omit<PesajeTarimaDto, 'numero' | 'pesoNeto'>) => {
    const errs: Record<string, string> = {};
    if (tarima.cantidadCajas <= 0) errs.cantidadCajas = 'Debe ser mayor a 0';
    if (tarima.pesoPorCaja <= 0) errs.pesoPorCaja = 'Debe ser mayor a 0';
    if (tarima.pesoBruto <= 0) errs.pesoBruto = 'Debe ser mayor a 0';
    if (tarima.pesoTarima < 0) errs.pesoTarima = 'No puede ser negativo';
    if (tarima.pesoPatin < 0) errs.pesoPatin = 'No puede ser negativo';
    
    // Validar que el número de tarima no esté duplicado
    const numeroTarima = nextNumero;
    const tarimaExistente = tarimas.find(t => t.numero === numeroTarima);
    if (tarimaExistente) {
      errs.numeroTarima = `Ya existe una tarima con el número ${numeroTarima}`;
    }
    
    return errs;
  };

  // Agregar nueva tarima
  const handleAdd = async () => {
    if (!canAddTarimas) return;
    const errs = validate(newTarima);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Calcular la tara basada en los valores por defecto
    const pesoTara = calcTara(newTarima.cantidadCajas, newTarima.pesoPorCaja);
    const payload = {
      numero: nextNumero,
      pesoBruto: newTarima.pesoBruto,
      pesoTara: pesoTara,
      pesoTarima: newTarima.pesoTarima,
      pesoPatin: newTarima.pesoPatin,
      cantidadCajas: newTarima.cantidadCajas,
      pesoPorCaja: newTarima.pesoPorCaja,
      observaciones: newTarima.observaciones,
      pesoNeto: calcNeto(
        newTarima.pesoBruto,
        pesoTara,
        newTarima.pesoTarima,
        newTarima.pesoPatin
      )
    };
    setEditStatus(prev => ({ ...prev, temp: 'saving' }));
    try {
      const tarimaAgregada = await OrdenesEntradaService.agregarTarima(codigoOrden, payload);
      if (tarimaAgregada) {
        setTarimas([...tarimas, tarimaAgregada]);
        setEditStatus(prev => ({ ...prev, [tarimaAgregada.numero]: 'success' }));
        toast.success(`Tarima ${tarimaAgregada.numero} agregada correctamente`);
        setTimeout(() => {
          setEditStatus(prev => ({ ...prev, [tarimaAgregada.numero]: 'idle' }));
        }, 2000);
        // Si es la primera tarima con peso, notificar para cambiar el estado
        if (estado === ESTADO_ORDEN.PENDIENTE && tarimaAgregada.pesoBruto > 0) {
          onPrimerPesaje?.();
        }
      } else {
        throw new Error('No se pudo agregar la tarima');
      }

      setNewTarima({ 
        pesoBruto: 0, 
        pesoTara: 0, 
        pesoTarima: 0, 
        pesoPatin: 0, 
        cantidadCajas: 42,
        pesoPorCaja: 1.6,
        observaciones: '' 
      });
      setErrors({});
      setEditStatus(prev => {
        const { temp, ...rest } = prev;
        return rest;
      });
    } catch (error: any) {
      setEditStatus(prev => ({ ...prev, temp: 'error' }));
      
      // Mostrar mensaje de error más específico
      let errorMessage = error?.message || 'Error al agregar la tarima';
      
      // Manejar específicamente el error de número duplicado
      if (errorMessage.toLowerCase().includes('duplicado') || 
          errorMessage.toLowerCase().includes('ya existe') ||
          errorMessage.toLowerCase().includes('duplicate')) {
        errorMessage = `Ya existe una tarima con el número ${nextNumero}. Se generará un nuevo número automáticamente.`;
        // Forzar la regeneración del número en el próximo render
        setTarimas([...tarimas]);
      }
      
      toast.error(errorMessage);
      
      // Limpiar el estado de error después de un tiempo
      setTimeout(() => {
        setEditStatus(prev => {
          const { temp, ...rest } = prev;
          return rest;
        });
      }, 3000);
    }
  };

  // Mostrar modal de confirmación para eliminar
  const handleDeleteClick = (idx: number) => {
    if (!canAddTarimas) return;
    const tarimaActual = currentTarimas[idx];
    if (!tarimaActual) return;
    
    setTarimaToDelete(tarimaActual);
    setShowDeleteConfirm(true);
  };

  // Eliminar tarima confirmada
  const handleDeleteConfirm = async () => {
    if (!tarimaToDelete) return;
    
    // Guardar una copia de la tarima para poder revertir si hay error
    const tarimaOriginal = { ...tarimaToDelete };
    
    setEditStatus(prev => ({ ...prev, [tarimaToDelete.numero]: 'saving' }));
    try {
      await OrdenesEntradaService.eliminarPesajeTarima(codigoOrden, tarimaToDelete.numero);
      setTarimas(tarimas.filter(t => t.numero !== tarimaToDelete.numero));
      setEditStatus(prev => ({ ...prev, [tarimaToDelete.numero]: 'success' }));
      toast.success(`Tarima ${tarimaToDelete.numero} eliminada correctamente`);
      setTimeout(() => {
        setEditStatus(prev => ({ ...prev, [tarimaToDelete.numero]: 'idle' }));
      }, 2000);
    } catch (error: any) {
      setEditStatus(prev => ({ ...prev, [tarimaToDelete.numero]: 'error' }));
      
      // Mostrar mensaje de error más específico
      const errorMessage = error?.message || `Error al eliminar la tarima ${tarimaToDelete.numero}`;
      toast.error(errorMessage);
      
      // Limpiar el estado de error después de un tiempo
      setTimeout(() => {
        setEditStatus(prev => ({ ...prev, [tarimaToDelete.numero]: 'idle' }));
      }, 3000);
    } finally {
      setShowDeleteConfirm(false);
      setTarimaToDelete(null);
    }
  };

  // Cancelar eliminación
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setTarimaToDelete(null);
  };

  // Manejar tecla Enter para agregar tarima
  // Permite al usuario presionar Enter en cualquier campo editable para agregar la tarima
  // Solo funciona si todos los campos requeridos tienen valores válidos
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Solo agregar si se pueden agregar tarimas, no hay operación en curso,
      // no hay errores de número duplicado y los campos requeridos tienen valores válidos
      if (canAddTarimas && 
          !editStatus.temp && 
          !errors.numeroTarima && 
          newTarima.pesoBruto > 0 && 
          newTarima.cantidadCajas > 0 && 
          newTarima.pesoPorCaja > 0) {
        handleAdd();
      }
    }
  };

  // Suma total de pesos netos
  const totales = tarimas.reduce((acc, t) => ({
    pesoBruto: acc.pesoBruto + (t.pesoBruto || 0),
    pesoTara: acc.pesoTara + (t.pesoTara || 0),
    pesoTarima: acc.pesoTarima + (t.pesoTarima || 0),
    pesoPatin: acc.pesoPatin + (t.pesoPatin || 0),
    pesoNeto: acc.pesoNeto + (t.pesoNeto || 0),
    cantidadCajas: acc.cantidadCajas + (t.cantidadCajas || 0),
    pesoPorCaja: acc.pesoPorCaja + (t.pesoPorCaja || 0)
  }), {
    pesoBruto: 0,
    pesoTara: 0,
    pesoTarima: 0,
    pesoPatin: 0,
    pesoNeto: 0,
    cantidadCajas: 0,
    pesoPorCaja: 0
  });

  // Resetear la página actual si es mayor que el total de páginas
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Limpiar errores de número duplicado cuando cambian las tarimas
  React.useEffect(() => {
    if (errors.numeroTarima) {
      setErrors(prev => {
        const { numeroTarima, ...rest } = prev;
        return rest;
      });
    }
  }, [tarimas, errors.numeroTarima]);

  return (
    <div className="flex flex-col">
      <SearchContainer>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número o observaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
          <Plus className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            {tarimas.length} tarima{tarimas.length !== 1 ? 's' : ''} agregada{tarimas.length !== 1 ? 's' : ''}
          </span>
        </div>
      </SearchContainer>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th></Th>
              <Th># Tarima</Th>
              <Th $isPesoBruto>Peso Bruto (kg)</Th>
              <Th>Cantidad Cajas</Th>
              <Th>Peso por Caja (kg)</Th>
              <Th>Peso Tara (kg)</Th>
              <Th>Peso Tarima (kg)</Th>
              <Th>Peso Patín (kg)</Th>
              <Th>Peso Neto (kg)</Th>
              <Th>Observaciones</Th>
            </tr>
          </thead>
          <tbody>
            {/* Fila de totales */}
            <tr>
              <TotalTd></TotalTd>
              <TotalTd>TOTAL</TotalTd>
              <TotalTd $isPesoBruto>
                <Input
                  type="text"
                  value={formatNumber(totales.pesoBruto)}
                  readOnly
                  className="w-full font-bold bg-blue-50 border-blue-200"
                />
              </TotalTd>
              <TotalTd>
                <Input
                  type="text"
                  value={formatNumber(totales.cantidadCajas)}
                  readOnly
                  className="w-full font-bold bg-blue-50 border-blue-200"
                />
              </TotalTd>
              <TotalTd>
                <Input
                  type="text"
                  value={formatNumber(totales.pesoPorCaja)}
                  readOnly
                  className="w-full font-bold bg-blue-50 border-blue-200"
                />
              </TotalTd>
              <TotalTd>
                <Input
                  type="text"
                  value={formatNumber(totales.pesoTara)}
                  readOnly
                  className="w-full font-bold bg-blue-50 border-blue-200"
                />
              </TotalTd>
              <TotalTd>
                <Input
                  type="text"
                  value={formatNumber(totales.pesoTarima)}
                  readOnly
                  className="w-full font-bold bg-blue-50 border-blue-200"
                />
              </TotalTd>
              <TotalTd>
                <Input
                  type="text"
                  value={formatNumber(totales.pesoPatin)}
                  readOnly
                  className="w-full font-bold bg-blue-50 border-blue-200"
                />
              </TotalTd>
              <TotalTd>
                <Input
                  type="text"
                  value={formatNumber(totales.pesoNeto)}
                  readOnly
                  className="w-full font-bold bg-blue-50 border-blue-200"
                />
              </TotalTd>
              <TotalTd></TotalTd>
            </tr>

            {/* Fila para agregar nueva tarima */}
            {canAddTarimas && (
              <tr>
                <Td $isAction>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ActionButton
                      type="button"
                      className="add"
                      size="sm"
                      onClick={handleAdd}
                      title="Agregar tarima (o presiona Enter en cualquier campo)"
                      disabled={editStatus.temp === 'saving' || !!errors.numeroTarima}
                    >
                      <Plus className="h-4 w-4" />
                    </ActionButton>
                    {editStatus.temp === 'saving' && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" style={{ marginLeft: '0.5rem' }} />
                    )}
                    {editStatus.temp === 'success' && (
                      <CheckCircle className="h-4 w-4 text-green-500" style={{ marginLeft: '0.5rem' }} />
                    )}
                    {editStatus.temp === 'error' && (
                      <XCircle className="h-4 w-4 text-red-500" style={{ marginLeft: '0.5rem' }} />
                    )}
                  </div>
                </Td>
                <Td>
                  <div className="flex flex-col">
                    <span className={errors.numeroTarima ? 'text-red-600 font-medium' : ''}>
                      {nextNumero}
                    </span>
                    {errors.numeroTarima && (
                      <span className="text-xs text-red-500 mt-1">
                        {errors.numeroTarima}
                      </span>
                    )}
                  </div>
                </Td>
                <Td $isPesoBruto>
                  <InputWrapper>
                    <NumericFormat
                      value={newTarima.pesoBruto}
                      onValueChange={(values) => setNewTarima({ ...newTarima, pesoBruto: values.floatValue || 0 })}
                      onKeyDown={handleKeyDown}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      placeholder="0.00"
                      disabled={isDisabled}
                      className={errors.pesoBruto ? 'border-red-500' : ''}
                    />
                    <ValidationMessage>
                      {errors.pesoBruto}
                    </ValidationMessage>
                  </InputWrapper>
                </Td>
                <Td>
                  <InputWrapper>
                    <NumericFormat
                      value={newTarima.cantidadCajas}
                      onValueChange={(values) => setNewTarima({ ...newTarima, cantidadCajas: values.floatValue || 0 })}
                      onKeyDown={handleKeyDown}
                      decimalScale={0}
                      allowNegative={false}
                      customInput={Input}
                      placeholder="0"
                      disabled={isDisabled}
                      className={errors.cantidadCajas ? 'border-red-500' : ''}
                    />
                    <ValidationMessage>
                      {errors.cantidadCajas}
                    </ValidationMessage>
                  </InputWrapper>
                </Td>
                <Td>
                  <InputWrapper>
                    <NumericFormat
                      value={newTarima.pesoPorCaja}
                      onValueChange={(values) => setNewTarima({ ...newTarima, pesoPorCaja: values.floatValue || 0 })}
                      onKeyDown={handleKeyDown}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      placeholder="0.00"
                      disabled={isDisabled}
                      className={errors.pesoPorCaja ? 'border-red-500' : ''}
                    />
                    <ValidationMessage>
                      {errors.pesoPorCaja}
                    </ValidationMessage>
                  </InputWrapper>
                </Td>
                <Td>
                  <Input
                    type="text"
                    value={formatNumber(calcTara(newTarima.cantidadCajas || 0, newTarima.pesoPorCaja || 0))}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </Td>
                <Td>
                  <InputWrapper>
                    <NumericFormat
                      value={newTarima.pesoTarima}
                      onValueChange={(values) => setNewTarima({ ...newTarima, pesoTarima: values.floatValue || 0 })}
                      onKeyDown={handleKeyDown}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      placeholder="0.00"
                      className={errors.pesoTarima ? 'border-red-500' : ''}
                    />
                    <ValidationMessage>
                      {errors.pesoTarima}
                    </ValidationMessage>
                  </InputWrapper>
                </Td>

                <Td>
                  <InputWrapper>
                    <NumericFormat
                      value={newTarima.pesoPatin}
                      onValueChange={(values) => setNewTarima({ ...newTarima, pesoPatin: values.floatValue || 0 })}
                      onKeyDown={handleKeyDown}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      placeholder="0.00"
                      className={errors.pesoPatin ? 'border-red-500' : ''}
                    />
                    <ValidationMessage>
                      {errors.pesoPatin}
                    </ValidationMessage>
                  </InputWrapper>
                </Td>
                <Td>
                  <Input
                    type="text"
                    value={formatNumber(calcNeto(
                      newTarima.pesoBruto || 0,
                      calcTara(newTarima.cantidadCajas || 0, newTarima.pesoPorCaja || 0),
                      newTarima.pesoTarima || 0,
                      newTarima.pesoPatin || 0
                    ))}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </Td>
                <Td>
                  <InputWrapper>
                    <Input
                      type="text"
                      value={newTarima.observaciones || ''}
                      onChange={e => setNewTarima({ ...newTarima, observaciones: e.target.value })}
                      onKeyDown={handleKeyDown}
                      className="w-full"
                    />
                  </InputWrapper>
                </Td>
              </tr>
            )}

            {/* Filas de tarimas existentes */}
            {currentTarimas
              .filter(tarima => tarima && tarima.numero)
              .map((tarima, idx) => (
              <tr key={tarima.numero}>
                <Td $even={idx % 2 === 0} $isAction>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ActionButton
                      type="button"
                      className="delete"
                      size="sm"
                      onClick={() => handleDeleteClick(idx)}
                      title="Eliminar tarima"
                      disabled={estadoOrdenUtils.estaCompletada(estado) || editStatus[tarima.numero] === 'saving'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </ActionButton>
                    {editStatus[tarima.numero] === 'saving' && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" style={{ marginLeft: '0.5rem' }} />
                    )}
                    {editStatus[tarima.numero] === 'success' && (
                      <CheckCircle className="h-4 w-4 text-green-500" style={{ marginLeft: '0.5rem' }} />
                    )}
                    {editStatus[tarima.numero] === 'error' && (
                      <XCircle className="h-4 w-4 text-red-500" style={{ marginLeft: '0.5rem' }} />
                    )}
                  </div>
                </Td>
                <Td $even={idx % 2 === 0}>{tarima.numero}</Td>
                <Td $even={idx % 2 === 0} $isPesoBruto>
                  <InputWrapper>
                    <NumericFormat
                      value={tarima.pesoBruto || 0}
                      onValueChange={(values) => handleLocalChange(idx, 'pesoBruto', values.floatValue || 0)}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      disabled={isDisabled}
                      placeholder="0.00"
                    />
                  </InputWrapper>
                </Td>
                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <NumericFormat
                      value={tarima.cantidadCajas || 0}
                      onValueChange={(values) => handleLocalChange(idx, 'cantidadCajas', values.floatValue || 0)}
                      decimalScale={0}
                      allowNegative={false}
                      customInput={Input}
                      disabled={isDisabled}
                      placeholder="0"
                    />
                  </InputWrapper>
                </Td>
                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <NumericFormat
                      value={tarima.pesoPorCaja || 0}
                      onValueChange={(values) => handleLocalChange(idx, 'pesoPorCaja', values.floatValue || 0)}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      disabled={isDisabled}
                      placeholder="0.00"
                    />
                  </InputWrapper>
                </Td>
                <Td $even={idx % 2 === 0}>
                  <Input
                    type="text"
                    value={formatNumber(tarima.pesoTara || 0)}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </Td>
                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <NumericFormat
                      value={tarima.pesoTarima || 0}
                      onValueChange={(values) => handleLocalChange(idx, 'pesoTarima', values.floatValue || 0)}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      disabled={isDisabled}
                      placeholder="0.00"
                    />
                  </InputWrapper>
                </Td>

                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <NumericFormat
                      value={tarima.pesoPatin || 0}
                      onValueChange={(values) => handleLocalChange(idx, 'pesoPatin', values.floatValue || 0)}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      disabled={isDisabled}
                      placeholder="0.00"
                    />
                  </InputWrapper>
                </Td>
                <Td $even={idx % 2 === 0}>
                  <Input
                    type="text"
                    value={formatNumber(tarima.pesoNeto || 0)}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </Td>
                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <Input
                      type="text"
                      value={tarima.observaciones || ''}
                      onChange={e => handleLocalChange(idx, 'observaciones', e.target.value)}
                      className="w-full"
                    />
                  </InputWrapper>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <PaginationContainer>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredTarimas.length)} de {filteredTarimas.length} tarimas
        </div>
      </PaginationContainer>

      {/* Modal de confirmación para eliminar tarima */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent className="w-[95%] sm:w-[500px] max-w-[95vw]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">¿Eliminar tarima {tarimaToDelete?.numero}?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Esta acción eliminará la tarima y todos sus datos de pesaje permanentemente. No se podrán realizar más cambios en esta tarima.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={editStatus[tarimaToDelete?.numero || ''] === 'saving'}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {editStatus[tarimaToDelete?.numero || ''] === 'saving' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sí, eliminar tarima
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}; 