// Shared category lists so Add/Edit forms and the Summary page
// all use the exact same category names.

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Bills",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

export const INCOME_CATEGORIES = ["Salary", "Allowance", "Gift", "Other"];

export function getCategoriesForType(type) {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
