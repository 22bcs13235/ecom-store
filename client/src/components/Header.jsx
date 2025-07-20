import SearchBar from './SearchBar';
import ToggleView from './ToggleView';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header({ view, setView, onSearch }) {
  const { cartCount } = useCart();
  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <Link to="/" className="text-xl font-bold">MyStore</Link>
      <SearchBar onSearch={onSearch} />
      <ToggleView view={view} setView={setView} />
      <Link to="/cart" className="relative">
        🛒
        {cartCount > 0 &&
          <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {cartCount}
          </span>}
      </Link>
    </header>
  );
}
