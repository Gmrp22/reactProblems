import React, { useState, useMemo } from 'react';
import useCartHandlers from './hook.jsx';
import ProductCard from './components/ProductCard.jsx';
import CartSummary from './components/CartSummary.jsx';
import FilterBar from './components/FilterBar.jsx';
import Header from './components/Header.jsx';

const FourthProblem = () => {
  const { handleUpdateQuantity, handleToggleFavorite, handleRemove, handleFilterChange, handleCheckout, products, filters } = useCartHandlers();
  const [searchTerm, setSearchTerm] = useState('');
  const [currency, setCurrency] = useState('USD');


  

const filteredProducts = useMemo(() => 
  products
    .filter(p => filters.category === 'all' || p.category === filters.category)
    .filter(p => !filters.favoritesOnly || p.favorite)
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'price') return b.price - a.price;
      if (filters.sortBy === 'quantity') return b.quantity - a.quarter;
      return 0;
    }),
  [products, filters, searchTerm]
);
  
  return (

      
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

  );
};

const FourthProblem = () => {   


  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <LiveTimer />
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
      <ProductCard ></ProductCard>
    </div>
  );
}

export default FourthProblem;