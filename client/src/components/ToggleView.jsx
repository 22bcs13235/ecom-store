export default function ToggleView({ view, setView }) {
  return (
    <div className="space-x-2">
      <button onClick={() => setView('grid')} className={view === 'grid' ? 'font-bold' : ''}>Grid</button>
      <button onClick={() => setView('list')} className={view === 'list' ? 'font-bold' : ''}>List</button>
    </div>
  );
}
