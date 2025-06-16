import { ProductoApi } from '@/types/product';

// Props para componentes principales
export interface ProductosTableProps {
  productos: ProductoApi[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
}

export interface TableHeaderProps {
  onNewProductClick: () => void;
}

// Tipos para formularios y datos
export interface ProductoFormData {
  codigo: string;
  nombre: string;
  descripcion?: string;
  imagen?: File;
}

export interface TableState {
  sorting: any[];
  columnFilters: any[];
  rowSelection: Record<string, boolean>;
  columnVisibility: Record<string, boolean>;
  productoAEliminar: string | null;
  productoAReactivar: string | null;
}

// Re-exportar tipos necesarios
export type { ProductoApi }; 