import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Cart() {
  const { items, checkout, cartCount } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products').then(res => setProducts(res.data));
  }, []);

  const total = items.reduce((sum, i) => {
    const product = products.find(p => p.id === i.productId);
    return sum + (product ? product.price * i.quantity : 0);
  }, 0);

  if (cartCount === 0) {
    return <div className="p-4">Your cart is empty. <Link to="/" className="text-blue-600">Browse products</Link></div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Your Cart</h2>
      <ul className="space-y-4">
        {items.map(item => <CartItem key={item.productId} item={item} />)}
      </ul>
      <div className="mt-4 font-bold">Total: ${total}</div>
      <button onClick={() => checkout()} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Checkout</button>
    </div>
  );
}
