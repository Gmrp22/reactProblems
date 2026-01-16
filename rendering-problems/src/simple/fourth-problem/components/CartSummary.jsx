import React from 'react';

const CartSummary = React.memo(({ products, currency, onCheckout }) => {
  const renderCount = React.useRef(0);
  renderCount.current++;
  
  const subtotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const discounts = products.reduce((sum, p) => {
    const discount = p.quantity >= 10 ? p.price * p.quantity * 0.1 : 0;
    return sum + discount;
  }, 0);
  const tax = (subtotal - discounts) * 0.15;
  const total = subtotal - discounts + tax;
  
  const formatPrice = (price) => {
    const rates = { USD: 1, EUR: 0.92, GBP: 0.79 };
    return `${currency} ${(price * rates[currency]).toFixed(2)}`;
  };
  
  return (
    <div className="bg-blue-50 p-4 rounded sticky top-4">
      <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discounts:</span>
          <span>-{formatPrice(discounts)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (15%):</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <button
        onClick={onCheckout}
        disabled={products.length === 0}
        className="w-full py-2 bg-green-500 text-white rounded font-bold disabled:bg-gray-300"
      >
        Checkout ({products.length} items)
      </button>
      <div className="mt-2 text-xs text-gray-500">
        Summary renders: {renderCount.current}
      </div>
    </div>
  );
});

CartSummary.displayName = 'CartSummary';

export default CartSummary;
