# ⚡ React Optimization - Guía Rápida

## 🎯 La Regla de Oro
> **"Mide primero, optimiza después"**

---

## ⚖️ Trade-offs (Compromisos)

### Toda optimización tiene un COSTO:

| Herramienta | Beneficio | Costo | ¿Cuándo vale? |
|-------------|-----------|-------|---------------|
| **React.memo** | Evita re-renders | Compara props cada vez | Listas, componentes costosos |
| **useCallback** | Función estable | Memoria extra | Pasada a componentes memo |
| **useMemo** | Evita recalcular | Memoria + comparación | Cálculos costosos |

### El Balance:
```
Beneficio de la optimización > Costo de la optimización = ✅ Úsala
Beneficio de la optimización < Costo de la optimización = ❌ No la uses
```

---

## 🔧 Cuándo Usar Cada Herramienta

### React.memo
```jsx
// ✅ SÍ: Se repite en lista
{items.map(item => <Card key={item.id} {...item} />)}

// ❌ NO: Componente único y simple
<Header title="Mi App" />
```

### useCallback
```jsx
// ✅ SÍ: Pasada a componente memo + forma funcional
const handleDelete = useCallback((id) => {
  setItems(prev => prev.filter(i => i.id !== id));
}, []); // Sin dependencias

// ❌ NO: Función simple no pasada a memo
const handleClick = () => console.log('hi');
```

### useMemo
```jsx
// ✅ SÍ: Cálculo costoso
const filtered = useMemo(() => 
  items.filter(...).sort(...),
  [items, filters]
);

// ❌ NO: Cálculo trivial
const total = price + tax; // No necesita useMemo
```

---

## 📊 Patrón: useCallback con Forma Funcional

**El secreto para useCallback sin dependencias:**

```jsx
// ❌ MAL: Necesita items en dependencias
const handleDelete = useCallback((id) => {
  setItems(items.filter(i => i.id !== id));
}, [items]); // Se recrea cuando items cambia

// ✅ BIEN: Sin dependencias
const handleDelete = useCallback((id) => {
  setItems(prev => prev.filter(i => i.id !== id));
}, []); // NUNCA se recrea
```

---

## 🏗️ Arquitectura: Separación de Responsabilidades

```
Components (UI)          Hook (Lógica)         Main (Orquestador)
     │                        │                       │
ProductCard.jsx  ←──── useCartHandlers.jsx ←──── solution.jsx
CartSummary.jsx              │
FilterBar.jsx                │
Header.jsx                   ▼
                        Estado + Handlers
```

**Beneficio:** Testeable, reutilizable, mantenible

---

## 🎨 Memoización Selectiva en Práctica

### En este proyecto:

```jsx
// ✅ CON memo (se repite)
const ProductCard = React.memo(...) 

// ✅ CON memo (cálculos costosos)
const CartSummary = React.memo(...)

// ❌ SIN memo (único + simple)
const FilterBar = (...) 
const Header = (...)
```

**Resultado:** Balance perfecto entre performance y simplicidad

---

## 🚨 Errores Comunes

### 1. Key con Index
```jsx
// ❌ MAL
{items.map((item, i) => <Card key={i} />)}
// Eliminar item → todos después se re-renderizan

// ✅ BIEN
{items.map(item => <Card key={item.id} />)}
// Eliminar item → solo ese desaparece
```

### 2. Nuevos Objetos en Props
```jsx
// ❌ MAL: Nuevo objeto cada render
<Child data={{ id: 1 }} />

// ✅ BIEN: Mismo objeto
const data = useMemo(() => ({ id: 1 }), []);
<Child data={data} />
```

### 3. LiveTimer Que Afecta al Padre
```jsx
// ❌ MAL: Timer causa re-render del padre
<LiveTimer onTick={() => setCount(c => c + 1)} />

// ✅ BIEN: Timer independiente
const LiveTimer = () => {
  const [time, setTime] = useState(...);
  useEffect(() => {
    setInterval(() => setTime(Date.now()), 1000);
  }, []); // Sin props del padre
};
```

---

## 📐 Flowchart de Decisión

```
¿Necesito optimizar?
    │
    ├─ ¿Se repite en .map()? → SÍ → React.memo ✅
    │
    ├─ ¿Cálculo costoso? → SÍ → useMemo ✅
    │
    ├─ ¿Función a componente memo? → SÍ → useCallback ✅
    │
    └─ ¿Componente simple único? → NO OPTIMIZAR ❌
```

---

## 💯 Checklist de Optimización

- [ ] ProductCard con React.memo (lista)
- [ ] CartSummary con React.memo (cálculos)
- [ ] Handlers con useCallback + forma funcional
- [ ] filteredProducts con useMemo
- [ ] Keys únicos (item.id, NO index)
- [ ] LiveTimer independiente (sin props)
- [ ] FilterBar/Header SIN memo (selectivo)

---

## 🎓 Nivel Alcanzado


**Fortalezas:**
- ✅ Memoización selectiva correcta
- ✅ Forma funcional en setState
- ✅ Arquitectura limpia y separada
- ✅ Balance entre performance y simplicidad

**Para llegar a Expert:**
- Profiling con React DevTools
- Métricas de performance real
- Virtualización para listas grandes

---

**TL;DR:** 
- No optimices todo
- Mide primero
- Usa memo solo donde vale la pena
- Forma funcional en setState = sin dependencias
- Keys únicos, nunca index
