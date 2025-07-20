import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { updateCart, removeFromCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get('/api/products').then(res => {
      const prod = res.data.find(p => p.id === item.productId);
      setProduct(prod);
    });
  }, [item.productId]);

  if (!product) return null;

  return (
    <li className="flex items-center border rounded p-2">
      {/* fixed-size image wrapper */}
      <div className="w-20 h-20 mr-4 flex-shrink-0 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex-1">
        <h4 className="font-semibold">{product.name}</h4>
        <p>
          ${product.price} × {item.quantity} = ${product.price * item.quantity}
        </p>
        <div className="space-x-2 mt-2">
          <button
            onClick={() => updateCart(item.productId, item.quantity - 1)}
            disabled={item.quantity === 1}
            className="px-2 border rounded"
          >
            –
          </button>
          <button
            onClick={() => updateCart(item.productId, item.quantity + 1)}
            className="px-2 border rounded"
          >
            +
          </button>
          <button
            onClick={() => removeFromCart(item.productId)}
            className="px-2 border rounded text-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
