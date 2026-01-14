# 🎯 Las 3 Herramientas de Optimización en React

## 1️⃣ React.memo

**Propósito:** Previene re-renders innecesarios de componentes

**Qué hace:** Compara las props antes de decidir si debe re-renderizar el componente.

```javascript
// ❌ Sin React.memo
const Child = ({ onClick }) => {
  console.log('Child rendered'); // Se ejecuta CADA VEZ que el padre se re-renderiza
  return <div>Child</div>;
};

// ✅ Con React.memo
const Child = React.memo(({ onClick }) => {
  console.log('Child rendered'); // Solo se ejecuta si las props cambiaron
  return <div>Child</div>;
});
```

---

## 2️⃣ useCallback

**Propósito:** Previene crear nuevas referencias de funciones

**Qué hace:** Memoriza una función para que mantenga la misma referencia entre renders.

```javascript
const Parent = () => {
  const [counter, setCounter] = useState(0);
  
  // ❌ Nueva función en cada render
  const handleClick = () => console.log('click');
  
  // ✅ Misma función en cada render
  const handleClickOptimized = useCallback(() => {
    console.log('click');
  }, []); // Dependencias vacías = la función nunca cambia
  
  return <Child onClick={handleClickOptimized} />;
};
```

### 💡 Forma funcional para evitar dependencias:

```javascript
// ✅ MEJOR - Sin dependencias usando la forma funcional de setState
const handleDelete = useCallback((id) => {
  setItems(prevItems => prevItems.filter(item => item.id !== id));
}, []); // No necesita items en las dependencias
```

---

## 3️⃣ useMemo

**Propósito:** Previene crear nuevas referencias de valores/objetos y evita cálculos costosos

**Qué hace:** Memoriza el resultado de un cálculo para que mantenga la misma referencia entre renders.

```javascript
const Parent = () => {
  const [items, setItems] = useState([...]);
  const [filter, setFilter] = useState('');
  
  // ❌ Nuevo objeto en cada render
  const data = { id: 1, name: 'Item' };
  
  // ✅ Mismo objeto en cada render
  const dataOptimized = useMemo(() => ({ 
    id: 1, 
    name: 'Item' 
  }), []); // Dependencias vacías = el objeto nunca cambia
  
  // ✅ Cálculo costoso memorizado
  const filteredItems = useMemo(() => 
    items.filter(item => item.name.includes(filter)),
    [items, filter] // Solo recalcula si items o filter cambian
  );
  
  return <Child data={dataOptimized} items={filteredItems} />;
};
```

---

## 🔗 Cómo Trabajan Juntas

### Ejemplo Completo

```javascript
const Parent = () => {
  const [counter, setCounter] = useState(0);
  const [items, setItems] = useState([...]);
  
  // useCallback: mantiene referencia estable de función
  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);
  
  // useMemo: mantiene referencia estable de objeto
  const config = useMemo(() => ({ theme: 'dark' }), []);
  
  return (
    <div>
      <button onClick={() => setCounter(counter + 1)}>Counter: {counter}</button>
      {/* React.memo previene re-render si las props no cambiaron */}
      <Child onDelete={handleDelete} config={config} />
    </div>
  );
};

// React.memo compara las props
const Child = React.memo(({ onDelete, config }) => {
  console.log('Child rendered');
  return <div>Child</div>;
});
```

### 🎬 Flujo cuando haces click en Counter:

1. ✅ Parent se re-renderiza (counter cambió)
2. ✅ `handleDelete` mantiene la misma referencia (useCallback)
3. ✅ `config` mantiene la misma referencia (useMemo)
4. ✅ React.memo compara props: `onDelete === onDelete` y `config === config`
5. ✅ Child **NO** se re-renderiza

---

## ✅ Cuándo Usarlas

### DO use React.memo cuando:
- El componente es costoso de renderizar (listas grandes, gráficos, canvas)
- Recibe las mismas props frecuentemente
- Es hijo de un componente que se re-renderiza seguido

### DO use useCallback cuando:
- La función se pasa a un componente hijo con React.memo
- La función es dependencia de useEffect/useMemo
- Event handlers en listas grandes

### DO use useMemo cuando:
- El cálculo es costoso (loops grandes, operaciones complejas)
- El objeto/array se pasa a un componente con React.memo
- Filtrar/transformar listas grandes

---

## ❌ Cuándo NO Usarlas

### DON'T use React.memo si:
- El componente es simple y rápido de renderizar
- El componente casi siempre recibe props diferentes
- Es un componente pequeño (un botón, un span simple)

```javascript
// ❌ MAL - Overhead innecesario para componente simple
const Button = React.memo(({ text }) => <button>{text}</button>);
```

### DON'T use useMemo/useCallback si:
- El cálculo es trivial (`const x = a + b`)
- La función es simple y no causa re-renders
- El valor cambia frecuentemente de todas formas

```javascript
// ❌ MAL - Cálculo trivial
const total = useMemo(() => price + tax, [price, tax]);

// ❌ MAL - Función simple no pasada a hijos memoizados
const handleClick = useCallback(() => setCount(count + 1), [count]);
```

---

## 🔑 Casos Especiales: El Problema del `key` en Listas

### ✅ Con key estable (ID único):

```javascript
{items.map(item => (
  <ListItem
    key={item.id} // ✅ Key estable
    item={item}
  />
))}
```

**Al eliminar Item 3:**
- Item 1 (key=1) → mismo key, mismas props → **NO re-render**
- Item 2 (key=2) → mismo key, mismas props → **NO re-render**
- Item 3 (key=3) → desaparece
- Item 4 (key=4) → mismo key, mismas props → **NO re-render**
- Item 5 (key=5) → mismo key, mismas props → **NO re-render**

### ❌ Con index como key (INCORRECTO):

```javascript
{items.map((item, index) => (
  <ListItem
    key={index} // ❌ MAL
    item={item}
  />
))}
```

**Al eliminar Item 3:**

```
Antes:            Después:
Item 1 (key=0)    Item 1 (key=0) ✅ OK
Item 2 (key=1)    Item 2 (key=1) ✅ OK
Item 3 (key=2)    Item 4 (key=2) ❌ ¡Key cambió! Re-render
Item 4 (key=3)    Item 5 (key=3) ❌ ¡Key cambió! Re-render
Item 5 (key=4)
```

**Todos los items después del eliminado se re-renderizan** porque sus keys cambiaron y React piensa que son componentes diferentes.

---

## 📊 Resumen

### La relación entre las herramientas:

- **React.memo** = Previene re-renders de componentes
- **useCallback** = Previene crear nuevas referencias de funciones
- **useMemo** = Previene crear nuevas referencias de valores/objetos

### Se necesitan entre sí:

- ❌ Sin React.memo: useCallback/useMemo no previenen re-renders
- ❌ Sin useCallback/useMemo: React.memo ve props diferentes y re-renderiza de todas formas
- ✅ Juntas: Optimización completa - props estables + prevención inteligente de re-renders

---

## 🎓 Regla General:

> **"Mide primero, optimiza después"**

1. Construye sin optimizaciones
2. Encuentra problemas de rendimiento (React DevTools Profiler)
3. Optimiza solo lo necesario

⚠️ **No optimices prematuramente**. El costo de la memoización puede ser peor que el re-render.

