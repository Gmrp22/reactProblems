  import { useCallback, useState } from 'react';
  const useCartHandlers = () => {
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
  
  const handleUpdateQuantity = useCallback((id, newQuantity) => {
    if (newQuantity < 1) return;
    setProducts( prevProducts => prevProducts.map(p => 
      p.id === id ? { ...p, quantity: newQuantity } : p
    ));
  }, []);
  
  const handleToggleFavorite = useCallback((id) => {
    setProducts(prevProducts => prevProducts.map(p => 
      p.id === id ? { ...p, favorite: !p.favorite } : p
    ));
  }, []);
  
  const handleRemove = useCallback((id) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
  }, []);
  
  const handleFilterChange = useCallback((key, value) => {
    setFilters( prevFilters => ({ ...prevFilters, [key]: value }));
  }, []);
  
  const handleCheckout = useCallback(() => {
    alert('Checkout complete!');
    setProducts([]);
  }, []);
return { handleUpdateQuantity, handleToggleFavorite, handleRemove, handleFilterChange, handleCheckout, products, filters };
}
export default useCartHandlers;