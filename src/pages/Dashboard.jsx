import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useTransactions from "../hooks/useTransactions.js";
import TransactionCard from "../components/TransactionCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import { formatCurrency } from "../utils/format.js";

function Dashboard() {
  // Real, persistent data now — read from localStorage via our custom hook.
  const { transactions } = useTransactions();

  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Totals only depend on `transactions`, NOT on the filters. Without
  // useMemo, every time the user clicks a filter pill, Dashboard re-renders
  // and these reduce()/filter() calls would re-run from scratch even though
  // the underlying transactions haven't changed at all. useMemo skips that
  // recalculation unless `transactions` itself changes.
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  }, [transactions]);

  // Same idea — the category list only needs to change when transactions change.
  const categories = useMemo(
    () => [...new Set(transactions.map((t) => t.category))],
    [transactions]
  );

  // This one DOES need to re-run when the filters change (that's its job),
  // but it should only run when transactions, typeFilter, or categoryFilter
  // actually change — not on every Dashboard re-render for unrelated reasons.
  const sortedTransactions = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      return matchesType && matchesCategory;
    });

    return [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, typeFilter, categoryFilter]);

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Track your balance and browse every income and expense you've logged.
      </p>

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
            {transactions.length === 0 ? (
              <>
                <p>You haven't added any transactions yet.</p>
                <Link to="/add" className="btn-primary btn-inline empty-state-cta">
                  Add your first transaction
                </Link>
              </>
            ) : (
              "No transactions match this filter."
            )}
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
