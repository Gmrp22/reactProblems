# 🎯 Conceptos de Optimización en React - Shopping Cart

## 📚 Índice
1. [Trade-offs (Compromisos)](#trade-offs-compromisos)
2. [Memoización Selectiva](#memoización-selectiva)
3. [React.memo](#reactmemo)
4. [useCallback](#usecallback)
5. [useMemo](#usememo)
6. [Custom Hooks](#custom-hooks)
7. [Arquitectura de Componentes](#arquitectura-de-componentes)
8. [Casos de Uso Reales](#casos-de-uso-reales)

---

## ⚖️ Trade-offs (Compromisos)

> **"Toda optimización tiene un costo. La clave es saber cuándo vale la pena."**

### 🎯 La Realidad de las Optimizaciones

Cada herramienta (React.memo, useCallback, useMemo) tiene **costos** y **beneficios**. No son gratis.

---

### 1️⃣ React.memo

#### ✅ Beneficio
- Previene re-renders innecesarios
- Ahorra tiempo de CPU
- Mejora performance en listas grandes

#### ❌ Costo
```jsx
const MemoizedComponent = React.memo(Component);

// Costos:
// 1. Memoria: Almacena el render previo
// 2. CPU: Compara props en CADA render del padre
// 3. Complejidad: Más código, más difícil de debuggear
```

#### 📊 Análisis del Trade-off

```javascript
// Pseudo-código de lo que React hace internamente

function memo(Component) {
  let cachedProps = null;
  let cachedResult = null;
  
  return function MemoizedComponent(newProps) {
    // ⚠️ COSTO 1: Comparación en CADA render del padre
    if (cachedProps && shallowEqual(cachedProps, newProps)) {
      // ✅ BENEFICIO: Reutiliza render anterior
      return cachedResult;
    }
    
    // ⚠️ COSTO 2: Almacena en memoria
    cachedProps = newProps;
    cachedResult = <Component {...newProps} />;
    
    return cachedResult;
  }
}
```

#### 🤔 ¿Cuándo vale la pena?

```jsx
// ✅ VALE LA PENA
// Componente costoso (100ms), comparación barata (1ms)
const HeavyChart = React.memo(({ data }) => {
  // 100ms de procesamiento
  return <ComplexVisualization data={data} />;
});
// Trade-off: Pagas 1ms para ahorrar 99ms ✅

// ❌ NO VALE LA PENA
// Componente simple (1ms), comparación cara (0.5ms)
const Button = React.memo(({ text, onClick, style, className, disabled }) => {
  return <button>{text}</button>;
});
// Trade-off: Pagas 0.5ms para ahorrar 0.5ms ❌ (50% overhead)
```

#### 📈 Regla del 80/20
```
Si el componente tarda:
- < 5ms en renderizar  → ❌ Probablemente no vale la pena
- 5-15ms              → ⚠️ Depende del caso
- > 15ms              → ✅ Probablemente vale la pena
```

---

### 2️⃣ useCallback

#### ✅ Beneficio
- Mantiene referencia estable de función
- Permite que React.memo funcione correctamente
- Evita re-creación de funciones

#### ❌ Costo
```jsx
// Sin useCallback
const handleClick = () => console.log('click');
// Costo: Nueva función en cada render (barato)

// Con useCallback
const handleClick = useCallback(() => console.log('click'), []);
// Costos:
// 1. Memoria: Almacena la función
// 2. CPU: Compara dependencias en cada render
// 3. Complejidad: Gestionar array de dependencias
```

#### 📊 Análisis del Trade-off

```jsx
// Ejemplo 1: ❌ NO vale la pena
function Parent() {
  const [count, setCount] = useState(0);
  
  // ❌ Overhead innecesario
  const handleClick = useCallback(() => {
    console.log('click');
  }, []);
  
  // No se pasa a componente memoizado
  return <button onClick={handleClick}>{count}</button>;
}
// Trade-off: Pagas overhead de useCallback para NADA ❌

// Ejemplo 2: ✅ Vale la pena
function Parent() {
  const [count, setCount] = useState(0);
  
  // ✅ Necesario para que memo funcione
  const handleClick = useCallback(() => {
    console.log('click');
  }, []);
  
  // Se pasa a 1000 items memoizados
  return items.map(item => (
    <MemoizedItem key={item.id} onClick={handleClick} />
  ));
}
// Trade-off: Pequeño overhead vs 1000 re-renders evitados ✅
```

#### 🎯 Cuándo vale la pena

| Escenario | useCallback | Razón |
|-----------|-------------|-------|
| Función pasada a 1 componente NO memoizado | ❌ | Overhead > beneficio |
| Función pasada a 1 componente memoizado | ⚠️ | Borderline, depende |
| Función pasada a 100 componentes memoizados | ✅ | Gran beneficio |
| Función como dependencia de useEffect | ✅ | Evita loops infinitos |
| Función muy simple (1 línea) | ⚠️ | Considerar inline |

---

### 3️⃣ useMemo

#### ✅ Beneficio
- Evita recalcular valores costosos
- Mantiene referencias estables
- Mejora performance

#### ❌ Costo
```jsx
// Sin useMemo
const filtered = data.filter(item => item.active);
// Costo: Cálculo en cada render

// Con useMemo
const filtered = useMemo(
  () => data.filter(item => item.active),
  [data]
);
// Costos:
// 1. Memoria: Almacena resultado
// 2. CPU: Compara dependencias
// 3. Complejidad: Gestionar dependencias
```

#### 📊 Análisis del Trade-off

```jsx
// ❌ NO vale la pena - Cálculo trivial
const total = useMemo(() => price + tax, [price, tax]);
// Comparar [price, tax] es TAN costoso como price + tax
// Trade-off: Overhead 100% ❌

// ⚠️ BORDERLINE - Cálculo medio
const filtered = useMemo(
  () => items.filter(i => i.active), // 10 items
  [items]
);
// Si items tiene 10 elementos: probablemente no vale la pena
// Si items tiene 10,000 elementos: definitivamente vale la pena

// ✅ VALE LA PENA - Cálculo costoso
const sorted = useMemo(() => {
  return items
    .filter(i => i.category === category)
    .filter(i => i.name.includes(search))
    .sort((a, b) => complexComparison(a, b));
}, [items, category, search]);
// Trade-off: Comparar 3 variables vs filtrar+ordenar miles ✅
```

#### 📏 Regla de Complejidad

```
Complejidad del cálculo:
- O(1) - constante       → ❌ No usar useMemo
- O(n) - lineal pequeña  → ⚠️ Depende del n
- O(n) - lineal grande   → ✅ Usar useMemo
- O(n²) - cuadrática     → ✅ Definitivamente usar
- O(n log n) - sort      → ✅ Usar si n > 100
```

---

### 4️⃣ Comparativa: Optimizado vs No Optimizado

#### Escenario: Lista de 100 productos

```jsx
// ❌ Sin optimización
function ProductList({ products, search }) {
  // Se ejecuta en CADA render del padre
  const filtered = products
    .filter(p => p.name.includes(search))
    .sort((a, b) => a.price - b.price);
  
  return filtered.map(p => <ProductCard {...p} />);
}

// Render del padre por cambio de moneda:
// 1. Filtra 100 productos (5ms)
// 2. Ordena ~100 productos (3ms)
// 3. Re-renderiza 100 ProductCards (50ms)
// Total: 58ms por render ❌
```

```jsx
// ✅ Con optimización selectiva
function ProductList({ products, search }) {
  const filtered = useMemo(() => {
    return products
      .filter(p => p.name.includes(search))
      .sort((a, b) => a.price - b.price);
  }, [products, search]);
  
  return filtered.map(p => (
    <ProductCard key={p.id} {...p} />
  ));
}

const ProductCard = React.memo(({ product }) => {
  return <div>...</div>
});

// Render del padre por cambio de moneda:
// 1. useMemo: compara [products, search] (0.1ms)
// 2. Reutiliza array filtrado ✅
// 3. React.memo: compara props de 100 cards (1ms)
// 4. NO re-renderiza ningún card ✅
// Total: 1.1ms por render ✅

// Trade-off ganado: 58ms → 1.1ms (98% más rápido)
```

---

### 5️⃣ Tabla de Decisión Rápida

| Situación | Optimizar | Trade-off |
|-----------|-----------|-----------|
| Lista de 5 items | ❌ | Overhead > beneficio |
| Lista de 50 items | ⚠️ | Depende del componente |
| Lista de 500 items | ✅ | Beneficio claro |
| Cálculo `a + b` | ❌ | Trivial, no optimizar |
| Filtro de 1000 items | ✅ | Costoso, optimizar |
| Componente único simple | ❌ | Re-render < comparación |
| Componente con 10 props | ⚠️ | Comparar 10 props puede ser caro |
| Effect con función handler | ✅ | useCallback previene loops |

---

### 6️⃣ El Costo de la Complejidad

#### 🧠 Costo Cognitivo
```jsx
// Simple y claro
const filtered = items.filter(i => i.active);

// Más complejo
const filtered = useMemo(
  () => items.filter(i => i.active),
  [items]
);
// ⚠️ Ahora debes pensar:
// - ¿Qué va en el array de dependencias?
// - ¿Qué pasa si olvido una dependencia?
// - ¿Por qué no se actualiza? (bugs)
```

#### 🐛 Bugs Comunes por Optimización Prematura
```jsx
// Bug 1: Dependencias incorrectas
const filtered = useMemo(
  () => items.filter(i => i.category === category),
  [items] // ❌ Falta category
);
// Resultado: UI no se actualiza cuando category cambia

// Bug 2: useCallback sin dependencias necesarias
const handleSave = useCallback(() => {
  saveData(formData); // ❌ formData stale
}, []); // Debería ser [formData]

// Bug 3: Memo innecesario confunde
const Button = React.memo(({ onClick }) => <button onClick={onClick} />);
// ¿Por qué este botón simple tiene memo?
// Nuevo dev pierde tiempo investigando
```

---

### 7️⃣ Medición Real de Trade-offs

#### Herramientas para Medir

```jsx
// 1. React DevTools Profiler
// Muestra tiempo real de renders

// 2. Performance.measure()
performance.mark('filter-start');
const filtered = items.filter(...);
performance.mark('filter-end');
performance.measure('filter', 'filter-start', 'filter-end');

// 3. console.time()
console.time('expensive-calc');
const result = expensiveCalculation();
console.timeEnd('expensive-calc');
// "expensive-calc: 45.2ms"
```

#### Ejemplo Real de Medición

```jsx
function ProductList({ products }) {
  // Medir sin useMemo
  console.time('filter-no-memo');
  const filtered1 = products.filter(p => p.active);
  console.timeEnd('filter-no-memo');
  // "filter-no-memo: 0.3ms"
  
  // Medir overhead de useMemo
  console.time('filter-with-memo');
  const filtered2 = useMemo(
    () => products.filter(p => p.active),
    [products]
  );
  console.timeEnd('filter-with-memo');
  // "filter-with-memo: 0.35ms"
  
  // Conclusión: useMemo agrega 0.05ms de overhead
  // Solo vale la pena si evita muchos renders
}
```

---

### 8️⃣ Framework de Decisión

```
┌────────────────────────────────────────┐
│ ¿Tengo un problema de performance?    │
└─────────────┬──────────────────────────┘
              │
         NO ──┼── SÍ
              │       │
              ↓       ↓
    ❌ NO      ┌──────────────────────┐
   OPTIMICES   │ ¿Mediste dónde está │
   (premature  │ el cuello de botella?│
   optimization)└──────┬───────────────┘
                       │
                  NO ──┼── SÍ
                       │       │
                       ↓       ↓
              ❌ MIDE     ┌───────────────────┐
                PRIMERO  │ ¿La optimización  │
                         │ mejora >20%?      │
                         └──────┬────────────┘
                                │
                           NO ──┼── SÍ
                                │       │
                                ↓       ↓
                         ❌ NO      ✅ APLICA
                          VALE       LA
                           LA    OPTIMIZACIÓN
                          PENA
```

---

### 9️⃣ Resumen de Trade-offs

#### React.memo
- **Paga:** Memoria + comparación de props
- **Gana:** Evitar re-renders
- **Vale cuando:** Componente costoso O en lista grande

#### useCallback
- **Paga:** Memoria + comparación de dependencias
- **Gana:** Referencia estable
- **Vale cuando:** Pasado a componentes memoizados O en useEffect

#### useMemo
- **Paga:** Memoria + comparación de dependencias
- **Gana:** Evitar recálculos
- **Vale cuando:** Cálculo costoso O referencia estable necesaria

---

### 🎯 La Regla de Oro

> **"El mejor código es el que no escribes. La mejor optimización es la que no necesitas."**

1. **Escribe código simple primero**
2. **Mide si hay problemas**
3. **Optimiza solo lo problemático**
4. **Vuelve a medir para validar**

**No optimices por optimizar. Optimiza porque lo necesitas.**

---

## 🎨 Memoización Selectiva

### ¿Qué es?
**NO** optimizar todo, solo lo que **realmente** necesita optimización.

### Regla de Oro
> "Mide primero, optimiza después"

### ¿Cuándo SÍ memoizar?

#### ✅ Componentes en Listas
```jsx
// ProductCard se repite N veces
{products.map(product => (
  <ProductCard key={product.id} {...product} />
))}
```
**Razón:** Sin memo, cambiar 1 producto re-renderiza TODOS.

#### ✅ Cálculos Costosos
```jsx
const CartSummary = React.memo(({ products }) => {
  // 3 reduce() = costoso
  const subtotal = products.reduce(...)
  const discounts = products.reduce(...)
  const tax = products.reduce(...)
});
```
**Razón:** Evita recalcular cuando props irrelevantes cambian.

### ¿Cuándo NO memoizar?

#### ❌ Componentes Únicos y Simples
```jsx
// Solo hay 1 FilterBar, HTML simple
const FilterBar = ({ filters }) => (
  <div>
    <input />
    <select />
  </div>
);
```
**Razón:** Re-render es más rápido que comparar props.

#### ❌ Props Cambian Constantemente
```jsx
// El counter cambia todo el tiempo
const Counter = ({ count }) => <div>{count}</div>;
```
**Razón:** Memo compara props, pero siempre son diferentes.

---

## ⚛️ React.memo

### ¿Qué hace?
Compara las props **antes** de re-renderizar. Si las props no cambiaron, **reutiliza** el render anterior.

### Sintaxis
```jsx
const MyComponent = React.memo(({ prop1, prop2 }) => {
  return <div>...</div>
});
```

### Cómo Funciona (Internamente)
```javascript
// Pseudo-código de React.memo
function memo(Component) {
  let prevProps = null;
  let prevResult = null;
  
  return function MemoizedComponent(newProps) {
    // Comparación superficial (shallow comparison)
    if (prevProps && shallowEqual(prevProps, newProps)) {
      return prevResult; // ✅ Reutiliza render anterior
    }
    
    // ❌ Props cambiaron, re-renderiza
    prevProps = newProps;
    prevResult = <Component {...newProps} />;
    return prevResult;
  }
}
```

### Comparación Superficial (Shallow Comparison)
```javascript
// Así compara React.memo las props
function shallowEqual(objA, objB) {
  // Compara referencias, NO valores profundos
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  
  if (keysA.length !== keysB.length) return false;
  
  for (let key of keysA) {
    if (objA[key] !== objB[key]) return false; // === (referencia)
  }
  
  return true;
}
```

### ⚠️ Problema con Objetos/Arrays/Funciones
```jsx
// ❌ MAL - Nuevo objeto en cada render
function Parent() {
  return <Child data={{ id: 1 }} />; // Nueva referencia
}

// ✅ BIEN - Misma referencia
function Parent() {
  const data = useMemo(() => ({ id: 1 }), []);
  return <Child data={data} />;
}
```

### Ejemplo Real: ProductCard
```jsx
const ProductCard = React.memo(({ product, onUpdate, currency }) => {
  return <div>...</div>
});

// Sin memo:
// Cambiar producto 1 → re-renderiza productos 1,2,3,4,5,6 ❌

// Con memo:
// Cambiar producto 1 → re-renderiza solo producto 1 ✅
```

---

## 🔄 useCallback

### ¿Qué hace?
Memoriza una **función** para que mantenga la misma referencia entre renders.

### Sintaxis
```jsx
const memoizedFunction = useCallback(
  (param) => {
    // lógica
  },
  [dependencies] // Se recrea si estas cambian
);
```

### ¿Por qué existe este problema?
```jsx
function Parent() {
  // ❌ Nueva función en CADA render
  const handleClick = () => console.log('click');
  
  return <Child onClick={handleClick} />;
}

// Child con React.memo NO funciona porque:
// handleClick es diferente en cada render
```

### Solución 1: useCallback Básico
```jsx
function Parent() {
  const [items, setItems] = useState([]);
  
  // ❌ Necesita items como dependencia
  const handleDelete = useCallback((id) => {
    setItems(items.filter(i => i.id !== id));
  }, [items]); // Se recrea cuando items cambia
}
```

### Solución 2: Forma Funcional (MEJOR)
```jsx
function Parent() {
  const [items, setItems] = useState([]);
  
  // ✅ Sin dependencias usando forma funcional
  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []); // NUNCA se recrea
}
```

### Ejemplo Real: useCartHandlers
```jsx
const useCartHandlers = () => {
  const [products, setProducts] = useState([]);
  
  // ✅ Todas con forma funcional
  const handleUpdateQuantity = useCallback((id, newQuantity) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, quantity: newQuantity } : p
    ));
  }, []); // Sin dependencias
  
  const handleToggleFavorite = useCallback((id) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, favorite: !p.favorite } : p
    ));
  }, []); // Sin dependencias
  
  return { handleUpdateQuantity, handleToggleFavorite };
};
```

### Cuándo Usar
```jsx
// ✅ SÍ usar cuando:
// 1. Se pasa a componente con React.memo
<MemoizedChild onClick={handleClick} />

// 2. Es dependencia de useEffect/useMemo
useEffect(() => {
  handleFetch();
}, [handleFetch]);

// ❌ NO usar cuando:
// 1. No se pasa a componentes memoizados
// 2. La función es muy simple
// 3. No es dependencia de nada
```

---

## 💾 useMemo

### ¿Qué hace?
Memoriza el **resultado** de un cálculo para evitar recalcularlo innecesariamente.

### Sintaxis
```jsx
const memoizedValue = useMemo(
  () => {
    // cálculo costoso
    return resultado;
  },
  [dependencies] // Solo recalcula si estas cambian
);
```

### Uso 1: Cálculos Costosos
```jsx
const filteredProducts = useMemo(() => {
  console.log('🔄 Filtrando y ordenando...');
  
  return products
    .filter(p => p.category === category)
    .filter(p => p.name.includes(search))
    .sort((a, b) => a.price - b.price);
}, [products, category, search]);

// Sin useMemo: Se ejecuta en CADA render
// Con useMemo: Solo cuando products, category o search cambian
```

### Uso 2: Objetos/Arrays Estables
```jsx
// ❌ Nuevo objeto en cada render
const config = { theme: 'dark', lang: 'es' };
<Child config={config} /> // Child se re-renderiza siempre

// ✅ Mismo objeto en cada render
const config = useMemo(() => ({ 
  theme: 'dark', 
  lang: 'es' 
}), []);
<Child config={config} /> // Child NO se re-renderiza
```

### Ejemplo Real: CartSummary
```jsx
const CartSummary = React.memo(({ products, currency }) => {
  // ❌ Sin useMemo: Se recalcula en CADA render del padre
  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  
  // ✅ Con useMemo: Solo cuando products o currency cambian
  const subtotal = useMemo(
    () => products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    [products]
  );
  
  // Más cálculos...
  const discounts = useMemo(() => {
    return products.reduce((sum, p) => {
      const discount = p.quantity >= 10 ? p.price * p.quantity * 0.1 : 0;
      return sum + discount;
    }, 0);
  }, [products]);
  
  const tax = useMemo(
    () => (subtotal - discounts) * 0.15,
    [subtotal, discounts]
  );
});
```

### Cuándo NO Usar
```jsx
// ❌ Cálculo trivial
const total = useMemo(() => price + tax, [price, tax]);
// Más costoso que hacer: const total = price + tax;

// ❌ Valor cambia siempre
const timestamp = useMemo(() => Date.now(), []);
// No tiene sentido, siempre es diferente
```

---

## 🎣 Custom Hooks

### ¿Qué son?
Funciones que **extraen lógica reutilizable** de componentes.

### Reglas
1. Nombre empieza con `use`
2. Pueden usar otros hooks
3. Extraen lógica, no UI

### Ejemplo: useCartHandlers
```jsx
// ✅ Separa lógica de negocio del UI
const useCartHandlers = () => {
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useState(initialFilters);
  
  // Todas las funciones handler
  const handleUpdateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) return;
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, quantity: newQuantity } : p
    ));
  }, []);
  
  const handleToggleFavorite = useCallback((id) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, favorite: !p.favorite } : p
    ));
  }, []);
  
  const handleRemove = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);
  
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const handleCheckout = useCallback(() => {
    alert('Checkout complete!');
    setProducts([]);
  }, []);
  
  return {
    products,
    filters,
    handleUpdateQuantity,
    handleToggleFavorite,
    handleRemove,
    handleFilterChange,
    handleCheckout
  };
};
```

### Beneficios
```jsx
// Antes: Todo mezclado
function ShoppingCart() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleUpdate = () => { /* 20 líneas */ }
  const handleDelete = () => { /* 15 líneas */ }
  // ... 100 líneas más
  
  return <div>...</div>; // UI perdida en el código
}

// Después: Separado y limpio
function ShoppingCart() {
  const { products, filters, ...handlers } = useCartHandlers();
  const [searchTerm, setSearchTerm] = useState('');
  
  return <div>...</div>; // UI clara y concisa
}
```

---

## 🏗️ Arquitectura de Componentes

### Estructura del Proyecto
```
fourth-problem/
├── components/           # Componentes presentacionales
│   ├── ProductCard.jsx   # ✅ Con memo (se repite)
│   ├── CartSummary.jsx   # ✅ Con memo (cálculos)
│   ├── FilterBar.jsx     # ❌ Sin memo (único + simple)
│   └── Header.jsx        # ❌ Sin memo (único + simple)
├── hook.jsx              # Lógica de negocio
└── solution.jsx          # Componente principal
```

### Separación de Responsabilidades

#### 1️⃣ Componentes Presentacionales (UI puro)
```jsx
// ProductCard.jsx - Solo muestra datos
const ProductCard = React.memo(({ product, onUpdate, currency }) => {
  // NO tiene lógica de negocio
  // Solo recibe props y las muestra
  return <div>...</div>
});
```

#### 2️⃣ Custom Hook (Lógica de negocio)
```jsx
// hook.jsx - Toda la lógica
const useCartHandlers = () => {
  // Estado
  const [products, setProducts] = useState([]);
  
  // Lógica de negocio
  const handleUpdate = useCallback(...);
  const handleDelete = useCallback(...);
  
  // Expone API
  return { products, handleUpdate, handleDelete };
};
```

#### 3️⃣ Componente Principal (Orquestador)
```jsx
// solution.jsx - Conecta todo
function ShoppingCart() {
  const { products, ...handlers } = useCartHandlers();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Calcula valores derivados
  const filteredProducts = useMemo(...);
  
  // Renderiza UI
  return (
    <div>
      <Header />
      <FilterBar />
      {filteredProducts.map(p => <ProductCard {...p} />)}
      <CartSummary />
    </div>
  );
}
```

### Ventajas de esta Arquitectura

#### ✅ Testeable
```javascript
// Puedes testear el hook sin UI
import { renderHook, act } from '@testing-library/react-hooks';

test('handleDelete removes product', () => {
  const { result } = renderHook(() => useCartHandlers());
  
  act(() => {
    result.current.handleDelete(1);
  });
  
  expect(result.current.products).toHaveLength(5);
});
```

#### ✅ Reutilizable
```jsx
// Usa el mismo hook en diferentes UIs
function MobileCart() {
  const { products, ...handlers } = useCartHandlers();
  return <MobileView products={products} />;
}

function DesktopCart() {
  const { products, ...handlers } = useCartHandlers();
  return <DesktopView products={products} />;
}
```

#### ✅ Mantenible
```jsx
// Cambiar lógica: solo editas hook.jsx
// Cambiar UI: solo editas componentes
// Separación clara
```

---

## 🎯 Casos de Uso Reales

### Caso 1: LiveTimer Optimizado

#### ❌ Problema Original
```jsx
function Parent() {
  const [tickCount, setTickCount] = useState(0);
  
  const handleTick = () => {
    setTickCount(tickCount + 1); // ❌ Causa re-render del padre
  };
  
  return (
    <div>
      <LiveTimer onTick={handleTick} /> {/* ❌ Cada segundo */}
      <ExpensiveList /> {/* ❌ Re-renderiza cada segundo */}
    </div>
  );
}
```

#### ✅ Solución
```jsx
// LiveTimer independiente, SIN props
function LiveTimer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      // ✅ NO llama nada del padre
    }, 1000);
    return () => clearInterval(timer);
  }, []); // ✅ Sin dependencias
  
  return <div>{time}</div>;
}

// Parent
function Parent() {
  return (
    <div>
      <LiveTimer /> {/* ✅ Solo se re-renderiza a sí mismo */}
      <ExpensiveList /> {/* ✅ NO se afecta */}
    </div>
  );
}
```

### Caso 2: Filtrado con useMemo

#### ❌ Sin optimizar
```jsx
function ProductList({ products, category, search }) {
  // ❌ Se ejecuta en CADA render
  const filtered = products
    .filter(p => p.category === category)
    .filter(p => p.name.includes(search))
    .sort((a, b) => a.price - b.price);
  
  return filtered.map(p => <ProductCard key={p.id} {...p} />);
}

// Si el padre se re-renderiza por CUALQUIER razón:
// → Filtra de nuevo (costoso)
// → Crea nuevo array (nueva referencia)
// → ProductCard se re-renderiza SIEMPRE (aunque sea el mismo producto)
```

#### ✅ Con useMemo
```jsx
function ProductList({ products, category, search }) {
  // ✅ Solo recalcula si cambian las dependencias
  const filtered = useMemo(() => {
    console.log('🔄 Filtrando...');
    return products
      .filter(p => p.category === category)
      .filter(p => p.name.includes(search))
      .sort((a, b) => a.price - b.price);
  }, [products, category, search]);
  
  return filtered.map(p => <ProductCard key={p.id} {...p} />);
}

// Si el padre se re-renderiza pero products/category/search NO cambian:
// → NO filtra de nuevo ✅
// → Misma referencia del array ✅
// → ProductCard NO se re-renderiza (memo funciona) ✅
```

### Caso 3: Problema del Key con Index

#### ❌ Usando index como key
```jsx
{items.map((item, index) => (
  <Item key={index} item={item} />
))}

// Antes de eliminar item 3:
// Item 1 (key=0)
// Item 2 (key=1)
// Item 3 (key=2) ← Eliminar
// Item 4 (key=3)
// Item 5 (key=4)

// Después de eliminar:
// Item 1 (key=0) ✅ OK
// Item 2 (key=1) ✅ OK
// Item 4 (key=2) ❌ Era key=3, ahora key=2 → React piensa que cambió
// Item 5 (key=3) ❌ Era key=4, ahora key=3 → React piensa que cambió

// Resultado: Items 4 y 5 se re-renderizan innecesariamente
```

#### ✅ Usando ID único
```jsx
{items.map(item => (
  <Item key={item.id} item={item} />
))}

// Antes de eliminar item con id=3:
// Item id=1 (key="1")
// Item id=2 (key="2")
// Item id=3 (key="3") ← Eliminar
// Item id=4 (key="4")
// Item id=5 (key="5")

// Después de eliminar:
// Item id=1 (key="1") ✅ Mismo key → NO re-render
// Item id=2 (key="2") ✅ Mismo key → NO re-render
// Item id=4 (key="4") ✅ Mismo key → NO re-render
// Item id=5 (key="5") ✅ Mismo key → NO re-render

// Resultado: Solo el item eliminado desaparece, los demás NO se tocan
```

---

## 📊 Flujo de Decisión

### ¿Debo usar React.memo?

```
┌─────────────────────────────────┐
│ ¿Se repite en un .map()?       │
└──────────┬──────────────────────┘
           │
      SÍ ──┼── NO
           │       │
           ↓       ↓
     ✅ USA     ┌──────────────────────┐
      MEMO      │ ¿Tiene render        │
                │ costoso (>16ms)?     │
                └──────┬───────────────┘
                       │
                  SÍ ──┼── NO
                       │       │
                       ↓       ↓
                  ✅ USA    ┌───────────────┐
                   MEMO     │ ¿Props casi   │
                            │ nunca cambian?│
                            └──────┬────────┘
                                   │
                              SÍ ──┼── NO
                                   │       │
                                   ↓       ↓
                              ✅ USA    ❌ NO
                               MEMO      USES
```

### ¿Debo usar useCallback?

```
┌─────────────────────────────────────┐
│ ¿Se pasa a componente con memo?    │
└──────────┬──────────────────────────┘
           │
      SÍ ──┼── NO
           │       │
           ↓       ↓
     ✅ USA     ┌──────────────────────┐
   CALLBACK    │ ¿Es dependencia de   │
               │ useEffect/useMemo?   │
               └──────┬───────────────┘
                      │
                 SÍ ──┼── NO
                      │       │
                      ↓       ↓
                 ✅ USA    ❌ NO
                CALLBACK    USES
```

### ¿Debo usar useMemo?

```
┌─────────────────────────────────────┐
│ ¿Es un cálculo costoso (loops)?    │
└──────────┬──────────────────────────┘
           │
      SÍ ──┼── NO
           │       │
           ↓       ↓
     ✅ USA     ┌──────────────────────┐
      MEMO      │ ¿Es objeto/array     │
                │ pasado a memo?       │
                └──────┬───────────────┘
                       │
                  SÍ ──┼── NO
                       │       │
                       ↓       ↓
                  ✅ USA    ❌ NO
                   MEMO      USES
```

---

## 🎓 Resumen de Conceptos Clave

### 1. La Regla Fundamental
> **"No optimices prematuramente. Mide primero, optimiza después."**

### 2. Los 3 Pilares de Optimización
- **React.memo**: Previene re-renders de componentes
- **useCallback**: Previene crear nuevas funciones
- **useMemo**: Previene recalcular valores

### 3. Se Necesitan Entre Sí
```jsx
// ❌ Sin React.memo
// useCallback/useMemo no previenen re-renders

// ❌ Sin useCallback/useMemo
// React.memo ve props diferentes y re-renderiza

// ✅ Juntos
// Props estables + prevención de re-renders
```

### 4. Memoización Selectiva
- ✅ Listas: Sí
- ✅ Cálculos costosos: Sí
- ❌ Componentes únicos y simples: No
- ❌ Valores que cambian siempre: No

### 5. Forma Funcional de setState
```jsx
// ❌ Necesita dependencia
setItems(items.filter(i => i.id !== id));

// ✅ Sin dependencias
setItems(prev => prev.filter(i => i.id !== id));
```

### 6. Keys en Listas
```jsx
// ❌ Index
key={index}

// ✅ ID único
key={item.id}
```

---

## 🚀 Próximos Pasos

### Para Llegar a Expert (100/100)

1. **Profiling con React DevTools**
   - Medir tiempos reales de render
   - Identificar cuellos de botella
   - Validar optimizaciones

2. **Virtualización**
   - Para listas de 1000+ items
   - `react-window` o `react-virtualized`
   - Solo renderizar items visibles

3. **Code Splitting**
   - `React.lazy()` y `Suspense`
   - Cargar componentes bajo demanda
   - Reducir bundle inicial

4. **Web Workers**
   - Para cálculos muy pesados
   - No bloquear el hilo principal
   - Procesamiento en paralelo

---

## 📚 Recursos Adicionales

- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [React memo docs](https://react.dev/reference/react/memo)
- [useCallback docs](https://react.dev/reference/react/useCallback)
- [useMemo docs](https://react.dev/reference/react/useMemo)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)

---

**Creado:** Enero 2026  
**Proyecto:** Shopping Cart Optimization
