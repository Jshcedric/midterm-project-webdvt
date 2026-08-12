// TEMPORARY mock data so we can design the Dashboard UI.
// In Phase 3 this will be replaced by real data from localStorage
// via the useTransactions() custom hook.

const mockTransactions = [
  {
    id: "1",
    title: "Weekly Allowance",
    amount: 1000,
    type: "income",
    category: "Allowance",
    date: "2026-08-10",
    description: "Weekly allowance from parents",
  },
  {
    id: "2",
    title: "Part-time Job",
    amount: 2500,
    type: "income",
    category: "Salary",
    date: "2026-08-08",
    description: "Weekend cafe shift",
  },
  {
    id: "3",
    title: "Lunch at School",
    amount: 150,
    type: "expense",
    category: "Food",
    date: "2026-08-11",
    description: "Lunch with classmates",
  },
  {
    id: "4",
    title: "Jeepney Fare",
    amount: 40,
    type: "expense",
    category: "Transportation",
    date: "2026-08-11",
    description: "Round trip to school",
  },
  {
    id: "5",
    title: "Electricity Bill Share",
    amount: 500,
    type: "expense",
    category: "Bills",
    date: "2026-08-05",
    description: "Contribution to household bill",
  },
  {
    id: "6",
    title: "New Notebook",
    amount: 120,
    type: "expense",
    category: "Education",
    date: "2026-08-04",
    description: "Notebook and pens for class",
  },
  {
    id: "7",
    title: "Movie Night",
    amount: 300,
    type: "expense",
    category: "Entertainment",
    date: "2026-08-02",
    description: "Movie with friends",
  },
  {
    id: "8",
    title: "New Shirt",
    amount: 450,
    type: "expense",
    category: "Shopping",
    date: "2026-07-30",
    description: "Shirt for a school event",
  },
];

export default mockTransactions;
