import { useState } from "react";
import useTransactions from "../hooks/useTransactions.js";
import TransactionCard from "../components/TransactionCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import { formatCurrency } from "../utils/format.js";

function Dashboard() {
  // Real, persistent data now — read from localStorage via our custom hook.
  const { transactions } = useTransactions();

  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Totals are always calculated from ALL transactions, not the filtered
  // list, so the summary cards stay accurate no matter what filter is active.
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // Unique category list for the filter dropdown.
  const categories = [...new Set(transactions.map((t) => t.category))];

  // Apply both filters to decide what shows up in the list below.
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    return matchesType && matchesCategory;
  });

  // Most recent first.
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      <div className="summary-grid">
        <div className="summary-card summary-card-balance">
          <p className="summary-label">Current Balance</p>
          <p className="summary-value">{formatCurrency(balance)}</p>
        </div>

        <div className="summary-card">
          <p className="summary-label">Total Income</p>
          <p className="summary-value amount-income">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="summary-card">
          <p className="summary-label">Total Expenses</p>
          <p className="summary-value amount-expense">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      <FilterBar
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />

      <div className="transaction-list">
        {sortedTransactions.length === 0 ? (
          <div className="placeholder-card">
            No transactions match this filter.
          </div>
        ) : (
          sortedTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
