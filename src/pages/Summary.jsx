import { useMemo, useState } from "react";
import useTransactions from "../hooks/useTransactions.js";
import { EXPENSE_CATEGORIES } from "../data/categories.js";
import { formatCurrency, formatMonthLabel } from "../utils/format.js";
import { getCategoryColor } from "../utils/categoryColors.js";
import DonutChart from "../components/DonutChart.jsx";
import ScrollToTopButton from "../components/ScrollToTopButton.jsx";

function Summary() {
  // Reuses the SAME transaction data as the rest of the app —
  // no separate data source, just derived calculations.
  const { transactions } = useTransactions();

  // 0 = most recent month with spending, 1 = the month before that, etc.
  // Navigated with the ‹ › buttons below.
  const [monthIndex, setMonthIndex] = useState(0);

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

  // Groups every expense by "YYYY-MM" so the viewer below can flip
  // between individual months, most recent first.
  const monthlySpending = useMemo(() => {
    const months = {};

    expenses.forEach((t) => {
      const monthKey = t.date.slice(0, 7);
      if (!months[monthKey]) {
        months[monthKey] = { total: 0, categories: {} };
      }
      months[monthKey].total += Number(t.amount);
      months[monthKey].categories[t.category] =
        (months[monthKey].categories[t.category] || 0) + Number(t.amount);
    });

    return Object.entries(months)
      .map(([monthKey, data]) => ({
        monthKey,
        label: formatMonthLabel(monthKey),
        total: data.total,
        categories: Object.entries(data.categories)
          .map(([category, amount]) => ({
            category,
            amount,
            color: getCategoryColor(category),
          }))
          .sort((a, b) => b.amount - a.amount),
      }))
      .sort((a, b) => (a.monthKey < b.monthKey ? 1 : -1)); // most recent month first
  }, [expenses]);

  // Clamp instead of using an effect — if transactions change and there
  // are fewer months than before, this just falls back to the last one.
  const safeIndex =
    monthlySpending.length > 0
      ? Math.min(monthIndex, monthlySpending.length - 1)
      : 0;
  const selectedMonth = monthlySpending[safeIndex] ?? null;

  const canGoOlder = safeIndex < monthlySpending.length - 1;
  const canGoNewer = safeIndex > 0;

  const monthChartData =
    selectedMonth?.categories.map((c) => ({
      label: c.category,
      value: c.amount,
      color: c.color,
    })) ?? [];

  return (
    <div className="page">
      <h1 className="page-title">Summary</h1>

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

          <h2 className="section-heading">Monthly Spending</h2>

          {selectedMonth && (
            <div className="chart-card monthly-viewer-card">
              <div className="monthly-viewer-header">
                <button
                  type="button"
                  className="month-nav-btn"
                  onClick={() => setMonthIndex(safeIndex + 1)}
                  disabled={!canGoOlder}
                  aria-label="Previous month"
                >
                  ‹
                </button>

                <div className="monthly-viewer-title">
                  <span className="month-viewer-label">{selectedMonth.label}</span>
                  <span className="month-viewer-total">
                    {formatCurrency(selectedMonth.total)} spent
                  </span>
                </div>

                <button
                  type="button"
                  className="month-nav-btn"
                  onClick={() => setMonthIndex(safeIndex - 1)}
                  disabled={!canGoNewer}
                  aria-label="Next month"
                >
                  ›
                </button>
              </div>

              <div className="chart-donut-holder">
                <DonutChart
                  data={monthChartData}
                  size={190}
                  thickness={26}
                  centerLabel="Spent"
                  centerValue={formatCurrency(selectedMonth.total)}
                />
              </div>

              <ul className="breakdown-list">
                {selectedMonth.categories.map((c) => {
                  const percent =
                    selectedMonth.total > 0 ? (c.amount / selectedMonth.total) * 100 : 0;

                  return (
                    <li key={c.category} className="breakdown-row">
                      <span
                        className="breakdown-ring"
                        style={{
                          background: `conic-gradient(${c.color} ${percent}%, var(--border) ${percent}% 100%)`,
                        }}
                      >
                        <span className="breakdown-ring-percent">{Math.round(percent)}%</span>
                      </span>

                      <span className="breakdown-info">
                        <span className="breakdown-name">{c.category}</span>
                      </span>

                      <span className="breakdown-amount">{formatCurrency(c.amount)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}

      <ScrollToTopButton />
    </div>
  );
}

export default Summary;
