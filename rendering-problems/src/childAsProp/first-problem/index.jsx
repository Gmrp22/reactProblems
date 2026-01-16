import React, { useState,useMemo, useCallback, useRef , useEffect, useEffe} from 'react';

// Contador de renders para visualizar el problema
function Total()   {
  
  const items = [1, 2, 3, 4, 5]
    const total = () => {
    console.log('🔴 Calculando algo costoso...');
    let result = 0;
    for (let i = 0; i < items.length; i++) {
      result += items[i] * 2;
    }
    return result;
  }
  return <span>Total: {total}</span>;
}

const ChildComponent = React.memo(function ({ title, onClick, data }) {
const renderCount = useRef(0);
  renderCount.current++; // Sí, da warning, pero funciona
  

  console.log('Child rendered');
  return (
    <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
          Renders: {renderCount.current}
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
});

const FirstProblem = ({ children, childMessage, staticContent }) => {
  const [counter, setCounter] = useState(0);
  const handleClick = useCallback(() => {
    setCounter(prev => prev + 1)
  }, []);
  console.log('Parent rendered');


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">🔥 Componente con Problemas de Re-render</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200">
        <h2 className="text-xl font-bold mb-4">Padre</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleClick}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold"
            >
              Incrementar Contador: {counter}
            </button>
            <span className="text-lg">
            <Total />
            </span>
          </div>

          {childMessage && (
            <div className="p-3 bg-green-100 border border-green-400 rounded text-green-800">
              {childMessage}
            </div>
          )}

          {/* Contenido estático pasado como prop */}
          {staticContent}
        </div>
      </div>

{children}

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


const Wrapper = ({staticContent}) => {
    const childData = {
    id: 1,
    name: 'Componente Hijo'
  }
  const [childMessage, setChildMessage] = useState('');
  const handleChildClick = useCallback(() => {
    console.log('Child clicked');
    setChildMessage('¡Click desde el hijo!');
    setTimeout(() => setChildMessage(''), 2000);
  }, []);



  return <>
  
   <FirstProblem childMessage={childMessage} staticContent={staticContent}>
      <ChildComponent 
        title="Componente Hijo"
        onClick={handleChildClick}
        data={childData}
      />
   </FirstProblem>
   
  </>
};
const FirstParentComponent = ()=>{

  const staticContent = (
    <>
 

    </>
  );

  return <Wrapper staticContent={staticContent} />
}
export default  FirstParentComponent;