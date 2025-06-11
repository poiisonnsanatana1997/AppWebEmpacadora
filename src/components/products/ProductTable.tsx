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
  ColumnResizeMode,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
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
import clsx from 'clsx';
import 'react-resizable/css/styles.css';
import { Combobox } from '@headlessui/react';
import { Check } from 'lucide-react';
import { ProductoApi } from '@/types/product';

interface ProductTableProps {
  products: ProductoApi[];
  onEdit: (producto: ProductoApi) => void;
  onDelete: (producto: ProductoApi) => void;
}

// Agregar la función de filtrado fuzzy
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rankear el item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Guardar el ranking para el item
  addMeta({
    itemRank,
  });

  // Retornar si el item debe ser incluido en los resultados
  return itemRank.passed;
};

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnResizeMode] = React.useState<ColumnResizeMode>('onChange');
  const [columnSizing, setColumnSizing] = React.useState({});

  // Función para obtener valores únicos de una columna
  const getUniqueValues = (columnId: string) => {
    const values = new Set<string>();
    products.forEach((product) => {
      const value = product[columnId as keyof ProductoApi];
      if (value) values.add(String(value));
    });
    return Array.from(values).sort();
  };

  // Componente de filtro avanzado
  const AdvancedFilter = ({ column }: { column: any }) => {
    const [query, setQuery] = React.useState('');
    const uniqueValues = getUniqueValues(column.id);
    const filteredValues = query === ''
      ? uniqueValues
      : uniqueValues.filter((value) =>
          value.toLowerCase().includes(query.toLowerCase())
        );

    return (
      <Combobox
        value={column.getFilterValue() ?? ""}
        onChange={(value: string) => column.setFilterValue(value === "" ? undefined : value)}
      >
        <div className="relative">
          <Combobox.Input
            className="w-full h-7 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            displayValue={(value: string) => value}
            placeholder={`Filtrar ${column.id}...`}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <Combobox.Option
            value=""
            className={({ active }: { active: boolean }) =>
              clsx(
                'relative cursor-default select-none py-2 pl-10 pr-4',
                active ? 'bg-primary text-primary-foreground' : 'text-foreground'
              )
            }
          >
            {({ selected, active }: { selected: boolean; active: boolean }) => (
              <>
                <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                  Todos
                </span>
                {selected && (
                  <span className={clsx(
                    'absolute inset-y-0 left-0 flex items-center pl-3',
                    active ? 'text-primary-foreground' : 'text-primary'
                  )}>
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </>
            )}
          </Combobox.Option>
          {filteredValues.map((value) => (
            <Combobox.Option
              key={value}
              value={value}
              className={({ active }: { active: boolean }) =>
                clsx(
                  'relative cursor-default select-none py-2 pl-10 pr-4',
                  active ? 'bg-primary text-primary-foreground' : 'text-foreground'
                )
              }
            >
              {({ selected, active }: { selected: boolean; active: boolean }) => (
                <>
                  <span className={clsx('block truncate', selected ? 'font-medium' : 'font-normal')}>
                    {value}
                  </span>
                  {selected && (
                    <span className={clsx(
                      'absolute inset-y-0 left-0 flex items-center pl-3',
                      active ? 'text-primary-foreground' : 'text-primary'
                    )}>
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    );
  };

  const columns = React.useMemo<ColumnDef<ProductoApi, any>[]>(
    () => [
      {
        accessorKey: 'imagen',
        header: 'Imagen',
        cell: ({ row }) => <ProductImage imageBase64={row.original.imagen} />,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'codigo',
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
                    className={clsx(
                      "h-6 w-6 relative cursor-pointer",
                      hasFilter && "text-blue-500"
                    )}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <AdvancedFilter column={column} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        filterFn: fuzzyFilter,
      },
      {
        accessorKey: 'nombre',
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
                    className={clsx(
                      "h-6 w-6 relative cursor-pointer",
                      hasFilter && "text-blue-500"
                    )}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <AdvancedFilter column={column} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        filterFn: fuzzyFilter,
      },
      {
        accessorKey: 'variedad',
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
                    className={clsx(
                      "h-6 w-6 relative cursor-pointer",
                      hasFilter && "text-blue-500"
                    )}
                  >
                    <Filter className="h-3 w-3" />
                    {hasFilter && (
                      <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <AdvancedFilter column={column} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        filterFn: fuzzyFilter,
      },
      {
        accessorKey: 'unidadMedida',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <div className="font-semibold">Unidad de Medida</div>
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
                      <SelectValue placeholder="Filtrar unidad de medida" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="kilogramos">Kilogramos</SelectItem>
                      <SelectItem value="pieza">Pieza</SelectItem>
                    </SelectContent>
                  </Select>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        cell: ({ row }) => row.original.unidadMedida || '-',
        filterFn: (row, _id, value) => {
          if (!value || value === "all") return true;
          return row.original.unidadMedida === value;
        },
      },
      {
        accessorKey: 'precio',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <div className="font-semibold">Precio</div>
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
                      <SelectValue placeholder="Filtrar precio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="kilogramos">Kilogramos</SelectItem>
                      <SelectItem value="pieza">Pieza</SelectItem>
                    </SelectContent>
                  </Select>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        cell: ({ row }) => row.original.precio || '-',
        filterFn: (row, _id, value) => {
          if (!value || value === "all") return true;
          return row.original.precio === value;
        },
      },
      {
        accessorKey: 'estatus',
        header: ({ column }) => {
          const filterValue = column.getFilterValue() as string | undefined;
          const hasFilter = Boolean(filterValue);
          return (
            <div className="flex items-center gap-1">
              <div className="font-semibold">Estatus</div>
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
                      <SelectValue placeholder="Filtrar estatus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="inactivo">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        cell: ({ row }) => (
          <Badge variant={row.original.estatus === "activo" ? "default" : "destructive"}>
            {row.original.estatus === "activo" ? "Activo" : "Inactivo"}
          </Badge>
        ),
        enableSorting: false,
        filterFn: (row, _id, value) => {
          if (!value || value === "all") return true;
          return row.original.estatus === value;
        },
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
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: fuzzyFilter,
    columnResizeMode,
    enableColumnResizing: true,
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
                      onSelect={(e: Event) => {
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
                    <TableHead 
                      key={header.id}
                      style={{ 
                        width: header.getSize(),
                        position: 'relative',
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={clsx(
                            "relative h-full w-full",
                            "flex items-center justify-between"
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={clsx(
                              "absolute right-0 top-0 h-full w-1",
                              "cursor-col-resize select-none touch-none",
                              "bg-transparent hover:bg-blue-500",
                              "opacity-0 hover:opacity-100",
                              "transition-opacity"
                            )}
                          />
                        </div>
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
                      className={clsx(row.getIsSelected() && "bg-muted/50")}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell 
                          key={cell.id}
                          style={{ 
                            width: cell.column.getSize(),
                            position: 'relative',
                          }}
                        >
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
              className={clsx(
                "h-8 w-8 p-0 cursor-pointer",
                "hidden lg:flex"
              )}
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
              className={clsx(
                "h-8 w-8 p-0 cursor-pointer",
                "hidden lg:flex"
              )}
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