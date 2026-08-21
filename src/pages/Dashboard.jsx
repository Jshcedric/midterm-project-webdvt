import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useTransactions from "../hooks/useTransactions.js";
import TransactionCard from "../components/TransactionCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import DonutChart from "../components/DonutChart.jsx";
import EyeIcon from "../components/EyeIcon.jsx";
import { formatCurrency } from "../utils/format.js";
import { getCategoryColor } from "../utils/categoryColors.js";

function Dashboard() {
  // Real, persistent data now — read from localStorage via our custom hook.
  const { transactions } = useTransactions();

  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showBalance, setShowBalance] = useState(true);

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

  // Feeds the donut chart: every category (income AND expense — salary,
  // groceries, whatever) gets its own slice sized by how much money moved
  // through it, so the chart is a one-glance summary of the whole picture.
  const categoryBreakdown = useMemo(() => {
    const totals = {};
    transactions.forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount);
    });

    return Object.entries(totals)
      .map(([category, value]) => ({
        label: category,
        value,
        color: getCategoryColor(category),
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

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

      <div className="dashboard-hero-grid">
        <div className="hero-balance-card">
          <div>
            <p className="hero-label">Current Balance</p>
            <div className="hero-value-row">
              <p className="hero-value">
                {showBalance ? formatCurrency(balance) : "₱ • • • • • •"}
              </p>
              <button
                type="button"
                className="balance-toggle"
                onClick={() => setShowBalance((visible) => !visible)}
                aria-label={showBalance ? "Hide balance" : "Show balance"}
                title={showBalance ? "Hide balance" : "Show balance"}
              >
                <EyeIcon visible={showBalance} />
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-dot dot-income" />
              <span>Income</span>
              <strong>{formatCurrency(totalIncome)}</strong>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-dot dot-expense" />
              <span>Expenses</span>
              <strong>{formatCurrency(totalExpense)}</strong>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <p className="chart-card-title">Where it's going</p>

          {categoryBreakdown.length === 0 ? (
            <p className="chart-empty">Add a transaction to see your breakdown.</p>
          ) : (
            <>
              <div className="chart-donut-holder">
                <DonutChart
                  data={categoryBreakdown}
                  size={200}
                  thickness={28}
                  centerLabel="Total flow"
                  centerValue={formatCurrency(totalIncome + totalExpense)}
                />
              </div>

              <ul className="breakdown-list">
                {categoryBreakdown.map((entry) => {
                  const percent =
                    totalIncome + totalExpense > 0
                      ? (entry.value / (totalIncome + totalExpense)) * 100
                      : 0;

                  return (
                    <li key={entry.label} className="breakdown-row">
                      <span
                        className="breakdown-ring"
                        style={{
                          background: `conic-gradient(${entry.color} ${percent}%, var(--border) ${percent}% 100%)`,
                        }}
                      >
                        <span className="breakdown-ring-percent">{Math.round(percent)}%</span>
                      </span>

                      <span className="breakdown-info">
                        <span className="breakdown-name">{entry.label}</span>
                      </span>

                      <span className="breakdown-amount">{formatCurrency(entry.value)}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
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
