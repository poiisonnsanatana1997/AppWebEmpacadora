import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  VisibilityState,
} from '@tanstack/react-table';

interface UseDataTableProps<TData> {
  data: TData[];
  columns: any[];
  initialState?: {
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    rowSelection?: RowSelectionState;
    columnVisibility?: VisibilityState;
  };
}

export function useDataTable<TData>({
  data,
  columns,
  initialState = {},
}: UseDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialState.sorting || []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState.columnFilters || []);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialState.rowSelection || {});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState.columnVisibility || {});

  const table = useReactTable({
    data,
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
  });

  return {
    table,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
  };
} 