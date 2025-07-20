import ProductCard from './ProductCard';

export default function ProductList({ products, view }) {
  if (view === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    );
  }
  return (
    <div className="flex flex-col p-4 space-y-4">
      {products.map(p => <ProductCard key={p.id} product={p} view="list" />)}
    </div>
  );
}
