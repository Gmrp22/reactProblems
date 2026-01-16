import React, { useState } from 'react';

const ProductCard = ({ product, onUpdateQuantity, onToggleFavorite, onRemove, currency }) => {
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
};

const FilterBar = ({ filters, onFilterChange, onSearch, searchTerm }) => {
  const renderCount = React.useRef(0);
  renderCount.current++;
  
  return (
    <div className="bg-gray-100 p-4 rounded mb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="food">Food</option>
        </select>
        
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="quantity">Sort by Quantity</option>
        </select>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.favoritesOnly}
            onChange={(e) => onFilterChange('favoritesOnly', e.target.checked)}
          />
          Favorites Only
        </label>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        FilterBar renders: {renderCount.current}
      </div>
    </div>
  );
};

const CartSummary = ({ products, currency, onCheckout }) => {
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
};

const LiveTimer = ({ onTick }) => {
  const renderCount = React.useRef(0);
  renderCount.current++;
  
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      onTick();
    }, 1000);
    return () => clearInterval(timer);
  }, [onTick]);
  
  return (
    <div className="text-sm text-gray-600">
      Current time: {time} | Renders: {renderCount.current}
    </div>
  );
};

const App = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Laptop', category: 'electronics', price: 999, quantity: 1, favorite: false },
    { id: 2, name: 'Phone', category: 'electronics', price: 599, quantity: 2, favorite: true },
    { id: 3, name: 'T-Shirt', category: 'clothing', price: 25, quantity: 5, favorite: false },
    { id: 4, name: 'Jeans', category: 'clothing', price: 60, quantity: 3, favorite: false },
    { id: 5, name: 'Coffee', category: 'food', price: 12, quantity: 10, favorite: true },
    { id: 6, name: 'Pasta', category: 'food', price: 8, quantity: 15, favorite: false },
  ]);
  
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'name',
    favoritesOnly: false
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [tickCount, setTickCount] = useState(0);
  
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setProducts(products.map(p => 
      p.id === id ? { ...p, quantity: newQuantity } : p
    ));
  };
  
  const handleToggleFavorite = (id) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, favorite: !p.favorite } : p
    ));
  };
  
  const handleRemove = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };
  
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };
  
  const handleCheckout = () => {
    alert('Checkout complete!');
    setProducts([]);
  };
  
  const handleTimerTick = () => {
    setTickCount(tickCount + 1);
  };
  
  const filteredProducts = products
    .filter(p => filters.category === 'all' || p.category === filters.category)
    .filter(p => !filters.favoritesOnly || p.favorite)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'price') return b.price - a.price;
      if (filters.sortBy === 'quantity') return b.quantity - a.quantity;
      return 0;
    });
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <LiveTimer onTick={handleTimerTick} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded ${currency === 'USD' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-4 py-2 rounded ${currency === 'EUR' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
            >
              EUR
            </button>
            <button
              onClick={() => setCurrency('GBP')}
              className={`px-4 py-2 rounded ${currency === 'GBP' ? 'bg-white text-blue-600' : 'bg-blue-500'}`}
            >
              GBP
            </button>
          </div>
        </div>
      </div>
      
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdateQuantity={handleUpdateQuantity}
              onToggleFavorite={handleToggleFavorite}
              onRemove={handleRemove}
              currency={currency}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No products found
            </div>
          )}
        </div>
        
        <div>
          <CartSummary
            products={products}
            currency={currency}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default App;