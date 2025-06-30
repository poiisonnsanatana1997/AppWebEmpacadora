interface ProveedoresFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  estado: string;
  onEstadoChange: (value: string) => void;
}

const ProveedoresFilters = ({ search, onSearchChange, estado, onEstadoChange }: ProveedoresFiltersProps) => (
  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4 bg-white border rounded-xl p-4 shadow">
    <input
      type="text"
      className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      placeholder="Buscar por nombre, RFC o correo..."
      value={search}
      onChange={e => onSearchChange(e.target.value)}
      aria-label="Buscar proveedor"
    />
    <select
      className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      value={estado}
      onChange={e => onEstadoChange(e.target.value)}
      aria-label="Filtrar por estado"
    >
      <option value="">Todos</option>
      <option value="activo">Activos</option>
      <option value="inactivo">Inactivos</option>
    </select>
  </div>
);

export default ProveedoresFilters; 