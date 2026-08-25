import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useTransactions from "../hooks/useTransactions.js";
import TransactionCard from "../components/TransactionCard.jsx";
import { EXPENSE_CATEGORIES } from "../data/categories.js";
import {
  formatCurrency,
  formatMonthLabel,
  getTodayDateString,
} from "../utils/format.js";
import { getCategoryColor } from "../utils/categoryColors.js";
import DonutChart from "../components/DonutChart.jsx";
import ScrollToTopButton from "../components/ScrollToTopButton.jsx";

function Summary() {
  // Reuses the SAME transaction data as the rest of the app —
  // no separate data source, just derived calculations.
  const { transactions } = useTransactions();

  // "month" = only this calendar month's spending feeds the donut,
  // "all" = every expense ever logged. Toggled from the dropdown.
  const [categoryScope, setCategoryScope] = useState("month");

  // 0 = most recent month with spending, 1 = the month before that, etc.
  // Navigated with the ‹ › buttons in the Monthly Overview panel.
  const [monthIndex, setMonthIndex] = useState(0);

  const expenses = transactions.filter((t) => t.type === "expense");
  const totalExpenseAllTime = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  const thisMonthKey = getTodayDateString().slice(0, 7);
  const thisMonthExpenses = expenses.filter((t) => t.date.slice(0, 7) === thisMonthKey);
  const totalThisMonth = thisMonthExpenses.reduce((sum, t) => sum + Number(t.amount), 0);

  // Groups every expense by "YYYY-MM" — feeds the trend chart and the
  // Monthly Overview navigator below.
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

  // Category breakdown for whichever scope is selected (this month / all time).
  const scopedExpenses = categoryScope === "month" ? thisMonthExpenses : expenses;
  const scopedTotal = scopedExpenses.reduce((sum, t) => sum + Number(t.amount), 0);

  const categoryTotals = EXPENSE_CATEGORIES.map((category) => {
    const total = scopedExpenses
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { category, total, color: getCategoryColor(category) };
  })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const chartData = categoryTotals.map((c) => ({
    label: c.category,
    value: c.total,
    color: c.color,
  }));

  // Last 6 calendar months (including ones with ₱0 spent) for the bar chart.
  const trendMonths = useMemo(() => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const match = monthlySpending.find((m) => m.monthKey === key);

      months.push({
        monthKey: key,
        shortLabel: d.toLocaleDateString("en-US", { month: "short" }),
        total: match ? match.total : 0,
      });
    }

    return months;
  }, [monthlySpending]);

  const trendMax = Math.max(...trendMonths.map((m) => m.total), 1);

  // Monthly Overview navigator — clamped instead of using an effect, so
  // it just falls back gracefully if the number of months ever shrinks.
  const safeIndex =
    monthlySpending.length > 0 ? Math.min(monthIndex, monthlySpending.length - 1) : 0;
  const selectedMonth = monthlySpending[safeIndex] ?? null;
  const canGoOlder = safeIndex < monthlySpending.length - 1;
  const canGoNewer = safeIndex > 0;

  // Top 3 categories of all time, regardless of the dropdown scope above.
  const topSpending = EXPENSE_CATEGORIES.map((category) => {
    const total = expenses
      .filter((t) => t.category === category)
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return { category, total, color: getCategoryColor(category) };
  })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="page">
      <header className="page-heading dashboard-heading">
        <span className="eyebrow">Budget Tracker / analysis</span>
      </header>

      {totalExpenseAllTime === 0 ? (
        <div className="placeholder-card">
          No expenses recorded yet. Add one from the Add Transaction page to
          see your summary here.
        </div>
      ) : (
        <>
          <div className="stat-row">
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">01</span>
              <div>
                <p className="stat-label">Total Spent</p>
                <p className="stat-value">{formatCurrency(totalExpenseAllTime)}</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">02</span>
              <div>
                <p className="stat-label">This Month</p>
                <p className="stat-value">{formatCurrency(totalThisMonth)}</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon" aria-hidden="true">03</span>
              <div>
                <p className="stat-label">Transactions</p>
                <p className="stat-value">{transactions.length}</p>
              </div>
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-header">
              <p className="panel-title">Spending by Category</p>
              <select
                className="scope-select"
                value={categoryScope}
                onChange={(e) => setCategoryScope(e.target.value)}
              >
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {categoryTotals.length === 0 ? (
              <p className="chart-empty">No spending recorded for this period.</p>
            ) : (
              <div className="category-panel-body">
                <div className="chart-donut-holder">
                  <DonutChart
                    data={chartData}
                    size={170}
                    thickness={22}
                    centerLabel={categoryScope === "month" ? "This month" : "All time"}
                    centerValue={formatCurrency(scopedTotal)}
                  />
                </div>

                <ul className="breakdown-list category-panel-list">
                  {categoryTotals.map((c) => (
                    <li key={c.category} className="breakdown-row">
                      <span className="legend-dot" style={{ background: c.color }} />
                      <span className="breakdown-info">
                        <span className="breakdown-name">{c.category}</span>
                      </span>
                      <span className="breakdown-amount">{formatCurrency(c.total)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="panel-card">
            <div className="panel-header">
              <p className="panel-title">Spending Trend</p>
              <span className="panel-subtext">Last 6 months</span>
            </div>

            <div className="trend-chart">
              {trendMonths.map((m) => (
                <div key={m.monthKey} className="trend-bar-col">
                  <span className="trend-bar-value">
                    {m.total > 0 ? formatCurrency(m.total) : ""}
                  </span>
                  <div className="trend-bar-track">
                    <div
                      className="trend-bar-fill"
                      style={{ height: `${(m.total / trendMax) * 100}%` }}
                    />
                  </div>
                  <span className="trend-bar-label">{m.shortLabel}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="two-col-grid">
            <div className="panel-card">
              <div className="panel-header">
                <p className="panel-title">Monthly Overview</p>
                <div className="month-nav-inline">
                  <button
                    type="button"
                    className="month-nav-btn small"
                    onClick={() => setMonthIndex(safeIndex + 1)}
                    disabled={!canGoOlder}
                    aria-label="Previous month"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="month-nav-btn small"
                    onClick={() => setMonthIndex(safeIndex - 1)}
                    disabled={!canGoNewer}
                    aria-label="Next month"
                  >
                    ›
                  </button>
                </div>
              </div>

              {selectedMonth ? (
                <>
                  <div>
                    <p className="overview-month-label">{selectedMonth.label}</p>
                    <p className="overview-month-total">
                      {formatCurrency(selectedMonth.total)} spent
                    </p>
                  </div>
                  <ul className="mini-category-list">
                    {selectedMonth.categories.slice(0, 4).map((c) => (
                      <li key={c.category} className="mini-category-row">
                        <span className="legend-dot" style={{ background: c.color }} />
                        <span>{c.category}</span>
                        <span className="mini-category-amount">
                          {formatCurrency(c.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="chart-empty">No data yet.</p>
              )}
            </div>

            <div className="panel-card">
              <p className="panel-title">Top Spending</p>
              <ul className="top-spending-list">
                {topSpending.map((c, index) => (
                  <li key={c.category} className="top-spending-row">
                    <span className="top-spending-rank" style={{ background: c.color }}>
                      {index + 1}
                    </span>
                    <span className="top-spending-name">{c.category}</span>
                    <span className="top-spending-amount">{formatCurrency(c.total)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-header">
              <p className="panel-title">Recent Transactions</p>
              <Link to="/" className="panel-link">
                View All →
              </Link>
            </div>
            <div className="recent-transactions-list">
              {recentTransactions.map((t) => (
                <TransactionCard key={t.id} transaction={t} />
              ))}
            </div>
          </div>
        </>
      )}

      <ScrollToTopButton />
    </div>
  );
}

export default Summary;
