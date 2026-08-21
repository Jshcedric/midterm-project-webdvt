// Consistent color per category so the donut chart, legend, and category
// dots on transaction cards all agree with each other no matter where
// they're rendered from.

const CATEGORY_COLORS = {
  Salary: "#22c55e",
  Allowance: "#06b6d4",
  Gift: "#ec4899",
  Food: "#f97316",
  Transportation: "#eab308",
  Bills: "#ef4444",
  Shopping: "#8b5cf6",
  Entertainment: "#f43f5e",
  Health: "#14b8a6",
  Education: "#4f46e5",
  Other: "#64748b",
};

// Any category not in the map above (e.g. a custom one a user typed in)
// still gets a stable color, deterministically picked from this palette
// based on the category name itself — so it's always the same color for
// that name, without needing to track render order.
const FALLBACK_PALETTE = [
  "#4f46e5",
  "#22c55e",
  "#f97316",
  "#ec4899",
  "#06b6d4",
  "#eab308",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#f43f5e",
];

export function getCategoryColor(category) {
  if (CATEGORY_COLORS[category]) {
    return CATEGORY_COLORS[category];
  }

  let hash = 0;
  for (let i = 0; i < category.length; i += 1) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
}

export default CATEGORY_COLORS;
