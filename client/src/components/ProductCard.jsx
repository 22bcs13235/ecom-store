import { useCart } from '../context/CartContext';

export default function ProductCard({ product, view = 'grid' }) {
  const { addToCart } = useCart();

  const imgWrapperClass =
    view === 'list'
      ? 'w-32 h-32 mr-4 flex-shrink-0'
      : 'w-full aspect-square mb-2';

  return (
    <div
      className={`border rounded shadow p-4 flex ${
        view === 'list' ? 'flex-row' : 'flex-col'
      }`}
    >
      <div className={`${imgWrapperClass} overflow-hidden`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain" 
        />
      </div>

      <div className="flex flex-col flex-1">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm flex-1">{product.description}</p>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">${product.price}</span>
          <button
            onClick={() => addToCart(product.id)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
