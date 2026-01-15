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
        if (filters.sortBy === 'quantity') return b.quantity - a.quantity;
        return 0;
      }),
    [products, filters, searchTerm]
  );
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <Header 
        currency={currency} 
        onCurrencyChange={setCurrency}
      />
      
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

export default FourthProblem;
