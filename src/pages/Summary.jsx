import useTransactions from "../hooks/useTransactions.js";
import { EXPENSE_CATEGORIES } from "../data/categories.js";
import { formatCurrency } from "../utils/format.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

function Summary() {
  // Reuses the SAME transaction data as the rest of the app —
  // no separate data source, just derived calculations.
  const { transactions } = useTransactions();

  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  // Total spent per category, using the shared EXPENSE_CATEGORIES list
  // so every category shows up even if it currently has ₱0 spent.
  const categoryTotals = EXPENSE_CATEGORIES.map((category) => {
    const total = expenses
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const percent = totalExpense > 0 ? (total / totalExpense) * 100 : 0;

    return { category, total, percent };
  }).sort((a, b) => b.total - a.total);

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Summary</h1>
          <p className="page-subtitle">
            A breakdown of your spending by category, calculated from all of
            your saved transactions.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="summary-total-card">
        <p className="summary-label">Total Spending</p>
        <p className="summary-value amount-expense">{formatCurrency(totalExpense)}</p>
      </div>

      {totalExpense === 0 ? (
        <div className="placeholder-card">
          No expenses recorded yet. Add one from the Add Transaction page to
          see your breakdown here.
        </div>
      ) : (
        <div className="category-list">
          {categoryTotals.map(({ category, total, percent }) => (
            <div key={category} className="category-row">
              <div className="category-row-top">
                <span className="category-name">{category}</span>
                <span className="category-amount">{formatCurrency(total)}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="category-percent">{percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
