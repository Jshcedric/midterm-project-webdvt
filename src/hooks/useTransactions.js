import { useState } from "react";
import mockTransactions from "../data/mockTransactions.js";

// The localStorage key we save everything under.
const STORAGE_KEY = "budget-tracker-transactions";

// Reads transactions from localStorage.
// If nothing has been saved yet (first time visiting the app), we seed it
// with the sample mock data so the Dashboard isn't empty on first load.
function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return mockTransactions;
  } catch (error) {
    console.error("Failed to read transactions from localStorage:", error);
    return mockTransactions;
  }
}

// Writes the given array straight to localStorage. We call this directly
// (synchronously) inside each mutator below instead of inside a useEffect.
// Why: pages like "Add Transaction" call navigate("/") immediately after
// updating state. React batches that state update with the route change,
// which can unmount the component before a useEffect gets a chance to run —
// so the save would silently never happen. Writing synchronously here
// guarantees the data is saved before we ever navigate away.
function saveTransactions(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Failed to save transactions to localStorage:", error);
  }
}

// Generates a unique-enough id without needing an extra library.
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// This custom hook is the ONLY place that talks to localStorage.
// Every page/component that needs transaction data calls this hook
// instead of duplicating the read/write logic.
function useTransactions() {
  const [transactions, setTransactions] = useState(loadTransactions);

  function addTransaction(transaction) {
    const newTransaction = {
      ...transaction,
      id: generateId(),
    };
    const updated = [...transactions, newTransaction];
    saveTransactions(updated);
    setTransactions(updated);
    return newTransaction;
  }

  function updateTransaction(id, updatedFields) {
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, ...updatedFields } : t
    );
    saveTransactions(updated);
    setTransactions(updated);
  }

  function deleteTransaction(id) {
    const updated = transactions.filter((t) => t.id !== id);
    saveTransactions(updated);
    setTransactions(updated);
  }

  function getTransactionById(id) {
    return transactions.find((t) => t.id === id);
  }

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
  };
}

export default useTransactions;
