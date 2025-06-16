import styled from 'styled-components';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NumericFormat } from 'react-number-format';
import { Search, ChevronLeft, ChevronRight, Plus, Trash2, Loader2 } from 'lucide-react';
import { ESTADO_ORDEN, EstadoOrden, PesajeTarimaDto, estadoOrdenUtils } from '../../types/ordenesEntrada';
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

const Th = styled.th`
  background: #f1f5f9;
  padding: 12px 16px;
  min-width: 120px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1.5px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
  white-space: nowrap;

  &:first-child {
    position: sticky;
    left: 0;
    background: #f1f5f9;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
`;

const Td = styled.td<{ $even?: boolean; $isAction?: boolean }>`
  padding: 8px 12px;
  background: ${({ $even }) => $even ? '#f9fafb' : '#fff'};
  border-bottom: 1px solid #e5e7eb;
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

const TotalTd = styled.td`
  background: #e0e7ef;
  font-weight: bold;
  padding: 8px 12px;
  position: sticky;
  bottom: 0;
  z-index: 10;
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
    background: #22c55e;
    color: white;
    border: none;
    
    &:hover {
      background: #16a34a;
    }

    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }

  &.delete {
    background: #f8fafc;
    color: #ef4444;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background: #fee2e2;
      border-color: #ef4444;
    }

    &:disabled {
      background: #f8fafc;
      color: #9ca3af;
      border-color: #e2e8f0;
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
  onEliminarUltimoPesaje?: () => void;
}

// Calcular el peso neto
const calcNeto = (bruto: number, tara: number, tarima: number, patin: number) => {
  return Math.max(0, bruto - tara - tarima - patin);
};


