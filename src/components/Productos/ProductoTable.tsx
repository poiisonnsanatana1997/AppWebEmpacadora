// Importaciones
// ============================================
import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table';

// Componentes de UI
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterSelect } from './FilterSelect';
import { FilterInput } from './FilterInput';

// Iconos
import { Edit2, ChevronDown, ChevronUp, ChevronsUpDown, Loader2, ZoomIn, PackageX } from 'lucide-react';

// Utilidades y tipos
import styled from 'styled-components';
import { motion, AnimatePresence } from 'motion/react';
import { ProductoDto } from '@/types/Productos/productos.types';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Componentes Estilizados
// ============================================
const ImagePreview = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

// Interfaces
// ============================================
interface ProductoTableProps {
  productos: ProductoDto[];
  loading: boolean;
  error: string | null;
  onEdit: (id: number) => void;
}

// Componente Principal: ProductoTable
// ============================================
export function ProductoTable({ productos, loading, error, onEdit }: ProductoTableProps) {
  // Estados de la tabla
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  // Definición de columnas
  const columns = useMemo<ColumnDef<ProductoDto>[]>(() => [
    {
      accessorKey: 'imagen',
      header: 'Imagen',
      cell: ({ row }) => {
        const imagen = row.original.imagen;
        const imageUrl = imagen ? (imagen.startsWith('data:') ? imagen : `data:image/jpeg;base64,${imagen}`) : null;

        const handleImageClick = () => {
          if (imageUrl) {
            setSelectedImage(imageUrl);
            setLightboxOpen(true);
          }
        };

        return imageUrl ? (
          <div className="relative w-[50px] h-[50px]">
            <ImagePreview 
              src={imageUrl}
              alt={`Imagen de ${row.original.nombre}`}
              onClick={handleImageClick}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <ZoomIn className="h-6 w-6 text-white bg-black/50 rounded-full p-1" />
            </div>
          </div>
        ) : (
          <div className="w-[50px] h-[50px] bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">Sin imagen</span>
          </div>
        );
      },
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
      filterFn: (row, id, value) => {
        if (!value) return true;
        return String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase());
      },
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
      filterFn: (row, id, value) => {
        if (!value) return true;
        return String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      accessorKey: 'variedad',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Variedad
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
                placeholder="Filtrar por variedad..."
              />
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!value) return true;
        return String(row.getValue(id)).toLowerCase().includes(String(value).toLowerCase());
      },
    },
    {
      accessorKey: 'unidadMedida',
      header: ({ column }) => {
        const filterValue = column.getFilterValue() as string | undefined;
        return (
          <div className="flex flex-col">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer justify-start transition-colors duration-200 hover:bg-gray-100"
            >
              Unidad de Medida
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
                onChange={(value) => {
                  column.setFilterValue(value === "all" ? "" : value);
                }}
                options={[
                  { value: "all", label: "Todas las unidades" },
                  { value: "kilogramos", label: "Kilogramos" },
                  { value: "caja", label: "Caja" },
                  { value: "individual", label: "Individual" }
                ]}
                placeholder="Seleccionar unidad de medida"
              />
            </div>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!value) return true;
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: 'precio',
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
            >
              Precio
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-1 h-3 w-3" />
              ) : (
                <ChevronsUpDown className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <span className="font-bold">
            {new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN'
            }).format(row.original.precio)}
          </span>
        );
      },
    },
    {
      accessorKey: 'fechaRegistro',
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
            >
              Fecha Registro
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="ml-1 h-3 w-3" />
              ) : column.getIsSorted() === "desc" ? (
                <ChevronDown className="ml-1 h-3 w-3" />
              ) : (
                <ChevronsUpDown className="ml-1 h-3 w-3" />
              )}
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const fecha = new Date(row.original.fechaRegistro);
        return fecha.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
    },
    {
      accessorKey: 'activo',
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-semibold h-8 px-2 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
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
          </div>
        );
      },
      cell: ({ row }) => {
        const activo = row.original.activo;
        return (
          <Badge 
            variant="secondary"
            className={activo ? 'bg-green-200 text-green-800 hover:bg-green-300 font-semibold' : 'bg-red-200 text-red-800 hover:bg-red-300 font-semibold'}
          >
            {activo ? 'Activo' : 'Inactivo'}
          </Badge>
        );
      },
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(row.original.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar producto</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ], [onEdit]);

  // Memoización de los datos de la tabla
  const tableData = useMemo(() => productos, [productos]);

  // Configuración de la tabla
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Optimizaciones de rendimiento
    enableFilters: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableMultiSort: false,
    enableSortingRemoval: false,
    enableColumnResizing: false,
  });

  // Renderizado condicional
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <table className="w-full">
        <thead className="bg-[#f1f5f9]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="hover:bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 font-semibold text-gray-700 border-b border-[#e2e8f0]">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <AnimatePresence mode="wait">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <motion.tr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <td colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="bg-gray-50 rounded-full p-4">
                      <PackageX className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-700">No se encontraron productos</h3>
                      <p className="text-sm text-gray-500 max-w-md">
                        No hay productos que coincidan con los criterios de búsqueda actuales.
                        Intenta ajustar los filtros o crear un nuevo producto.
                      </p>
                    </div>
                  </div>
                </td>
              </motion.tr>
            )}
          </AnimatePresence>
        </tbody>
      </table>
      
      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={selectedImage ? [{ src: selectedImage }] : []}
      />
      
      {/* Controles de paginación */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer hidden lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a primera página</span>
              <ChevronUp className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a página anterior</span>
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a página siguiente</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 cursor-pointer hidden lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a última página</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
