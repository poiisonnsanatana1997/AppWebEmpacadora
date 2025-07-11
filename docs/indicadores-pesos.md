# Indicadores de Pesos - Documentación

## Descripción General

Los indicadores de pesos mejorados proporcionan una vista detallada y en tiempo real de los pesos clasificados por tipo, permitiendo un mejor control y seguimiento del proceso de clasificación.

## Características Implementadas

### 1. Pesos por Tipo de Clasificación
- **XL**: Peso total de tarimas clasificadas como Extra Large
- **L**: Peso total de tarimas clasificadas como Large  
- **M**: Peso total de tarimas clasificadas como Medium
- **S**: Peso total de tarimas clasificadas como Small

### 2. Peso Total Clasificado
Calculado como la suma de:
- Pesos por tipo (XL + L + M + S)
- Peso de retornos
- Peso de mermas

### 3. Comparación con Peso Esperado
- Muestra el peso total esperado por clasificar
- Calcula el progreso como porcentaje
- Indica si hay peso sobrante o faltante

### 4. Indicadores Visuales
- Barras de progreso con colores
- Iconos distintivos para cada tipo
- Colores diferenciados por categoría

## Componentes Creados

### 1. `IndicadoresPesos.tsx`
Componente reutilizable que muestra los indicadores de pesos con dos modos:
- **Modo completo**: 3 tarjetas con información detallada
- **Modo compacto**: 1 tarjeta con información resumida

#### Props:
```typescript
interface IndicadoresPesosProps {
  pesoXL: number;
  pesoL: number;
  pesoM: number;
  pesoS: number;
  pesoRetornos: number;
  pesoMermas: number;
  pesoTotalEsperado: number;
  showProgress?: boolean;
  title?: string;
  compact?: boolean;
}
```

### 2. `useIndicadoresPesos.ts`
Hook personalizado que calcula todos los indicadores de pesos.

#### Hooks disponibles:
- `useIndicadoresPesos(clasificaciones)`: Para múltiples clasificaciones
- `useIndicadoresPesosClasificacion(clasificacion)`: Para una sola clasificación

#### Retorna:
```typescript
interface IndicadoresPesosData {
  pesoXL: number;
  pesoL: number;
  pesoM: number;
  pesoS: number;
  pesoRetornos: number;
  pesoMermas: number;
  pesoTotalClasificado: number;
  pesoTotalEsperado: number;
  progreso: number;
  pesosPorTipo: Record<string, number>;
}
```

## Uso en el Proyecto

### En ClasificacionDetalle.tsx
```typescript
import { useIndicadoresPesosClasificacion } from '../../hooks/Clasificacion/useIndicadoresPesos';

const indicadores = useIndicadoresPesosClasificacion(clasificacion);
```

### En ClasificacionOrdenEntrada.tsx
```typescript
import { useIndicadoresPesos } from '../hooks/Clasificacion/useIndicadoresPesos';

const indicadores = useIndicadoresPesos(clasificaciones);
```

### Uso del Componente Reutilizable
```typescript
import { IndicadoresPesos } from '../components/Clasificacion/IndicadoresPesos';

<IndicadoresPesos
  pesoXL={indicadores.pesoXL}
  pesoL={indicadores.pesoL}
  pesoM={indicadores.pesoM}
  pesoS={indicadores.pesoS}
  pesoRetornos={indicadores.pesoRetornos}
  pesoMermas={indicadores.pesoMermas}
  pesoTotalEsperado={indicadores.pesoTotalEsperado}
  showProgress={true}
  title="Indicadores de Pesos"
  compact={false}
/>
```

## Cálculos Realizados

### 1. Pesos por Tipo
```typescript
const pesosPorTipo = tarimas.reduce((acc, tarima) => {
  const tipo = tarima.tipo;
  if (!acc[tipo]) {
    acc[tipo] = 0;
  }
  acc[tipo] += tarima.peso;
  return acc;
}, {} as Record<string, number>);
```

### 2. Peso Total Clasificado
```typescript
const pesoTotalClasificado = pesoXL + pesoL + pesoM + pesoS + pesoRetornos + pesoMermas;
```

### 3. Progreso
```typescript
const progreso = pesoTotalEsperado > 0 ? (pesoTotalClasificado / pesoTotalEsperado) * 100 : 0;
```

## Beneficios

1. **Visibilidad mejorada**: Muestra claramente los pesos por tipo de clasificación
2. **Control de calidad**: Permite identificar desviaciones del peso esperado
3. **Toma de decisiones**: Facilita la identificación de problemas en el proceso
4. **Reutilización**: Componentes y hooks reutilizables en otras partes del sistema
5. **Mantenibilidad**: Código centralizado y bien estructurado

## Consideraciones Técnicas

- Los cálculos se realizan usando `useMemo` para optimizar el rendimiento
- Los componentes son completamente responsivos
- Se mantiene la consistencia con el diseño existente
- Se siguen las mejores prácticas de React y TypeScript
- Los hooks están tipados correctamente para evitar errores

## Próximas Mejoras Posibles

1. **Alertas automáticas**: Notificaciones cuando el progreso supere ciertos umbrales
2. **Gráficos**: Visualización de datos con gráficos de barras o circulares
3. **Exportación**: Funcionalidad para exportar reportes de pesos
4. **Histórico**: Seguimiento de cambios en los pesos a lo largo del tiempo
5. **Comparación**: Comparación de pesos entre diferentes órdenes o períodos 