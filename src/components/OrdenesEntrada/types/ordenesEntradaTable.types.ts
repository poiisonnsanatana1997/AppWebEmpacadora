import { OrdenEntradaDto } from '../../../types/ordenesEntrada';

export interface OrdenesEntradaTableProps {
  ordenes: OrdenEntradaDto[];
  onEdit: (codigo: string) => void;
  onDelete: (codigo: string) => void;
  onReactivate: (codigo: string) => void;
}

export interface FilterOptions {
  estado: string;
  proveedor: string;
  producto: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface TableState {
  sorting: { id: string; desc: boolean }[];
  filters: FilterOptions;
  selectedOrden: string | null;
} 