export const TarimasTableEditable: React.FC<TarimasTableEditableProps> = ({ tarimas, setTarimas, estado, codigoOrden, onPrimerPesaje, onEliminarUltimoPesaje }) => {
  const [newTarima, setNewTarima] = React.useState<Omit<PesajeTarimaDto, 'numero' | 'pesoNeto'>>({
    pesoBruto: 0,
    pesoTara: 0,
    pesoTarima: 0,
    pesoPatin: 0,
    cantidadCajas: 40,
    pesoPorCaja: 1.6,
    observaciones: '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [editingValues, setEditingValues] = React.useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const itemsPerPage = 10;
  const [editStatus, setEditStatus] = React.useState<Record<string, 'saving' | 'success' | 'error' | 'idle'>>({});
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  const isDisabled = estadoOrdenUtils.estaCompletada(estado);
  const canAddTarimas = estadoOrdenUtils.puedeEditar(estado);

  // Calcular el siguiente número de tarima
  const nextNumero = `T-${(tarimas.length + 1).toString().padStart(3, '0')}`;

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
  const formatNumber = (value: number): string => {
    return value.toFixed(2);
  };

  // Validar número decimal
  const validateDecimal = (value: string): string => {
    // Permitir solo números y un punto decimal
    return value;
  };

  // Convertir a número para cálculos
  const toNumber = (value: string): number => {
    if (value === '') return 0;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  // Calcular la tara basada en cantidad de cajas y peso por caja
  const calcTara = (cantidadCajas: number, pesoPorCaja: number) => {
    return cantidadCajas * pesoPorCaja;
  };

  // Validar valor numérico
  const validateNumericValue = (value: number, field: string): string | null => {
    if (isNaN(value)) return 'Valor inválido';
    if (value < 0) return 'No puede ser negativo';
    if (field === 'pesoBruto' && value === 0) return 'El peso bruto debe ser mayor a 0';
    if (field === 'cantidadCajas' && value === 0) return 'La cantidad debe ser mayor a 0';
    if (field === 'pesoPorCaja' && value === 0) return 'El peso por caja debe ser mayor a 0';
    return null;
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
        const updated = await OrdenesEntradaService.actualizarPesajesTarima(
          codigoOrden,
          numero,
          { [field]: value }
        );

        if (updated) {
          setEditStatus(prev => ({ ...prev, [numero]: 'success' }));
        } else {
          throw new Error('No se pudo actualizar la tarima');
        }
      } catch (error) {
        console.error('Error al actualizar tarima:', error);
        setEditStatus(prev => ({ ...prev, [numero]: 'error' }));
        toast.error('Error al actualizar la tarima');
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
      }else{
        toast.error('Error al agregar la tarima');
      }

      setNewTarima({ 
        pesoBruto: 0, 
        pesoTara: 0, 
        pesoTarima: 0, 
        pesoPatin: 0, 
        cantidadCajas: 40,
        pesoPorCaja: 1.6,
        observaciones: '' 
      });
      setErrors({});
      setEditStatus(prev => {
        const { temp, ...rest } = prev;
        return rest;
      });
    } catch (error) {
      setEditStatus(prev => ({ ...prev, temp: 'error' }));
      toast.error('Error al agregar la tarima');
    }
  };

  // Eliminar tarima
  const handleDelete = async (idx: number) => {
    if (!canAddTarimas) return;
    const tarimaActual = currentTarimas[idx];
    if (!tarimaActual) return;
    setEditStatus(prev => ({ ...prev, [tarimaActual.numero]: 'saving' }));
    try {
      await OrdenesEntradaService.eliminarPesajeTarima(codigoOrden, tarimaActual.numero);
      setTarimas(tarimas.filter(t => t.numero !== tarimaActual.numero));
      setEditStatus(prev => ({ ...prev, [tarimaActual.numero]: 'success' }));
      toast.success(`Tarima ${tarimaActual.numero} eliminada correctamente`);
      setTimeout(() => {
        setEditStatus(prev => ({ ...prev, [tarimaActual.numero]: 'idle' }));
      }, 2000);
    } catch (error) {
      setEditStatus(prev => ({ ...prev, [tarimaActual.numero]: 'error' }));
      toast.error(`Error al eliminar la tarima ${tarimaActual.numero}`);
    }
  };

  // Suma total de pesos netos
  const totales = tarimas.reduce((acc, t) => ({
    pesoBruto: acc.pesoBruto + t.pesoBruto,
    pesoTara: acc.pesoTara + t.pesoTara,
    pesoTarima: acc.pesoTarima + t.pesoTarima,
    pesoPatin: acc.pesoPatin + t.pesoPatin,
    pesoNeto: acc.pesoNeto + t.pesoNeto,
    cantidadCajas: acc.cantidadCajas + t.cantidadCajas,
    pesoPorCaja: acc.pesoPorCaja + t.pesoPorCaja
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
        <div className="text-sm text-muted-foreground">
          {filteredTarimas.length} tarimas encontradas
        </div>
      </SearchContainer>

      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th></Th>
              <Th># Tarima</Th>
              <Th>Cantidad Cajas</Th>
              <Th>Peso por Caja (kg)</Th>
              <Th>Peso Bruto (kg)</Th>
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
                  value={formatNumber(totales.pesoBruto)}
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
            </tr>

            {/* Fila para agregar nueva tarima */}
            {canAddTarimas && (
              <tr>
                <Td $isAction>
                  <ActionButton
                    type="button"
                    className="add"
                    size="sm"
                    onClick={handleAdd}
                    title="Agregar tarima"
                  >
                    <Plus className="h-4 w-4" />
                  </ActionButton>
                </Td>
                <Td>{nextNumero}</Td>
                <Td>
                  <InputWrapper>
                    <NumericFormat
                      value={newTarima.cantidadCajas}
                      onValueChange={(values) => setNewTarima({ ...newTarima, cantidadCajas: values.floatValue || 0 })}
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
                  <InputWrapper>
                    <NumericFormat
                      value={newTarima.pesoBruto}
                      onValueChange={(values) => setNewTarima({ ...newTarima, pesoBruto: values.floatValue || 0 })}
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
                  <Input
                    type="text"
                    value={formatNumber(calcTara(newTarima.cantidadCajas, newTarima.pesoPorCaja))}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </Td>
                <Td>
                  <InputWrapper>
                    <NumericFormat
                      value={newTarima.pesoTarima}
                      onValueChange={(values) => setNewTarima({ ...newTarima, pesoTarima: values.floatValue || 0 })}
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
                      newTarima.pesoBruto,
                      calcTara(newTarima.cantidadCajas, newTarima.pesoPorCaja),
                      newTarima.pesoTarima,
                      newTarima.pesoPatin
                    ))}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </Td>
                <Td>
                  <InputWrapper>
                    <Input
                      type="text"
                      value={newTarima.observaciones}
                      onChange={e => setNewTarima({ ...newTarima, observaciones: e.target.value })}
                      className="w-full"
                    />
                  </InputWrapper>
                </Td>
              </tr>
            )}

            {/* Filas de tarimas existentes */}
            {currentTarimas.map((tarima, idx) => (
              <tr key={tarima.numero}>
                <Td $even={idx % 2 === 0} $isAction>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ActionButton
                      type="button"
                      className="delete"
                      size="sm"
                      onClick={() => handleDelete(idx)}
                      title="Eliminar tarima"
                      disabled={estadoOrdenUtils.estaCompletada(estado) || editStatus[tarima.numero] === 'saving'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </ActionButton>
                    {editStatus[tarima.numero] === 'saving' && (
                      <Loader2 className="h-4 w-4 animate-spin" style={{ marginLeft: '1rem' }} />
                    )}
                  </div>
                </Td>
                <Td $even={idx % 2 === 0}>{tarima.numero}</Td>
                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <NumericFormat
                      value={tarima.cantidadCajas}
                      onValueChange={(values) => handleLocalChange(idx, 'cantidadCajas', values.floatValue || 0)}
                      decimalScale={0}
                      allowNegative={false}
                      customInput={Input}
                      disabled={isDisabled}
                      placeholder="0"
                      className={validationErrors[`${tarima.numero}-cantidadCajas`] ? 'border-red-500' : ''}
                    />
                    <ValidationMessage>
                      {validationErrors[`${tarima.numero}-cantidadCajas`]}
                    </ValidationMessage>
                  </InputWrapper>
                </Td>
                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <NumericFormat
                      value={tarima.pesoPorCaja}
                      onValueChange={(values) => handleLocalChange(idx, 'pesoPorCaja', values.floatValue || 0)}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      disabled={isDisabled}
                      placeholder="0.00"
                      className={validationErrors[`${tarima.numero}-pesoPorCaja`] ? 'border-red-500' : ''}
                    />
                    <ValidationMessage>
                      {validationErrors[`${tarima.numero}-pesoPorCaja`]}
                    </ValidationMessage>
                  </InputWrapper>
                </Td>
                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <NumericFormat
                      value={tarima.pesoBruto}
                      onValueChange={(values) => handleLocalChange(idx, 'pesoBruto', values.floatValue || 0)}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      disabled={isDisabled}
                      placeholder="0.00"
                      className={validationErrors[`${tarima.numero}-pesoBruto`] ? 'border-red-500' : ''}
                    />
                    <ValidationMessage>
                      {validationErrors[`${tarima.numero}-pesoBruto`]}
                    </ValidationMessage>
                  </InputWrapper>
                </Td>
                <Td $even={idx % 2 === 0}>
                  <Input
                    type="text"
                    value={formatNumber(tarima.pesoTara)}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </Td>
                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <NumericFormat
                      value={tarima.pesoTarima}
                      onValueChange={(values) => handleLocalChange(idx, 'pesoTarima', values.floatValue || 0)}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      disabled={isDisabled}
                      placeholder="0.00"
                      className={validationErrors[`${tarima.numero}-pesoTarima`] ? 'border-red-500' : ''}
                    />
                    <ValidationMessage>
                      {validationErrors[`${tarima.numero}-pesoTarima`]}
                    </ValidationMessage>
                  </InputWrapper>
                </Td>
                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <NumericFormat
                      value={tarima.pesoPatin}
                      onValueChange={(values) => handleLocalChange(idx, 'pesoPatin', values.floatValue || 0)}
                      decimalScale={2}
                      allowNegative={false}
                      customInput={Input}
                      disabled={isDisabled}
                      placeholder="0.00"
                      className={validationErrors[`${tarima.numero}-pesoPatin`] ? 'border-red-500' : ''}
                    />
                    <ValidationMessage>
                      {validationErrors[`${tarima.numero}-pesoPatin`]}
                    </ValidationMessage>
                  </InputWrapper>
                </Td>
                <Td $even={idx % 2 === 0}>
                  <Input
                    type="text"
                    value={formatNumber(tarima.pesoNeto)}
                    readOnly
                    className="w-full bg-gray-100"
                  />
                </Td>
                <Td $even={idx % 2 === 0}>
                  <InputWrapper>
                    <Input
                      type="text"
                      value={tarima.observaciones}
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
    </div>
  );
}; 