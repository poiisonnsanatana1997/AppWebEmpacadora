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
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, ChevronDown, ChevronUp, ChevronsUpDown, Search, SlidersHorizontal, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Product } from '@/types/product';
import { ProductImage } from './ProductImage';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns = React.useMemo<ColumnDef<Product, any>[]>(
    () => [
      {
        accessorKey: 'imageBase64',
        header: 'Imagen',
        cell: ({ row }) => <ProductImage imageBase64={row.original.imageBase64} />,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'code',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-semibold h-8 px-2 cursor-pointer"
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 relative cursor-pointer ${hasFilter ? "text-blue-500" : ""}`}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  <Input
                    placeholder="Filtrar código..."
                    value={filterValue ?? ""}
                    onChange={(event) => column.setFilterValue(event.target.value)}
                    className="h-7"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
      {
        accessorKey: 'name',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-semibold h-8 px-2 cursor-pointer"
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 relative cursor-pointer ${hasFilter ? "text-blue-500" : ""}`}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  <Input
                    placeholder="Filtrar nombre..."
                    value={filterValue ?? ""}
                    onChange={(event) => column.setFilterValue(event.target.value)}
                    className="h-7"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
      {
        accessorKey: 'variety',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="font-semibold h-8 px-2 cursor-pointer"
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 relative cursor-pointer ${hasFilter ? "text-blue-500" : ""}`}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  <Input
                    placeholder="Filtrar variedad..."
                    value={filterValue ?? ""}
                    onChange={(event) => column.setFilterValue(event.target.value)}
                    className="h-7"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <div className="font-semibold">Estado</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 relative cursor-pointer ${hasFilter ? "text-blue-500" : ""}`}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  <Select
                    value={filterValue ?? "all"}
                    onValueChange={(value) => column.setFilterValue(value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="Filtrar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="true">Activo</SelectItem>
                      <SelectItem value="false">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "default" : "destructive"}>
            {row.original.isActive ? "Activo" : "Inactivo"}
          </Badge>
        ),
        enableSorting: false,
        filterFn: (row, _id, value) => {
          if (!value || value === "all") return true;
          return row.original.isActive.toString() === value;
        },
      },
      {
        accessorKey: 'size',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <div className="font-semibold">Tamaño</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 relative cursor-pointer ${hasFilter ? "text-blue-500" : ""}`}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  <Input
                    placeholder="Filtrar tamaño..."
                    value={filterValue ?? ""}
                    onChange={(event) => column.setFilterValue(event.target.value)}
                    className="h-7"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        cell: ({ row }) => row.original.size || '-',
      },
      {
        accessorKey: 'packagingType',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <div className="font-semibold">Empaque</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 relative cursor-pointer ${hasFilter ? "text-blue-500" : ""}`}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  <Input
                    placeholder="Filtrar empaque..."
                    value={filterValue ?? ""}
                    onChange={(event) => column.setFilterValue(event.target.value)}
                    className="h-7"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        cell: ({ row }) => row.original.packagingType || '-',
      },
      {
        accessorKey: 'unit',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <div className="font-semibold">Unidad</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-6 w-6 relative cursor-pointer ${hasFilter ? "text-blue-500" : ""}`}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[180px]">
                  <Input
                    placeholder="Filtrar unidad..."
                    value={filterValue ?? ""}
                    onChange={(event) => column.setFilterValue(event.target.value)}
                    className="h-7"
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        cell: ({ row }) => row.original.unit || '-',
      },
      {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(row.original)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar producto</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(row.original)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eliminar producto</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data: products,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto cursor-pointer">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      className="capitalize"
                      onSelect={(e) => {
                        e.preventDefault();
                        column.toggleVisibility(!column.getIsVisible());
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={column.getIsVisible()}
                          onChange={() => {}}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        {column.id}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className={row.getIsSelected() ? "bg-muted/50" : ""}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
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
              className="hidden h-8 w-8 p-0 lg:flex cursor-pointer"
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
              className="hidden h-8 w-8 p-0 lg:flex cursor-pointer"
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

export default ProductTable; 