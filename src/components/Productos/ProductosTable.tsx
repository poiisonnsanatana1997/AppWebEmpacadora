import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  VisibilityState,
  FilterFn,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { motion } from 'framer-motion';
import { ProductoApi } from '@/types/product';
import { ProductImage } from '@/components/Productos/components/ProductImage';
import { FilterInput } from '@/components/Productos/components/FilterInput';
import { FilterSelect } from '@/components/Productos/components/FilterSelect';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, RefreshCw, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import styled from 'styled-components';

// Componentes estilizados
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
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
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4A5568;
  border-bottom: 2px solid #E2E8F0;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #E2E8F0;
  color: #2D3748;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  margin: 0 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const EditButton = styled(ActionButton)`
  background: #EBF8FF;
  color: #2B6CB0;
  
  &:hover {
    background: #BEE3F8;
  }
`;

const DeleteButton = styled(ActionButton)`
  background: #FFF5F5;
  color: #C53030;
  
  &:hover {
    background: #FED7D7;
  }
`;

const ReactivateButton = styled(ActionButton)`
  background: #F0FFF4;
  color: #2F855A;
  
  &:hover {
    background: #C6F6D5;
  }
`;

const StatusBadge = styled.span<{ active: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.active ? '#F0FFF4' : '#FFF5F5'};
  color: ${props => props.active ? '#2F855A' : '#C53030'};
`;

// Función de filtrado fuzzy
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

interface ProductosTableProps {
  productos: ProductoApi[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
}

export function ProductosTable({ productos, onEdit, onDelete, onReactivate }: ProductosTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [productoAEliminar, setProductoAEliminar] = React.useState<ProductoApi | null>(null);
  const [productoAReactivar, setProductoAReactivar] = React.useState<ProductoApi | null>(null);

  const handleEliminarProducto = (producto: ProductoApi) => {
    setProductoAEliminar(producto);
  };

  const handleReactivarProducto = (producto: ProductoApi) => {
    setProductoAReactivar(producto);
  };

  const handleConfirmarEliminacion = async () => {
    if (!productoAEliminar) return;
    try {
      await onDelete(productoAEliminar.id.toString());
      setProductoAEliminar(null);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleConfirmarReactivacion = async () => {
    if (!productoAReactivar) return;
    try {
      await onReactivate(productoAReactivar.id.toString());
      setProductoAReactivar(null);
    } catch (error) {
      console.error('Error al reactivar el producto:', error);
    }
  };

  const columns = React.useMemo<ColumnDef<ProductoApi>[]>(() => [
    {
      accessorKey: 'imagen',
      header: 'Imagen',
      cell: ({ row }) => <ProductImage src={row.original.imagen} alt={row.original.nombre} />,
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'codigo',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Código
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-1 h-3 w-3" />
              ) : (
                <ChevronsUpDown className="ml-1 h-3 w-3" />
              )}
            </Button>
            <div className="mt-2">
              <FilterInput
                value={(filterValue as string) ?? ""}
                onChange={(value) => column.setFilterValue(value)}
                placeholder="Filtrar por código..."
              />
            </div>
          </div>
        );
      },
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: 'nombre',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Nombre
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-1 h-3 w-3" />
              ) : (
                <ChevronsUpDown className="ml-1 h-3 w-3" />
              )}
            </Button>
            <div className="mt-2">
              <FilterInput
                value={(filterValue as string) ?? ""}
                onChange={(value) => column.setFilterValue(value)}
                placeholder="Filtrar por nombre..."
              />
            </div>
          </div>
        );
      },
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      cell: ({ row }) => row.original.descripcion || '-',
    },
    {
      accessorKey: 'activo',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Estado
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-1 h-3 w-3" />
              ) : (
                <ChevronsUpDown className="ml-1 h-3 w-3" />
              )}
            </Button>
            <div className="mt-2">
              <FilterSelect
                value={filterValue ?? "all"}
                onChange={(value) => column.setFilterValue(value === "all" ? "" : value)}
                options={[
                  { value: "all", label: "Todos" },
                  { value: "true", label: "Activos" },
                  { value: "false", label: "Inactivos" }
                ]}
                placeholder="Filtrar por estado"
              />
            </div>
          </div>
        );
      },
      cell: ({ row }) => (
        <StatusBadge active={row.original.activo}>
          {row.original.activo ? 'Activo' : 'Inactivo'}
        </StatusBadge>
      ),
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.original.activo === (value === "true");
      },
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <EditButton onClick={() => onEdit(row.original.id.toString())}>
                  <Edit2 className="w-4 h-4" />
                </EditButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar producto</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {row.original.activo ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DeleteButton onClick={() => handleEliminarProducto(row.original)}>
                    <Trash2 className="w-4 h-4" />
                  </DeleteButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eliminar producto</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ReactivateButton onClick={() => handleReactivarProducto(row.original)}>
                    <RefreshCw className="w-4 h-4" />
                  </ReactivateButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reactivar producto</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ], [onEdit, onDelete, onReactivate]);

  const table = useReactTable({
    data: productos,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <TableContainer>
      <div className="space-y-4">
        <Table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Diálogos de confirmación */}
      <AlertDialog open={!!productoAEliminar} onOpenChange={() => setProductoAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será marcado como inactivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarEliminacion}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!productoAReactivar} onOpenChange={() => setProductoAReactivar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reactivar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              El producto volverá a estar activo y disponible para su uso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmarReactivacion}>
              Reactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TableContainer>
  );
} 