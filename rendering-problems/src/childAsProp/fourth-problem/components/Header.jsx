import React, { useState } from 'react';

const LiveTimer = () => {
  const renderCount = React.useRef(0);
  renderCount.current++;
  
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="text-sm text-gray-600">
      Current time: {time} | Renders: {renderCount.current}
    </div>
  );
};

const Header = ({ currency, onCurrencyChange }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <LiveTimer />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onCurrencyChange('USD')}
            className={`px-4 py-2 rounded ${currency === 'USD' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
          >
            USD
          </button>
          <button
            onClick={() => onCurrencyChange('EUR')}
            className={`px-4 py-2 rounded ${currency === 'EUR' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
          >
            EUR
          </button>
          <button
            onClick={() => onCurrencyChange('GBP')}
            className={`px-4 py-2 rounded ${currency === 'GBP' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
          >
            GBP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
