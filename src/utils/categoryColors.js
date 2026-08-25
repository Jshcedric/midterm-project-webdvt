// Consistent color per category so the donut chart, legend, and category
// dots on transaction cards all agree with each other no matter where
// they're rendered from.

const CATEGORY_COLORS = {
  Salary: "#50765f",
  Allowance: "#537477",
  Gift: "#aa6d62",
  Food: "#b46b43",
  Transportation: "#a48642",
  Bills: "#a74f43",
  Shopping: "#826b80",
  Entertainment: "#a85d63",
  Health: "#4f7d72",
  Education: "#5e6f89",
  Other: "#77736b",
};

// Any category not in the map above (e.g. a custom one a user typed in)
// still gets a stable color, deterministically picked from this palette
// based on the category name itself — so it's always the same color for
// that name, without needing to track render order.
const FALLBACK_PALETTE = [
  "#5e6f89",
  "#50765f",
  "#b46b43",
  "#aa6d62",
  "#537477",
  "#a48642",
  "#826b80",
  "#a74f43",
  "#4f7d72",
  "#a85d63",
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
