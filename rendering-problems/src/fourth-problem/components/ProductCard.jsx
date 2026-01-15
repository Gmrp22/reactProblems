import React from 'react';

const ProductCard = React.memo(({ product, onUpdateQuantity, onToggleFavorite, onRemove, currency }) => {
  const renderCount = React.useRef(0);
  renderCount.current++;
  
  const formatPrice = (price) => {
    const rates = { USD: 1, EUR: 0.92, GBP: 0.79 };
    const converted = price * rates[currency];
    return `${currency} ${converted.toFixed(2)}`;
  };
  
  const discount = product.quantity >= 10 ? 0.1 : 0;
  const total = product.price * product.quantity * (1 - discount);
  
  return (
    <div className="border rounded p-4 mb-2 bg-white">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-bold">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.category}</p>
          <p className="text-lg">{formatPrice(product.price)}</p>
          {discount > 0 && <span className="text-green-600 text-sm">10% bulk discount!</span>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleFavorite(product.id)}
            className={`px-2 py-1 rounded ${product.favorite ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
          >
            ♥
          </button>
          <button
            onClick={() => onRemove(product.id)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}
          disabled={product.quantity <= 1}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          -
        </button>
        <span className="w-12 text-center">{product.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          +
        </button>
        <span className="ml-4">Total: {formatPrice(total)}</span>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Renders: {renderCount.current}
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
