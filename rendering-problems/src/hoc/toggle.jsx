import { useState } from 'react';

// Esto es el HOC: una FUNCIÓN que recibe un componente
export const WithToggle = (WrappedComponent) => {
  // Retorna un NUEVO componente
  return (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    
    // Renderiza el componente original con props extra
    return (
      <div>
        <button onClick={toggle}>
          {isOpen ? 'Cerrar' : 'Abrir'}
        </button>
        {isOpen && (
          <WrappedComponent 
            isOpen={isOpen} 
            toggle={toggle} 
            close={() => setIsOpen(false)}
            {...props} 
          />
        )}
      </div>
    );
  };
};