import { OrdenEntradaDto } from './ordenesEntrada.types';

export interface OrdenesEntradaTableProps {
  ordenes: OrdenEntradaDto[];
  onEdit: (codigo: string) => void;
  onDelete: (codigo: string) => void;
  onRegistrarClasificacion: (orden: OrdenEntradaDto) => void;
}

export interface FilterOption {
  value: string;
  label: string;
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
  columnFilters: any[];
  rowSelection: Record<string, boolean>;
  columnVisibility: Record<string, boolean>;
  ordenACancelar: string | null;
  filters: FilterOptions;
} 