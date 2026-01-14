import React, { useCallback, useState, useMemo } from 'react';

const useListManager = () => { // ✅ Solo necesitas setItems
      const initialItems = [  
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
  ];
  const [items, setItems] = useState(initialItems);
    const handleDelete = useCallback((id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, [setItems]);

  const handleEdit = useCallback((id) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id 
        ? { ...item, name: item.name + ' (edited)' }
        : item
    ));
  }, [setItems]);

  return { items, handleDelete, handleEdit };
}

//Ok lets debug, first, we have a rerender due to hadneledit and handledelete, we need to avoid making renders for the reference of the funcitons, so we need to use usecallback
const ListItem = React.memo(({ item, onDelete, onEdit }) => {
  const renderCount = React.useRef(0);
  renderCount.current++;
  
  console.log(`Item ${item.id} rendered`);
  
  return (
    <div className="flex items-center justify-between p-3 bg-white border rounded mb-2">
      <span className="flex-1">{item.name}</span>
      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded mr-2">
        Renders: {renderCount.current}
      </span>
      <button 
        onClick={() => onEdit(item.id)}
        className="px-3 py-1 bg-blue-500 text-white rounded mr-2"
      >
        Edit
      </button>
      <button 
        onClick={() => onDelete(item.id)}
        className="px-3 py-1 bg-red-500 text-white rounded"
      >
        Delete
      </button>
    </div>
  );
} )

const SecondProblem = () => {
 const { items, handleDelete, handleEdit } = useListManager();
  const [filter, setFilter] = useState('');
  const [counter, setCounter] = useState(0);

  //const {  handleDelete, handleEdit } = useListManager( setItems);

  const filteredItems = useMemo(() => items.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  ), [items, filter]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-purple-600 text-white p-4 rounded mb-6">
        <h1 className="text-2xl font-bold">🔥 Ejercicio 2: Lista con Re-renders</h1>
      </div>

      <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded mb-4">
        <h3 className="font-bold mb-2">❌ Problemas:</h3>
        <ul className="list-disc list-inside text-sm">
          <li>Todos los items se re-renderizan cuando cambias el counter</li>
          <li>Todos los items se re-renderizan cuando filtras</li>
          <li>Todos los items se re-renderizan cuando editas/eliminas uno solo</li>
          <li>Las funciones onDelete y onEdit se crean nuevas en cada render</li>
          <li>filteredItems se calcula en cada render</li>
        </ul>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          <button 
            onClick={() => setCounter(counter + 1)}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Counter: {counter}
          </button>
          <input
            type="text"
            placeholder="Filter items..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredItems.map(item => (
          <ListItem
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <div className="mt-6 bg-gray-100 p-4 rounded text-sm">
        <p className="font-semibold mb-2">🎯 Tu tarea:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Haz que los items NO se re-rendericen cuando cambias el counter</li>
          <li>Haz que solo el item editado/eliminado se re-renderice</li>
          <li>Optimiza el filtrado</li>
          <li>Memoiza las funciones</li>
        </ul>
      </div>
    </div>
  );
};

export default SecondProblem;