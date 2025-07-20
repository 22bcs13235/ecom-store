export default function SearchBar({ onSearch }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      className="px-2 py-1 rounded text-black"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
