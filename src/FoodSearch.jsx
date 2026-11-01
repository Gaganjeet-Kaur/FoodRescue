
function FoodSearch({ search, setSearch }) {
  return (
    <div className="food-search">
      <span>🔍</span>

      <input
        type="text"
        placeholder="Search food by name, category or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <button
          type="button"
          onClick={() => setSearch('')}
          aria-label="Clear search"
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#245a3b',
            fontWeight: 'bold',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default FoodSearch;
