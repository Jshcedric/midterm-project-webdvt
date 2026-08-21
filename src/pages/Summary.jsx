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
  const [expandedMonth, setExpandedMonth] = useState(null);

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

  // Groups every expense by "YYYY-MM" so we can show how much was spent
  // each month, plus which categories made up that month's total —
  // basically a month-by-month spending tracker.
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

  const highestMonthTotal = monthlySpending.reduce(
    (max, month) => Math.max(max, month.total),
    0
  );

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
          <div className="monthly-list">
            {monthlySpending.map((month) => {
              const isOpen = expandedMonth === month.monthKey;
              const barPercent =
                highestMonthTotal > 0 ? (month.total / highestMonthTotal) * 100 : 0;

              return (
                <div key={month.monthKey} className="month-card">
                  <button
                    type="button"
                    className="month-card-header"
                    onClick={() => setExpandedMonth(isOpen ? null : month.monthKey)}
                    aria-expanded={isOpen}
                  >
                    <div className="month-card-heading">
                      <span className="month-name">{month.label}</span>
                      <span className="month-card-right">
                        <span className="month-total">{formatCurrency(month.total)}</span>
                        <span className={`month-chevron ${isOpen ? "is-open" : ""}`}>⌄</span>
                      </span>
                    </div>
                    <div className="month-bar-track">
                      <div className="month-bar-fill" style={{ width: `${barPercent}%` }} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="month-categories">
                      {month.categories.map((c) => (
                        <div key={c.category} className="month-category-row">
                          <span
                            className="transaction-category-dot"
                            style={{ background: c.color }}
                          />
                          <span className="month-category-name">{c.category}</span>
                          <span className="month-category-amount">
                            {formatCurrency(c.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <ScrollToTopButton />
    </div>
  );
}

export default Summary;
