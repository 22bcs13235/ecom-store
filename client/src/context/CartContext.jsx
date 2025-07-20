import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('sessionId');
    if (saved) return saved;
    const id = uuid();
    localStorage.setItem('sessionId', id);
    return id;
  });

  const [items, setItems] = useState([]);

  const refresh = async () => {
    const res = await axios.get(`/api/cart/${sessionId}`);
    setItems(res.data);
  };

  useEffect(() => { refresh(); }, []);

  const addToCart = async (productId, quantity = 1) => {
    await axios.post('/api/cart', { sessionId, productId, quantity });
    refresh();
  };

  const updateCart = async (productId, quantity) => {
    await axios.put(`/api/cart/${sessionId}/${productId}`, { quantity });
    refresh();
  };

  const removeFromCart = async (productId) => {
    await axios.delete(`/api/cart/${sessionId}/${productId}`);
    refresh();
  };

  const checkout = async () => {
    const res = await axios.post('/api/checkout/create-session', { sessionId });
    window.location.href = res.data.url;
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateCart, removeFromCart, checkout, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
