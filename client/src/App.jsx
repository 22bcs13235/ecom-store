import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Success from './components/Success';
import Cancel from './components/Cancel';

export default function App() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');

  const fetchProducts = async (q = '') => {
    const res = await axios.get('/api/products', { params: { q } });
    setProducts(res.data);
  };

  useEffect(() => { fetchProducts(search); }, [search]);

  return (
    <CartProvider>
      <Router>
        <Header view={view} setView={setView} onSearch={setSearch} />
        <Routes>
          <Route path="/" element={<ProductList products={products} view={view} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
