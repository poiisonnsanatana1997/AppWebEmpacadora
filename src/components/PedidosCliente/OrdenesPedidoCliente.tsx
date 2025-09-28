import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Trash2, 
  Plus, 
  Package, 
  Edit3, 
  X,
  Calculator,
  Scale,
  Info
} from 'lucide-react';
import { ordenSchema, type OrdenData, type OrdenesData } from '@/schemas/pedidoClienteWizardSchema';
import { ProductoDto } from '@/types/Productos/productos.types';

// Schema para agregar nueva orden
const agregarOrdenSchema = z.object({
  tipo: z.string().min(1, 'El tipo es requerido'),
  cantidad: z.number().min(0, 'La cantidad no puede ser negativa').optional(),
  peso: z.number().min(0, 'El peso no puede ser negativo').optional(),
  idProducto: z.number().min(1, 'Debe seleccionar un producto'),
});

interface OrdenesPedidoClienteProps {
  ordenes: OrdenData[];
  productos: ProductoDto[];
  onAgregarOrden: (orden: Omit<OrdenData, 'id'>) => void;
  onEliminarOrden: (index: number) => void;
  onActualizarOrden: (index: number, orden: Partial<OrdenData>) => void;
}

const tiposOrden = [
  { value: 'XL', label: 'XL' },
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'S', label: 'S' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

export const OrdenesPedidoCliente: React.FC<OrdenesPedidoClienteProps> = ({
  ordenes,
  productos,
  onAgregarOrden,
  onEliminarOrden,
  onActualizarOrden,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' } | null>(null);

  // Detectar si es móvil
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const addOrderForm = useForm<z.infer<typeof agregarOrdenSchema>>({
    resolver: zodResolver(agregarOrdenSchema),
    defaultValues: {
      tipo: '',
      cantidad: 0,
      peso: 0,
      idProducto: undefined,
    },
    mode: 'onBlur',
  });

  const handleSubmit = (data: z.infer<typeof agregarOrdenSchema>) => {
    const ordenData = {
      ...data,
      cantidad: data.cantidad === 0 ? undefined : data.cantidad,
      peso: data.peso === 0 ? undefined : data.peso,
    };

    // Verificar si ya existe una orden con el mismo tipo y producto
    const ordenExistente = ordenes.find(
      orden => orden.tipo === ordenData.tipo && orden.idProducto === ordenData.idProducto
    );

    if (editingIndex !== null) {
      // Verificar si al editar se combinará con otra orden existente
      const ordenOriginal = ordenes[editingIndex];
      const seCombinara = ordenes.some((orden, i) => 
        i !== editingIndex && 
        orden.tipo === ordenData.tipo && 
        orden.idProducto === ordenData.idProducto
      );
      
      onActualizarOrden(editingIndex, ordenData);
      setEditingIndex(null);
      setShowForm(false);
      
      // Mostrar notificación si se combinó
      if (seCombinara) {
        const productoInfo = getProductoInfo(ordenData.idProducto);
        setNotification({
          message: `Se combinó con la orden existente de ${productoInfo.nombre} (${ordenData.tipo})`,
          type: 'info'
        });
        
        // Limpiar notificación después de 3 segundos
        setTimeout(() => setNotification(null), 3000);
      }
    } else {
      onAgregarOrden(ordenData);
      
      // Mostrar notificación si se combinó con una orden existente
      if (ordenExistente) {
        const productoInfo = getProductoInfo(ordenData.idProducto);
        setNotification({
          message: `Se combinó con la orden existente de ${productoInfo.nombre} (${ordenData.tipo})`,
          type: 'info'
        });
        
        // Limpiar notificación después de 3 segundos
        setTimeout(() => setNotification(null), 3000);
      }
    }
    
    addOrderForm.reset();
  };

  const handleCancel = () => {
    addOrderForm.reset();
    setShowForm(false);
    setEditingIndex(null);
    setNotification(null);
  };

  const handleEdit = (index: number) => {
    const orden = ordenes[index];
    addOrderForm.reset({
      tipo: orden.tipo,
      cantidad: orden.cantidad || 0,
      peso: orden.peso || 0,
      idProducto: orden.idProducto,
    });
    setEditingIndex(index);
    setShowForm(true);
    
    // Limpiar notificación al editar
    setNotification(null);
  };

  const getProductoInfo = (idProducto: number) => {
    const producto = productos.find(p => p.id === idProducto);
    if (!producto) return { nombre: 'Producto no encontrado', info: '', precio: 0 };
    
    return {
      nombre: producto.nombre,
      info: `${producto.codigo} | ${producto.variedad}`,
      precio: producto.precio
    };
  };

  const calcularTotal = () => {
    return ordenes.reduce((total, orden) => {
      const cantidad = orden.cantidad && orden.cantidad > 0 ? orden.cantidad : 0;
      const peso = orden.peso && orden.peso > 0 ? orden.peso : 0;
      return total + cantidad + peso;
    }, 0);
  };

  // Paginación manual
  const paginatedOrdenes = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return ordenes.slice(start, start + pageSize);
  }, [ordenes, currentPage, pageSize]);

  const columns = React.useMemo<ColumnDef<OrdenData>[]>(() => [
    {
      accessorKey: 'tipo',
      header: () => <span className="font-semibold">Tipo</span>,
      cell: ({ row }) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.original.tipo === 'XL' ? 'bg-purple-100 text-purple-800' :
          row.original.tipo === 'L' ? 'bg-blue-100 text-blue-800' :
          row.original.tipo === 'M' ? 'bg-green-100 text-green-800' :
          row.original.tipo === 'S' ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.original.tipo}
        </span>
      ),
    },
    {
      accessorKey: 'idProducto',
      header: () => <span className="font-semibold">Producto</span>,
      cell: ({ row }) => {
        const productoInfo = getProductoInfo(row.original.idProducto);
        return (
          <div className="flex flex-col">
            <span className="font-medium text-slate-800">{productoInfo.nombre}</span>
            <span className="text-xs text-slate-500">{productoInfo.info}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'cantidad',
      header: () => <span className="font-semibold">Cajas</span>,
      cell: ({ row }) => (
        <span className="text-slate-700">
          {row.original.cantidad && row.original.cantidad > 0 ? row.original.cantidad : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'peso',
      header: () => <span className="font-semibold">Peso</span>,
      cell: ({ row }) => (
        <span className="text-slate-700">
          {row.original.peso && row.original.peso > 0 ? `${row.original.peso} kg` : '-'}
        </span>
      ),
    },
    {
      id: 'acciones',
      header: () => <span className="font-semibold">Acciones</span>,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEliminarOrden(row.index)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-md transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ], [productos, handleEdit, onEliminarOrden]);

  const table = useReactTable({
    data: paginatedOrdenes,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  const totalPages = Math.ceil(ordenes.length / pageSize) || 1;

  // Componente del formulario
  const FormularioOrden = () => (
    <Card className="h-fit w-80 hidden lg:block">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {editingIndex !== null ? 'Editar Orden' : 'Agregar Nueva Orden'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...addOrderForm}>
          <form onSubmit={addOrderForm.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-4">
              <FormField
                control={addOrderForm.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposOrden.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addOrderForm.control}
                name="idProducto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Producto *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? field.value.toString() : ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el producto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productos.filter(p => p.activo).map((producto) => (
                          <SelectItem key={producto.id} value={producto.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">{producto.nombre}</span>
                              <span className="text-xs text-muted-foreground">
                                {producto.codigo} | {producto.variedad}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addOrderForm.control}
                name="cantidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cajas *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={addOrderForm.control}
                name="peso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder="0.0"
                        value={field.value === 0 ? '' : field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            field.onChange(value === '' ? 0 : Number(value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col gap-3 pt-3 border-t">
              <Button 
                type="submit" 
                className="w-full"
              >
                {editingIndex !== null ? 'Actualizar Orden' : 'Agregar Orden'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {/* Notificación */}
      {notification && (
        <div className={`p-3 rounded-lg border ${
          notification.type === 'info' 
            ? 'bg-blue-50 border-blue-200 text-blue-800' 
            : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Métricas y botón */}
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Órdenes</p>
              <p className="text-lg font-semibold text-gray-900">{ordenes.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Calculator className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cajas</p>
              <p className="text-lg font-semibold text-gray-900">{calcularTotal()}</p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          disabled={showForm}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Orden
        </Button>
      </div>

      {/* Layout principal con tabla y formulario lateral */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Tabla de órdenes */}
        <div className="flex-1">
          {ordenes.length === 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Debes agregar al menos una orden para continuar al siguiente paso.
              </p>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className="px-3 py-2 align-top text-left font-semibold text-slate-700 border-b border-gray-200">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 py-6">
                        <div className="bg-gray-50 rounded-full p-3">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">No hay órdenes agregadas</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-3 py-2 align-middle text-slate-700">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Controles de paginación y selector de filas por página */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 mt-3">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Filas por página</p>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-transparent px-2 py-1 text-sm"
              >
                {PAGE_SIZE_OPTIONS.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center text-sm font-medium">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0 cursor-pointer hidden lg:flex"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Ir a primera página</span>
                <span className="inline-block rotate-90"><svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M8 17l4-4-4-4m8 8V7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Ir a página anterior</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Ir a página siguiente</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0 cursor-pointer hidden lg:flex"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Ir a última página</span>
                <span className="inline-block -rotate-90"><svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M16 7l-4 4 4 4M8 7v10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              </Button>
            </div>
          </div>
        </div>

        {/* Formulario lateral (solo en escritorio) */}
        {showForm && <FormularioOrden />}
      </div>

      {/* Modal para móvil */}
      <Dialog open={showForm && isMobile} onOpenChange={setShowForm}>
        <DialogContent className="lg:hidden max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? 'Editar Orden' : 'Agregar Nueva Orden'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Form {...addOrderForm}>
              <form onSubmit={addOrderForm.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="space-y-4">
                  <FormField
                    control={addOrderForm.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposOrden.map((tipo) => (
                              <SelectItem key={tipo.value} value={tipo.value}>
                                {tipo.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addOrderForm.control}
                    name="idProducto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Producto *</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? field.value.toString() : ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el producto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productos.filter(p => p.activo).map((producto) => (
                              <SelectItem key={producto.id} value={producto.id.toString()}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{producto.nombre}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {producto.codigo} | {producto.variedad}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addOrderForm.control}
                    name="cantidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cajas *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={addOrderForm.control}
                    name="peso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.0"
                            value={field.value === 0 ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                field.onChange(value === '' ? 0 : Number(value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-3 pt-3 border-t">
                  <Button 
                    type="submit" 
                    className="w-full"
                  >
                    {editingIndex !== null ? 'Actualizar Orden' : 'Agregar Orden'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 