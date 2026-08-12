function FilterBar({ typeFilter, onTypeChange, categoryFilter, onCategoryChange, categories }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <button
          className={`filter-pill ${typeFilter === "all" ? "filter-pill-active" : ""}`}
          onClick={() => onTypeChange("all")}
        >
          All
        </button>
        <button
          className={`filter-pill ${typeFilter === "income" ? "filter-pill-active" : ""}`}
          onClick={() => onTypeChange("income")}
        >
          Income
        </button>
        <button
          className={`filter-pill ${typeFilter === "expense" ? "filter-pill-active" : ""}`}
          onClick={() => onTypeChange("expense")}
        >
          Expense
        </button>
      </div>

      <select
        className="filter-select"
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
