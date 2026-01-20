import React, { useState } from "react";
export default function Toggle({ component, style }) {
  const [ToggleState, setToggleState] = useState(false);

  const close = () => setToggleState(false);

  return (
    <>
      <button onClick={() => setToggleState(!ToggleState)} style={{marginBottom: '1rem', ...style}}>
        {ToggleState ? "Ocultar" : "Mostrar"} Componente
      </button>
      {ToggleState && component({ isOpen: ToggleState, close })}
    </>
  );
}
