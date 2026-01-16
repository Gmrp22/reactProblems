import React from 'react';

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

export default FilterBar;
