import React, { useCallback, useMemo, useState } from 'react';

const FormField = React.memo(({ label, value, onChange, validation }) => {
  const renderCount = React.useRef(0);
  renderCount.current++;
  
  console.log(`Field "${label}" rendered`);
  
  const error = validation(value);
  
  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
          Renders: {renderCount.current}
        </span>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
});

const SubmitButton = React.memo(({ onClick, disabled }) => {
  const renderCount = React.useRef(0);
  renderCount.current++;
  
  console.log('SubmitButton rendered');
  
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-6 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        Submit
      </button>
      <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
        Renders: {renderCount.current}
      </span>
    </div>
  );
})

const ThirdProblem = () => {

  const [counter, setCounter] = useState(0);
  const [submitted, setSubmitted] = useState(false);

const { validateName, validateEmail, validatePassword, name,email,password, setName, setEmail, setPassword } = useFormManager();
const handleCounterClick = useCallback(() => {
  setCounter( prevCounter => prevCounter + 1);
}, []);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  }, []);
// only optimize with usememo if validators where expensive
  const isValid = useMemo(() => !validateName(name) && !validateEmail(email) && !validatePassword(password), [name, email, password, validateName, validateEmail, validatePassword]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-orange-600 text-white p-4 rounded mb-6">
        <h1 className="text-2xl font-bold">🔥 Ejercicio 3: Form con Validación</h1>
      </div>

      <div className="bg-yellow-100 border-2 border-yellow-400 p-4 rounded mb-4">
        <h3 className="font-bold mb-2">❌ Problemas:</h3>
        <ul className="list-disc list-inside text-sm">
          <li>Todos los campos se re-renderizan cuando cambias uno solo</li>
          <li>Todos los campos se re-renderizan cuando cambias el counter</li>
          <li>Las funciones de validación se crean nuevas en cada render</li>
          <li>El botón se re-renderiza cuando cambias cualquier campo</li>
          <li>handleSubmit se crea nuevo en cada render</li>
          <li>isValid se calcula en cada render</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded shadow mb-4">
        <button 
          onClick={handleCounterClick}
          className="mb-6 px-4 py-2 bg-purple-500 text-white rounded"
        >
          Counter: {counter}
        </button>

        <FormField
          label="Name"
          value={name}
          onChange={setName}
          validation={validateName}
        />

        <FormField
          label="Email"
          value={email}
          onChange={setEmail}
          validation={validateEmail}
        />

        <FormField
          label="Password"
          value={password}
          onChange={setPassword}
          validation={validatePassword}
        />

        <SubmitButton
          onClick={handleSubmit}
          disabled={!isValid}
        />

        {submitted && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded text-green-800">
            Form submitted successfully!
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-4 rounded text-sm">
        <p className="font-semibold mb-2">🎯 Tu tarea:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Evita que los campos se re-rendericen cuando cambias otros campos</li>
          <li>Evita que el botón se re-renderice innecesariamente</li>
          <li>Optimiza las validaciones</li>
          <li>Memoiza handleSubmit e isValid</li>
        </ul>
      </div>
    </div>
  );
};


const useFormManager = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateName = React.useCallback((value) => {
    if (value.length < 3) return 'Name must be at least 3 characters';
    return null;
  }, []);

  const validateEmail = React.useCallback((value) => {
    if (!value.includes('@')) return 'Invalid email';
    return null;
  }, []);

  const validatePassword = React.useCallback((value) => {
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  }, []);

  return { validateName, validateEmail, validatePassword, name, email, password , setName, setEmail, setPassword};
}
export default ThirdProblem;