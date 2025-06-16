import { OrdenEntradaDto } from "../../../types/ordenesEntrada";


export interface OrdenesEntradaTableProps {
  ordenes: OrdenEntradaDto[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface TableState {
  sorting: any[];
  columnFilters: any[];
  rowSelection: Record<string, boolean>;
  columnVisibility: Record<string, boolean>;
  ordenACancelar: string | null;
  ordenAReactivar: string | null;
} 