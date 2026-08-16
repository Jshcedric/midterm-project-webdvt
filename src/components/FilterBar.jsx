function FilterBar({ typeFilter, onTypeChange, categoryFilter, onCategoryChange, categories }) {
  return (
    <div className="filter-bar">
      <div className="filter-group" role="group" aria-label="Filter by transaction type">
        <button
          type="button"
          className={`filter-pill ${typeFilter === "all" ? "filter-pill-active" : ""}`}
          aria-pressed={typeFilter === "all"}
          onClick={() => onTypeChange("all")}
        >
          All
        </button>
        <button
          type="button"
          className={`filter-pill ${typeFilter === "income" ? "filter-pill-active" : ""}`}
          aria-pressed={typeFilter === "income"}
          onClick={() => onTypeChange("income")}
        >
          Income
        </button>
        <button
          type="button"
          className={`filter-pill ${typeFilter === "expense" ? "filter-pill-active" : ""}`}
          aria-pressed={typeFilter === "expense"}
          onClick={() => onTypeChange("expense")}
        >
          Expense
        </button>
      </div>

      <select
        className="filter-select"
        aria-label="Filter by category"
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterBar;
