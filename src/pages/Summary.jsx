import useTransactions from "../hooks/useTransactions.js";
import { EXPENSE_CATEGORIES } from "../data/categories.js";
import { formatCurrency } from "../utils/format.js";
import { getCategoryColor } from "../utils/categoryColors.js";
import DonutChart from "../components/DonutChart.jsx";

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

    return { category, total, percent, color: getCategoryColor(category) };
  }).sort((a, b) => b.total - a.total);

  // Only feed categories that actually have spending into the donut —
  // a slice for a ₱0 category would just be an invisible sliver.
  const chartData = categoryTotals
    .filter((c) => c.total > 0)
    .map((c) => ({ label: c.category, value: c.total, color: c.color }));

  return (
    <div className="page">
      <h1 className="page-title">Summary</h1>
      <p className="page-subtitle">
        A breakdown of your spending by category, calculated from all of your
        saved transactions.
      </p>

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
        <>
          <div className="chart-card summary-chart-card">
            <p className="chart-card-title">Spending by category</p>
            <DonutChart
              data={chartData}
              centerLabel="Total spent"
              centerValue={formatCurrency(totalExpense)}
            />
          </div>

          <div className="category-list">
            {categoryTotals.map(({ category, total, percent, color }) => (
              <div key={category} className="category-row">
                <div className="category-row-top">
                  <span className="category-name">
                    <span className="transaction-category-dot" style={{ background: color }} />
                    {category}
                  </span>
                  <span className="category-amount">{formatCurrency(total)}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${percent}%`, background: color }}
                  />
                </div>
                <span className="category-percent">{percent.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Summary;
