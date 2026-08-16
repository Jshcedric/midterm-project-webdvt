// Small shared helpers so we don't repeat currency/date formatting
// logic in every component that displays a transaction.

export function formatCurrency(amount) {
  return `₱${Number(amount).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// IMPORTANT: our transaction dates are plain "YYYY-MM-DD" strings with no
// time component. Passing that straight into `new Date(dateString)` makes
// JavaScript parse it as UTC midnight — when displayed back in a timezone
// behind UTC (e.g. most of the US), it can show as the PREVIOUS day. We
// avoid that entirely by parsing the year/month/day ourselves and building
// the Date using local-time arguments instead.
export function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Returns today's date as "YYYY-MM-DD" using the user's LOCAL time.
// (new Date().toISOString() uses UTC, which can be a day off for users
// ahead or behind UTC — e.g. late at night in the Philippines, UTC is
// still "yesterday".) This builds the string from local date parts instead.
export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
