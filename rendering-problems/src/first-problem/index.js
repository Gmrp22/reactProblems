import React, { useState } from 'react';

// Contador de renders para visualizar el problema
let renderCount = 0;

const ChildComponent = ({ title, onClick, data }) => {
  renderCount++;
  
  return (
    <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
          Renders: {renderCount}
        </span>
      </div>
      
      <p className="mb-3 text-gray-700">
        Datos: {JSON.stringify(data)}
      </p>
      
      <button 
        onClick={onClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Click me
      </button>
      
      <div className="mt-3 p-2 bg-yellow-100 border border-yellow-400 rounded text-sm">
        ⚠️ Este componente se re-renderiza cada vez que el padre cambia, 
        incluso cuando sus props no cambian realmente
      </div>
    </div>
  );
};

const ProblematicParent = () => {
  const [counter, setCounter] = useState(0);
  const [childMessage, setChildMessage] = useState('');
  
  // 🔴 PROBLEMA 1: Esta función se crea nueva en cada render
  const handleChildClick = () => {
    setChildMessage('¡Click desde el hijo!');
    setTimeout(() => setChildMessage(''), 2000);
  };
  
  // 🔴 PROBLEMA 2: Este objeto se crea nuevo en cada render
  const childData = {
    id: 1,
    name: 'Componente Hijo'
  };
  
  // 🔴 PROBLEMA 3: Este array se crea nuevo en cada render
  const items = [1, 2, 3, 4, 5];
  
  // Cálculo "costoso" que se ejecuta en cada render
  const expensiveCalculation = () => {
    console.log('🔴 Calculando algo costoso...');
    let result = 0;
    for (let i = 0; i < items.length; i++) {
      result += items[i] * 2;
    }
    return result;
  };
  
  // 🔴 PROBLEMA 4: Este cálculo se ejecuta en cada render
  const total = expensiveCalculation();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">🔥 Componente con Problemas de Re-render</h1>
        <p className="text-sm opacity-90">
          Este componente tiene varios problemas de optimización. ¡Encuéntralos y arreglalos!
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
        <h2 className="text-xl font-bold mb-4">Padre</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCounter(counter + 1)}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold"
            >
              Incrementar Contador: {counter}
            </button>
            <span className="text-lg">
              Total calculado: {total}
            </span>
          </div>

          {childMessage && (
            <div className="p-3 bg-green-100 border border-green-400 rounded text-green-800">
              {childMessage}
            </div>
          )}

          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <h3 className="font-bold mb-2 text-red-700">⚠️ Problemas a resolver:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>El hijo se re-renderiza cada vez que cambias el counter</li>
              <li>La función handleChildClick se crea nueva en cada render</li>
              <li>El objeto childData se crea nuevo en cada render</li>
              <li>El cálculo costoso se ejecuta en cada render</li>
              <li>El array items se crea nuevo en cada render</li>
            </ul>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
            <h3 className="font-bold mb-2 text-blue-700">💡 Herramientas disponibles:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li><code className="bg-gray-200 px-1 rounded">React.memo()</code> - Para evitar re-renders del hijo</li>
              <li><code className="bg-gray-200 px-1 rounded">useCallback()</code> - Para memoizar funciones</li>
              <li><code className="bg-gray-200 px-1 rounded">useMemo()</code> - Para memoizar valores y cálculos</li>
            </ul>
          </div>
        </div>
      </div>

      <ChildComponent 
        title="Componente Hijo"
        onClick={handleChildClick}
        data={childData}
      />

      <div className="bg-gray-100 p-4 rounded-lg text-sm">
        <p className="font-semibold mb-2">🎯 Tu tarea:</p>
        <p>
          Haz click en "Incrementar Contador" y observa cómo el contador de renders 
          del hijo aumenta aunque sus props no han cambiado realmente. 
          Usa React.memo, useCallback y useMemo para optimizar este componente.
        </p>
      </div>
    </div>
  );
};

export default ProblematicParent;